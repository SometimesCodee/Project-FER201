import { useState } from 'react';
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
function App() {
  const [isLogin, setLogin] = useState(false);
  return (
    <div className="App">


      <BrowserRouter>
        <Routes>
          <Route path="/cars" element={<Car />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login setLogin={setLogin} />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/home" element={<Home />} />
        </Routes>
        {
          isLogin && (
            <Routes>
              <Route path="/admin" element={<ManagerCar />} />
              <Route path='/addCar' element={<CreateCar />} />
              <Route path='/editCar/:ProductID' element={<EditCar />} />
            </Routes>
          )
        }
      </BrowserRouter>
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
    </div>
  );
}

export default App;
