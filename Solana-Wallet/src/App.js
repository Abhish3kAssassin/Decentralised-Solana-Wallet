import React from 'react';
import CreateWallet from './components/CreateWallet';
import ImportWallet from './components/ImportWallet';
import WalletDashboard from './components/WalletDashboard';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // ✅ FIXED: Added useNavigate
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const navigate = useNavigate(); // ✅ Now useNavigate will work

  return (
    <div className="App-header">
      <h1>Solana Wallet</h1>
      <div className="container">
        <div>
          <h2>Create a New Wallet</h2>
          <button onClick={() => navigate('/create-wallet')}>Create Wallet</button>
        </div>
        <div>
          <h2>Import Wallet</h2>
          <button onClick={() => navigate('/import-wallet')}>Import Wallet</button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      {/* ToastContainer added at the root level */}
      <ToastContainer position="top-right" autoClose={5000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/import-wallet" element={<ImportWallet />} />
        <Route path="/dashboard" element={<WalletDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;