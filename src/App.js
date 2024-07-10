import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import CreateCar from './components/manager/CreateCar';
import EditCar from './components/manager/EditCar';
import ManagerCar from "./components/manager/ManagerCar";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
        <Routes>
          <Route path="/admin" element={<ManagerCar/>}/>
          <Route path='/addCar' element={<CreateCar/>}/>
          <Route path='/editCar/:ProductID' element={<EditCar/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
