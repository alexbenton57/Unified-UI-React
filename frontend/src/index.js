import React from 'react';
import ReactDOM from 'react-dom/client';
import 'Styles/index.css';

import App from './app';

export const API_URL = "http://localhost:8000/customusers/";
const root = ReactDOM.createRoot(document.getElementById('root'));

//root.render(  <React.StrictMode>    <App />  </React.StrictMode>);
root.render( <App/>)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

