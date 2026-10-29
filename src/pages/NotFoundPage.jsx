import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center animate-fade-in space-y-4">
      <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto">
        <ShoppingBag size={32} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
      <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm">
        The destination you are looking for does not exist or may have been relocated.
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
      >
        <ArrowLeft size={14} />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
