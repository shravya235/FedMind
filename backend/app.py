from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
import torch
import torch.nn as nn
import numpy as np
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mental Health Prediction API",
    description="FL+DP+SSA Research Demonstration",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model definitions
class LogisticRegression(nn.Module):
    def __init__(self, input_dim):
        super(LogisticRegression, self).__init__()
        self.linear = nn.Linear(input_dim, 1)
        
    def forward(self, x):
        return torch.sigmoid(self.linear(x))

class MLP(nn.Module):
    def __init__(self, input_dim, hidden_dims=[64, 32]):
        super(MLP, self).__init__()
        layers = []
        prev_dim = input_dim
        
        for hidden_dim in hidden_dims:
            layers.extend([
                nn.Linear(prev_dim, hidden_dim),
                nn.ReLU(),
                nn.Dropout(0.3)
            ])
            prev_dim = hidden_dim
            
        layers.append(nn.Linear(prev_dim, 1))
        self.network = nn.Sequential(*layers)
        
    def forward(self, x):
        return torch.sigmoid(self.network(x))

class DeepMLP(nn.Module):
    def __init__(self, input_dim, embedding_dims=None):
        super(DeepMLP, self).__init__()
        if embedding_dims is None:
            embedding_dims = [128, 64, 32]
            
        layers = []
        prev_dim = input_dim
        
        for hidden_dim in embedding_dims:
            layers.extend([
                nn.Linear(prev_dim, hidden_dim),
                nn.BatchNorm1d(hidden_dim),
                nn.ReLU(),
                nn.Dropout(0.4)
            ])
            prev_dim = hidden_dim
            
        layers.extend([
            nn.Linear(prev_dim, 64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, 1)
        ])
        
        self.network = nn.Sequential(*layers)
        
    def forward(self, x):
        return torch.sigmoid(self.network(x))

# Model registry
MODELS = {
    "LR": LogisticRegression,
    "MLP": MLP,
    "DeepMLP": DeepMLP
}

# Feature names (adjust based on your actual dataset)
FEATURE_NAMES = [
    "age", "gender", "education", "employment", "income",
    "marital_status", "children", "alcohol_consumption",
    "drug_use", "sleep_hours", "exercise_hours", "stress_level",
    "social_support", "therapy_history", "symptom_severity"
]

# Input validation schema
class PredictionRequest(BaseModel):
    features: dict = Field(..., description="Feature dictionary with 15 keys")
    model_name: Literal["LR", "MLP", "DeepMLP"] = Field(..., description="Model architecture")
    privacy_budget: Literal[0.1, 5.0] = Field(..., description="Privacy budget ε")

class PredictionResponse(BaseModel):
    prediction: int = Field(..., description="0: No treatment needed, 1: Treatment needed")
    probability: float = Field(..., description="Prediction probability")
    model_name: str = Field(..., description="Model used")
    privacy_budget: float = Field(..., description="Privacy budget ε")
    confidence: str = Field(..., description="Confidence level description")

# Model loading utility
class ModelManager:
    def __init__(self):
        self.models = {}
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.load_models()
    
    def load_models(self):
        """Load all available models"""
        model_dir = Path("models")
        
        for model_name in ["LR", "MLP", "DeepMLP"]:
            for epsilon in [0.1, 5.0]:
                model_key = f"{model_name}_eps{epsilon}"
                model_path = model_dir / f"{model_key}.pth"
                
                if model_path.exists():
                    try:
                        model_class = MODELS[model_name]
                        if model_name == "LR":
                            model = model_class(input_dim=15)
                        elif model_name == "MLP":
                            model = model_class(input_dim=15)
                        else:  # DeepMLP
                            model = model_class(input_dim=15)
                        
                        model.load_state_dict(torch.load(model_path, map_location=self.device))
                        model.to(self.device)
                        model.eval()
                        self.models[model_key] = model
                        logger.info(f"Loaded model: {model_key}")
                    except Exception as e:
                        logger.error(f"Failed to load model {model_key}: {e}")
                else:
                    logger.warning(f"Model file not found: {model_path}")
    
    def predict(self, features, model_name, privacy_budget):
        """Make prediction using specified model"""
        model_key = f"{model_name}_eps{privacy_budget}"
        
        if model_key not in self.models:
            raise ValueError(f"Model {model_key} not found")
        
        model = self.models[model_key]
        
        # Preprocess features
        input_tensor = self.preprocess_features(features)
        input_tensor = input_tensor.to(self.device)
        
        with torch.no_grad():
            prediction = model(input_tensor)
            probability = prediction.item()
            predicted_class = 1 if probability > 0.5 else 0
        
        # Determine confidence level
        if probability < 0.3 or probability > 0.7:
            confidence = "High"
        elif probability < 0.4 or probability > 0.6:
            confidence = "Medium"
        else:
            confidence = "Low"
        
        return {
            "prediction": predicted_class,
            "probability": probability,
            "model_name": model_name,
            "privacy_budget": privacy_budget,
            "confidence": confidence
        }
    
    def preprocess_features(self, features):
        """Preprocess input features"""
        # Convert features to numpy array
        feature_array = np.array([features.get(name, 0) for name in FEATURE_NAMES])
        
        # Normalize features (adjust based on your preprocessing)
        feature_array = (feature_array - feature_array.mean()) / (feature_array.std() + 1e-8)
        
        # Convert to tensor
        return torch.FloatTensor(feature_array).unsqueeze(0)

# Initialize model manager
model_manager = ModelManager()

@app.get("/")
async def root():
    return {"message": "Mental Health Prediction API - FL+DP+SSA Research"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "models_loaded": len(model_manager.models)}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        result = model_manager.predict(
            request.features,
            request.model_name,
            request.privacy_budget
        )
        return result
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare")
async def compare_models(request: PredictionRequest):
    """Compare predictions across all models for given input"""
    try:
        results = {}
        
        for model_name in ["LR", "MLP", "DeepMLP"]:
            for epsilon in [0.1, 5.0]:
                try:
                    result = model_manager.predict(
                        request.features,
                        model_name,
                        epsilon
                    )
                    results[f"{model_name}_eps{epsilon}"] = result
                except Exception as e:
                    results[f"{model_name}_eps{epsilon}"] = {"error": str(e)}
        
        return {"comparison": results}
    except Exception as e:
        logger.error(f"Comparison error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def get_available_models():
    """Get list of available models"""
    return {
        "available_models": list(model_manager.models.keys()),
        "feature_names": FEATURE_NAMES
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
