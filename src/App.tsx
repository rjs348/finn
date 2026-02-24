import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { StudentLogin } from './components/StudentLogin';
import { AdminLogin } from './components/AdminLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { VotingPage } from './components/VotingPage';
import { ResultsPage } from './components/ResultsPage';
import { ManageCandidates } from './components/ManageCandidates';
import { SuccessPage } from './components/SuccessPage';
import { Chatbot } from './components/Chatbot';
import { ResetPassword } from './components/ResetPassword';

// Define types locally
export type ElectionStatus = 'open' | 'closed';

interface User {
    rollNumber: string;
    name: string;
    role: string;
    hasVoted?: boolean;
}

const BackgroundStars = () => {
    return (
        <div className="stars-container">
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="star"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 3}px`,
                        height: `${Math.random() * 3}px`,
                        '--duration': `${2 + Math.random() * 4}s`,
                    } as any}
                />
            ))}
            <div className="shooting-star" style={{ top: '10%', left: '30%', animationDelay: '2s' }}></div>
            <div className="shooting-star" style={{ top: '5%', left: '80%', animationDelay: '4s' }}></div>
        </div>
    );
};

function AppContent() {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isAdmin, setIsAdmin] = useState(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        return !!token && !savedUser; // Simplified admin check
    });
    const navigate = useNavigate();

    const handleStudentLogin = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/student/dashboard');
    };

    const handleAdminLogin = () => {
        setIsAdmin(true);
        navigate('/admin');
    };

    const handleLogout = () => {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    useEffect(() => {
        // Just for logging or other side effects if needed
    }, []);

    return (
        <div className="min-h-screen">
            <BackgroundStars />
            <Routes>
                <Route path="/" element={
                    <LandingPage
                        onStudentLogin={() => navigate('/student/login')}
                        onAdminLogin={() => navigate('/admin/login')}
                    />
                } />

                <Route path="/student/login" element={
                    <StudentLogin
                        onLogin={handleStudentLogin}
                        onBack={() => navigate('/')}
                    />
                } />

                <Route path="/admin/login" element={
                    <AdminLogin
                        onLogin={handleAdminLogin}
                        onBack={() => navigate('/')}
                    />
                } />

                <Route path="/student/dashboard" element={
                    user ? (
                        <StudentDashboard
                            student={user}
                            onVoteNow={() => navigate('/vote')}
                            onLogout={handleLogout}
                        />
                    ) : <Navigate to="/student/login" />
                } />

                <Route path="/admin" element={
                    isAdmin ? (
                        <AdminDashboard
                            onManageCandidates={() => navigate('/admin/candidates')}
                            onViewResults={() => navigate('/results')}
                            onLogout={handleLogout}
                        />
                    ) : <Navigate to="/admin/login" />
                } />

                <Route path="/vote" element={<VotingPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/admin/candidates" element={<ManageCandidates />} />
                <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
                <Route path="/success" element={<SuccessPage onBackToDashboard={() => navigate('/student/dashboard')} />} />
            </Routes>
            <Chatbot />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
