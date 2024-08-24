import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Subscribe from "./pages/Subscribe";
import NavBar from "./components/NavBar";
import SubscriptionConfirm from "./pages/SubscriptionConfirm";
import UnsubscriptionConfirm from "./pages/UnsubscriptionConfirm";

const App = () => {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<History />} />
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/subscription-confirm" element={<SubscriptionConfirm />} />
                <Route path="/unsubscription-confirm" element={<UnsubscriptionConfirm />} />
            </Routes>
        </Router>
    );
};

export default App;
