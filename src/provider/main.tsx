"use client";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import React from "react";
import "primeicons/primeicons.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const MainProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<PrimeReactProvider>
			{children}
			<ToastContainer />
		</PrimeReactProvider>
	);
};

export default MainProvider;
