import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertCircle, Check, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  notify: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const notify = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => removeToast(id), 3500);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed right-4 top-4 z-[80] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl shadow-black/10 animate-scale-in">
            <div className={`mt-0.5 ${toast.type === 'success' ? 'text-emerald-600' : toast.type === 'error' ? 'text-red-600' : 'text-black'}`}>
              {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            </div>
            <p className="flex-1 text-sm font-semibold text-black">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-neutral-300 transition-colors hover:text-black">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
