import { GraduationCap, User, Shield, Clock } from 'lucide-react';

interface LandingPageProps {
  onStudentLogin: () => void;
  onAdminLogin: () => void;
}

export function LandingPage({ onStudentLogin, onAdminLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white p-6 rounded-full animate-bounce-slow">
            <GraduationCap className="w-16 h-16" />
          </div>
        </div>
        <h1 className="text-4xl mb-4 text-white">National Institute of Technology</h1>
        <h2 className="text-2xl text-blue-200 mb-2">Online Voting System</h2>
        <p className="text-blue-100 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 animate-tick-tock" />
          College Elections 2026
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl w-full">
        <button
          onClick={onStudentLogin}
          className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-2 border-purple-400/30 hover:border-purple-300 hover-lift animate-slide-left btn-ripple relative overflow-hidden group"
        >
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full animate-float border-2 border-white/30">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl mb-2 text-white font-semibold">Student Login</h3>
            <p className="text-purple-100 text-sm">Cast your vote for college elections</p>
          </div>
        </button>

        <button
          onClick={onAdminLogin}
          className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:scale-105 border-2 border-indigo-400/30 hover:border-indigo-300 hover-lift animate-slide-right btn-ripple relative overflow-hidden group"
        >
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full animate-pulse-slow border-2 border-white/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl mb-2 text-white font-semibold">Admin Login</h3>
            <p className="text-indigo-100 text-sm">Manage elections and view results</p>
          </div>
        </button>
      </div>

      <div className="mt-12 text-center text-sm text-blue-200 animate-fade-in">
        <p>🔒 Secure • Fair • Transparent</p>
      </div>
    </div>
  );
}