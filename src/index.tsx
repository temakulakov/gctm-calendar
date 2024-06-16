import { ConfigProvider } from 'antd';
// import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<ConfigProvider
				theme={{
					token: {
						// Seed Token
						colorPrimary: '#9D2135',
						borderRadius: 5,

						// Alias Token
						// colorBgContainer: '#f6ffed',
					},
				}}
			>
				<App />
			</ConfigProvider>
		</Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
