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
    const [offline, setOffline] = useState(false);

    useEffect(() => {
        if (!window.navigator.onLine) {
            setOffline(true);
        } else {
            setOffline(false);
        }
        
        console.log("Offline status", offline);
    }, [offline]);

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
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        console.log('test...')
        checkUser();

        let interval;
        console.log('clockedIn', clockedIn);
        console.log('offline', offline);
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
    }, [navigate, clockedIn, offline]);

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
            checkUser();
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
            checkUser();
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
        if (!window.navigator.onLine) {
            toast.error(
                'You are offline. Please go back online to clock in or out.'
            );
            return
        }

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
            checkUser();

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
            <h2 className=" text-center text-4xl my-4">{`${Math.floor(
                minutes / 60
            )} H ${minutes % 60} M`}</h2>

            {offline && (
            <svg
                width="12.278452mm"
                height="8.639862mm"
                viewBox="0 0 24.556904 17.279724"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                >
                <defs id="defs216" />
                <g transform="translate(-48.872324,-94.74602)">
                    <g transform="matrix(0.27870523,0,0,0.27870523,47.200093,-175.9777)">
                    <path
                        style={{ opacity: 1, fill: '#000000', stroke: 'none' }}
                        d="m 52.53125,19 c -8.891138,0 -17.283401,2.11681 -24.6875,5.90625 a 2.0001995,2.0001995 0 1 0 1.8125,3.5625 C 36.513003,24.95945 44.28163,23 52.53125,23 67.707796,23 81.288582,29.69621 90.5,40.28125 a 2.0001995,2.0001995 0 1 0 3,-2.625 C 83.560476,26.23453 68.887976,19 52.53125,19 Z M 14.875,23.34375 C 9.973676,23.34375 6,27.30536 6,32.1875 c 0,4.88214 3.973676,8.84375 8.875,8.84375 4.901323,0 8.875,-3.96161 8.875,-8.84375 0,-4.88214 -3.973677,-8.84375 -8.875,-8.84375 z M 11.65625,27.5 a 1.6137304,1.607418 0 0 1 1.3125,0.5 L 14.875,29.90625 16.78125,28 a 1.6137304,1.607418 0 0 1 1.125,-0.5 1.6137304,1.607418 0 0 1 1.15625,2.78125 l -1.90625,1.90625 1.90625,1.875 a 1.6162578,1.6099355 0 1 1 -2.28125,2.28125 L 14.875,34.4375 12.96875,36.34375 A 1.6162578,1.6099355 0 1 1 10.6875,34.0625 l 1.90625,-1.875 -1.90625,-1.90625 A 1.6137304,1.607418 0 0 1 11.65625,27.5 Z m 40.875,5.59375 c -12.460899,0 -23.624025,5.68549 -30.96875,14.59375 a 2.0085875,2.0085875 0 1 0 3.09375,2.5625 c 6.612219,-8.01982 16.628601,-13.15625 27.875,-13.15625 11.246397,0 21.294031,5.13643 27.90625,13.15625 A 2.0001995,2.0001995 0 1 0 83.5,47.6875 C 76.155275,38.77924 64.992147,33.09375 52.53125,33.09375 Z m 0,14.75 c -8.421407,0 -15.885334,4.14175 -20.46875,10.46875 a 2.003476,2.003476 0 0 0 3.25,2.34375 c 3.86053,-5.3291 10.107399,-8.8125 17.21875,-8.8125 7.11135,0 13.389469,3.4834 17.25,8.8125 a 2.003476,2.003476 0 0 0 3.25,-2.34375 c -4.583417,-6.327 -12.078594,-10.46875 -20.5,-10.46875 z m 0,16.71875 c -4.529891,0 -8.21875,3.70655 -8.21875,8.21875 0,4.5122 3.688859,8.21875 8.21875,8.21875 4.529891,0 8.25,-3.70655 8.25,-8.21875 0,-4.5122 -3.720109,-8.21875 -8.25,-8.21875 z m 0,4 c 2.363891,0 4.25,1.86405 4.25,4.21875 0,2.3546 -1.886109,4.21875 -4.25,4.21875 -2.36389,0 -4.21875,-1.86415 -4.21875,-4.21875 0,-2.3547 1.85486,-4.21875 4.21875,-4.21875 z"
                        transform="translate(0,952.36218)"
                    />
                    </g>
                </g>
            </svg>
            )}




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

            {/* <button
                className="middle none center w-48 h-48 mt-10 rounded-full bg-slate-500 py-3.5 px-7 font-sans text-3xl font-bold uppercase text-white shadow-md shadow-slate-500/20 transition-all hover:shadow-lg hover:shadow-slate-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
                onClick={() => {
                    handleClockInButtonClicked();
                }}
            >
                {clockInText}
            </button>
            <p>Timer: {timer} seconds</p>
            <p className='sm:ml-4'><b>Note</b>: You must remember to clock out in order to conclude session and get paid for that time.</p> */}

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
