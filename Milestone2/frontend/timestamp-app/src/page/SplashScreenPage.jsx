import React, { useEffect } from 'react'
import SplashScreen from '../images/TimeStamp.png'
import '../App.css'
import { useNavigate} from 'react-router-dom';

const SplashScreenPage = () => {
    console.log("DO SOMETHING");
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            console.log("REDIRECT PLS");
            navigate('/login');
        }, 3000)
    }, []);
    return (
        <div className='flex w-full h-full items-center justify-center bg-[#F6F6E9]'>
            <img
                className=' w-[500px]'
                src={SplashScreen}
                alt="splash"
                height={'100%'}
            />
        </div>
    )
}

export default SplashScreenPage