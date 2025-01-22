// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract RewardsContract is ReentrancyGuard {
    IERC20 public rewardsToken;
    AggregatorV3Interface public priceFeed;
    
    mapping(address => uint256) public userPoints;
    
    // Events
    event PointsRewarded(address indexed user, uint256 points);
    event PointsRedeemed(address indexed user, uint256 points, uint256 tokens);
    event BalanceChecked(address indexed user, uint256 balance);
    
    // Constants
    uint256 private constant POINTS_DECIMALS = 18;
    uint256 private constant PRICE_DECIMALS = 8;
    
    constructor(address _rewardsToken, address _priceFeed) {
        require(_rewardsToken != address(0), "Invalid token address");
        require(_priceFeed != address(0), "Invalid price feed address");
        
        rewardsToken = IERC20(_rewardsToken);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }
    
    /**
     * @dev Add reward points to a user's balance
     * @param user Address of the user to reward
     * @param points Amount of points to reward
     */
    function rewardPoints(address user, uint256 points) external {
        require(msg.sender != address(0), "Invalid sender");
        require(user != address(0), "Invalid user address");
        require(points > 0, "Points must be greater than 0");
        
        userPoints[user] += points;
        emit PointsRewarded(user, points);
    }
    
    /**
     * @dev Redeem points for tokens
     * @param points Amount of points to redeem
     */
    function redeemPoints(uint256 points) external nonReentrant {
        require(msg.sender != address(0), "Invalid sender");
        require(points > 0, "Points must be greater than 0");
        require(userPoints[msg.sender] >= points, "Insufficient points balance");
        
        uint256 tokenAmount = calculateTokenAmount(points);
        require(tokenAmount > 0, "Token amount too small");
        require(
            rewardsToken.balanceOf(address(this)) >= tokenAmount,
            "Insufficient contract balance"
        );
        
        userPoints[msg.sender] -= points;
        require(
            rewardsToken.transfer(msg.sender, tokenAmount),
            "Token transfer failed"
        );
        
        emit PointsRedeemed(msg.sender, points, tokenAmount);
    }
    
    /**
     * @dev Get the current points balance of a user
     * @param user Address of the user to check
     * @return balance Current points balance
     */
    function getBalance(address user) external returns (uint256 balance) {
        require(msg.sender != address(0), "Invalid sender");
        require(user != address(0), "Invalid user address");
        
        balance = userPoints[user];
        emit BalanceChecked(user, balance);
        return balance;
    }
    
    /**
     * @dev Calculate token amount based on points and current price
     * @param points Amount of points to convert
     * @return tokenAmount Amount of tokens to receive
     */
    function calculateTokenAmount(uint256 points) internal view returns (uint256) {
        (, int256 price,,,) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price feed response");
        
        // Convert points to tokens based on price
        // 1 point = 1 USD worth of tokens
        uint256 tokenAmount = (points * (10 ** PRICE_DECIMALS)) / uint256(price);
        return tokenAmount;
    }
} 