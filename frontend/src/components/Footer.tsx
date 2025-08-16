export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">FedMind</h3>
          <p className="text-gray-300 mb-4">
            Advancing mental health prediction through federated learning and privacy-preserving AI
          </p>
          <div className="flex justify-center space-x-6">
            <a href="/" className="text-gray-300 hover:text-white">Home</a>
            <a href="/about" className="text-gray-300 hover:text-white">About</a>
            <a href="/contact" className="text-gray-300 hover:text-white">Contact</a>
            <a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © 2024 FedMind. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
