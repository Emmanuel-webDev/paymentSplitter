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
}
