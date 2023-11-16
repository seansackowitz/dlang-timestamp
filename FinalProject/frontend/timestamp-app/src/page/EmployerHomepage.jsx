import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

const EmployerHomepage = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [user, setUser] = useState();
    const [open, setOpen] = useState(false);
    const [hourlyRate, setHourlyRate] = useState();
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [openAddUser, setOpenAddUser] = useState(false);
    const [username, setUsername] = useState('');

    const onSubmitAddUser = async () => {
        if (username === '') {
            toast.error('Invalid input');
            return;
        }
        try {
            const updateData = {
                affiliation: user.affiliation,
                hourly_rate: 0,
                role: 'employee',
            };
            const response = await fetch(`/api/users/employer/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) {
                console.log(response);
                throw new Error('Failed to adding employee');
            }
            const result = await response.json();
            console.log('Update result:', result);
            toast.success('Employee Added');
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
            navigate('/dashboard/employer_home');
        } catch (error) {
            console.error('Error adding:', error);
            toast.error('Invalid User');
        }
    };

    const handleEditEmployee = (employee) => {
        setSelectedEmployee(employee); // Set the selected employee
        setHourlyRate(employee.hourly_rate);
        setOpen(true); // Open the modal
    };

    const handleRemoveEmployee = async () => {
        if (!selectedEmployee) {
            toast.error('Error');
            return;
        }
        try {
            const updateData = {
                affiliation: 'none',
                hourly_rate: 0,
                role: 'self-employed',
            };
            const response = await fetch(
                `/api/users/employer/${selectedEmployee.username}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                }
            );
            if (!response.ok) {
                throw new Error('Failed to removing employee');
            }
            const result = await response.json();
            console.log('Update result:', result);
            toast.success('Employee Removed');
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
            navigate('/dashboard/employer_home');
        } catch (error) {
            console.error('Error removing:', error);
            toast.error('Error Removing Employee');
        }
    };

    // Function to handle saving the new hourly rate
    const handleSaveHourlyRate = async () => {
        if (!selectedEmployee || !hourlyRate) {
            toast.error('Please fill in all fields');
            return;
        }
        try {
            const updateData = {
                hourly_rate: hourlyRate,
            };
            const response = await fetch(
                `/api/users/employer/${selectedEmployee.username}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                }
            );
            if (!response.ok) {
                throw new Error('Failed to update hourly rate');
            }
            const result = await response.json();
            console.log('Update result:', result);
            toast.success('Hourly rate updated successfully');
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
        } catch (error) {
            console.error('Error updating hourly rate:', error);
            toast.error('Error updating hourly rate');
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            let user = await (await fetch('/api/login/users/current')).json();
            if (!user || user.role !== 'employer') {
                navigate('/login');
                return;
            }
            setUser(user);
            let employeeResponse = await fetch(
                `/api/users/${user.username}/employees`
            );
            if (!employeeResponse.ok) {
                throw new Error('Failed to fetch employees data');
            }
            setEmployees(await employeeResponse.json());
        };
        checkUser();
    }, []);

    // useEffect(() => {
    //     console.log(employees);
    // }, [employees]);

    return (
        <div className=" pt-9 w-full">
            <div className="flex items-center mb-6">
                <h1 className="px-9 text-2xl ">
                    {user
                        ? `Your Business Name: ${user.affiliation}`
                        : 'Loading...'}
                </h1>
                <button
                    // to='/dashboard/home'
                    className="block w-[180px] select-none rounded-lg bg-pink-500 py-3 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    data-ripple-light="true"
                    onClick={() => {
                        setOpenAddUser(true);
                    }}
                >
                    Add New Employee
                </button>
            </div>

            {employees.length <= 0 ? (
                <div className="flex w-full justify-center"> No user found</div>
            ) : (
                <>
                    <div className="px-10 table-container">
                        <table class="min-w-full divide-y divide-gray-200 overflow-x-scroll ">
                            <thead>
                                <tr>
                                    <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3"></th>
                                    <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                        Username
                                    </th>
                                    <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                        Name
                                    </th>
                                    <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                        Hourly Rate
                                    </th>
                                    <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr
                                        class=" hover:bg-gray-100"
                                        key={employee.id}
                                    >
                                        <td class="px-6 py-4">
                                            <img
                                                class="relative inline-block h-12 w-12 rounded-lg object-cover object-center"
                                                alt="employee_BigAvatar"
                                                src={employee.avatar}
                                            />
                                        </td>
                                        <td class="px-6 py-4">
                                            {employee.username}
                                        </td>
                                        <td class="px-6 py-4">{`${employee.first_name} ${employee.last_name}`}</td>
                                        <td class="px-6 py-4">{`$${employee.hourly_rate.toFixed(2)}/hr`}</td>
                                        <td class="px-2 py-4 flex justify-center">
                                            <button
                                                // to='/dashboard/home'
                                                className="block w-[100px] select-none rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                type="button"
                                                data-ripple-light="true"
                                                onClick={() =>
                                                    handleEditEmployee(employee)
                                                }
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 sm-table">
                        <ul
                            role="list"
                            class="divide-y divide-gray-200 dark:divide-gray-700 "
                        >
                            {employees.map((employee) => (
                                <li class="py-3 sm:py-4" key={employee.id}>
                                    <div class="flex items-center space-x-4">
                                        <div class="flex-shrink-0">
                                            <img
                                                class="w-8 h-8 rounded-full"
                                                src={employee.avatar}
                                                alt="employee_avatar"
                                            />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-gray-900 truncate ">
                                                {`${employee.first_name} ${employee.last_name}`}
                                            </p>
                                            <p class="text-sm text-gray-500 truncate ">
                                                {employee.username}
                                            </p>
                                        </div>
                                        <div class="inline-flex items-center text-base font-semibold text-gray-900">
                                            {`$${employee.hourly_rate.toFixed(2)}/hr`}
                                        </div>
                                        <div class="inline-flex items-center text-base font-semibold text-gray-900">
                                            <button
                                                className="block w-full select-none rounded-lg bg-pink-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                type="button"
                                                data-ripple-light="true"
                                                onClick={() =>
                                                    handleEditEmployee(employee)
                                                }
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
            <Modal open={openAddUser} onClose={() => setOpenAddUser(false)}>
                <div className="text-center w-64 flex flex-col justify-center gap-4">
                    <h1 className=" text-3xl mb-4 text-center">Add Employee</h1>
                    <form
                        className="flex flex-col justify-center gap-4
                    "
                    >
                        <div class="relative h-11 w-full min-w-[200px]">
                            <input
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                                placeholder="Enter Username"
                                class="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-pink-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                            />
                            <label class="after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                Username
                            </label>
                        </div>
                        <button
                            class="middle none center mr-4 rounded-lg bg-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            data-ripple-light="true"
                            type="button"
                            onClick={() => {
                                onSubmitAddUser();
                            }}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </Modal>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-64 flex flex-col justify-center gap-4">
                    <h1 className=" text-3xl mb-4 text-center">
                        Edit Employee
                    </h1>
                    <form className="flex flex-col justify-center gap-8">
                        <div className="flex gap-4 flex-col">
                            <div class="relative flex h-10 w-full min-w-[200px] max-w-[24rem] mt-3">
                                <input
                                    min={0}
                                    type="number"
                                    class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200  placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500  focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                    value={hourlyRate || ''}
                                    required
                                    onChange={(e) =>
                                        setHourlyRate(e.target.value)
                                    }
                                />
                                <button
                                    class="!absolute right-1 top-1 z-10 select-none rounded bg-pink-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
                                    type="button"
                                    data-ripple-light="true"
                                    onClick={() => {
                                        handleSaveHourlyRate();
                                    }}
                                >
                                    Save
                                </button>
                                {/* <label class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[12px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Hourly Rate
                                </label> */}
                                <label class="after:content[' '] pointer-events-none absolute left-1 top-[-1.375rem] flex h-full w-full select-none text-sm font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-pink-500 after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:after:scale-x-100 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Hourly Rate
                                </label>
                            </div>
                        </div>

                        <button
                            className="block w-full select-none rounded-lg bg-red-500 py-2 px-2 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20  transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-light="true"
                            onClick={() => {
                                handleRemoveEmployee();
                            }}
                        >
                            Remove Employee
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default EmployerHomepage;
