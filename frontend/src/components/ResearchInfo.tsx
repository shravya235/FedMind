'use client';

export default function ResearchInfo() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-3 text-gray-800">Research Overview</h3>
        <p className="text-sm text-gray-600 mb-2">
          This platform demonstrates Federated Learning with Differential Privacy and Secure Aggregation (FL+DP+SSA) 
          for mental health prediction.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-3 text-gray-800">Model Architectures</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li><strong>LR:</strong> Logistic Regression - Simple linear model</li>
          <li><strong>MLP:</strong> Multi-Layer Perceptron - Neural network with hidden layers</li>
          <li><strong>DeepMLP:</strong> Deep Multi-Layer Perceptron - Complex neural network with embeddings</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-3 text-gray-800">Privacy Settings</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li><strong>ε = 0.1:</strong> High privacy, lower accuracy</li>
          <li><strong>ε = 5.0:</strong> Lower privacy, higher accuracy</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-3 text-gray-800">Privacy Notice</h3>
        <p className="text-sm text-gray-600">
          No user data is stored. All predictions are processed in real-time and cleared immediately after use.
        </p>
      </div>
    </div>
  );
}
