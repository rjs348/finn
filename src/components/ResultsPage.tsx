import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, BarChart3, Download, CheckCircle2 } from 'lucide-react';
import { candidates as candidatesApi } from '../api';
import { useNavigate } from 'react-router-dom';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

interface Candidate {
  _id: string;
  name: string;
  course: string;
  manifesto: string;
  photo?: string;
  votes?: number;
}

export function ResultsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const navigate = useNavigate();

  const fetchResults = async () => {
    try {
      const response = await candidatesApi.getAll();
      // Sort by vote count desc
      const sorted = response.data.sort((a: Candidate, b: Candidate) => (b.votes || 0) - (a.votes || 0));
      setCandidates(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const totalVotes = candidates.reduce((acc, curr) => acc + (curr.votes || 0), 0);
  const winner = candidates[0];

  const handleExport = () => {
    if (candidates.length === 0) return;

    const headers = ["Rank", "Candidate Name", "Department", "Votes"];
    const rows = candidates.map((c, index) => [
      index + 1,
      c.name,
      c.course,
      c.votes || 0
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `election_results_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare data for charts
  const chartData = candidates.map(c => ({
    name: c.name,
    votes: c.votes || 0,
    shortName: c.name.split(' ')[0]
  }));

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Download className="w-5 h-5" />
              Export Results
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl mb-2">Election Results</h1>
            <p className="text-gray-600">Live voting statistics and visualizations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white text-center">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <p className="text-purple-100 mb-1">Total Votes Cast</p>
              <p className="text-4xl font-bold">{totalVotes}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white text-center md:col-span-2 relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-center gap-6">
                <div>
                  <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <p className="text-yellow-100 mb-1">Leading Candidate</p>
                  <p className="text-4xl font-bold">{winner?.name || 'No Votes Yet'}</p>
                  <p className="text-yellow-100">{winner?.votes || 0} Votes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Detailed Standings</h2>
          </div>
          <div className="divide-y">
            {candidates.map((candidate, index) => (
              <div key={candidate._id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center font-bold text-xl text-gray-400">
                  #{index + 1}
                </div>

                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                  {candidate.photo ? (
                    <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-500">No Image</div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{candidate.name}</h3>
                  <p className="text-gray-600 text-sm">{candidate.course}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold mb-1">{candidate.votes || 0}</p>
                  <p className="text-sm text-gray-500">
                    {totalVotes > 0 ? Math.round(((candidate.votes || 0) / totalVotes) * 100) : 0}%
                  </p>
                </div>

                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${totalVotes > 0 ? ((candidate.votes || 0) / totalVotes) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Analytics Section */}
        {candidates.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Vote Distribution (Bar)
              </h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="shortName" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                Vote Percentage (Pie)
              </h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="votes"
                    >
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}