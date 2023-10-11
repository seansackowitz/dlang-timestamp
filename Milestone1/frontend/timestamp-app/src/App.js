import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import BusinessRegistrationPage from './page/BusinessRegistrationPage';

import { EmployeeRegistrationPage } from './page/EmployeeRegistrationPage';
import LoginPage from './page/LoginPage';
import Homepage from './page/Homepage';
import Register from './page/Register';
import HoursRecord from './page/HoursRecord';

function App() {
    return (
      <div className="App bg-slate-50">
      <Header></Header>
      <div className="flex justify-center w-full">
          <div className="">
              <LeftSidebar />
          </div>
          <div className="flex-grow flex justify-center">
              {/* <BusinessRegistrationPage /> */}
              {/* <EmployeeRegistrationPage></EmployeeRegistrationPage> */}
              {/* <LoginPage></LoginPage> */}
              {/* <Homepage></Homepage> */}
              {/* <Register></Register> */}
              {/* <HoursRecord></HoursRecord> */}
          </div>
      </div>
      <Navbar></Navbar>
  </div>
    );
}

export default App;
