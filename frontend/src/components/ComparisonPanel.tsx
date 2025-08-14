'use client';

interface ComparisonPanelProps {
  results: {
    comparison: {
      [key: string]: {
        prediction: number;
        probability: number;
        model_name: string;
        privacy_budget: number;
        confidence: string;
      };
    };
  };
}

export default function ComparisonPanel({ results }: ComparisonPanelProps) {
  if (!results?.comparison) return null;

  const getPredictionText = (prediction: number) => {
    return prediction === 1 ? "Treatment Needed" : "No Treatment";
  };

  const getColor = (prediction: number) => {
    return prediction === 1 ? "text-red-600" : "text-green-600";
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const comparisonData = Object.entries(results.comparison);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Model Comparison</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model & Privacy
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prediction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Probability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comparisonData.map(([key, data]) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {data.model_name} (ε={data.privacy_budget})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`font-semibold ${getColor(data.prediction)}`}>
                    {getPredictionText(data.prediction)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(data.probability * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`font-semibold ${getConfidenceColor(data.confidence)}`}>
                    {data.confidence}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
