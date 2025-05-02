import React, { useEffect, useState } from "react";
import { initialize, requestAccount } from "./utils/contractServices";
import { ToastContainer, toast } from 'react-toastify';
import ContractInfo from "./components/ContractInfo";
import ContractActions from "./components/ContractActions";
import ConnectWalletButton from "./components/ConnectWalletButton";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [accountChange, setAccountChange] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      const account = await requestAccount();
      setAccount(account);
    };
    fetchAccount();
  }, []);

  useEffect(() => {
    const handleAccountChange = (newAccounts) => {
      setAccountChange(true);
      setAccount(newAccounts.length > 0 ? newAccounts[0] : null);
      window.location.reload();
      toast.success("Account changed successfully!");
    }
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountChange);
      //fetchAccount();
    }
    return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
      };
});

  return ( 
    <div className="app">
          {!account ? (
        <ConnectWalletButton setAccount={setAccount} />
      ) : (
        <div className="contract-interactions">
          <ContractInfo account={account} />
          <ContractActions />
        </div>
      )} 
    </div>
  );

};

  

export default App;
