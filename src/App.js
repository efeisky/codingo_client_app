import React from 'react'
import { Routes, Route,useLocation} from "react-router-dom";

import Homepage from './pages/router/Home/Homepage';
import Login from './pages/router/Login/Login'
import Register from './pages/router/Register/Register'
import RegisterComplete from './pages/router/Register/RegisterComplete';
import Contact from './pages/router/Contact/Contact';
import About from './pages/router/About/About';
import Policy from './pages/router/Policy/Policy';
import Sitemap from './pages/router/Sitemap/Sitemap';

import SearchProfile from './pages/router/SearchProfile/SearchProfile';
import Profile from './pages/router/userPages/Profile/Profile';
import ReportProfile from './pages/router/reportProfile/ReportProfile';

import ForgetPassword from './pages/router/ForgetPassword/ForgetPassword';
import ResetPassword from './pages/router/ForgetPassword/resetPass/ResetPassword';

import RegisterLayout from './pages/router/RegisterLayout'
import MainLayout from './pages/router/MainLayout'
import ForgetPassLayout from './pages/router/ForgetPassLayout';
import SettingLayout from './pages/router/SettingLayout';


import Home from './pages/router/userPages/Home/Home'
import Setting from './pages/router/userPages/Setting/Setting';
import DetailLesson from './pages/router/userPages/detailLesson/DetailLesson';
import Order from './pages/router/userPages/order/Order';
import Nots from './pages/router/userPages/notes/Nots';

import { Verify } from './pages/router/userPages/Setting/verify/Verify';
import { Picture } from './pages/router/userPages/Setting/picture/Picture';
import { ChangePassword } from './pages/router/userPages/Setting/changePassword/ChangePassword';

import {routes} from './Router'
import Footer from './pages/partials/PartialFooter/Footer';
import Chat from './pages/router/userPages/Chat/Chat';


import LessonPage from './pages/router/userPages/LessonPage/LessonPage';
import PythonTest from './pages/router/userPages/PythonTest/PythonTest';
import Trial from './pages/router/trialLesson/Trial';
import Practice from './pages/router/userPages/Practice/Practice';

import { NotFound } from './pages/router/Error/notFound';

function App() {
  const location = useLocation();

  const {
    homepage,
    login,
    register,
    forgetPass,
    searchProfile,
    contact,
    about,
    policy,
    sitemap,
    reportProfile,
    lesson,
    pythonTest,
    trial,
    practice
  } = routes
  
  const ignoreFooter = location.pathname.includes('/lesson') || location.pathname.includes('/pythonTest') || location.pathname.includes('/trial') | location.pathname.includes('/practice');

  return (
    <div className="App">
      <Routes>
        <Route path={homepage.path} element={<Homepage/>}/>
        <Route path={login.path} element={<Login/>}/>
        <Route path={searchProfile.path} element={<SearchProfile/>}/>
        <Route path={contact.path} element={<Contact/>}/>
        <Route path={about.path} element={<About/>}/>
        <Route path={policy.path} element={<Policy/>}/>
        <Route path={sitemap.path} element={<Sitemap/>}/>
        <Route path={reportProfile.path} element={<ReportProfile/>}/>
        <Route path={trial.path} element={<Trial />} />
        <Route path={practice.path} element={<Practice />} />

        <Route path={forgetPass.path} element={<ForgetPassLayout/>}>
          <Route index={true} element={<ForgetPassword/>}/>
          <Route path='resetPass' element={<ResetPassword/>}/>
        </Route>
        
        <Route path={register.path} element={<RegisterLayout/>}>
          <Route index={true} element={<Register/>}/>
          <Route path='complete' element={<RegisterComplete/>}/>
        </Route>

        <Route path='/:usernameParam' element={<MainLayout/>}>
          <Route index={true} element={<Home/>}/>
          <Route path='setting' element={<SettingLayout/>}>
            <Route index={true} element={<Setting/>}/>
            <Route path='verify' element={<Verify/>}/>
            <Route path='picture' element={<Picture/>}/>
            <Route path='changePassword' element={<ChangePassword/>}/>
          </Route>
          <Route path='profile' element={<Profile/>}/>
          <Route path='nots' element={<Nots/>}/>
          <Route path='order' element={<Order/>}/>
          <Route path='detailLesson' element={<DetailLesson/>}/>
          <Route path='chat' element={<Chat/>}/>
        </Route>
        <Route path={lesson.path} element={<LessonPage />} />
        <Route path={pythonTest.path} element={<PythonTest />} />

        <Route path='*' element={<NotFound/>}/>
      </Routes>
      {!ignoreFooter && <Footer />}
    </div>
  );
}
export default App;
