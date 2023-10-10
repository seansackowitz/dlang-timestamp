import logo from './logo.svg';
import './App.css';
import LoginPage from './page/login';
import Register from './page/Register';
import { EmployeeRegistrationPage } from './page/EmployeeRegistrationPage';
import BusinessRegistrationPage from './page/BusinessRegistrationPage';
import Navbar from './page/Navbar';
import Header from './page/Header';
import LeftSidebar from './page/LeftSidebar';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <div className='flex'>
      <LeftSidebar></LeftSidebar>
      <div>
        <p>lisajdlaisjd</p>
      </div>
      </div>

      <Navbar></Navbar>

    </div>
  );
}

export default App;
