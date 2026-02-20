import { useState, useEffect } from 'react';
import { LogOut, Vote, CheckCircle2, XCircle } from 'lucide-react';
import { election } from '../api';

interface Student {
  name: string;
  rollNumber: string;
  hasVoted?: boolean;
}

interface StudentDashboardProps {
  student: Student;
  onVoteNow: () => void;
  onLogout: () => void;
}

export function StudentDashboard({
  student: initialStudent,
  onVoteNow,
  onLogout
}: StudentDashboardProps) {
  const [electionStatus, setElectionStatus] = useState<'open' | 'closed'>('closed');
  const [student] = useState(initialStudent);

  const fetchStatus = async () => {
    try {
      const response = await election.getStatus();
      setElectionStatus(response.data.status);
    } catch (error) {
      console.error('Error fetching election status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    // In a real app, we'd also fetch the latest student status from backend
  }, []);

  const canVote = electionStatus === 'open' && !student.hasVoted;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in hover-lift">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl mb-1">Welcome, {student.name}!</h1>
              <p className="text-gray-600">Roll Number: {student.rollNumber}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors btn-ripple"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Voting Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 animate-fade-in hover-lift">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {electionStatus === 'open' ? (
                <div className="bg-green-100 p-4 rounded-full animate-pulse-slow">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 p-4 rounded-full animate-swing">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              )}
            </div>

            <h2 className="text-2xl mb-2">
              Voting Status: {electionStatus === 'open' ? 'Open' : 'Closed'}
            </h2>

            {student.hasVoted ? (
              <div className="mt-4">
                <div className="inline-block bg-blue-100 text-blue-700 px-6 py-3 rounded-full animate-bounce-slow">
                  ✓ You have already voted
                </div>
              </div>
            ) : electionStatus === 'open' ? (
              <p className="text-gray-600 mb-6">
                The election is currently open. Cast your vote now!
              </p>
            ) : (
              <p className="text-gray-600">
                The election is currently closed. Please check back later.
              </p>
            )}
          </div>
        </div>

        {/* Vote Button */}
        {canVote && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-8 animate-fade-in hover-lift">
            <div className="text-center text-white">
              <Vote className="w-12 h-12 mx-auto mb-4 animate-float" />
              <h3 className="text-2xl mb-4">Ready to Vote?</h3>
              <p className="mb-6 opacity-90">
                Make your voice heard. Choose your candidate carefully.
              </p>
              <button
                onClick={onVoteNow}
                className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg"
              >
                Vote Now
              </button>
            </div>
          </div>
        )}

        {student.hasVoted && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center animate-fade-in hover-lift">
            <p className="text-blue-800">
              Thank you for participating in the college elections!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}