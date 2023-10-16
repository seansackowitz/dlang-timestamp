import React from 'react';

import { Routes, Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import LeftSidebar from '../components/LeftSidebar';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Homepage from './Homepage';
import HoursRecord from './HoursRecord';

const Dashboard = () => {
    const { pathname } = useLocation();
    return (
        <div>
            <Header></Header>
            <div className="flex justify-center w-full">
                <div className="">
                    <LeftSidebar />
                </div>
                <div className="flex-grow flex justify-center">
                    {pathname === "/dashboard" && <Homepage />}
                    {pathname === '/dashboard/hours' && <HoursRecord/>}
                </div>
            </div>
            <Navbar></Navbar>
        </div>
    );
};

export default Dashboard;
