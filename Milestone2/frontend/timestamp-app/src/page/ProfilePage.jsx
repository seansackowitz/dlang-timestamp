import React, { useRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            let user = await (await fetch("/api/login/users/current")).json();
            if (
                user !== undefined &&
                user !== null &&
                user.role !== undefined
            ) {
                setUsername(user.username || "");
                setFirstName(user.first_name || "");
                setLastName(user.last_name || "");
                setHourlyRate(user.hourly_rate || "");
                setRole(user.role || "");
                setAffiliation(user.affiliation || "");
                setAvatar(
                    user.avatar ||
                    "https://images-ext-1.discordapp.net/external/6CZaeJz37z5zmVIZ2c1ELxM5NicrKd96KM65FiBHGPA/https/art.pixilart.com/0b055c338bd0168.png?width=598&height=598"
                );

                if (user.role === "employer") {
                    // TODO: Navigate employer to employer page
                    console.log("THIS IS AN EMPLOYER");
                }
            } else {
                navigate("/login");
            }
        };
        checkUser();
    }, [navigate]);
    const previewProfile = useRef();

    const profilePicUploadRef = useRef(null);

    const handleUploadClick = (event) => {
        profilePicUploadRef.current.click();
    };

    const handleUploadProfileChange = (event) => {
        //To do: see the preview image
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        if (file.size > 1 * 1024 * 1024) {
            alert("File size too big");
            return;
        }
        console.log(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            previewProfile.current.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleOnSave = async () => {
        console.log({
            username: username,
            password: password,
            confirmPassword: confirmPassword,
            role: role,
            affiliation: affiliation,
            hourlyRate: hourlyRate,
        });
        if ((password || confirmPassword) && password !== confirmPassword) {
            toast.error("password does not match");
            return;
        }
        const updateData = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            hourly_rate: hourlyRate,
            role: role,
            affiliation: affiliation,
        };
        if (password) {
            updateData.newPassword = password;
        }
        try {
            const response = await fetch("/api/users/" + username, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            console.log("Response back with data: ", data);

            // Notify the user of success
            toast.success("Profile Updated!");
        } catch (error) {
            console.log("error: ", error);
            toast.error("An error occurred while updating the profile.");
        }
    };

    /**
     * Storing the user information
     */
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    //employer changing those settings
    const [role, setRole] = useState("");
    const [affiliation, setAffiliation] = useState("");
    const [avatar, setAvatar] = useState("");

    return (
        <div
            className="overflow-y-auto w-full flex flex-col items-center"
            style={{ maxHeight: "calc(100vh - 5rem)" }}
        >
            <section className="w-full mb-20">
                <h1 className=" text-3xl mx-8 lg:mx-36 mt-8 pb-7 border-b-2">
                    Account Settings
                </h1>
                <div className="mx-8 mt-8 flex lg:mx-36 pb-7 border-b-2">
                    <img
                        ref={previewProfile}
                        src={avatar}
                        className=" object-cover w-32 h-32 mr-6 rounded-full"
                        alt="profile_pic"
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
                                disabled={true}
                                className="w-full h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1">Hourly Rate</label>
                            <div className="flex items-center gap-3">
                                <input
                                    disabled={
                                        role === "employee" ? true : false
                                    }
                                    className=" w-11/12 h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                    type="text"
                                    value={hourlyRate}
                                    onChange={(e) =>
                                        setHourlyRate(e.target.value)
                                    }
                                />
                                <label className="text-xl mb-2">/hr</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full lg:gap-10 gap-2 flex-wrap lg:flex-nowrap">
                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1">First Name</label>
                            <input
                                className="w-full h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1">Last Name</label>
                            <input
                                className="w-full h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
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
                                onChange={(e) => setPassword(e.target.value)}
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
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="flex w-full lg:gap-10 gap-2 flex-wrap lg:flex-nowrap">
                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1">Affiliation</label>
                            <input
                                className="w-full h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                                value={affiliation}
                                onChange={(e) => setAffiliation(e.target.value)}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                            <label className=" ml-1">Role</label>
                            <input
                                disabled
                                className="w-full h-11 px-3 mb-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
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
                        {/* <button
                            className="block lg:w-[100px] select-none rounded-lg bg-pink-500 py-3 px-4 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-light="true"
                        >
                            Leave
                        </button> */}
                    </div>
                </div>

                <div className=" mx-4 mt-4 flex lg:mx-36">
                    <div className="flex justify-between w-full lg:flex-nowrap flex-wrap gap-4">
                        <div>
                            <b>Delete your account</b>
                            <p className="mt-1">
                                All your personal information will be
                                permanently removed.{" "}
                            </p>
                        </div>
                        <button
                            className="h-[50px] lg:w-[180px] block select-none rounded-lg bg-pink-500 py-3 px-4 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-light="true"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
                <div className=" mx-4 mt-4 flex lg:mx-36">
                    <div className="flex justify-between w-full lg:flex-nowrap flex-wrap gap-4">
                        <div>
                            <b>Logout of your account</b>
                            <p className="mt-1">
                                You will be logged out of your current session.{" "}
                            </p>
                        </div>
                        <button
                            className="h-[50px] lg:w-[180px] block select-none rounded-lg bg-pink-500 py-3 px-4 text-center align-middle font-sans text-sm font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-light="true"
                            onClick={() => {
                                fetch('/api/logout', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    }
                                });
                                navigate('/login');
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;
