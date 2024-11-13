import { ConfigProvider } from 'antd';
// import 'antd/dist/antd.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {ModalProvider} from "./contexts/ModalContext";
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
	<React.StrictMode>
		<BrowserRouter>
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<ConfigProvider
					theme={{
						token: {
							// Seed Token
							colorPrimary: '#9D2135',
							borderRadius: 5,

							// Alias Token
							// colorBgContainer: '#f6ffed',
						},
						components: {
							Collapse: {
								headerPadding: '5px',
								contentPadding: '0 20px',
							},
							Checkbox: {},
						},
					}}
				>
					<ModalProvider>
						<App />
					</ModalProvider>
				</ConfigProvider>
			</QueryClientProvider>
		</Provider>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
