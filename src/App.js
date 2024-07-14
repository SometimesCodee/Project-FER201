import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Home from "./components/Home";
import Car from "./components/Car";
import Cart from "./components/Cart";

import CreateCar from './components/manager/CreateCar';
import EditCar from './components/manager/EditCar';
import ManagerCar from "./components/manager/ManagerCar";
import Profile from './components/customer/Profile';
import Header from './components/Header';
import CustomerOrder from './components/customer/CustomerOrder';

function App() {
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
      setLogin(true);
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cars" element={<Car />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login setLogin={setLogin} />} />
          <Route path="/signup" element={<SignUp />} />
          {isLogin && (
            <>
              <Route path="/admin" element={<ManagerCar />} />
              <Route path='/addCar' element={<CreateCar />} />
              <Route path='/editCar/:ProductID' element={<EditCar />} />
              <Route path="/customer/profile/:id" element={<Profile />} />
              <Route path='/customer/profile/:id/orders' element={<CustomerOrder></CustomerOrder>}></Route>
            </>
          )}
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
