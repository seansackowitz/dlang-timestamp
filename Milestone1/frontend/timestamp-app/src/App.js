import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import BusinessRegistrationPage from './page/BusinessRegistrationPage';

import { EmployeeRegistrationPage } from './page/EmployeeRegistrationPage';
import LoginPage from './page/LoginPage';
import Homepage from './page/Homepage';
import Register from './page/Register';
import HoursRecord from './page/HoursRecord';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './page/Dashboard';

function App() {
    return (
        <div className="App bg-slate-50">
            <Routes>
                <Route path='/login' element={<LoginPage/>}></Route>
                <Route path='/dashboard' element={<Dashboard/>}>
                    <Route path='hours'></Route>
                </Route>
                <Route path='/register' element={<Register/>}></Route>
                <Route path='/register/business' element={<BusinessRegistrationPage/>}></Route>
                <Route path='/register/employee' element={<EmployeeRegistrationPage/>}></Route>
            </Routes>
        </div>
    );
}

export default App;
