import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import { ToastProvider } from '../../Contexts/ToastContext';

export default function WasteAgentLayout() {
    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <ToastProvider>
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 p-6 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </ToastProvider>
        </div>
    );
}
