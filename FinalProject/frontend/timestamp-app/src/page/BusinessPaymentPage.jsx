import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Modal from '../components/Modal';
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const BusinessPaymentPage = () => {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    // const [currentEmployee, setCurrentEmployee] = useState(null);
    const [employer, setEmployer] = useState(null);

    const handlePayEmployee = async (employee) => {
        console.log(employee);
        if (employee.hours <= 0) {
            toast.error("This employee has 0 hour");
            return;
        }
        const paymentDetail = {
            amount: employee.hourly_rate * employee.hours,
            date: new Date().toLocaleDateString("en-US"),
            recipientId: employee.id,
            senderId: employer.id,
        };
        try {
            const response = await fetch(`/api/payments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentDetail),
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json();
            console.log("Response back with data: ", data);
            toast.success("Payment successful!");
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
        } catch (error) {
            if (!window.navigator.onLine) {
                toast.error(
                    "You are offline. Please go back online to make a payment."
                );
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
                toast.error(
                    "You are offline. Please go back online to view all employees that need to be paid."
                );
                return;
            }
            toast.error(
                "An error has occurred while obtaining all employees with unpaid time."
            );
        }
    }

    async function getRecordsHoursByUserId(id) {
        console.log("Im getting ur records");
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
            let user = await (await fetch("/api/login/users/current")).json();
            if (!user || user.role !== "employer") {
                navigate("/login");
                return;
            }
            setEmployer(user);
            try {
                let employeeResponse = await fetch(
                    `/api/users/${user.username}/employees`
                );
                if (!employeeResponse.ok) {
                    throw new Error(
                        "Failed to fetch employees data. Please check your internet connection."
                    );
                }
                let employeeList = await employeeResponse.json();
                const employeesWithHours = await Promise.all(
                    employeeList.map(async (employee) => {
                        const hours = await getRecordsHoursByUserId(
                            employee.id
                        );
                        return { ...employee, hours };
                    })
                );
                setEmployees(employeesWithHours);
            } catch (error) {
                if (!window.navigator.onLine) {
                    toast.error(
                        "You are offline. Please go back online to view all of the employee data."
                    );
                    return;
                }
                toast.error(
                    "An error has occurred while obtaining employee data."
                );
            }
        };
        checkUser();
    }, []);

    useEffect(() => {
        console.log("this is employees ", employees);
    }, [employees]);

    return (
        <div
            className="overflow-y-auto w-full flex flex-col items-center container-height"
            // style={{ maxHeight: "calc(100vh - 10rem)" }}
        >
            <section className="mt-8 w-full px-2 sm:px-4 md:px-8 lg:px-10 flex flex-col">
                <h1 className="text-3xl text-center">Payment</h1>
                {employees.length <= 0 ? (
                    <div className="mt-8 flex justify-center">
                        No User Found
                    </div>
                ) : (
                    <>
                        <div className="table-container w-full">
                            <table class="min-w-full divide-y divide-gray-200 overflow-x-scroll ">
                                <thead>
                                    <tr>
                                        <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3"></th>
                                        <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                            Name
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
                                            <td class="px-6 py-4">{`${employee.first_name} ${employee.last_name}`}</td>

                                            <td class="px-6 py-4">{`${employee.hours} hour(s)`}</td>
                                            <td class="px-6 py-4">{`$${employee.hourly_rate}/hr`}</td>
                                            <td class="px-2 py-4 flex justify-center">
                                                <div className="flex gap-2">
                                                    <burron
                                                        type="button"
                                                        data-ripple-light="true"
                                                        className="flex gap-2 select-none rounded-lg bg-teal-800 py-3 px-3 text-center font-sans text-xs uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                        onClick={() => handlePayEmployee(employee)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="16"
                                                            width="18"
                                                            viewBox="0 0 576 512"
                                                        >
                                                            <path
                                                                fill="#ffffff"
                                                                d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64V320c35.3 0 64 28.7 64 64zM64 192V128h64c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64v64H448zm64-192c-35.3 0-64-28.7-64-64h64v64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                                                            />
                                                        </svg>
                                                        Pay
                                                    </burron>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col w-full sm-table">
                            {employees.map((employee) => (
                                <div className="mt-4 flex justify-center w-full">
                                    <div class=" relative flex w-full max-w-[35rem] flex-col rounded-xl bg-transparent bg-clip-border text-gray-700">
                                        <div class=" w-full relative flex items-center pr-4 mb-0 gap-4 pt-0 pb-2 mx-0 mt-4 overflow-hidden text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border">
                                            <img
                                                src={employee.avatar}
                                                alt={employee.username}
                                                class="relative inline-block h-[58px] w-[58px] !rounded-full object-cover object-center"
                                            />
                                            <div class="flex w-full flex-col gap-0.5">
                                                <div class="flex items-center justify-between">
                                                    <h5 class="block font-sans text-xl antialiased font-bold leading-snug tracking-normal text-blue-gray-900">
                                                        {`${employee.first_name} ${employee.last_name}`}
                                                    </h5>
                                                </div>
                                                <p class="block font-sans text-base antialiased font-normal leading-relaxed text-blue-gray-900">
                                                    <b className=" font-semibold">
                                                        Hourly Rate:{" "}
                                                    </b>
                                                    {`${employee.hourly_rate}/hr`}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="p-0 mb-2">
                                            <div className="flex items-center justify-between px-4">
                                                <p class="block font-sans text-base antialiased font-normal leading-relaxed text-inherit">
                                                    {`Hours: ${employee.hours} hour(s)`}
                                                </p>
                                                <div className="flex gap-2">
                                                    <burron
                                                        type="button"
                                                        data-ripple-light="true"
                                                        className="flex gap-2 select-none rounded-lg bg-teal-800 py-3 px-3 text-center font-sans text-xs uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                        onClick={() => handlePayEmployee(employee)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="16"
                                                            width="18"
                                                            viewBox="0 0 576 512"
                                                        >
                                                            <path
                                                                fill="#ffffff"
                                                                d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64V320c35.3 0 64 28.7 64 64zM64 192V128h64c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64v64H448zm64-192c-35.3 0-64-28.7-64-64h64v64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                                                            />
                                                        </svg>
                                                        Pay
                                                    </burron>
                                                </div>
                                            </div>

                                            <div class="block font-sans text-base antialiased font-light leading-relaxed text-inherit"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export default BusinessPaymentPage;
