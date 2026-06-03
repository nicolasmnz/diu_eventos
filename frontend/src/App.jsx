import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./views/Home";
import EventDetails from "./views/EventDetails.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos/:slug" element={<EventDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
