import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  Moon
} from 'lucide-react';

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, quickLogin } = useAuth();
  const { showToast } = useShop();

  // Mode: 'login' or 'register'
  const isRegisterParam = location.pathname === '/register';
  const [mode, setMode] = useState(isRegisterParam ? 'register' : 'login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Errors
  const [errors, setErrors] = useState({});

  const validateLogin = () => {
    const errs = {};
    if (!loginEmail.trim()) errs.email = 'Email address is required';
    else if (!loginEmail.includes('@')) errs.email = 'Please provide a valid email';
    if (!loginPassword) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateRegister = () => {
    const errs = {};
    if (!regName.trim() || regName.trim().length < 2) errs.name = 'Full name must be at least 2 characters';
    if (!regEmail.trim() || !regEmail.includes('@')) errs.email = 'Valid email is required';
    if (!regPassword || regPassword.length < 6) errs.password = 'Password must be at least 6 characters';
    if (regPassword !== regConfirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) errs.terms = 'You must agree to the Terms of Service';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    const res = login(loginEmail, loginPassword);
    if (res.success) {
      showToast('Welcome Back!', `Signed in as ${res.user.name}.`);
      navigate(res.user.role === 'admin' ? '/admin' : '/');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    const res = register({
      name: regName,
      email: regEmail,
      password: regPassword
    });

    if (res.success) {
      showToast('Account Created!', `Welcome to Moon Light Store, ${res.user.name}.`);
      navigate('/');
    }
  };

  const handleQuickDemo = (role) => {
    const user = quickLogin(role);
    showToast(`Switched to ${role === 'admin' ? 'Admin' : 'Customer'}`, `Logged in as ${user.name}`);
    navigate(role === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-soft-lg p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-amber-400 flex items-center justify-center text-white shadow-md">
              <Moon size={20} className="fill-amber-200 text-amber-200" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">
              Moon Light <span className="text-brand-600">Store</span>
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Welcome back to Moon Light Store' : 'Create your shopper account'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? 'Access your orders, saved favorites, and member perks.'
              : 'Join today and receive an instant $15 welcome coupon.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrors({});
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrors({});
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Quick Demo Login Buttons */}
        <div className="bg-brand-50/60 p-3.5 rounded-2xl border border-brand-100 space-y-2">
          <span className="text-[11px] font-bold text-brand-900 flex items-center gap-1">
            <Sparkles size={13} className="text-brand-600" /> Fast 1-Click Test Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-1.5 px-3 bg-white hover:bg-brand-100/50 text-slate-800 text-[11px] font-semibold rounded-lg border border-brand-200 transition-colors shadow-2xs"
            >
              👤 Customer Mode
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-3 bg-slate-900 hover:bg-black text-white text-[11px] font-semibold rounded-lg transition-colors shadow-2xs"
            >
              🛡️ Admin Mode
            </button>
          </div>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="demo@example.com"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full bg-slate-50 pl-10 pr-4 py-2.5 text-xs rounded-xl border ${
                    errors.email ? 'border-rose-500 bg-rose-50/40' : 'border-slate-200'
                  } focus:outline-none focus:border-brand-500`}
                />
                <Mail size={16} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-brand-600 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  className={`w-full bg-slate-50 pl-10 pr-10 py-2.5 text-xs rounded-xl border ${
                    errors.password ? 'border-rose-500 bg-rose-50/40' : 'border-slate-200'
                  } focus:outline-none focus:border-brand-500`}
                />
                <Lock size={16} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-rose-500 mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 accent-brand-600"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Sign In to Account</span>
              <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Gokilavani"
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full bg-slate-50 pl-10 pr-4 py-2 text-xs rounded-xl border ${
                    errors.name ? 'border-rose-500 bg-rose-50/40' : 'border-slate-200'
                  } focus:outline-none focus:border-brand-500`}
                />
                <User size={15} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="gokilavani@example.com"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full bg-slate-50 pl-10 pr-4 py-2 text-xs rounded-xl border ${
                    errors.email ? 'border-rose-500 bg-rose-50/40' : 'border-slate-200'
                  } focus:outline-none focus:border-brand-500`}
                />
                <Mail size={15} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={`w-full bg-slate-50 px-3 py-2 text-xs rounded-xl border ${
                      errors.password ? 'border-rose-500 bg-rose-50/40' : 'border-slate-200'
                    } focus:outline-none focus:border-brand-500`}
                  />
                </div>
                {errors.password && <p className="text-[10px] text-rose-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm *
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Repeat pass"
                  value={regConfirmPassword}
                  onChange={(e) => {
                    setRegConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  className={`w-full bg-slate-50 px-3 py-2 text-xs rounded-xl border ${
                    errors.confirmPassword ? 'border-rose-500 bg-rose-50/40' : 'border-slate-200'
                  } focus:outline-none focus:border-brand-500`}
                />
                {errors.confirmPassword && <p className="text-[10px] text-rose-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div>
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                  }}
                  className="w-4 h-4 rounded text-brand-600 accent-brand-600 mt-0.5"
                />
                <span className="text-[11px] text-slate-500 leading-tight">
                  I agree to Moon Light Store's Terms of Service and Privacy Policy.
                </span>
              </label>
              {errors.terms && <p className="text-[10px] text-rose-500 mt-1">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Create Free Account</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
