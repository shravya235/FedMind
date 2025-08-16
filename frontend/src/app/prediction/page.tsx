'use client';

import { useState } from 'react';
import FeatureForm from '@/components/FeatureForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import ComparisonPanel from '@/components/ComparisonPanel';
import ResearchInfo from '@/components/ResearchInfo';

export default function PredictionPage() {
  const [results, setResults] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Mental Health Prediction Research Platform
          </h1>
          <p className="text-lg text-gray-600">
            Federated Learning with Differential Privacy & Simulated Secure Aggregation
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FeatureForm 
              onResults={setResults}
              onComparison={setComparisonResults}
              loading={loading}
              setLoading={setLoading}
            />
            
            {results && (
              <ResultsDisplay 
                results={results} 
                loading={loading}
              />
            )}
            
            {comparisonResults && (
              <ComparisonPanel 
                results={comparisonResults}
              />
            )}
          </div>
          
          <div className="lg:col-span-1">
            <ResearchInfo />
          </div>
        </div>
      </main>
    </div>
  );
}
