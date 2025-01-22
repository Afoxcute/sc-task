import { ethers } from "hardhat";

async function main() {
    const REWATokenAddress = "0xe3Cf8C99E10C1a7138520391bef6dddC61Aa0b91";
    const REWA = await ethers.getContractAt("IERC20", REWATokenAddress);

    const RewardsContractAddress = "0x5FA0943FE08d4b4fd8325b0919A63194397d6B47";
    const RewardsContract = await ethers.getContractAt("IREWA", RewardsContractAddress);

    // Approve savings contract to spend token
    const approvalAmount = ethers.parseUnits("1000", 18);

    const approveTx = await REWA.approve(RewardsContract, approvalAmount);
    approveTx.wait();

    const contractBalanceBeforeDeposit = await RewardsContract.getContractBalance();
    console.log("Contract balance before :::", contractBalanceBeforeDeposit);

    // const depositAmount = ethers.parseUnits("150", 18);
    // const depositTx = await RewardsContract.deposit(depositAmount);

    // console.log(depositTx);

    // depositTx.wait();

    // const contractBalanceAfterDeposit = await RewardsContract.getContractBalance();

    // console.log("Contract balance after :::", contractBalanceAfterDeposit);



    // Withdrawal Interaction
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
