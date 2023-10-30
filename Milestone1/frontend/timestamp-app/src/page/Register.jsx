import React from 'react'
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="flex flex-col justify-center h-full items-center">
         <h1 className=' text-5xl mb-4'>Register</h1>
         <div className='flex gap-12 mt-14'>
            <Link to="/register/business" className="bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button">Business</Link>
            <Link to="/register/employee" className="bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button">Employee</Link>
         </div>
    </div>
  )
}

export default Register