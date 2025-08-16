'use client';

import Link from 'next/link';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Documentation
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Platform</h2>
            <p className="text-gray-600 mb-4">
              This research platform demonstrates how federated learning can be used to develop 
              mental health prediction models while preserving user privacy. The system uses 
              advanced privacy-preserving techniques to ensure that sensitive health data 
              remains protected throughout the entire process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Federated Learning</h3>
              <p className="text-gray-600">
                Instead of collecting all data in one place, federated learning allows 
                models to be trained across multiple decentralized devices or servers 
                holding local data samples, without exchanging them.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Differential Privacy</h3>
              <p className="text-gray-600">
                A system for publicly sharing information about a dataset by describing 
                the patterns of groups within the dataset while withholding information 
                about individuals in the dataset.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Simulated Secure Aggregation</h3>
              <p className="text-gray-600">
                Since implementing real cryptographic protocols like homomorphic encryption or multi-party computation is super heavy, researchers often simulate secure aggregation in experiments to test FL frameworks.

              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Privacy Guarantee</h3>
              <p className="text-gray-600">
                Your data is processed locally and never leaves your device. The system 
                only shares encrypted model updates that cannot be traced back to individual users.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Try?</h2>
            <p className="text-gray-600 mb-6">
              Experience the platform and see how ML models with privacy preserving techniques can help predict mental health needs 
              while keeping your data completely private.
            </p>
            <Link 
              href="/prediction"
className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
            >
              Start Prediction
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
