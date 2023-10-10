import React from 'react';

const LeftSidebar = () => {
    return (
        <section
            className="bg-slate-0 text-neutral-900 w-52 space-y-6 py-7 px-2 inset-y-0 shadow-md max-lg:hidden"
            style={{ height: 'calc(100vh - 5rem)' }}
        >
            <h2 className="text-2xl px-4">Hello! Persondsa dsadsadasd s</h2>
            <nav>
                <a
                    href="#"
                    className="block py-3 px-4 text-xl rounded transition duration-200 hover:bg-slate-400 hover:text-slate-50"
                >
                    Home
                </a>
                <a
                    href="#"
                    className="block py-3 px-4 text-xl rounded transition duration-200 hover:bg-slate-400 hover:text-slate-50"
                >
                    Edit
                </a>
                <a
                    href="#"
                    className="block py-3 px-4 text-xl rounded transition duration-200 hover:bg-slate-400 hover:text-slate-50"
                >
                    Profile
                </a>
                <a
                    href="#"
                    className="block py-3 px-4 text-xl rounded transition duration-200 hover:bg-slate-400 hover:text-slate-50"
                >
                    Logout
                </a>
            </nav>
        </section>
    );
};

export default LeftSidebar;
