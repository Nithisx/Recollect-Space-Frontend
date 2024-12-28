import { useState } from 'react';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Myfiles from './components/Myfiles';
import AboutUs from './components/Aboutus';
import FolderPage from './components/Folder'
import BlogPage from './components/Blog'
import VerifyOTP from './components/Otp';
import ForgotPassword from "./components/Forgotpassword"

function App() {

  return (
      <>
          <Router>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/auth' element={<Login/>}/>
              <Route path='/myfiles' element={<Myfiles/>}/>
              <Route path='/aboutus' element={<AboutUs/>}/>
              <Route path="/folder/:folderId" element={<FolderPage />}/>
              <Route path="/folders/:folderId/blog" element={<BlogPage />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </Router>

      </>
  );
}

export default App;
