import React from "react";

function ContractInfo({ account }) {
    return(
        <div className="account-info">
            <h3>Connected Wallet</h3>
            <p>{account}</p>
        </div>
    );
}

export default ContractInfo;