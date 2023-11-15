import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/login/users/current');

                if (!response.ok) {
                    throw new Error('Fail to load user');
                }

                const userData = await response.json();

                if (!userData || !userData.role) {
                    navigate('/login');
                }

                setUser(userData);
            } catch (error) {
                toast.error(error);
                console.log(
                    'Problem when fetching user for left side bar: ',
                    error
                );
                navigate('/login');
            }
        };

        fetchUser();
    }, []);
    return (
        <section
            className=" bg-white text-neutral-900 w-52 space-y-6 py-7 px-2 inset-y-0 max-lg:hidden"
            style={{ height: 'calc(100vh - 5rem)' }}
        >
            {/* <h2 className="text-2xl px-4">Hello! Big Boy</h2> */}
            <nav className="flex flex-col gap-2">
                <Link
                    to={
                        user
                            ? user.role === 'employer'
                                ? '/dashboard/employer_home'
                                : '/dashboard/employee_home'
                            : '/login'
                    }
                    className="block py-3 px-4 text-xl rounded transition duration-200 hover:bg-slate-400 hover:text-slate-50"
                >
                    Home
                </Link>
                <Link
                    to={
                        user
                            ? user.role === 'employer'
                                ? '/dashboard/payment'
                                : '/dashboard/hours'
                            : '/login'
                    }
                    className="block py-3 px-4 text-xl rounded transition duration-200 hover:bg-slate-400 hover:text-slate-50"
                >
                    {user
                        ? user.role === 'employer'
                            ? 'Payment'
                            : 'Hours'
                        : 'Loading'}
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
                    onClick={() =>
                        fetch('/api/logout', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                            },
                        })
                    }
                >
                    Logout
                </Link>
            </nav>
        </section>
    );
};

export default LeftSidebar;
