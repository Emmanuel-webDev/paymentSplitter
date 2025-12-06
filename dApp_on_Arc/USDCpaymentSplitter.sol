// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // Recommended for setting minDeposit

contract Payer {
    using SafeERC20 for IERC20;
    IERC20 public token = IERC20(0x3600000000000000000000000000000000000000);

    uint public minDeposit = 5 * 10 ** 6; // min deposit 5$, Set for 6 decimals (USDC standard)
    uint public walletBal = token.balanceOf(msg.sender);

    mapping(address => uint) public userBalance;

    //Deposit to contract
    function deposit(uint _amount) public {
        require(
            _amount >= minDeposit,
            "Deposit must be greater than minDeposit"
        );
        require(walletBal >= _amount, "Wallet balance is low");
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
    function splitFunds(
        address payable[] memory recipents,
        uint32[] memory amounts
    ) public {
        require(userBalance[msg.sender] > 0, "Insufficient balance to split");
        require(
            recipents.length == amounts.length,
            "Recipents and percents must be the same length"
        );
        require(recipents.length > 0, "Recipents must be greater than 0");
        require(amounts.length > 0, "Percents must be greater than 0");
        uint amountToSplit = 0;

        for (uint i = 0; i < amounts.length; i++) {
            amountToSplit += amounts[i];
        }

        require(
            amountToSplit <= userBalance[msg.sender],
            "Amount to send is higher than deposited balance"
        );
        userBalance[msg.sender] -= amountToSplit;
        //Fund distributor loop
        for (uint i = 0; i < recipents.length; i++) {
            if (amounts[i] > 0) {
                token.safeTransfer(recipents[i], amounts[i]);
            }
        }
    }
}
