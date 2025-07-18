import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Admin from './component/admin/Admin';
import User from './component/user/User'; 
import HomePage from './component/home/HomePage'; 
import Topic from './component/learn/Topic';
import Test from './component/test/Test'; 
import Lesson from './component/learn/Lesson';

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
          <Route path="notifications" element={<div>Notifications Page</div>} />
          <Route path="users" element={<User />} />
        </Route>
        <Route path="admins" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
