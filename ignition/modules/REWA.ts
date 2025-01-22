import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const REWAModule = buildModule("REWAModule", (m) => {

    const erc20 = m.contract("REWA");

    return { erc20 };
});

export default REWAModule;
