import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import WarehouseContextProvider from '../../Contexts/Warehouse/WarehouseContext';
import { PaymentProvider } from '../../Contexts/Warehouse/PaymentContext';
import { WasteAgentProvider } from '../../Contexts/Warehouse/WasteAgentContext';
import { ToastProvider } from '../../Contexts/ToastContext';

export default function WarehouseLayout() {
    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <WarehouseContextProvider>
                <PaymentProvider>
                    <WasteAgentProvider>
                        <ToastProvider>
                            <Sidebar />
                            <div className="flex-1 flex flex-col">
                                <Header />
                                <main className="flex-1 overflow-auto">
                                    <Outlet />
                                </main>
                            </div>
                        </ToastProvider>
                    </WasteAgentProvider>
                </PaymentProvider>
            </WarehouseContextProvider>
        </div>
    );
}