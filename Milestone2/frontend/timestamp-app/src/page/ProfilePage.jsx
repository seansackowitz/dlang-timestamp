import React, { useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    const checkUser = async () => {
        let user = await ((await fetch('/api/login/users/current')).json());
        console.log("USER IS", user);
        if (user !== undefined && user !== null && user.role !== undefined) {
            if (user.role === 'employer') {
                // TODO: Navigate employer to employer page
                console.log("THIS IS AN EMPLOYER");
            }
            // loggedUser.current = "Hello " + user.first_name + " " + user.last_name;
        }
        else {
            navigate('/login');
        }
    };
    useEffect(() => {
        checkUser();
    }, []);
    const previewProfile = useRef();
    
    const profilePicUploadRef = useRef(null);

    const handleUploadClick = (event) => {
        profilePicUploadRef.current.click();
    };

    const handleUploadProfileChange = (event) => {
        //To do: see the preview image
        const file = event.target.files[0];
        if(!file) {
            return;
        }
        if (file.size > 1 * 1024 * 1024) {
            alert('File size too big');
            return;
        }
        console.log(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            previewProfile.current.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleOnSave = () => {
        toast.success('Profile saved');
    }

    return (
        <div
            className="overflow-y-auto w-full flex flex-col items-center"
            style={{ maxHeight: 'calc(100vh - 5rem)' }}
        >
            <section className="w-full mb-20">
                <h1 className=" text-3xl mx-8 lg:mx-36 mt-8 pb-7 border-b-2">
                    Account Settings
                </h1>
                <div className="mx-8 mt-8 flex lg:mx-36 pb-7 border-b-2">
                    <img
                        ref={previewProfile}
                        src="https://media.discordapp.net/attachments/813610330374144050/1077362408315682899/6C570FF2-A5C9-479E-AB97-9531C03945DA.jpg?ex=65496e6e&is=6536f96e&hm=98b39b4d8f3a4482df14751012033df5695c27ecd8f70026563f1363a494c75c&=&width=1117&height=917"
                        className=" object-cover w-32 h-32 mr-6 rounded-full"
                    ></img>
                    <div className="flex flex-col justify-center gap-2">
                        <b className=" text-lg">Profile Photo</b>
                        <p>Accepted file type .png. Less than 1MB</p>
                        <div className=" relative overflow-hidden">
                            <input
                                ref={profilePicUploadRef}
                                onChange={handleUploadProfileChange}
                                accept="image/*"
                                type="file"
                                className=" absolute opacity-0 -z-10"
                                required
                            ></input>
                            <button
                                onClick={handleUploadClick}
                                className="middle none center mr-3 rounded-lg border border-teal-800 py-2 px-5 font-sans text-xs font-bold uppercase text-teal-800 transition-all hover:opacity-75 focus:ring focus:teal-800/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
                {/* Fields */}
                <div className="lg:mx-36 mt-5 flex flex-col gap-2 mx-4 pb-7 border-b-2">
                    <div className="flex w-full lg:gap-10 flex-wrap lg:flex-nowrap gap-2">
                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1">Username</label>
                            <input
                                className="w-full h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                                value={'bigboy531'}
                            />
                        </div>

                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1">Email</label>
                            <input
                                className="w-full h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                                value={'bigboy531@gmail.com'}
                            />
                        </div>
                    </div>

                    <div className="flex w-full lg:gap-10 gap-2 flex-wrap lg:flex-nowrap">
                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1">New Password</label>
                            <input
                                className="w-full h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="password"
                                placeholder="New Password"
                            />
                        </div>

                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1 text-clip">
                                Confirm Password
                            </label>
                            <input
                                className="w-full h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="password"
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    <div className="flex w-full lg:gap-10 gap-2 flex-wrap lg:flex-nowrap">
                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1">Affiliation</label>
                            <input
                                className="w-full h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                                value={'NCSU'}
                                disabled
                            />
                        </div>

                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1">Role</label>
                            <input
                                disabled
                                className="w-full h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                                value={'Employee'}
                            />
                        </div>
                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1">Hourly Rate</label>
                            <div className="flex items-center gap-3">
                                <input
                                    className=" w-11/12 h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                    type="text"
                                    value={'15'}
                                />
                                <label className="text-xl mb-2">/hr</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full lg:gap-10 gap-2 flex-wrap lg:flex-nowrap mt-2">
                        <button
                            className="block lg:w-[150px]  select-none rounded-lg bg-teal-800 py-4 px-4 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-light="true"
                            onClick={handleOnSave}
                        >
                            Save Changes
                        </button>
                        <button
                            className="block lg:w-[100px] select-none rounded-lg bg-pink-500 py-3 px-4 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-light="true"
                        >
                            Leave
                        </button>
                    </div>
                </div>

                <div className=" mx-4 mt-4 flex lg:mx-36">
                    <div className="flex justify-between w-full lg:flex-nowrap flex-wrap gap-4">
                        <div>
                            <b>Delete your account</b>
                            <p className="mt-1">
                                All your personal information will be
                                permanently removed.{' '}
                            </p>
                        </div>
                        <button
                            className=" lg:w-[180px] block select-none rounded-lg bg-pink-500 py-3 px-4 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-light="true"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;
