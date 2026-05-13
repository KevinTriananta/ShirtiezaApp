import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../providers/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    country: 'Indonesia',
    zip_code: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Name, email, and password are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.message?.includes('Network Error')) {
        setError('Unable to connect to server. Please make sure the backend is running.');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl text-sm text-black placeholder:text-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all duration-200';
  const labelClass =
    'block text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2.5';
  const iconClass = 'absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300';

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 lg:pt-[72px] flex items-center justify-center px-6">
      <div className="w-full max-w-lg py-12 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="text-[22px] font-black italic tracking-tight text-black mb-6 inline-block hover:opacity-70 transition-opacity duration-200">
            SHIRTIEZA
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-[0.06em] text-black mt-6 mb-2">
            Create Account
          </h1>
          <p className="text-sm text-neutral-400">
            Join Shirtieza and start shopping today
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-sm text-red-600 px-4 py-3 rounded-xl flex items-start gap-3 animate-scale-in">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="reg-name" className={labelClass}>Full Name *</label>
              <div className="relative">
                <User size={16} strokeWidth={1.5} className={iconClass} />
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className={labelClass}>Email Address *</label>
              <div className="relative">
                <Mail size={16} strokeWidth={1.5} className={iconClass} />
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className={labelClass}>Password * (min 6 characters)</label>
              <div className="relative">
                <Lock size={16} strokeWidth={1.5} className={iconClass} />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 border border-neutral-200 rounded-xl text-sm text-black placeholder:text-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all duration-200"
                  required
                  minLength={6}
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

            {/* Phone & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-phone" className={labelClass}>Phone</label>
                <div className="relative">
                  <Phone size={16} strokeWidth={1.5} className={iconClass} />
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+62..."
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="reg-city" className={labelClass}>City</label>
                <div className="relative">
                  <MapPin size={16} strokeWidth={1.5} className={iconClass} />
                  <input
                    id="reg-city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Jakarta"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="reg-address" className={labelClass}>Address</label>
              <textarea
                id="reg-address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your full address"
                className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-sm text-black placeholder:text-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all duration-200 resize-none"
                rows={3}
              />
            </div>

            {/* Country & ZIP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-country" className={labelClass}>Country</label>
                <select
                  id="reg-country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-sm text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all duration-200 bg-white appearance-none cursor-pointer"
                >
                  <option value="Indonesia">Indonesia</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label htmlFor="reg-zip" className={labelClass}>ZIP Code</label>
                <input
                  id="reg-zip"
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  placeholder="12345"
                  className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl text-sm text-black placeholder:text-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/5 transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-800 hover:shadow-lg hover:shadow-black/10 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-neutral-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-black font-semibold hover:text-neutral-600 transition-colors duration-200 underline underline-offset-2 decoration-neutral-300 hover:decoration-black"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
