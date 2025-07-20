import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './component/home/HomePage'; 
import Topic from './component/learn/Topic';
import Test from './component/test/Test'; 
import Lesson from './component/learn/Lesson';
import TestStart from './component/test/TestStart';
import SearchPage from './component/search/SearchPage';
import Login from './component/account/Login';
import Signup from './component/account/Signup';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="topics" element={<Topic />}/>
          <Route path="lessons" element={<Lesson />} />
          <Route path="tests" element={<Test />} />
          <Route path="dotests" element={<TestStart />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
        <Route>
           <Route path="logins" element={< Login />}/>
           <Route path="signup" element={< Signup />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
