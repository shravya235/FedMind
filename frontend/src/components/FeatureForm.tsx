'use client';

import { useState } from 'react';

interface FeatureFormProps {
  onResults: (results: any) => void;
  onComparison: (results: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const FEATURES = [
  { name: 'age', label: 'Age', type: 'number', min: 18, max: 100 },
  { name: 'gender', label: 'Gender', type: 'select', options: ['0: Male', '1: Female', '2: Other'] },
  { name: 'education', label: 'Education Level', type: 'select', options: ['0: High School', '1: College', '2: Bachelor', '3: Master', '4: PhD'] },
  { name: 'employment', label: 'Employment Status', type: 'select', options: ['0: Unemployed', '1: Part-time', '2: Full-time', '3: Self-employed'] },
  { name: 'income', label: 'Annual Income ($)', type: 'number', min: 0, max: 500000 },
  { name: 'marital_status', label: 'Marital Status', type: 'select', options: ['0: Single', '1: Married', '2: Divorced', '3: Widowed'] },
  { name: 'children', label: 'Number of Children', type: 'number', min: 0, max: 10 },
  { name: 'alcohol_consumption', label: 'Alcohol Consumption (0-10)', type: 'number', min: 0, max: 10 },
  { name: 'drug_use', label: 'Drug Use (0-10)', type: 'number', min: 0, max: 10 },
  { name: 'sleep_hours', label: 'Average Sleep Hours', type: 'number', min: 0, max: 24 },
  { name: 'exercise_hours', label: 'Exercise Hours/Week', type: 'number', min: 0, max: 40 },
  { name: 'stress_level', label: 'Stress Level (0-10)', type: 'number', min: 0, max: 10 },
  { name: 'social_support', label: 'Social Support (0-10)', type: 'number', min: 0, max: 10 },
  { name: 'therapy_history', label: 'Previous Therapy', type: 'select', options: ['0: No', '1: Yes'] },
  { name: 'symptom_severity', label: 'Symptom Severity (0-10)', type: 'number', min: 0, max: 10 }
];

export default function FeatureForm({ onResults, onComparison, loading, setLoading }: FeatureFormProps) {
  const [features, setFeatures] = useState<Record<string, number>>({});
  const [modelName, setModelName] = useState('MLP');
  const [privacyBudget, setPrivacyBudget] = useState(5.0);
  const [compareAll, setCompareAll] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (compareAll) {
        const response = await fetch('http://localhost:8000/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ features, model_name: modelName, privacy_budget: privacyBudget })
        });
        const data = await response.json();
        onComparison(data.comparison);
      } else {
        const response = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ features, model_name: modelName, privacy_budget: privacyBudget })
        });
        const data = await response.json();
        onResults(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureChange = (name: string, value: string) => {
    setFeatures(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Input Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {FEATURES.map(feature => (
          <div key={feature.name} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {feature.label}
            </label>
            {feature.type === 'select' ? (
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleFeatureChange(feature.name, e.target.value)}
                required
              >
                <option value="">Select {feature.label}</option>
                {feature.options?.map(option => (
                  <option key={option} value={option.split(':')[0]}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                min={feature.min}
                max={feature.max}
                step={feature.type === 'number' ? '0.1' : '1'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleFeatureChange(feature.name, e.target.value)}
                required
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model Architecture
          </label>
          <select
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="LR">Logistic Regression</option>
            <option value="MLP">MLP</option>
            <option value="DeepMLP">Deep MLP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Privacy Budget (ε)
          </label>
          <select
            value={privacyBudget}
            onChange={(e) => setPrivacyBudget(parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0.1}>ε = 0.1 (High Privacy)</option>
            <option value={5.0}>ε = 5.0 (Low Privacy)</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={compareAll}
              onChange={(e) => setCompareAll(e.target.checked)}
              className="mr-2"
            />
            Compare all models
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : compareAll ? 'Compare All Models' : 'Predict'}
      </button>
    </form>
  );
}
