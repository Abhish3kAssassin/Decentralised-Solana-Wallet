import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';

const ImportWallet = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const navigate = useNavigate();

  // Import Wallet Function
  const handleImportWallet = async () => {
    try {
      if (!seedPhrase.trim()) {
        throw new Error("Seed phrase cannot be empty.");
      }

      // Split words and validate length (12 or 24 words)
      const words = seedPhrase.trim().split(/\s+/);
      if (words.length !== 12 && words.length !== 24) {
        throw new Error("Invalid seed phrase. Please enter a valid 12 or 24-word phrase.");
      }

      // Derive keypair from the seed phrase
      const seed = await bip39.mnemonicToSeed(seedPhrase);
      const keypair = Keypair.fromSeed(seed.slice(0, 32));

      toast.success("✅ Wallet imported successfully! Redirecting...", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect to Wallet Dashboard
      setTimeout(() => {
        navigate('/dashboard', { state: { publicKey: keypair.publicKey.toBase58(), privateKey: Array.from(keypair.secretKey) } });
      }, 3000);

    } catch (error) {
      console.error("Error importing wallet:", error);
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="import-wallet-container">
      <h2>Import Wallet</h2>
      <textarea
        className="import-input"
        placeholder="Enter your seed phrase"
        value={seedPhrase}
        onChange={(e) => setSeedPhrase(e.target.value)}
      />
      <button className="import-button" onClick={handleImportWallet}>Import Wallet</button>
    </div>
  );
};

export default ImportWallet;