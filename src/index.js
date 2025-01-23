import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Clinica from './pages/Clinica';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>   
    <BrowserRouter>
      <Routes>
        <Route index element={<App/>}/>
        <Route path='/home' element={<Home/>}/>        
        <Route path='/clinica' element={<Clinica/>}/>
        <Route path='*' element={<h2>404</h2>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
