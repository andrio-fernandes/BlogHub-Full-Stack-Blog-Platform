import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

let toastCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = "success") => {
      const id = ++toastCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 3000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            role="status"
          >
            <span className="toast-icon">
              {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
};