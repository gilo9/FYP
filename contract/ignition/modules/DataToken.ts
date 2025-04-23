import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';



const DataTokenModule = buildModule("DataTokenModule", (m) => {
  
    const DataTokenContract = m.contract("DataToken");

    return { DataTokenContract };
});

export default DataTokenModule;