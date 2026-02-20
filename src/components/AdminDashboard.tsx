import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  Vote,
} from "lucide-react";
import type { ElectionStatus } from "../App";
import { admin } from '../api';

interface AdminDashboardProps {
  onManageCandidates: () => void;
  onViewResults: () => void;
  onLogout: () => void;
}

export function AdminDashboard({
  onManageCandidates,
  onViewResults,
  onLogout,
}: AdminDashboardProps) {
  const [electionStatus, setElectionStatus] = useState<ElectionStatus>('closed');
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);

  const fetchStats = async () => {
    try {
      const response = await admin.getDashboard();
      setElectionStatus(response.data.electionStatus);
      setTotalVotes(response.data.totalVotes);
      setTotalCandidates(response.data.totalCandidates);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleToggleElection = async () => {
    try {
      const response = await admin.toggleElection();
      setElectionStatus(response.data.status);
    } catch (error) {
      console.error('Error toggling election:', error);
    }
  };
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl mb-1">Admin Dashboard</h1>
              <p className="text-gray-600">
                Manage college elections
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Vote className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  Total Votes
                </p>
                <p className="text-3xl">{totalVotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  Active Candidates
                </p>
                <p className="text-3xl">{totalCandidates}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-full ${electionStatus === "open"
                  ? "bg-green-100"
                  : "bg-red-100"
                  }`}
              >
                <Settings
                  className={`w-8 h-8 ${electionStatus === "open"
                    ? "text-green-600"
                    : "text-red-600"
                    }`}
                />
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  Election Status
                </p>
                <p className="text-xl capitalize">
                  {electionStatus}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Control Election Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl mb-4">Election Control</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2">
                Current Status:{" "}
                <span className="capitalize">
                  {electionStatus}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                {electionStatus === "open"
                  ? "Students can currently cast their votes"
                  : "Voting is currently closed"}
              </p>
            </div>
            <button
              onClick={handleToggleElection}
              className={`px-6 py-3 rounded-lg transition-colors ${electionStatus === "open"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
                }`}
            >
              {electionStatus === "open"
                ? "Close Voting"
                : "Open Voting"}
            </button>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={onManageCandidates}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 text-left"
          >
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl mb-2">
                  Manage Candidates
                </h3>
                <p className="text-gray-600">
                  Add, edit, or remove candidates from the
                  election
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={onViewResults}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 text-left"
          >
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-4 rounded-full">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl mb-2">View Results</h3>
                <p className="text-gray-600">
                  See voting statistics and export results
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}