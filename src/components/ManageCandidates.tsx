import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Save, X } from 'lucide-react';
import { candidates as candidatesApi } from '../api';
import { useNavigate } from 'react-router-dom';

interface Candidate {
  _id: string;
  name: string;
  rollNumber: string;
  course: string;
  year: string;
  manifesto: string;
  photo?: string;
  votes?: number;
}

export function ManageCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    rollNumber: '',
    course: '',
    year: '',
    manifesto: '',
    photo: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCandidates = async () => {
    try {
      const response = await candidatesApi.getAll();
      // Sort by vote count desc
      const sorted = response.data.sort((a: Candidate, b: Candidate) => (b.votes || 0) - (a.votes || 0));
      setCandidates(sorted);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch candidates');
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await candidatesApi.add(newCandidate);
      setShowAddForm(false);
      setNewCandidate({
        name: '',
        rollNumber: '',
        course: '',
        year: '',
        manifesto: '',
        photo: ''
      });
      fetchCandidates();
    } catch (err) {
      console.error(err);
      setError('Failed to add candidate');
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await candidatesApi.delete(id);
        fetchCandidates();
      } catch (err) {
        console.error(err);
        setError('Failed to delete candidate');
      }
    }
  };

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
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 tewhite px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-white"
            >
              <Plus className="w-5 h-5" />
              Add Candidate
            </button>
          </div>

          <h1 className="text-3xl mb-2">Manage Candidates</h1>
          <p className="text-gray-600">Add, edit, or remove candidates</p>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Candidate</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddCandidate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={newCandidate.name}
                  onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Roll Number</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={newCandidate.rollNumber}
                  onChange={e => setNewCandidate({ ...newCandidate, rollNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Course & Department</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech CSE"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={newCandidate.course}
                  onChange={e => setNewCandidate({ ...newCandidate, course: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Year</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3rd Year"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={newCandidate.year}
                  onChange={e => setNewCandidate({ ...newCandidate, year: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-gray-700">Manifesto / Slogan</label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={newCandidate.manifesto}
                  onChange={e => setNewCandidate({ ...newCandidate, manifesto: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-gray-700">Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={newCandidate.photo}
                  onChange={e => setNewCandidate({ ...newCandidate, photo: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div key={candidate._id} className="bg-white rounded-xl shadow-lg overflow-hidden group">
              <div className="relative h-48 bg-gray-100">
                {candidate.photo ? (
                  <img
                    src={candidate.photo}
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleDeleteCandidate(candidate._id)}
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{candidate.name}</h3>
                <p className="text-gray-600 mb-4">{candidate.course} • {candidate.year}</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 italic">"{candidate.manifesto}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}