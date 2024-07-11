import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./components/Home";
import CreateCar from './components/manager/CreateCar';
import EditCar from './components/manager/EditCar';
import ManagerCar from "./components/manager/ManagerCar";
import { ToastContainer } from 'react-toastify';
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/home" element={<Home/>}/>
        </Routes>
        <Routes>
          <Route path="/admin" element={<ManagerCar/>}/>
          <Route path='/addCar' element={<CreateCar/>}/>
          <Route path='/editCar/:ProductID' element={<EditCar/>}/>
        </Routes>
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
