// src/pages/Money.jsx

import Header from "../components/Header.jsx";
import Navigation from "../components/Navigation.jsx";
import Mic from "../components/Mic.jsx";
const Money = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#e6ffe6]">
    <Header />
    <div className="text-4xl font-bold text-[#399946]">자산(머니) 화면</div>
    <Navigation />
    <Mic />
  </div>
);
export default Money;