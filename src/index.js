import React from 'react';
import {render} from 'react-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'
import {BrowserRouter} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import './app/reset.css'
const root = document.getElementById('root')

render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId='251812595551-qq1unhvu2ckv7vdf1dhublbch9uipjld.apps.googleusercontent.com'>
      <App />
    </GoogleOAuthProvider>

  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
