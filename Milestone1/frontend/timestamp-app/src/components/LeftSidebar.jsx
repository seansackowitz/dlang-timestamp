import React from 'react';
import { Link } from 'react-router-dom';

const LeftSidebar = () => {
    return (
        <section
            className=" bg-white text-neutral-900 w-52 space-y-6 py-7 px-2 inset-y-0 max-lg:hidden"
            style={{ height: 'calc(100vh - 5rem)' }}
        >
            <h2 className="text-2xl px-4">Hello! Big Boy</h2>
            <nav className='flex flex-col gap-2'>
                <Link
                    to="/dashboard/home"
                    className="block py-3 px-4 text-xl rounded transition duration-200 hover:bg-slate-400 hover:text-slate-50"
                >
                    Home
                </Link>
                <Link
                    to="/dashboard/hours"
                    className="block py-3 px-4 text-xl rounded transition duration-200 hover:bg-slate-400 hover:text-slate-50"
                >
                    Hours
                </Link>
                <Link
                    to="/dashboard/profile"
                    className="block py-3 px-4 text-xl rounded transition duration-200 hover:bg-slate-400 hover:text-slate-50"
                >
                    Profile
                </Link>
                <Link
                    to="/login"
                    className="block py-3 px-4 text-xl rounded transition duration-200 hover:bg-slate-400 hover:text-slate-50"
                >
                    Logout
                </Link>
            </nav>
        </section>
    );
};

export default LeftSidebar;
