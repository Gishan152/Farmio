import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const push = useCallback((message) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const remove = useCallback((id) => {
        setToasts((prev) => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ push, remove }}>
            {children}
            {/* Toast container */}
            <div className="fixed inset-x-0 top-4 flex flex-col items-center space-y-2 z-50 pointer-events-none">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className="max-w-md w-full bg-green-300 text-black dark:bg-gray-800 dark:text-white px-4 py-2 rounded shadow-lg transform transition duration-300"
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
