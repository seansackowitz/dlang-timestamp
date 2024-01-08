import React, { useState } from 'react';
import Modal from '../components/Modal';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';

const HoursRecord = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    //Enter time manually
    const [manualHours, setManualHours] = useState('');
    const [manualMinutes, setManualMinutes] = useState('');
    const message = useRef();
    const [records, setRecords] = useState([]);
    const [status, setStatus] = useState('idle');
    const [selectedRecord, setSelectedRecord] = useState({
        date: '',
        minutes: 0,
        notes: '',
    });
    const [recordDate, setRecordDate] = useState('');
    // const [recordHours, setRecordHours] = useState("");
    // const [recordMinutes, setRecordMinutes] = useState("");
    // const [recordNotes, setRecordNotes] = useState("");
    const date = useRef();
    const options = [
        { value: '0', label: 'None' },
        { value: '1', label: 'Paid Records' },
        { value: '2', label: 'Unpaid Records' },
    ];
    const [selectedFilter, setSelectedFilter] = useState({
        value: '0',
        label: 'None',
    });

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    useEffect(() => {
        filterRecords();
    }, [selectedFilter]);
    const filterRecords = () => {
        let recordCards = document.getElementsByClassName('recordCard');
        console.log('LENGTH OF RECORD CARDS', recordCards.length);
        let index = 0;
        let recordExists = false;
        for (const record of recordCards) {
            console.log('RECORD', record);
            console.log('SELECTED FILTER', selectedFilter);
            console.log('SELECTED FILTER VALUE', selectedFilter.value);
            console.log('IS IT PAID?', records[index].paid);
            console.log(
                'IS selectedFilter.value == 1 TRUE?',
                selectedFilter.value == 1
            );
            console.log(
                'IS records[index].paid != 1 TRUE?',
                records[index].paid != 1
            );
            console.log(
                'IS selectedFilter.value == 2 TRUE?',
                selectedFilter.value == 2
            );
            console.log('IS records[index] != 0 TRUE?', records[index] != 0);
            if (
                (selectedFilter.value == 1 && records[index].paid == 0) ||
                (selectedFilter.value == 2 && records[index].paid == 1)
            ) {
                console.log('HIDE RECORD', record.id);
                record.style.display = 'none';
                // record.style.zIndex = "-1";
            } else {
                // record.style.zIndex = "0";
                record.style.display = 'block';
                recordExists = true;
            }
            index++;
        }
        if (recordExists) {
            document.querySelector('#noRecord').classList.add('hidden');
        } else {
            document.querySelector('#noRecord').classList.remove('hidden');
        }
    };
    const handleChange = (e) => {
        // console.log("THIS IS E", e);
        setSelectedFilter(e);
    };
    const handleEditRecord = (record) => {
        setSelectedRecord(record);
        setManualHours(parseInt(record.minutes / 60));
        setManualMinutes(record.minutes % 60);
        // setRecordNotes(record.notes);
        setRecordDate(record.date);
        setOpen(true);
    };
    const handleDeleteRecord = (record) => {
        setSelectedRecord(record);
        setOpenDeleteModal(true);
    };
    // Sort in descending order; show most recent records at the top
    const sortByDate = (a, b) => {
        return new Date(b.date) - new Date(a.date);
    };

    useEffect(() => {
        // re-render modal when selectedRecord changes
    }, [selectedRecord]);

    const checkUser = async () => {
        setStatus('loading');
        const user = await (await fetch('/api/login/users/current')).json();
        console.log('USER IS', user);
        if (user !== undefined && user !== null && user.role !== undefined) {
            if (user.role === 'employer') {
                // TODO: Navigate employer to employer page
                navigate('/dashboard/employer_home');
            }
            try {
                const data = await (
                    await fetch('/api/records/' + user.id)
                ).json();
                console.log(data);
                data.sort(sortByDate);
                setRecords(data);
                setStatus('success');
            } catch (error) {
                setStatus('Error');
                if (!window.navigator.onLine) {
                    toast.error(
                        'You are offline. Please go back online to view all of your records.'
                    );
                    return;
                }
                toast.error('An error has occurred while obtaining records.');
            }
        } else {
            navigate('/login');
        }
    };

    useEffect(() => {
        checkUser();
        document.querySelector('#noRecord').classList.add('hidden');
    }, []);

    const handleManualHoursInput = (e) => {
        if (!isNaN(e.target.value)) {
            setManualHours(e.target.value);
        }
    };

    const handleSubmitDeleteRecord = async () => {
        const response = await fetch(`/api/records/${selectedRecord.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete the record');
        }
        setRecords((prevRecords) =>
            prevRecords.filter((record) => record.id !== selectedRecord.id)
        );
    };

    const handleDeleteClick = () => {
        toast.promise(handleSubmitDeleteRecord(), {
            loading: 'Deleting...',
            success: <b>Record deleted successfully!</b>,
            error: <b>Could not delete the record.</b>,
        }).then(() => {
            setOpenDeleteModal(false);
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleSubmitEditedTime = async () => {
        if (
            manualHours === '' ||
            manualMinutes === '' ||
            isNaN(manualHours) ||
            isNaN(manualMinutes) ||
            manualHours < 0 ||
            manualMinutes < 0 ||
            (manualHours == 0 && manualMinutes == 0) ||
            manualHours > 24 ||
            manualMinutes >= 60 ||
            date.current.value === ''
        ) {
            toast.error('Please enter a valid date and hours and minutes.');
            return;
        }
        console.log(manualHours);
        console.log(await message.current.value);
        let minutes = parseInt(manualMinutes) + parseInt(manualHours) * 60;
        selectedRecord.minutes = minutes;
        selectedRecord.date = await date.current.value;
        selectedRecord.notes = await message.current.value;
        let tempDate = new Date(recordDate);
        let body = {
            date: tempDate,
            notes: await message.current.value,
            minutes: minutes,
        };
        console.log('BODY IS', body, 'BEFORE PUT');
        try {
            let updatedRecord = await (
                await fetch('/api/records/' + selectedRecord.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(body),
                })
            ).json();
            console.log('AFTER PUT, UPDATED RECORD IS', updatedRecord);
            setManualHours('');
            setManualMinutes('');
            message.current.value = '';
            setOpen(false);
            toast.success('Record updated successfully!');
        } catch (error) {
            if (!window.navigator.onLine) {
                toast.error(
                    'You are offline. Please go back online to edit your records.'
                );
            } else {
                toast.error(
                    'An error has occurred while updating your record.'
                );
            }
        }
    };

    const formatDate = (date) => {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        let tempDate = new Date(date.setDate(date.getDate() + 1));
        let month = tempDate.getMonth() + 1;
        // // let temp = [];
        let day = tempDate.getDate();
        let year = tempDate.getFullYear();
        console.log('THIS IS THE NEW DATE', tempDate.toDateString());
        let temp;
        if (month < 10 && day < 10) {
            temp = ''.concat(year, '-0', month, '-0', day);
            // temp = ''.concat("0", month, "/0", day, "/", year);
        } else if (month < 10) {
            temp = ''.concat(year, '-0', month, '-', day);
            // temp = ''.concat("0", month, "/", day, "/", year);
        } else if (day < 10) {
            temp = ''.concat(year, '-', month, '-0', day);
            // temp = ''.concat(month, "/0", day, "/", year);
        } else {
            temp = ''.concat(year, '-', month, '-', day);
            // temp = ''.concat(month, "/", day, "/", year);
        }
        // let temp = date.toLocaleDateString("en-US");
        // let temp2 = temp.replaceAll('/', '-');
        return temp;
    };

    const formatDateString = (date) => {
        let tempDate = new Date(date.setDate(date.getDate() + 1));
        return tempDate.toDateString();
    };

    const handleManualMinutesInput = (e) => {
        if (!isNaN(e.target.value)) {
            setManualMinutes(e.target.value);
        }
    };

    const renderRecords = () => {
        switch (status) {
            case 'loading':
                return <div>Loading</div>;
            case 'error':
                return <div>Error</div>;
            case 'success':
                console.log('was i ehre');
                return records.map((item) => {
                    return (
                        <div className="relative mt-6 mb-3 flex w-80 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md recordCard">
                            <div className="p-6 pb-0">
                                <div className="flex justify-between">
                                    <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                                        {formatDateString(new Date(item.date))}
                                    </h5>
                                    <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                                        {Math.floor(item.minutes / 60)}H{' '}
                                        {item.minutes % 60}M
                                    </h5>
                                </div>
                                <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                                    {item.notes}
                                </p>
                            </div>
                            <Modal
                                open={openDeleteModal}
                                onClose={() => setOpenDeleteModal(false)}
                            >
                                <div className="w-64 flex flex-col justify-center">
                                    <h1 className=" font-bold">
                                        Are you sure you want to delete this
                                        record?
                                    </h1>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            class="select-none rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                            type="button"
                                            onClick={() =>
                                                handleDeleteClick()
                                            }
                                        >
                                            Yes
                                        </button>
                                        <button
                                            class="select-none rounded-lg bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                            type="button"
                                            onClick={() => {
                                                setOpenDeleteModal(false);
                                            }}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                            <div className="p-6 pt-4">
                                {item.paid === 0 ? (
                                    <a
                                        className="!font-medium !text-blue-gray-900 !transition-colors hover:!text-pink-500 cursor-default"
                                        href="#"
                                    >
                                        <div className="flex justify-between">
                                            <button
                                                className="flex select-none items-center gap-2 rounded-lg py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                type="button"
                                                data-ripple-dark="true"
                                                onClick={() => {
                                                    handleEditRecord(item);
                                                }}
                                            >
                                                Edit
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    aria-hidden="true"
                                                    className="h-4 w-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                                    ></path>
                                                </svg>
                                            </button>
                                            <button
                                                className="mr-2 flex select-none items-center gap-2 rounded-lg py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-pink-500 transition-all hover:bg-pink-500/10 active:bg-pink-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                type="button"
                                                data-ripple-dark="true"
                                                onClick={() => {
                                                    handleDeleteRecord(item);
                                                }}
                                            >
                                                Remove
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="16"
                                                    width="14"
                                                    viewBox="0 0 448 512"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        fill="#ec4899"
                                                        d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </a>
                                ) : (
                                    <div>This record has been paid for!</div>
                                )}
                            </div>
                        </div>
                    );
                });
            default:
                return <div>Idle...</div>;
        }
    };

    return (
        <div className="overflow-y-auto w-full flex flex-col items-center container-height">
            <h1 className="text-4xl mt-8 text-center">My Hours</h1>
            <div className="w-72 mt-5">
                <div className="text-center">
                    <label className="">Filters Applied:</label>
                </div>
                <div className="mt-3">
                    <Select
                        options={options}
                        defaultValue={{ value: 0, label: 'None' }}
                        value={selectedFilter}
                        onChange={handleChange}
                    ></Select>
                </div>
                <div id="noRecord" className="hidden mt-5 h-1/5 text-center">
                    <p className="text-2xl">
                        There are no records that match the selected filter.
                    </p>
                    <br></br>
                    <p className="text-2xl">Please select another filter.</p>
                </div>
            </div>
            {renderRecords()}
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-64 flex flex-col justify-center">
                    <h1 className="text-4xl mb-4 text-center">
                        Edit your time
                    </h1>
                    <form className="flex flex-col gap-7 justify-center">
                        <div className="flex gap-3 justify-center items-center">
                            <label>Date: </label>
                            <input
                                name="date"
                                type="date"
                                ref={date}
                                value={formatDate(recordDate)}
                                onChange={(e) => setRecordDate(e.target.value)}
                                required /*defaultValue={formatDate(new Date(selectedRecord.date))}*/
                            />
                        </div>
                        <div className="">
                            <div className="relative h-11 w-full min-w-[180]">
                                <input
                                    placeholder="hours"
                                    className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    value={`${manualHours}`}
                                    type="number"
                                    min={0}
                                    onChange={(e) =>
                                        setManualHours(e.target.value)
                                    }
                                />
                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Enter your hours
                                </label>
                            </div>
                        </div>
                        <div className="">
                            <div className="relative h-11 w-full min-w-[180]">
                                <input
                                    placeholder="minutes"
                                    type="number"
                                    value={`${manualMinutes}`}
                                    className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    onChange={(e) =>
                                        setManualMinutes(e.target.value)
                                    }
                                />
                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Enter your minutes
                                </label>
                            </div>
                        </div>
                        <div className="">
                            <div className="relative w-full min-w-[200px]">
                                <textarea
                                    // ref={selectedRecord.notes}
                                    defaultValue={selectedRecord.notes}
                                    ref={message}
                                    className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200  bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                                    placeholder=" "
                                ></textarea>
                                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Enter your note
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                className="block w-full select-none rounded-lg bg-teal-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                                data-ripple-light="true"
                                onClick={handleSubmitEditedTime}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default HoursRecord;
