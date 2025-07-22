import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import SavesContextProvider from '../../Contexts/Buyer/SavesContext';
import { ToastProvider } from '../../Contexts/ToastContext';
import OrderContextProvider from '../../Contexts/Buyer/OrdersContexts';
import RequestsContextProvider from '../../Contexts/Buyer/BuyerRequestContext';
import TransportsContextProvider from '../../Contexts/Buyer/TransportContext';

export default function BuyerLayout() {
    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <SavesContextProvider>
                <OrderContextProvider>
                    <RequestsContextProvider>
                        <TransportsContextProvider>
                            <ToastProvider>
                                <Sidebar />
                                <div className="flex-1 flex flex-col">
                                    <Header />
                                    <main className="flex-1 overflow-auto">
                                        <Outlet />
                                    </main>
                                </div>
                            </ToastProvider>
                        </TransportsContextProvider>
                    </RequestsContextProvider>
                </OrderContextProvider>
            </SavesContextProvider>
        </div>
    );
}
