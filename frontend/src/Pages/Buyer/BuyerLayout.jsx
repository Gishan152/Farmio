import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import SavesContextProvider from '../../Contexts/Buyer/SavesContext';
import { ToastProvider } from '../../Contexts/ToastContext';
import OrderContextProvider from '../../Contexts/Buyer/OrdersContexts';

export default function BuyerLayout() {
    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <SavesContextProvider>
                <OrderContextProvider>
                    <ToastProvider>
                        <Sidebar />
                        <div className="flex-1 flex flex-col">
                            <Header />
                            <main className="flex-1 p-6 overflow-auto">
                                <Outlet />
                            </main>
                        </div>
                    </ToastProvider>
                </OrderContextProvider>
            </SavesContextProvider>
        </div>
    );
}
