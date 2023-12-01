import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EmployeeHomepage = () => {
    const navigate = useNavigate();
    const user = useRef();
    const [records, setRecords] = useState([]);
    const [minutes, setMinutes] = useState(0);
    const [timer, setTimer] = useState(0);
    const [clockedIn, setClockedIn] = useState(false);
    const [clockInText, setClockInText] = useState('CLOCK IN');

    useEffect(() => {
        const checkUser = async () => {
            user.current = await (
                await fetch('/api/login/users/current')
            ).json();
            console.log('USER IS', user.current);
            if (
                user.current !== undefined &&
                user.current !== null &&
                user.current.role !== undefined
            ) {
                if (user.current.role === 'employer') {
                    // TODO: Navigate employer to employer page
                    console.log('THIS IS AN EMPLOYER');
                    navigate('/dashboard/employer_home');
                }
                try {
                    const data = await (
                        await fetch('/api/records/' + user.current.id)
                    ).json();
                    console.log(data);
                    setRecords(data);
                    let totalMinutes = 0;
                    await data.forEach(
                        (record) => (totalMinutes += record.minutes)
                    );
                    setMinutes(totalMinutes);
                } catch (error) {
                    if (!window.navigator.onLine) {
                        toast.error(
                            'You are offline. Please go back online to view your total time logged.'
                        );
                        return;
                    }
                    toast.error(
                        'An error has occurred while obtaining records.'
                    );
                }
                // loggedUser.current.value = "Hello " + user.first_name + " " + user.last_name;
            } else {
                navigate('/login');
            }
        };
        checkUser();

        let interval;
        console.log(clockedIn);
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
    const [manualDate, setManualDate] = useState('');
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
        if (manualHours === '' || manualMinutes === '' || manualDate === '') {
            console.log('MANUAL HOURS', manualHours);
            console.log('MANUAL MINUTES', manualMinutes);
            console.log('MANUAL DATE', manualDate);
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
            (manualHours == 0 && manualMinutes == 0) ||
            (manualHours == 24 && manualMinutes > 0)
        ) {
            toast.error('Please input a valid amount of hours and minutes.');
            return;
        } else if (!/^\d{4}$/.test('' + new Date(manualDate).getFullYear())) {
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
        console.log('MANUAL DATE', await manualDate);
        let minutes = parseInt(manualHours) * 60 + parseInt(manualMinutes);
        let body = {
            date: await manualDate,
            notes: await manualMessage.current.value,
            minutes: minutes,
        };
        try {
            await fetch('/api/records/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            setManualHours('');
            setManualMinutes('');
            setManualDate('');
            manualMessage.current.value = '';
            toast.success('Record entered successfully!');
        } catch (error) {
            if (!window.navigator.onLine) {
                toast.error(
                    'You are offline. Please go back online to make new records.'
                );
            } else {
                toast.error(
                    'An error has occurred while creating your manual record.'
                );
            }
        }
    };
    const manualMessage = useRef();

    const [open, setOpen] = useState(false);
    const [openCalculatedModal, setOpenCalculatedModal] = useState(false);

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
        try {
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
        } catch (error) {
            if (!window.navigator.onLine) {
                toast.error(
                    'You are offline. Please go back online to make new records.'
                );
            } else {
                toast.error(
                    'An error occurred while creating your calculated record.'
                );
            }
        }
    };

    const handleClockInButtonClicked = () => {
        // TODO: Handle clock in button clicked
        setClockedIn((prevState) => !prevState);

        if (clockInText == 'CLOCK IN') {
            setClockInText('CLOCK OUT');
        } else {
            // clocking out
            setClockInText('CLOCK IN');

            const currentTime = new Date();

            let minutes = Math.floor(timer / 60);
            let body = {
                date: currentTime.toISOString().split('T')[0],
                notes: '',
                minutes: minutes,
            };
            let record = fetch('/api/records/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }).then((res) => res.json());
            console.log('RECORD IS', record);
            toast.success('Time logged successfully!');

            // Retrieve the latest total time
            try {
                const data = fetch('/api/records/' + user.current.id)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log('$$$$$$$$$$$');
                        console.log('New records data $$$', data);
                        // setRecords(data);
                        console.log('start minutes', minutes);
                        let totalMinutes = 0;
                        data.forEach(
                            (record) => (totalMinutes += record.minutes)
                        );

                        console.log('New minutes $$$', totalMinutes + minutes);
                        setMinutes(totalMinutes + minutes);
                    });
                console.log('*************');

                console.log('New records data ***', data);
                // setRecords(data);
                // console.log("start minutes", minutes);
                let totalMinutes = 0;
                data.forEach((record) => (totalMinutes += record.minutes));

                console.log('New minutes ***', totalMinutes);
                setMinutes(totalMinutes + minutes);
            } catch (error) {}
        }

        if (!clockedIn) {
            setTimer(0);
        }
    };

    return (
        <div
            className="flex flex-col items-center overflow-y-auto container-height"
        >
            <h1 className=" text-5xl mt-24 text-center">Total Hours</h1>
            <h2 className=" text-center text-4xl mt-4">{`${Math.floor(
                minutes / 60
            )} H ${minutes % 60} M`}</h2>
            {/* <h1>{minutes}</h1> */}
            <div className="flex gap-8 mt-8 px-3">
                <button
                    className="block w-full select-none rounded-lg bg-zinc-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-zinc-500/20 transition-all hover:shadow-lg hover:shadow-zinc-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    data-ripple-light="true"
                    onClick={() => {
                        setOpen(true);
                        setOpenCalculatedModal(false);
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
                        setOpenCalculatedModal(true);
                    }}
                >
                    Enter hours manually
                </button>
            </div>

            {/* <button className="w-60 h-60 mt-10 flex items-center justify-center bg-white hover:bg-slate-50 text-white font-bold py-2 px-4 rounded-full focus:outline-none">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="15em"
                    viewBox="0 0 512 512"
                >
                    <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                </svg>
            </button> */}
            <button
                className="middle none center w-48 h-48 mt-10 rounded-full bg-slate-500 py-3.5 px-7 font-sans text-3xl font-bold uppercase text-white shadow-md shadow-slate-500/20 transition-all hover:shadow-lg hover:shadow-slate-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
                onClick={() => {
                    handleClockInButtonClicked();
                }}
            >
                {clockInText}
            </button>
            <p>Timer: {timer} seconds</p>
            <p className='sm:ml-4'><b>Note</b>: You must remember to clock out in order to conclude session and get paid for that time.</p>

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
                                    onChange={(e) =>
                                        setManualDate(e.target.value)
                                    }
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
                                        onChange={(e) =>
                                            setManualHours(e.target.value)
                                        }
                                        placeholder="Hours"
                                        type="number"
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
                                        onChange={(e) =>
                                            setManualMinutes(e.target.value)
                                        }
                                        type="number"
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
