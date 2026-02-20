import { CheckCircle, Home } from 'lucide-react';

interface SuccessPageProps {
  onBackToDashboard: () => void;
}

export function SuccessPage({ onBackToDashboard }: SuccessPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vote Successful!</h1>
        <p className="text-gray-600 mb-8">
          Your vote has been cast and recorded securely in our system.
        </p>

        <div className="space-y-4">
          <button
            onClick={onBackToDashboard}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>

          <p className="text-sm text-gray-500">
            You can now view live results from the dashboard if they are public.
          </p>
        </div>
      </div>
    </div>
  );
}