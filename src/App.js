import Header from "./components/Header";
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import Home from "./components/Home";
import Car from "./components/Car";
import Cart from "./components/Cart";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/cars" element={<Car />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
