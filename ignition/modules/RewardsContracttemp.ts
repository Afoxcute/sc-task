import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = "0xe3Cf8C99E10C1a7138520391bef6dddC61Aa0b91";

const RewardsContractModule = buildModule("RewardsContractModule", (m) => {

    const save = m.contract("RewardsContract", [tokenAddress]);

    return { save };
});

export default RewardsContractModule;

// Deployed SaveERC20: 0xD410219f5C87247d3F109695275A70Da7805f1b1
