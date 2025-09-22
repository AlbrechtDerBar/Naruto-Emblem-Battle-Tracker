// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import EmblemPage from './Pages/EmblemPage/EmblemPage';
import FriendaPage from './Pages/FriendaPage/FriendaPage';
import Home from './Pages/Home';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/naruto-emblem-battle" element={<EmblemPage />} />
        <Route path="/pokemon-frienda" element={<FriendaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
