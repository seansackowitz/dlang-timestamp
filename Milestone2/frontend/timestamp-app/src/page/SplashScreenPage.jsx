import React, { useEffect } from 'react'
import SplashScreen from '../images/TimeStamp__1_-removebg-preview.png'
import '../App.css'
import { Link, useNavigate} from 'react-router-dom';

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
        <div className='flex w-full h-full items-center justify-center'>
            <img
                src={SplashScreen}
                alt="splash"
                height={'100%'}
            />
        </div>
    )
}

export default SplashScreenPage