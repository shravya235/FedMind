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

interface Feature {
  name: string;
  label: string;
  type: string;
  options?: string[];
  required: boolean;
}

export default function FeatureForm({ onResults, onComparison, loading, setLoading }: FeatureFormProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [modelName, setModelName] = useState('MLP');
  const [privacyBudget, setPrivacyBudget] = useState(5.0);

  const features: Feature[] = [
    { name: 'timestamp', label: 'Survey Date', type: 'date', required: true },
    { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
    { name: 'country', label: 'Country', type: 'text', required: true },
    { name: 'occupation', label: 'Occupation', type: 'select', options: ['Corporate', 'Student', 'Freelancer', 'Healthcare', 'Education', 'Other'], required: true },
    { name: 'self_employed', label: 'Self Employed', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'family_history', label: 'Family History of Mental Illness', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'treatment', label: 'Previous Treatment', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'days_indoors', label: 'Days Staying Indoors', type: 'select', options: ['1-7 days', '8-14 days', '15-30 days', 'More than 30 days'], required: true },
    { name: 'growing_stress', label: 'Growing Stress', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'changes_habits', label: 'Changes in Daily Habits', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'mental_health_history', label: 'Personal Mental Health History', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'mood_swings', label: 'Mood Swings', type: 'select', options: ['Low', 'Medium', 'High'], required: true },
    { name: 'coping_struggles', label: 'Coping Struggles', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'work_interest', label: 'Work Interest Affected', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'social_weakness', label: 'Social Weakness', type: 'select', options: ['Yes', 'No'], required: true },
    { name: 'mental_health_interview', label: 'Comfort Discussing Mental Health in Interviews', type: 'select', options: ['Yes', 'No', 'Maybe'], required: true },
    { name: 'care_options', label: 'Awareness of Care Options', type: 'select', options: ['Yes', 'No', 'Not sure'], required: true },
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
            <label htmlFor={feature.name} className="block text-sm font-medium text-gray-700 mb-2">
              {feature.label}
            </label>
            {feature.type === 'select' ? (
              <select
                id={feature.name}
                value={formData[feature.name] || ''}
                onChange={(e) => handleInputChange(feature.name, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
                required
              >
                <option value="">Select {feature.label}</option>
                {feature.options?.map(option => (
                  <option key={option} value={option.split(':')[0]}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                id={feature.name}
                type={feature.type}
                // min={feature.min}
                // max={feature.max}
                min={feature.min}
                max={feature.max}
                value={formData[feature.name] || ''}
                onChange={(e) => handleInputChange(feature.name, parseFloat(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="model-architecture" className="block text-sm font-medium text-gray-700 mb-2">Model Architecture</label>
          <select
            id="model-architecture"
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
          <label htmlFor="privacy-budget" className="block text-sm font-medium text-gray-700 mb-2">Privacy Budget (ε)</label>
          <select
            id="privacy-budget"
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
className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Get Prediction'}
      </button>
    </form>
  );
}
