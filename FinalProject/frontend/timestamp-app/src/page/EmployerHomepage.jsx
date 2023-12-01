import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import toast from "react-hot-toast";

const EmployerHomepage = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [user, setUser] = useState();
    const [open, setOpen] = useState(false);
    const [hourlyRate, setHourlyRate] = useState();
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [openAddUser, setOpenAddUser] = useState(false);
    const [username, setUsername] = useState("");

    const onSubmitAddUser = async () => {
        if (username === "") {
            toast.error("Invalid input");
            return;
        }
        try {
            const updateData = {
                affiliation: user.affiliation,
                hourly_rate: 0,
                role: "employee",
            };
            const response = await fetch(`/api/users/employer/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) {
                console.log(response);
                throw new Error("Failed to adding employee");
            }
            const result = await response.json();
            console.log("Update result:", result);
            toast.success("Employee Added");
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
            navigate("/dashboard/employer_home");
        } catch (error) {
            if (!window.navigator.onLine) {
                toast.error(
                    "You are offline. Please go back online to add new employees."
                );
                return;
            }
            console.error("Error adding:", error);
            toast.error("Invalid User");
        }
    };

    const handleEditEmployee = (employee) => {
        setSelectedEmployee(employee); // Set the selected employee
        setHourlyRate(employee.hourly_rate);
        setOpen(true); // Open the modal
    };

    const handleRemoveEmployee = async (employee) => {
        setSelectedEmployee(employee);
        // if (!selectedEmployee) {
        //     toast.error("Error");
        //     return;
        // }
        try {
            const updateData = {
                affiliation: "none",
                hourly_rate: 0,
                role: "self-employed",
            };
            const response = await fetch(
                `/api/users/employer/${await employee.username}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateData),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to removing employee");
            }
            const result = await response.json();
            console.log("Update result:", await result);
            toast.success("Employee Removed");
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
            navigate("/dashboard/employer_home");
        } catch (error) {
            if (!window.navigator.onLine) {
                toast.error(
                    "You are offline. Please go back online to remove an employee."
                );
                return;
            }
            console.error("Error removing:", error);
            toast.error("Error Removing Employee");
        }
    };

    // Function to handle saving the new hourly rate
    const handleSaveHourlyRate = async () => {
        if (!selectedEmployee || !hourlyRate) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            const updateData = {
                hourly_rate: hourlyRate,
            };
            const response = await fetch(
                `/api/users/employer/${selectedEmployee.username}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updateData),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update hourly rate");
            }
            const result = await response.json();
            console.log("Update result:", result);
            toast.success("Hourly rate updated successfully");
            setTimeout(() => {
                window.location.reload(false);
            }, 1000);
        } catch (error) {
            if (!window.navigator.onLine) {
                toast.error(
                    "You are offline. Please go back online to update your employee's hourly rate."
                );
                return;
            }
            console.error("Error updating hourly rate:", error);
            toast.error("Error updating hourly rate");
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            let user = await (await fetch("/api/login/users/current")).json();
            if (!user || user.role !== "employer") {
                navigate("/login");
                return;
            }
            setUser(user);
            try {
                let employeeResponse = await fetch(
                    `/api/users/${user.username}/employees`
                );
                if (!employeeResponse.ok) {
                    throw new Error("Failed to fetch employees data");
                }
                setEmployees(await employeeResponse.json());
            } catch (error) {
                if (!window.navigator.onLine) {
                    toast.error(
                        "You are offline. Please go back online to view all employee data."
                    );
                    return;
                }
                toast.error(
                    "An error has occurred while obtaining all employee data."
                );
            }
        };
        checkUser();
    }, []);

    // useEffect(() => {
    //     console.log(employees);
    // }, [employees]);

    return (
        <div
            className="overflow-y-auto w-full flex flex-col items-center"
            style={{ maxHeight: "calc(100vh - 10rem)" }}
        >
            <section className="mt-8 w-full px-2 sm:px-4 md:px-8 lg:px-10">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-3xl sm:text-3xl md:text-3xl lg:text-3xl flex items-center">
                        {user
                            ? `Business Name: ${user.affiliation}`
                            : "Loading..."}
                    </h1>
                    <button
                        onClick={() => {
                            setOpenAddUser(true);
                        }}
                        className="middle none center rounded-lg border border-teal-800 py-2 px-3 font-sans text-xs font-bold uppercase text-teal-800 transition-all hover:opacity-75 focus:ring focus:teal-800/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    >
                        Add New Employee
                    </button>
                </div>
                {employees.length <= 0 ? (
                    <div className="mt-8 flex justify-center">
                        No User Found
                    </div>
                ) : (
                    <>
                        <div className="table-container">
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
                                            <td class="px-6 py-4">{`$${employee.hourly_rate}/hr`}</td>
                                            <td class="px-2 py-4 flex justify-center">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="block select-none rounded-lg bg-teal-800 py-3 px-3 text-center align-middle font-sans text-xs uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                        type="button"
                                                        data-ripple-light="true"
                                                        onClick={() =>
                                                            handleEditEmployee(
                                                                employee
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <burron
                                                        type="button"
                                                        data-ripple-light="true"
                                                        onClick={() => {
                                                            handleRemoveEmployee(
                                                                employee
                                                            );
                                                        }}
                                                        className="block select-none rounded-lg bg-teal-800 py-3 px-3 text-center align-middle font-sans text-xs uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                    >
                                                        Remove
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
                                    <div class="relative flex w-full max-w-[35rem] flex-col rounded-xl bg-transparent bg-clip-border text-gray-700 shadow-none">
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
                                                    {employee.username}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="p-0 mb-2">
                                            <div className="flex items-center justify-between px-4">
                                                <p class="block font-sans text-base antialiased font-normal leading-relaxed text-inherit">
                                                    {`Hourly Rate: ${employee.hourly_rate}/hr`}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="block select-none rounded-lg bg-teal-800 py-3 px-3 text-center align-middle font-sans text-xs uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                        type="button"
                                                        data-ripple-light="true"
                                                        onClick={() => {
                                                            handleEditEmployee(
                                                                employee
                                                            );
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="block select-none rounded-lg bg-teal-800 py-3 px-2 text-center align-middle font-sans text-xs uppercase text-white shadow-md shadow-teal-800/20 transition-all hover:shadow-lg hover:shadow-teal-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                        type="button"
                                                        data-ripple-light="true"
                                                        onClick={() => {
                                                            handleRemoveEmployee(
                                                                employee
                                                            );
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>

            <Modal open={openAddUser} onClose={() => setOpenAddUser(false)}>
                <div className="text-center w-64 flex flex-col justify-center gap-4">
                    <h1 className=" text-3xl mb-4 text-center">Add Employee</h1>
                    <div
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
                    </div>
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
                                    value={hourlyRate || ""}
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
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default EmployerHomepage;
