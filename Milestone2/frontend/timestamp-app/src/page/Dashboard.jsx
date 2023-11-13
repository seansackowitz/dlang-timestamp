import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import LeftSidebar from '../components/LeftSidebar';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const { pathname } = useLocation();
    // const loggedUser = useRef();
    const navigate = useNavigate();
    const checkUser = async () => {
        let user = await (await fetch('/api/login/users/current')).json();
        console.log('USER IS', user);
        // if (user !== undefined && user !== null && user.role !== undefined) {
        //     if (user.role === 'employer') {
        //         // TODO: Navigate employer to employer page
        //         console.log('THIS IS AN EMPLOYER');
        //         navigate('/dashboard/employer_home');
        //     } else {
        //         navigate('/dashboard/employee_home');
        //     }
        //     // loggedUser.current = "Hello " + user.first_name + " " + user.last_name;
        // } else {
        //     navigate('/login');
        // }
        if (!user || !user.role) {
            console.log('Redirecting to login');
            navigate('/login');
            return;
        }
        if (pathname === '/dashboard') {
            const targetPath =
                user.role === 'employer'
                    ? '/dashboard/employer_home'
                    : '/dashboard/employee_home';
            console.log(`Redirecting to ${targetPath}`);
            navigate(targetPath);
        }
    };
    useEffect(() => {
        checkUser();
    }, [pathname]);
    return (
        <div>
            <Header></Header>
            <div className="flex justify-center w-full">
                <div className="">
                    <LeftSidebar />
                </div>
                <div className="flex-grow flex justify-center">
                    {/* {pathname === '/dashboard' && <Homepage />}
                    {pathname === '/dashboard/hours' && <HoursRecord />}
                    {pathname === '/dashbaord/profile' && <ProfilePage />} */}
                    <Outlet />
                </div>
            </div>
            <Navbar></Navbar>
        </div>
    );
};

export default Dashboard;
