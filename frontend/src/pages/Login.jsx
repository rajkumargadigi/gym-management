import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Dumbbell, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const { login, error, setError, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
    // Clean up errors on mount
    setError(null);
  }, [user, navigate, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      const data = await login(email, password);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // AuthContext handles the error state
    }
  };

  return (
    <div className="min-h-screen bg-gymBlack-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gymRed/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gymRed/5 blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center items-center space-x-2">
          <Dumbbell className="h-10 w-10 text-gymRed animate-pulse" />
          <span className="text-3xl font-black tracking-wider text-white">
            IRON<span className="text-gymRed">HOUSE</span>
          </span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Welcome back, athlete
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-gymRed hover:text-gymRed-light transition-colors"
          >
            create a new gym membership
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="glass-panel py-8 px-6 shadow-2xl rounded-2xl border border-white/5 sm:px-10 glow-red">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Context or Form Error Display */}
            {(formError || error) && (
              <div className="bg-gymRed/15 border border-gymRed/30 text-gymRed-light p-3 rounded-lg flex items-center space-x-2 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{formError || error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-gymBlack-dark/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gymRed focus:border-transparent transition-all text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-gymBlack-dark/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gymRed focus:border-transparent transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gymRed hover:bg-gymRed-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gymRed transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
