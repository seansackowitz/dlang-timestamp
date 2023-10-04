import React from 'react'

const Register = () => {
  return (
    <div class="flex flex-col justify-center h-full items-center">
         <h1 className=' text-5xl mb-4'>Register</h1>
         <div className='flex gap-12 mt-14'>
            <button class="bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button">Business</button>
            <button class="bg-slate-600 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button">Employee</button>
         </div>
    </div>
  )
}

export default Register