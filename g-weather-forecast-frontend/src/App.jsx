import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Subscribe from "./pages/Subscribe";
import NavBar from "./components/NavBar";

const App = () => {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<History />} />
                <Route path="/subscribe" element={<Subscribe />} />
            </Routes>
        </Router>
    );
};

export default App;
