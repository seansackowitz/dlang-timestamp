import React from 'react';

const PaymentConfirmationPage = () => {
    return (
        <div className="flex flex-col justify-center h-full items-center">
            <h1 className="text-5xl mb-8 text-center max-lg:mt-24">Payment Sent</h1>
            
            <div class="w-72 bg-green-500 w-24 h-24 rounded-full flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 448 512" fill="white">
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                </svg>
            </div>

        </div>
    );
};

export default PaymentConfirmationPage;
