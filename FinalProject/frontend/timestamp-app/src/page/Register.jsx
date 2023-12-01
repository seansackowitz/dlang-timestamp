import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
    return (
        <div className="flex flex-col justify-center h-full items-center align-items">
            <h1 className=" text-5xl mb-4">Register</h1>
            <div className="flex gap-12 mt-14">
                <Link
                    to="/register/business"
                    className="middle none center rounded-lg bg-slate-600 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-slate-600/20 transition-all hover:shadow-lg hover:shadow-slate-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                >
                    Business
                </Link>
                <Link
                    to="/register/employee"
                    className="middle none center rounded-lg bg-slate-600 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-slate-600/20 transition-all hover:shadow-lg hover:shadow-slate-600/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                >
                    Employee
                </Link>
            </div>

            <Link
                to="/login"
                className="middle center rounded-sm py-2 px-6 font-sans text-xs text-black transition-all hover:underline mt-8"
                type="button"
            >
                Back
            </Link>
        </div>
    );
};

export default Register;
