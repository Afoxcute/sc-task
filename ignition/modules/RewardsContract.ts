import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RewardsContractModule = buildModule("RewardsContractModule", (m) => {
    const rewardsContract = m.contract("RewardsContract", [
        // Add both required constructor arguments here
        "0xe3Cf8C99E10C1a7138520391bef6dddC61Aa0b91", // rewardsToken address
        "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"  // stakingToken address
    ]);

    return { rewardsContract };
});

export default RewardsContractModule;