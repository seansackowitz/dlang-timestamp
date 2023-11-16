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
        } catch (error) {
            toast.error("Couldn't make it payment");
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
            let employeeResponse = await fetch(
                `/api/users/${user.username}/employees`
            );
            if (!employeeResponse.ok) {
                throw new Error('Failed to fetch employees data');
            }
            let employeeList = await employeeResponse.json();
            const employeesWithHours = await Promise.all(
                employeeList.map(async (employee) => {
                    const hours = await getRecordsHoursByUserId(employee.id);
                    return { ...employee, hours };
                })
            );
            setEmployees(employeesWithHours);
        };
        checkUser();
    }, []);

    useEffect(() => {
        console.log('this is employees ', employees);
    }, [employees]);

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-5xl text-center mb-8">Payroll</h1>

            <form className="flex flex-col gap-5" action="" method="POST">
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
                                        <td class="px-6 py-4">{`$${employee.hourly_rate}/hr`}</td>
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

                <div className="flex flex-col gap-2">
                    <p className="text-gray-500">Total:</p>
                    <h1 className="text-xl font-bold">$520</h1>
                </div>

                <div className="flex justify-center">
                    <div className="flex justify-between items-center w-48">
                        <input
                            type="hidden"
                            name="selected_employee"
                            id="selected_employee"
                            value=""
                        ></input>
                        <input
                            type="hidden"
                            name="selected_hours"
                            id="selected_hours"
                            value=""
                        ></input>
                        <Link
                            to="/payment-confirmation"
                            className="block w-full select-none rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-light="true"
                        >
                            Send Payment
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BusinessPaymentPage;
