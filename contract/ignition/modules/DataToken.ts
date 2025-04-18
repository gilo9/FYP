import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';


const DataTokenModule = buildModule("DataTokenModule", (m) => {
    const name = "DataToken";
    const symbol = "DTK";
    const DataTokenContract = m.contract("DataToken",[name,symbol],{});

    return { DataTokenContract };
});

export default DataTokenModule;