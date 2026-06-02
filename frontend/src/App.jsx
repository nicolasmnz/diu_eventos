import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./views/Home";
import EventDetails from "./views/EventDetails.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos/:id" element={<EventDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
