import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification = () => {
  const { toasts, removeToast } = useShop();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-500';
        let borderColor = 'border-emerald-100 bg-white';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-rose-500';
          borderColor = 'border-rose-100 bg-white';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'text-indigo-500';
          borderColor = 'border-indigo-100 bg-white';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-soft-lg border ${borderColor} animate-slide-up transition-all`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors -mr-1 -mt-1 p-1 rounded-lg hover:bg-slate-50"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastNotification;
