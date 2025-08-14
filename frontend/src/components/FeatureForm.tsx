'use client';

import { useState } from 'react';

interface FeatureFormProps {
  onResults: (results: any) => void;
  onComparison: (results: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

interface FormData {
  [key: string]: string | number;
}

export default function FeatureForm({ onResults, onComparison, loading, setLoading }: FeatureFormProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [modelName, setModelName] = useState('MLP');
  const [privacyBudget, setPrivacyBudget] = useState(5.0);

  const features = [
    { name: 'age', label: 'Age', type: 'number', min: 18, max: 100 },
    { name: 'gender', label: 'Gender', type: 'select', options: ['0: Male', '1: Female', '2: Other'] },
    { name: 'education', label: 'Education Level', type: 'select', options: ['0: High School', '1: College', '2: Bachelor', '3: Master', '4: PhD'] },
    { name: 'employment', label: 'Employment Status', type: 'select', options: ['0: Unemployed', '1: Part-time', '2: Full-time', '3: Self-employed'] },
    { name: 'income', label: 'Annual Income ($)', type: 'number', min: 0, max: 1000000 },
    { name: 'marital_status', label: 'Marital Status', type: 'select', options: ['0: Single', '1: Married', '2: Divorced', '3: Widowed'] },
    { name: 'children', label: 'Number of Children', type: 'number', min: 0, max: 10 },
    { name: 'alcohol_consumption', label: 'Alcohol Consumption (drinks/week)', type: 'number', min: 0, max: 100 },
    { name: 'drug_use', label: 'Drug Use (0: No, 1: Yes)', type: 'select', options: ['0: No', '1: Yes'] },
    { name: 'sleep_hours', label: 'Sleep Hours per Night', type: 'number', min: 0, max: 24 },
    { name: 'exercise_hours', label: 'Exercise Hours per Week', type: 'number', min: 0, max: 40 },
    { name: 'stress_level', label: 'Stress Level (1-10)', type: 'number', min: 1, max: 10 },
    { name: 'social_support', label: 'Social Support (1-10)', type: 'number', min: 1, max: 10 },
    { name: 'therapy_history', label: 'Previous Therapy', type: 'select', options: ['0: No', '1: Yes'] },
    { name: 'symptom_severity', label: 'Symptom Severity (1-10)', type: 'number', min: 1, max: 10 },
  ];

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: formData,
          model_name: modelName,
          privacy_budget: privacyBudget
        }),
      });

      const data = await response.json();
      onResults(data);

      // Also get comparison results
      const comparisonResponse = await fetch('http://localhost:8000/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: formData,
          model_name: modelName,
          privacy_budget: privacyBudget
        }),
      });

      const comparisonData = await comparisonResponse.json();
      onComparison(comparisonData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Input Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {features.map(feature => (
          <div key={feature.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {feature.label}
            </label>
            {feature.type === 'select' ? (
              <select
                value={formData[feature.name] || ''}
                onChange={(e) => handleInputChange(feature.name, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select {feature.label}</option>
                {feature.options?.map(option => (
                  <option key={option} value={option.split(':')[0]}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={feature.type}
                min={feature.min}
                max={feature.max}
                value={formData[feature.name] || ''}
                onChange={(e) => handleInputChange(feature.name, parseFloat(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Model Architecture</label>
          <select
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="LR">Logistic Regression</option>
            <option value="MLP">Multi-Layer Perceptron</option>
            <option value="DeepMLP">Deep Multi-Layer Perceptron</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Privacy Budget (ε)</label>
          <select
            value={privacyBudget}
            onChange={(e) => setPrivacyBudget(parseFloat(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value={0.1}>High Privacy (ε=0.1)</option>
            <option value={5.0}>Lower Privacy (ε=5.0)</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Get Prediction'}
      </button>
    </form>
  );
}
