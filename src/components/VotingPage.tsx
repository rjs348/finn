import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { candidates as candidatesApi, vote as voteApi } from '../api';
import { useNavigate } from 'react-router-dom';

interface Candidate {
  _id: string;
  name: string;
  course: string;
  manifesto: string;
  photo?: string;
  votes?: number;
}

export function VotingPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCandidates = async () => {
    try {
      const response = await candidatesApi.getAll();
      setCandidates(response.data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to load candidates.');
    }
  };

  useEffect(() => {
    fetchCandidates();
    // Check if user has voted (could be part of user profile or a separate check)
    // For now, assuming if we get a 403 or specific error on vote it means voted
    // Or we can check user state if we had a global context
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.hasVoted) setHasVoted(true);
    }
  }, []);

  const handleVote = async () => {
    if (selectedCandidate) {
      try {
        await voteApi.cast(selectedCandidate);
        setShowConfirmation(true);
        setHasVoted(true);
        // Update local storage to reflect status
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.hasVoted = true;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (err) {
        const error = err as any;
        setError(error.response?.data?.message || 'Vote failed');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  if (hasVoted && !showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">You Have Voted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for participating in the election.
          </p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    const candidate = candidates.find(c => c._id === selectedCandidate);
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in">
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl mb-4">Vote Submitted!</h2>
            <p className="text-gray-600 mb-6">
              You have successfully voted for:
            </p>
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <p className="text-xl">{candidate?.name}</p>
              <p className="text-gray-600">{candidate?.course}</p>
            </div>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="text-center">
            <h1 className="text-3xl mb-2">Cast Your Vote</h1>
            <p className="text-gray-600">Select one candidate from the list below</p>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              onClick={() => setSelectedCandidate(candidate._id)}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-b last:border-b-0 ${selectedCandidate === candidate._id
                ? 'bg-blue-50 border-l-4 border-l-blue-600'
                : 'hover:bg-gray-50'
                }`}
            >
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {candidate.photo ? (
                  <img
                    src={candidate.photo}
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg mb-1">{candidate.name}</h3>
                <p className="text-gray-600 text-sm">{candidate.course}</p>
              </div>

              <div className="flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedCandidate === candidate._id
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300'
                    }`}
                >
                  {selectedCandidate === candidate._id && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleVote}
          disabled={!selectedCandidate}
          className={`w-full py-4 rounded-lg text-lg transition-all ${selectedCandidate
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          Submit Vote
        </button>
      </div>
    </div>
  );
}