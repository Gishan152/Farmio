import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import WarehouseContextProvider from '../../Contexts/Warehouse/WarehouseContext';
import { ToastProvider } from '../../Contexts/ToastContext';

export default function WarehouseLayout() {
    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <WarehouseContextProvider>
                <ToastProvider>
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 p-6 overflow-auto">
                            <Outlet />
                        </main>
                    </div>
                </ToastProvider>
            </WarehouseContextProvider>
        </div>
    );
}