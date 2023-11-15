import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const loggedUser = useRef();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const checkUser = async () => {
        let user = await (await fetch('/api/login/users/current')).json();
        console.log('USER IS', user);
        if (user !== undefined && user !== null && user.role !== undefined) {
            if (user.role === 'employer') {
                // TODO: Navigate employer to employer page
                console.log('THIS IS AN EMPLOYER');
            }
            setUser(user);
            loggedUser.current.value =
                'Hello ' +
                (await user.first_name) +
                ' ' +
                (await user.last_name);
        } else {
            navigate('/login');
        }
    };
    useEffect(() => {
        checkUser();
    }, []);
    return (
        <div>
            <nav className="h-20 mx-auto block w-full rounded-xl border border-white/80 bg-white bg-opacity-80 py-5 px-4 text-white shadow-md backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-5">
                <div>
                    <div className=" container mx-auto flex items-center justify-between text-gray-900">
                        <a
                            href="#"
                            className=" transition ease-in-out hover:scale-125 mr-4 block cursor-pointer py-1.5 font-sans text-sm font-normal leading-normal text-inherit antialiased"
                        >
                            <span className="text-2xl">TimeStamp</span>
                        </a>
                        <ul className="hidden items-center gap-6 lg:flex">
                            <li className="block p-1 font-sans text-sm font-normal leading-normal text-inherit antialiased">
                                <button
                                    className="flex items-center text-2xl"
                                    href="#"
                                    ref={loggedUser}
                                >
                                    {user
                                        ? `Hello ${user.first_name} ${user.last_name}!`
                                        : ''}
                                    {/* Hello {loggedUser.first_name} {loggedUser.last_name}! */}
                                </button>
                            </li>
                        </ul>
                        <img
                            className="relative inline-block h-12 w-12 rounded-full object-cover object-center"
                            alt="Image placeholder"
                            src={
                                user
                                    ? user.avatar
                                    : 'https://media.discordapp.net/attachments/813610330374144050/1172442187858984981/85434_guest_512x512.png?ex=656054e0&is=654ddfe0&hm=77bd3f750309b9e51fc4f5ce0dd391a4a6d621e45de38d47b999c590542af28e&=&width=576&height=576'
                            }
                        />
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Header;
