import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Plans from "./pages/Plans";
import Templates from "./pages/Templates";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/planes" element={<Plans />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/register" element={<Register />} />
        {/* Aquí agregaremos /login, /dashboard después */}
      </Routes>
    </Router>
  );
}

export default App;