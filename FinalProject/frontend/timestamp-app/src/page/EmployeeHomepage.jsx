import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EmployeeHomepage = () => {
    const navigate = useNavigate();
    let user;
    const [records, setRecords] = useState([]);
    const [minutes, setMinutes] = useState(0);
    const [timer, setTimer] = useState(0);
    const [clockedIn, setClockedIn] = useState(false);
    const [clockInText, setClockInText] = useState('CLOCK IN');

    useEffect(() => {
        const checkUser = async () => {
            user = await (await fetch('/api/login/users/current')).json();
            console.log('USER IS', user);
            if (
                user !== undefined &&
                user !== null &&
                user.role !== undefined
            ) {
                if (user.role === 'employer') {
                    // TODO: Navigate employer to employer page
                    console.log('THIS IS AN EMPLOYER');
                    navigate('/dashboard/employer_home');
                }
                try {
                    const data = await (
                        await fetch('/api/records/' + user.id)
                    ).json();
                    console.log(data);
                    setRecords(data);
                    let totalMinutes = 0;
                    await data.forEach(
                        (record) => (totalMinutes += record.minutes)
                    );
                    setMinutes(totalMinutes);
                } catch (error) {}
                // loggedUser.current.value = "Hello " + user.first_name + " " + user.last_name;
            } else {
                navigate('/login');
            }
        };
        checkUser();

        let interval;
        console.log(clockedIn)
        if (clockedIn) {
            interval = setInterval(() => {
                
                setTimer((prevTimer) => {
                    console.log('TIMER IS', prevTimer);
                    setMinutes(minutes + Math.floor(prevTimer / 60));
                    return prevTimer + 1;
                });
                // setMinutes(minutes + timer);
            }, 1000);
            // setMinutes(minutes + timer);  //Math.floor(timer / 60)
        } else {
            clearInterval(interval);
        }

        // Cleanup the interval when the component unmounts or when isRunning changes
        return () => clearInterval(interval);
    }, [navigate, clockedIn]);
    
    //Enter time manually
    const [manualHours, setManualHours] = useState('');
    const [manualMinutes, setManualMinutes] = useState('');
    const manualDate = useRef();
    const handleManualHoursInput = (e) => {
        if (!isNaN(e.target.value) && e.target.value != '.') {
            setManualHours(e.target.value);
        }
    };
    const handleManualMinutesInput = (e) => {
        if (!isNaN(e.target.value) && e.target.value != '.') {
            setManualMinutes(e.target.value);
        }
    };
    
    const handleManualTimeSubmit = async (e) => {
        if (
            manualHours === '' ||
            manualMinutes === '' ||
            manualDate.current.value === ''
        ) {
            toast.error(
                'Please input the date of the log and the amount of time in hours and minutes.'
            );
            return;
            // e.preventDefault();
        } else if (
            manualHours > 24 ||
            manualMinutes > 59 ||
            manualHours < 0 ||
            manualMinutes < 0 ||
            (manualHours == 0 && manualMinutes == 0)
        ) {
            toast.error('Please input a valid amount of hours and minutes.');
            return;
        } else if (
            !/^\d{4}$/.test(
                '' + new Date(manualDate.current.value).getFullYear()
            )
        ) {
            toast.error(
                'Please input a valid date. The year must be 4 digits long.'
            );
            return;
        }
        setOpen(false);
        // setManualHours('');
        console.log('MANUAL HOURS', manualHours);
        console.log('MANUAL MINUTES', manualMinutes);
        console.log('MANUAL MESSAGE', await manualMessage.current.value);
        console.log('MANUAL DATE', await manualDate.current.value);
        let minutes = parseInt(manualHours) * 60 + parseInt(manualMinutes);
        let body = {
            date: await manualDate.current.value,
            notes: await manualMessage.current.value,
            minutes: minutes,
        };
        let record = await (
            await fetch('/api/records/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
        ).json();
        setManualHours('');
        setManualMinutes('');
        manualDate.current.value = '';
        manualMessage.current.value = '';
        toast.success('Record entered successfully!');
    };
    const manualMessage = useRef();

    const [open, setOpen] = useState(false);
    const [openCalculatedModal, setOpenCalcualtedModal] = useState(false);

    // Enter start time and end time modal (automatically calculated)
    const startTime = useRef();
    const endTime = useRef();
    const calculatedMessage = useRef();
    const calculatedDate = useRef();
    const handleSubmitCalculatedTime = async (e) => {
        if (
            startTime.current.value === '' ||
            endTime.current.value === '' ||
            calculatedDate.current.value === ''
        ) {
            toast.error(
                'Please enter the start time, end time, and date of the log.'
            );
            return;
        } else if (
            !/^\d{4}$/.test(
                '' + new Date(calculatedDate.current.value).getFullYear()
            )
        ) {
            toast.error(
                'Please input a valid date. The year must be 4 digits long.'
            );
            return;
        }
        console.log(await startTime.current.value);
        console.log(await endTime.current.value);
        console.log(await calculatedMessage.current.value);
        let body = {
            date: await calculatedDate.current.value,
            notes: await calculatedMessage.current.value,
            startTime: await startTime.current.value,
            endTime: await endTime.current.value,
        };
        console.log('RECORD IS ABOUT TO BE POSTED');
        let record = await (
            await fetch('/api/records/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
        ).json();
        console.log('RECORD IS', await record);
        calculatedMessage.current.value = '';
        startTime.current.value = '';
        endTime.current.value = '';
        setOpen(false);
        toast.success('Record entered successfully!');
    };

    const handleClockInButtonClicked = () => {
        // TODO: Handle clock in button clicked
        setClockedIn((prevState) => !prevState);

        if (clockInText == 'CLOCK IN') {
            setClockInText('CLOCK OUT');
        } else {
            setClockInText('CLOCK IN');
        }

        if (!clockedIn) {
            setTimer(0);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className=" text-5xl mt-24 text-center">Total Hours</h1>
            <h2 className=" text-center text-4xl mt-4">{`${Math.floor(
                minutes / 60
            )} H ${minutes % 60} M`}</h2>
            <h1>{minutes}</h1>
            <div className="flex gap-8 mt-8">
                <button
                    className="block w-full select-none rounded-lg bg-zinc-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-zinc-500/20 transition-all hover:shadow-lg hover:shadow-zinc-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    data-ripple-light="true"
                    onClick={() => {
                        setOpen(true);
                        setOpenCalcualtedModal(false);
                    }}
                >
                    Enter Hours
                </button>
                <button
                    className="block w-full select-none rounded-lg bg-zinc-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-zinc-500/20 transition-all hover:shadow-lg hover:shadow-zinc-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    data-ripple-light="true"
                    onClick={() => {
                        setOpen(true);
                        setOpenCalcualtedModal(true);
                    }}
                >
                    Enter hours manually
                </button>
            </div>

            <button
                className="middle none center w-60 h-60 mt-10 rounded-full bg-slate-500 py-3.5 px-7 font-sans text-3xl font-bold uppercase text-white shadow-md shadow-slate-500/20 transition-all hover:shadow-lg hover:shadow-slate-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
                onClick={() => {
                    handleClockInButtonClicked()
                }}
            >
                {clockInText}
            </button>
            <p>Timer: {timer} seconds</p>
            <p><b>Note</b>: You must remember to clock out in order to conclude session and get paid for that time.</p>

            <Modal open={open} onClose={() => setOpen(false)}>
                {openCalculatedModal ? (
                    <div className="text-center w-64 flex flex-col justify-center">
                        <h1 className="text-4xl mb-4 text-center">
                            Enter your time
                        </h1>
                        <div className="flex flex-col gap-7 justify-center">
                            <div className="flex gap-3 justify-center items-center">
                                <label>Date: </label>
                                <input
                                    name="date"
                                    type="date"
                                    ref={manualDate}
                                    required
                                />
                            </div>
                            <div className="">
                                <div className="relative h-11 w-full min-w-[180]">
                                    <input
                                        onInput={(e) =>
                                            handleManualHoursInput(e)
                                        }
                                        value={manualHours}
                                        placeholder="Hours"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <label className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                        Enter your hours
                                    </label>
                                </div>
                            </div>
                            <div className="">
                                <div className="relative h-11 w-full min-w-[180]">
                                    <input
                                        onInput={(e) =>
                                            handleManualMinutesInput(e)
                                        }
                                        value={manualMinutes}
                                        placeholder="Minutes"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <label className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                        Enter your minutes
                                    </label>
                                </div>
                            </div>
                            <div className="">
                                <div className="relative w-full min-w-[200px]">
                                    <textarea
                                        ref={manualMessage}
                                        className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200  bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                                        placeholder=" "
                                    ></textarea>
                                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                        Message
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    className="block w-full select-none rounded-lg bg-teal-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                    data-ripple-light="true"
                                    onClick={handleManualTimeSubmit}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center w-64 flex flex-col justify-center">
                        <h1 className="text-4xl mb-4 text-center">
                            Enter your time
                        </h1>
                        <form className="flex flex-col gap-7 justify-center">
                            <div className="flex gap-3 justify-center items-center">
                                <label>Date: </label>
                                <input
                                    name="date"
                                    type="date"
                                    ref={calculatedDate}
                                    required
                                />
                            </div>
                            <div className="">
                                <div className="relative h-11 w-full min-w-[180]">
                                    <input
                                        ref={startTime}
                                        type="time"
                                        placeholder="hours"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <label className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                        Enter Start Time
                                    </label>
                                </div>
                            </div>
                            <div className="">
                                <div className="relative h-11 w-full min-w-[180]">
                                    <input
                                        ref={endTime}
                                        type="time"
                                        placeholder="hours"
                                        className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    />
                                    <label className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                        Enter End Time
                                    </label>
                                </div>
                            </div>
                            <div className="">
                                <div className="relative w-full min-w-[200px]">
                                    <textarea
                                        ref={calculatedMessage}
                                        className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200  bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                                        placeholder=" "
                                    ></textarea>
                                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                        Message
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    className="block w-full select-none rounded-lg bg-teal-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                    data-ripple-light="true"
                                    onClick={handleSubmitCalculatedTime}
                                >
                                    Continue
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default EmployeeHomepage;
