import React, { useRef } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const navigate = useNavigate();
    async function onLogin() {
        console.log('ATTEMPT LOGIN');
        let login = {
            username: username.current.value,
            password: password.current.value,
        };
        try {
            console.log('BEFORE GETTING RESPONSE');
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(login),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('RESPONSE');
            if (!response.ok) {
                const errorData = await response.json(); // Get the error message from the server
                throw new Error(errorData.error || response.statusText);
            }
            console.log('LOGIN SUCCESSFUL');
            const userData = await response.json();
            console.log('Hello', userData.username);
            toast.success('Welcome back ' + userData.username + '!');
            setTimeout(function () {
                navigate('/dashboard');
            }, 3000);
        } catch (error) {
            toast.error(error.message);
        }
    }
    const username = useRef();
    const password = useRef();
    return (
        <div className="flex flex-col justify-center h-full items-center">
            <h1 className="text-5xl mb-8 text-center max-lg:mt-24">Login</h1>
            <form className="flex flex-col gap-7">
                <div className="w-72">
                    <div className="relative h-10 w-full min-w-[200px]">
                        <input
                            className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                            placeholder=" "
                            ref={username}
                        />
                        <label className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Username
                        </label>
                    </div>
                </div>
                <div className="w-72">
                    <div className="relative h-10 w-full min-w-[200px]">
                        <input
                            type="password"
                            className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                            placeholder=" "
                            ref={password}
                        />
                        <label className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Password
                        </label>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Link
                        to="/register"
                        className="block w-full select-none rounded-lg bg-teal-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                        data-ripple-light="true"
                    >
                        Register
                    </Link>
                    <button
                        // to='/dashboard/home'
                        className="block w-full select-none rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                        data-ripple-light="true"
                        onClick={onLogin}
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
