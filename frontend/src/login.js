import React, { useEffect } from "react";
import { requestAccount } from "./utils/contractServices";
import App from "./App";


function LoginPage(){
    useEffect(() => {
        const handleLogin =  async (provider) => {
            const login = await requestAccount(provider)
            if (login){
                App.Route("/Dashboard")
            }
        }

    })

    return(
        <div>
            <h1>Sign In Using Your Preferred Wallet</h1>
            <button onClick={requestAccount}>MetaMask</button>
            <button onClick={requestAccount}>Coinbase</button>


        </div>

    );

}
export default LoginPage;