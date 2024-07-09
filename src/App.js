import Header from "./components/Header";
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
