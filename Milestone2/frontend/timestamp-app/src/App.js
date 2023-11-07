
import './App.css';
import { Toaster } from 'react-hot-toast';

import BusinessRegistrationPage from './page/BusinessRegistrationPage';

import { EmployeeRegistrationPage } from './page/EmployeeRegistrationPage';
import LoginPage from './page/LoginPage';
import Homepage from './page/Homepage';
import Register from './page/Register';
import HoursRecord from './page/HoursRecord';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './page/Dashboard';
import ProfilePage from './page/ProfilePage';
import SplashScreenPage from './page/SplashScreenPage';

function App() {
    return (
        <div className="App bg-slate-50">
            <Toaster/>
            <Routes>
                <Route path='/' element={<SplashScreenPage/>}></Route>
                <Route path='/login' element={<LoginPage/>}></Route>
                <Route path='/dashboard' element={<Dashboard/>}>
                    <Route path='home' element={<Homepage/>}></Route>
                    <Route path='hours' element={<HoursRecord/>}></Route>
                    <Route path='profile' element={<ProfilePage/>}></Route>
                </Route>
                <Route path='/register' element={<Register/>}></Route>
                <Route path='/register/business' element={<BusinessRegistrationPage/>}></Route>
                <Route path='/register/employee' element={<EmployeeRegistrationPage/>}></Route>
            </Routes>
        </div>
    );
}

export default App;
