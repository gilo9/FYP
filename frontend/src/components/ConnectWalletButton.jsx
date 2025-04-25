import React from "react";
import { requestAccount } from "../utils/contractServices";

function ConnectWalletButton({ setAccount }) {
    const connectWallet = async () => {
        try {
            const account = await requestAccount();
            setAccount(account);
        } catch (error) {
            console.error('Error connecting wallet:', error.message);
        }
    };
    
    return (
        <div className="flex-center" style={{ minHeight: '50vh' }}>
            <button 
                onClick={connectWallet}
                className="connect-wallet-btn"
            >
                Connect Web3 Wallet
            </button>
        </div>
    );
}

export default ConnectWalletButton;