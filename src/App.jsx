import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Plans from "./pages/Plans";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/planes" element={<Plans />} />
        {/* Aquí agregaremos /login, /dashboard después */}
      </Routes>
    </Router>
  );
}

export default App;