// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./assets/pages/Home";
import Money from "./assets/pages/Money";
import Benefit from './assets/pages/Benefit';
import Pay from './assets/pages/Pay';
import Paper from './assets/pages/Paper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/money" element={<Money />} />
        <Route path="/benefit" element={<Benefit />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/paper" element={<Paper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
