import React from 'react';
import { Link } from 'react-router-dom';

const BusinessPaymentPage = () => {
    return (
        <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-5xl text-center mb-8">Payroll</h1>
            
            <form className="flex flex-col gap-5" action='' method='POST'>
                <div className='payroll-table w-72'>
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Employee</th>
                                <th class="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="cursor-pointer hover:bg-gray-100">
                                <td class="px-6 py-4">Dylan</td>
                                <td class="px-6 py-4">30</td>
                            </tr>
                            <tr class="cursor-pointer hover:bg-gray-100">
                                <td class="px-6 py-4">Hong</td>
                                <td class="px-6 py-4">20</td>
                            </tr>
                            <tr class="cursor-pointer hover:bg-gray-100">
                                <td class="px-6 py-4">Michael</td>
                                <td class="px-6 py-4">10</td>
                            </tr>
                            <tr class="cursor-pointer hover:bg-gray-100">
                                <td class="px-6 py-4">Ignacio</td>
                                <td class="px-6 py-4">40</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-gray-500">Total:</p>
                    <h1 className="text-xl font-bold">$520</h1>
                </div>

                <div className='flex justify-center'>
                    <div className="flex justify-between items-center w-48">
                        <input type="hidden" name="selected_employee" id="selected_employee" value=""></input>
                        <input type="hidden" name="selected_hours" id="selected_hours" value=""></input>
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
