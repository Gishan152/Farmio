import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router";
import './App.css'
import LandingPage from './Pages/LandingPage';
import Root from './Pages/Root';
import Login, { loginAction, loginLoader } from './Pages/LoginRegister/Login';
import Registration, { RegistrationAction, RegistrationLoader } from './Pages/LoginRegister/Registration';
import FarmerRegistration, { FarmerRegistrationAction, FarmerRegistrationLoader } from './Pages/LoginRegister/FarmerRegistration';
import BuyerRegistration, { BuyerRegistrationAction, BuyerRegistrationLoader } from './Pages/LoginRegister/BuyerRegistration';
import WarehouseProviderRegistration, { WarehouseProviderRegistrationAction, WarehouseProviderRegistrationLoader } from './Pages/LoginRegister/WarehouseProviderRegistration';
import TransportProviderRegistration, { TransportProviderRegistrationAction, TransportProviderRegistrationLoader } from './Pages/LoginRegister/TransportProviderRegistration';
import WasteAgentRegistration, { WasteAgentRegistrationAction, WasteAgentRegistrationLoader } from './Pages/LoginRegister/WasteAgentRegistration';


let router = createBrowserRouter([
  // {
  //   path: "/",
  //   Component: Root,
  //   children: [
  //     {
  //       path: "shows/:showId",
  //       Component: Show,
  //       loader: ({ request, params }) =>
  //         fetch(`/api/show/${params.showId}.json`, {
  //           signal: request.signal,
  //         }),
  //     },
  //   ],
  // },
	{
		index: true,
		Component: LandingPage
	},
	{
		path: "/login",
		loader: loginLoader,
		action: loginAction,
		Component: Login
	},
	{
		path: "/register",
		loader: RegistrationLoader,
		action: RegistrationAction,
		Component: Registration
	},
	{
		path: "/register/farmer",
		loader: FarmerRegistrationLoader,
		action: FarmerRegistrationAction,
		Component: FarmerRegistration,
	},
	{
		path: "/register/buyer",
		loader: BuyerRegistrationLoader,
		action: BuyerRegistrationAction,
		Component: BuyerRegistration,
	},
	{
		path: "/register/warehouse-provider",
		loader: WarehouseProviderRegistrationLoader,
		action: WarehouseProviderRegistrationAction,
		Component: WarehouseProviderRegistration,
	},
	{
		path: "/register/transport-provider",
		loader: TransportProviderRegistrationLoader,
		action: TransportProviderRegistrationAction,
		Component: TransportProviderRegistration,
	},
	{
		path: "/register/waste-agent",
		loader: WasteAgentRegistrationLoader,
		action: WasteAgentRegistrationAction,
		Component: WasteAgentRegistration,
	},
	{
		path: "/user",
		Component: Root,
		children: [

		]
	}
]);


function App() {
	return (
		<RouterProvider router={router} />
	)
}

export default App
