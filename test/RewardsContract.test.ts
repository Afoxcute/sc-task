import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { REWARDS_TOKEN_ADDRESS, PRICE_FEED_ADDRESS, REWARDS_CONTRACT_ADDRESS } from "../scripts/constants";

describe("RewardsContract", function () {
    // Fixture to deploy contracts and set up initial state
    async function deployRewardsFixture() {
        // Get signers
        const [owner, user1, user2] = await hre.ethers.getSigners();

        // Get existing token contract
        const rewardsToken = await hre.ethers.getContractAt("IERC20", REWARDS_TOKEN_ADDRESS);
        const token = await rewardsToken.deploymentTransaction();

        // Get existing price feed contract
        const priceFeed = await hre.ethers.getContractAt("AggregatorV3Interface", PRICE_FEED_ADDRESS);

        // Deploy RewardsContract with actual addresses
        const RewardsContract = await ethers.getContractFactory("RewardsContract");
        const rewardsContract = await RewardsContract.deploy(
            REWARDS_TOKEN_ADDRESS,
            PRICE_FEED_ADDRESS
        );
        await rewardsContract.waitForDeployment();

        const INITIAL_SUPPLY = ethers.parseEther("100"); // 1 million tokens

        return { 
            rewardsContract, 
            rewardsToken,
            priceFeed, 
            owner, 
            user1, 
            user2,
            INITIAL_SUPPLY
        };
    }

    describe("Deployment", function () {
        it("Should set the correct token and price feed addresses", async function () {
            const { rewardsContract, owner } = await loadFixture(deployRewardsFixture);
            
            expect(await rewardsContract.owner()).to.equal(owner);
            // expect(await rewardsContract.priceFeed()).to.equal(PRICE_FEED_ADDRESS);
        });

        it("Should be able to interact with the token and price feed contracts", async function () {
            const { rewardsToken, owner, token } = await loadFixture(deployRewardsFixture);
            expect(await REWARDS_TOKEN_ADDRESS.decimals()).to.equal(token);


            // Verify we can call methods on both contracts
            // const decimals = await rewardsToken.decimals();
            // expect(decimals).to.be.gt(0);

 
        });
    });

    describe("Reward Points", function () {
        it("Should reward points to users", async function () {
            const { rewardsContract, user1 } = await loadFixture(deployRewardsFixture);
            const points = 100;

            await rewardsContract.rewardPoints(user1.address, points);
            expect(await rewardsContract.userPoints(user1.address)).to.equal(points);
        });

        it("Should emit PointsRewarded event", async function () {
            const { rewardsContract, user1 } = await loadFixture(deployRewardsFixture);
            const points = 100;

            await expect(rewardsContract.rewardPoints(user1.address, points))
                .to.emit(rewardsContract, "PointsRewarded")
                .withArgs(user1.address, points);
        });

        it("Should revert when rewarding 0 points", async function () {
            const { rewardsContract, user1 } = await loadFixture(deployRewardsFixture);
            
            await expect(rewardsContract.rewardPoints(user1.address, 0))
                .to.be.revertedWith("Points must be greater than 0");
        });

        it("Should revert when rewarding to zero address", async function () {
            const { rewardsContract } = await loadFixture(deployRewardsFixture);
            
            await expect(rewardsContract.rewardPoints(ethers.ZeroAddress, 100))
                .to.be.revertedWith("Invalid user address");
        });
    });

    describe("Redeem Points", function () {
        // Note: These tests might need to be modified based on the actual token's behavior
        it("Should allow users to redeem points for tokens if contract has sufficient balance", async function () {
            const { rewardsContract, rewardsToken, user1 } = await loadFixture(deployRewardsFixture);
            const points = 1000; // $1000 worth of points

            // First check if contract has sufficient balance
            const contractBalance = await rewardsToken.balanceOf(await rewardsContract.getAddress());
            if (contractBalance.toString() === "0") {
                // Skip test if contract has no tokens
                this.skip();
            }

            await rewardsContract.rewardPoints(user1.address, points);
            const initialBalance = await rewardsToken.balanceOf(user1.address);
            
            await rewardsContract.connect(user1).redeemPoints(points);
            
            expect(await rewardsContract.userPoints(user1.address)).to.equal(0);
            expect(await rewardsToken.balanceOf(user1.address)).to.be.gt(initialBalance);
        });

        it("Should emit PointsRedeemed event", async function () {
            const { rewardsContract, user1 } = await loadFixture(deployRewardsFixture);
            const points = 1000;

            await rewardsContract.rewardPoints(user1.address, points);
            
            await expect(rewardsContract.connect(user1).redeemPoints(points))
                .to.emit(rewardsContract, "PointsRedeemed");
        });

        it("Should revert when redeeming more points than available", async function () {
            const { rewardsContract, user1 } = await loadFixture(deployRewardsFixture);
            
            await expect(rewardsContract.connect(user1).redeemPoints(100))
                .to.be.revertedWith("Insufficient points balance");
        });
    });

    describe("Balance Checking", function () {
        it("Should return correct balance", async function () {
            const { rewardsContract, user1 } = await loadFixture(deployRewardsFixture);
            const points = 100;

            await rewardsContract.rewardPoints(user1.address, points);
            expect(await rewardsContract.getBalance(user1.address)).to.equal(points);
        });

        it("Should emit BalanceChecked event", async function () {
            const { rewardsContract, user1 } = await loadFixture(deployRewardsFixture);
            const points = 100;

            await rewardsContract.rewardPoints(user1.address, points);
            
            await expect(rewardsContract.getBalance(user1.address))
                .to.emit(rewardsContract, "BalanceChecked")
                .withArgs(user1.address, points);
        });
    });
}); 