import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { Connection, clusterApiUrl, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import backgroundImage from '../login.jpg'; // ✅ Import the background image

window.Buffer = Buffer;

const WalletDashboard = () => {
  const { state } = useLocation();
  const [publicKey, setPublicKey] = useState(state?.publicKey || '');
  const [privateKey, setPrivateKey] = useState(state?.privateKey || []);
  const [balance, setBalance] = useState(null);
  const [sendTo, setSendTo] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // Fetch Balance
  const handleGetBalance = async () => {
    try {
      if (!publicKey) {
        toast.error('⚠️ No public key detected.');
        return;
      }
      const walletBalance = await connection.getBalance(new PublicKey(publicKey));
      setBalance(walletBalance / 1e9);
    } catch (error) {
      toast.error('❌ Failed to fetch balance.');
    }
  };

  // Send Transaction with Toast Notification
  const handleSendSOL = async () => {
    try {
      if (!sendTo || !amount) {
        toast.error('⚠️ Please provide a valid recipient and amount.');
        return;
      }

      const senderKeypair = Keypair.fromSecretKey(Uint8Array.from(privateKey));
      const recipientPublicKey = new PublicKey(sendTo);
      const lamports = parseFloat(amount) * 1e9; // Convert SOL to lamports

      // Fetch sender balance
      const senderBalance = await connection.getBalance(senderKeypair.publicKey);

      if (senderBalance < lamports) {
        toast.error(`❌ Insufficient balance. Available: ${senderBalance / 1e9} SOL`);
        return;
      }

      // Fetch latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: recipientPublicKey,
          lamports,
        })
      );

      transaction.recentBlockhash = blockhash;
      transaction.feePayer = senderKeypair.publicKey;

      // Sign & send transaction
      const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);

      toast.success(`✅ Transaction successful! Signature: ${signature}`);

      handleGetBalance(); // Refresh balance
    } catch (error) {
      toast.error(`❌ Transaction failed: ${error.message}`);
    }
  };

  return (
    <div 
      className="dashboard" 
      style={{ 
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <h1>Wallet Dashboard</h1>

      {publicKey ? (
        <>
          <p><strong>Public Key:</strong> {publicKey}</p>
          <button onClick={handleGetBalance}>Get Balance</button>
          {balance !== null && <p><strong>Balance:</strong> {balance} SOL</p>}

          {/* QR Code for Receiving SOL */}
          <h3>Receive SOL</h3>
          {publicKey && <QRCode value={publicKey} />}

          {/* Send SOL Section */}
          <h3>Send SOL</h3>
          <input
            type="text"
            placeholder="Recipient Address"
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount (SOL)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleSendSOL}>Send</button>
        </>
      ) : (
        <p style={{ color: 'red' }}>No public key available. Please import a wallet.</p>
      )}

      {status && <p>{status}</p>}
    </div>
  );
};

export default WalletDashboard;