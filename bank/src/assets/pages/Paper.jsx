// src/pages/Paper.jsx
import Header from "../components/Header.jsx";
import Navigation from "../components/Navigation.jsx";
import Mic from "../components/Mic.jsx";
const Paper = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#eceaff]">
    <Header />
    <div className="text-4xl font-bold text-[#6756c7]">증권(페이퍼) 화면</div>
    <Navigation />
    <Mic />
  </div>
);
export default Paper;
