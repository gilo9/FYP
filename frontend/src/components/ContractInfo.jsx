import React from "react";

function ContractInfo({ account }) {
    return(
        <div>
            <h2>Contract Information</h2>
            <p>Account: {account}</p>
        </div>
    );
}
export default ContractInfo;
// This component displays the account information of the connected wallet.