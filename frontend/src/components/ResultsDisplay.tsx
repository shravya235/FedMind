'use client';

interface ResultsDisplayProps {
  results: {
    prediction: number;
    probability: number;
    model_name: string;
    privacy_budget: number;
    confidence: string;
  };
  loading: boolean;
}

export default function ResultsDisplay({ results, loading }: ResultsDisplayProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Prediction Results</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const getPredictionText = (prediction: number) => {
    return prediction === 1 
      ? "Needs mental health treatment" 
      : "No immediate treatment needed";
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability > 0.8 || probability < 0.2) return 'text-green-600';
    if (probability > 0.7 || probability < 0.3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Prediction Results</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">Prediction</h4>
          <p className={`text-2xl font-bold ${getPredictionText(results.prediction) === "Needs mental health treatment" ? "text-red-600" : "text-green-600"}`}>
            {getPredictionText(results.prediction)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Probability</span>
            <p className={`text-lg font-semibold ${getProbabilityColor(results.probability)}`}>
              {(results.probability * 100).toFixed(1)}%
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Confidence</span>
            <p className={`text-lg font-semibold ${getConfidenceColor(results.confidence)}`}>
              {results.confidence}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Model:</strong> {results.model_name}</p>
          <p><strong>Privacy Budget (ε):</strong> {results.privacy_budget}</p>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This prediction is for research purposes only. 
            Please consult with a healthcare professional for actual diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
}
