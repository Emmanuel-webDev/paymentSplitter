// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // Recommended for setting minDeposit

contract Payer {
    using SafeERC20 for IERC20;
    IERC20 public token = IERC20(0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a);

    uint public minDeposit = 5 * 10 ** 6; // Set for 6 decimals (USDC standard)
    
    mapping(address => uint) public userBalance;
    uint public amountToSplit = 0;

    //Deposit to contract
    function deposit(uint _amount) public payable {
        require(_amount >= minDeposit, "Deposit must be greater than minDeposit");
        token.safeTransferFrom(msg.sender, address(this), _amount);
        userBalance[msg.sender] += _amount;
    }

    // Withdraw USDC from contract
    function withdraw(uint _amount) public {
        require(
            userBalance[msg.sender] >= _amount,
            "Insufficient balance to withdraw"
        );

        userBalance[msg.sender] -= _amount;

        token.safeTransfer(msg.sender, _amount);
    }

    //Funds splitter
    function splitFunds(address payable[] memory recipents, uint32[] memory percents) public payable {
        require(userBalance[msg.sender] > 0, "Insufficient balance to split");
        require(recipents.length == percents.length, "Recipents and percents must be the same length");
        require(recipents.length > 0, "Recipents must be greater than 0");
        require(percents.length > 0, "Percents must be greater than 0");

    
        for (uint i = 0; i < percents.length; i++) {
            amountToSplit += percents[i];
        }

        //Fund distributor loop
        for (uint i = 0; i < recipents.length; i++) {

            if (percents[i] > 0) {
                token.safeTransfer(recipents[i], percents[i]);
            }
        }
        userBalance[msg.sender] -= amountToSplit;
    }
}
