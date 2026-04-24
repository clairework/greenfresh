import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import './stylesheets/all.scss';
import { HashRouter } from 'react-router-dom';
import { store } from '../src/reduce/store';
import { Provider } from 'react-redux';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 使用 Provider 包裹，並將 store 作為 props 傳入 */}
    <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>   
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
