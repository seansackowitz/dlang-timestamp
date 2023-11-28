import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const BusinessPaymentPage = () => {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [employer, setEmployer] = useState(null);

    const handlePayEmployee = async (employee) => {
        console.log(employee);
        if (employee.hours <= 0) {
            toast.error('This employee has 0 hour');
            return;
        }
        const paymentDetail = {
            amount: employee.hourly_rate * employee.hours,
            date: new Date().toLocaleDateString('en-US'),
            recipientId: employee.id,
            senderId: employer.id,
        };
        try {
            const response = await fetch(`/api/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentDetail),
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            console.log('Response back with data: ', data);
            toast.success('Payment successful!');
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
        } catch (error) {
            if (!window.navigator.onLine) {
                toast.error('You are offline. Please go back online to make a payment.');
                return;
            }
            toast.error("An error has occurred while making a payment.");
            console.log(error);
        }
        // setCurrentEmployee(employee);
        // console.log(employee);
        // try {
        //     const employeeUnpaidRecords = await getUnpaidRecordsById(
        //         employee.id
        //     );
        //     console.log(employeeUnpaidRecords);

        //     if (employeeUnpaidRecords.length === 0) {
        //         toast.error("This employee is lazy");
        //     }

        // } catch (error) {
        //     console.log(error);
        // }
    };

    async function getUnpaidRecordsById(id) {
        try {
            const response = await fetch(`/api/unpaid_records/${id}`);
            if (!response.ok) {
                console.log(response);
                throw new Error(response.status);
            }
            const unpaidRecords = await response.json();
            return unpaidRecords;
        } catch (error) {
            console.log(error);
            if (!window.navigator.onLine) {
                toast.error("You are offline. Please go back online to view all employees that need to be paid.");
                return;
            }
            toast.error("An error has occurred while obtaining all employees with unpaid time.");
        }
    }

    async function getRecordsHoursByUserId(id) {
        console.log('Im getting ur records');
        try {
            const unpaidRecords = await getUnpaidRecordsById(id);
            let totalMins = 0;
            unpaidRecords.forEach((item) => {
                totalMins += item.minutes;
            });
            const totalHrs = totalMins / 60;
            return Math.round(totalHrs * 100) / 100;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const checkUser = async () => {
            let user = await (await fetch('/api/login/users/current')).json();
            if (!user || user.role !== 'employer') {
                navigate('/login');
                return;
            }
            setEmployer(user);
            try {
                let employeeResponse = await fetch(
                    `/api/users/${user.username}/employees`
                );
                if (!employeeResponse.ok) {
                    throw new Error('Failed to fetch employees data. Please check your internet connection.');
                }
                let employeeList = await employeeResponse.json();
                const employeesWithHours = await Promise.all(
                    employeeList.map(async (employee) => {
                        const hours = await getRecordsHoursByUserId(employee.id);
                        return { ...employee, hours };
                    })
                );
                setEmployees(employeesWithHours);
            } catch (error) {
                if (!window.navigator.onLine) {
                    toast.error("You are offline. Please go back online to view all of the employee data.");
                    return;
                }
                toast.error("An error has occurred while obtaining employee data.");
            }
        };
        checkUser();
    }, []);

    useEffect(() => {
        console.log('this is employees ', employees);
    }, [employees]);

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-5xl text-center mb-8">Payroll</h1>
            <div className=' flex items-center gap-8'>
                <p>Employee</p>
                <p>Hours</p>
            </div>
            <div className="sm-table">
                <ul
                    role="list"
                    className="divide-y divide-gray-200 dark:divide-gray-700 "
                >
                    {employees.map((employee) => (
                        <div>
                            <li className="py-3 sm:py-4" key={employee.id}>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate ">
                                            {`${employee.first_name} ${employee.last_name}`}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate ">
                                            {employee.username}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                        {`${employee.hours}`}
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                        {`$${employee.hourly_rate}/hr`}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="block w-[100px] select-none rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                            type="button"
                                            data-ripple-light="true"
                                            onClick={() => handlePayEmployee(employee)}
                                        >Pay</button>
                                    </div>
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>

            <form className="flex flex-col gap-5 table-container" action="" method="POST">
                <div className="payroll-table w-full">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                    Employee
                                </th>
                                <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                    Hours
                                </th>
                                <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                    Hourly Rate
                                </th>
                                <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => {
                                return (
                                    <tr
                                        key={employee.id}
                                        class="cursor-pointer hover:bg-gray-100"
                                    >
                                        <td class="px-6 py-4">{`${employee.first_name} ${employee.last_name}`}</td>
                                        <td class="px-6 py-4">{`${employee.hours} hour(s)`}</td>
                                        <td class="px-6 py-4">{`$${employee.hourly_rate.toFixed(2)}/hr`}</td>
                                        <td class="px-6 py-4">
                                            <button
                                                className="block w-[100px] select-none rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                type="button"
                                                data-ripple-light="true"
                                                onClick={() =>
                                                    handlePayEmployee(employee)
                                                }
                                            >
                                                Pay
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </form>
        </div>
    );
};

export default BusinessPaymentPage;
