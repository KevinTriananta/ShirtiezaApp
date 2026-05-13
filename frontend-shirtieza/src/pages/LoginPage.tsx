import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../providers/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please make sure the backend is running.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 lg:pt-[72px] flex items-center justify-center px-6">
      <div className="w-full max-w-md py-12 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="text-[22px] font-black italic tracking-tight text-black mb-6 inline-block hover:opacity-70 transition-opacity duration-200">
            SHIRTIEZA
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-[0.06em] text-black mt-6 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-neutral-400">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-sm text-red-600 px-4 py-3 rounded-xl flex items-start gap-3 animate-scale-in">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
                />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl text-sm text-black placeholder:text-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300"
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 border border-neutral-200 rounded-xl text-sm text-black placeholder:text-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-600 transition-colors duration-200 p-1 rounded-lg hover:bg-neutral-100"
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/10 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none mt-2 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-neutral-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-black font-semibold hover:text-neutral-600 transition-colors duration-200 underline underline-offset-2 decoration-neutral-300 hover:decoration-black"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
