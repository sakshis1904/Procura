import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateRFP from './pages/CreateRFP';
import RFPDetail from './pages/RFPDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateRFP />} />
            <Route path="/rfp/:id" element={<RFPDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
