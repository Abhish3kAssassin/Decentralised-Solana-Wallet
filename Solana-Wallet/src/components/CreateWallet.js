import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';

const CreateWallet = () => {
  const [walletCreated, setWalletCreated] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState([]);

  // Generate Wallet
  const handleCreateWallet = async () => {
    const mnemonic = bip39.generateMnemonic(128); // Generate human-readable seed phrase
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const keypair = Keypair.fromSeed(seed.slice(0, 32));

    setSeedPhrase(mnemonic);
    setPublicKey(keypair.publicKey.toBase58());
    setPrivateKey(Array.from(keypair.secretKey));
    
    // Show agreement popup before revealing keys
    setShowAgreement(true);
  };

  // Confirm and proceed
  const handleAgree = () => {
    setWalletCreated(true);
    setShowAgreement(false);

    // Success notification
    toast.success('✅ Wallet created successfully! Download your seed phrase & keys NOW.', {
      position: 'top-right',
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Warning notification
    setTimeout(() => {
      toast.warn('⚠ WARNING: Your seed phrase is the ONLY way to recover your wallet! Store it safely.', {
        position: 'top-center',
        autoClose: 7000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }, 1000);
  };

  // Download JSON file
  const downloadFile = (fileName, data) => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="wallet-container">
      <h1>Create a Solana Wallet</h1>

      {/* Hide 'Create Wallet' button after wallet is created */}
      {!walletCreated && !showAgreement && (
        <button className="create-btn" onClick={handleCreateWallet}>Generate Wallet</button>
      )}

      {/* Agreement Popup */}
      {showAgreement && (
        <div className="agreement-popup">
          <h2>⚠ Important Notice</h2>
          <p>
            You must **download and securely store your seed phrase and keys.** 
            If you lose them, you will **not** be able to recover your wallet.
          </p>
          <button className="agree-btn" onClick={handleAgree}>I Understand & Proceed</button>
        </div>
      )}

      {/* Wallet Details */}
      {walletCreated && (
        <div className="wallet-info">
          <h2>🎉 Wallet Successfully Created!</h2>
          
          {/* Seed Phrase */}
          <p><strong>Seed Phrase:</strong></p>
          <div className="seed-box">{seedPhrase}</div>

          {/* Public Key */}
          <p><strong>Public Key:</strong> {publicKey}</p>

          {/* QR Code for Public Key */}
          <div className="qr-container">
            <QRCode value={publicKey} className="qr-code" />
          </div>

          {/* Download Buttons */}
          <div className="buttons">
            <button className="download-btn" onClick={() => downloadFile('seed_phrase.json', { seedPhrase })}>
              📥 Download Seed Phrase
            </button>
            <button className="download-btn" onClick={() => downloadFile('wallet_keys.json', { publicKey, privateKey })}>
              📥 Download Public & Private Key
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateWallet;