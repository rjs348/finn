import { useState } from 'react';
import { ArrowLeft, Lock, Mail, Send, CheckCircle } from 'lucide-react';
import { auth } from '../api';

interface StudentLoginProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

export function StudentLogin({ onLogin, onBack }: StudentLoginProps) {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName && rollNumber && registerNumber && email) {
      try {
        await auth.studentLogin({
          name: studentName.trim(),
          rollNumber: Number(rollNumber),
          registerNumber: registerNumber.trim(),
          email: email.trim()
        });
        setStep('otp');
      } catch (error) {
        alert('Failed to send OTP. Please try again.');
        console.error(error);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await auth.verifyOtp({ registerNumber, otp });
      localStorage.setItem('token', response.data.token);
      // Pass the student data from backend to the login handler
      const studentData = {
        ...response.data.student,
        role: 'student'
      };

      // Clear login details
      setStudentName('');
      setRollNumber('');
      setRegisterNumber('');
      setEmail('');
      setOtp('');
      setStep('credentials');

      onLogin(studentData);
    } catch (error) {
      alert('Invalid OTP or OTP expired. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl mb-2">Student Login</h2>
          <p className="text-gray-600">
            {step === 'credentials'
              ? 'Enter your details to receive OTP'
              : 'Enter the OTP sent to your email'}
          </p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleSendOtp} className="space-y-6" autoComplete="off">
            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Student Name
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Roll Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter your roll number"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Register Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  placeholder="Enter your register number"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Email ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6" autoComplete="off">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <p className="text-sm">OTP has been sent to {email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Enter OTP
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-center text-2xl tracking-widest"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
            >
              Verify & Login
            </button>

            <button
              type="button"
              onClick={() => setStep('credentials')}
              className="w-full text-gray-600 py-2 hover:text-blue-600 transition-colors"
            >
              Change Email or Roll Number
            </button>
          </form>
        )}

      </div>
    </div>
  );
}