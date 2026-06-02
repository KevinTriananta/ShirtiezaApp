import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isDanger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  isDanger = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm animate-fade-in" onClick={onCancel}>
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl animate-scale-in" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isDanger ? 'bg-red-50 text-red-600' : 'bg-neutral-100 text-black'}`}>
            <AlertTriangle size={22} />
          </div>
          <button type="button" onClick={onCancel} className="rounded-2xl p-2 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-black">
            <X size={18} />
          </button>
        </div>
        <h3 className="mt-5 text-xl font-black tracking-tight text-black">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">{message}</p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 transition-all hover:text-black">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:shadow-xl ${isDanger ? 'bg-red-600 hover:shadow-red-600/20' : 'bg-black hover:shadow-black/10'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
