import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import SavesContextProvider from '../../Contexts/Farmer/SavesContext';
import { ToastProvider } from '../../Contexts/ToastContext';

export default function FarmerLayout() {
    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <SavesContextProvider>
                <ToastProvider>
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 p-6 overflow-auto">
                            <Outlet />
                        </main>
                    </div>
                </ToastProvider>
            </SavesContextProvider>
        </div>
    );
}
