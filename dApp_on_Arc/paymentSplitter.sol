// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // Recommended for setting minDeposit

contract Payer {
    using SafeERC20 for IERC20;

    uint public minDeposit = 0.5 * 10 ** 6; // Set for 6 decimals (USDC standard)
    IERC20 public immutable token =
        IERC20(0x3600000000000000000000000000000000000000); // USDC token address for arc
    mapping(address => uint) public userBalance;
    uint public amountToSplit;

    //Deposit to contract
    function deposit(uint _amount) public payable {
        require(
            _amount >= minDeposit,
            "Deposit must be greater than minDeposit"
        );
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
        uint32[] memory percents
    ) public payable {
        require(userBalance[msg.sender] > 0, "Insufficient balance to split");
        require(
            recipents.length == percents.length,
            "Recipents and percents must be the same length"
        );
        require(recipents.length > 0, "Recipents must be greater than 0");
        require(percents.length > 0, "Percents must be greater than 0");

        uint32 totalPercent = 0;
        for (uint i = 0; i < percents.length; i++) {
            totalPercent += percents[i];
        }
        require(
            totalPercent <= 100,
            "Total percent must be less than or equal to 100"
        );

        amountToSplit = (userBalance[msg.sender] * totalPercent) / 100;
        userBalance[msg.sender] -= amountToSplit;

        //Fund distributor loop
        for (uint i = 0; i <= recipents.length; i++) {
            uint256 amount = (userBalance[msg.sender] * percents[i]) / 100;

            if (amount > 0) {
                token.safeTransfer(recipents[i], amount);
            }
        }
    }
}
