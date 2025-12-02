let contractAddress = "0xA2f175bAE8D9E2c2F8cA717F20FD3f07E2E4fc3e";

let contractABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address payable[]",
        name: "recipents",
        type: "address[]",
      },
      {
        internalType: "uint32[]",
        name: "amounts",
        type: "uint32[]",
      },
    ],
    name: "splitFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "amountToSplit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "walletBal",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const ERC20_ABI = [
  // --- View Functions (Read-only / No gas cost) ---

  // 1. balanceOf: Returns the amount of tokens owned by 'account'.
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },

  // 2. allowance: Returns the amount of tokens that the 'spender' is allowed to spend on behalf of 'owner'.
  {
    constant: true,
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },

  // 3. decimals: Returns the number of decimals used to get its user representation. (Crucial for display)
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },

  // 4. symbol: Returns the symbol of the token (e.g., "USDC", "DAI").
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },

  // --- Transaction Functions (Write / Gas cost) ---

  // 5. approve: Sets the amount of tokens that an 'spender' (your Payer contract) can spend. (Required before deposit)
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },

  // 6. transfer: Moves 'amount' tokens from the caller's account to 'recipient'. (Used internally by your withdraw function)
  {
    constant: false,
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },

  // 7. transferFrom: Moves 'amount' tokens from 'sender' to 'recipient' using the allowance mechanism. (Used by your deposit function)
  {
    constant: false,
    inputs: [
      { name: "sender", type: "address" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },

  // --- Events (Crucial for UI updates) ---

  // 8. Transfer Event: Emitted when tokens are moved.
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },

  // 9. Approval Event: Emitted when an allowance is set.
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
];

let provider, signer, contract, tokenContract;

document.getElementById("connectWalletBtn").onclick = async () => {
  if (typeof window.ethereum == "undefined") {
    alert("MetaMask is not installed, please install it to use this dApp!");
  } else {
    try {
      //switch to Arc
      try {
        // Try switching the network
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x4cef52" }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x4cef52", // <--- CORRECTED: Must be 0x-prefixed hexadecimal
                  chainName: "Arc Testnet",
                  nativeCurrency: {
                    name: "USDC",
                    symbol: "USDC", // <--- CONFIRMED: Symbol is USDC
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc.testnet.arc.network"], // Using the primary RPC
                  blockExplorerUrls: ["https://testnet.arcscan.app"],
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add network:", addError);
          }
        }
      }

      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // ask user to connect wallet
      signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      contract = new ethers.Contract(contractAddress, contractABI, signer);
      document.getElementById("connectWalletBtn").style.display = "none";
      document.getElementById("walletAddress").innerText = `: ${userAddress}`;

      const tokenaddress = "0x3600000000000000000000000000000000000000"; // USDC contract address
      tokenContract = new ethers.Contract(tokenaddress, ERC20_ABI, signer);

      //display wallet balance
      await displayWalletBalance();

      //Display deposited balance after deposit/withdraw
      await displayContractBalance();

      //Approve token if not approved yet
      await approveToken();
    } catch (err) {
      console.error(err);
    }
  }
};

async function approveToken() {
  try {
    const tokenaddress = "0x3600000000000000000000000000000000000000"; // USDC contract address
    const tokenContract = new ethers.Contract(tokenaddress, ERC20_ABI, signer);
    const MAX_APPROVAL_AMOUNT = ethers.constants.MaxUint256;
    const tx = await tokenContract.approve(
      contractAddress,
      MAX_APPROVAL_AMOUNT
    );
    await tx.wait();
  } catch (err) {
    if (err.code === 4001) {
      await showToast("Token approval is required to proceed.", "error");
      window.location.reload();
    }

    // 2. Handle all other network or contract execution errors
    else {
      console.error("An unexpected error occurred during token approval:", err);
    }
  }
}

async function showToast(message, type) {
  // 1. Create the new element
  const newToast = document.createElement("div");
  newToast.textContent = message;
  newToast.className = "toast-container";

  // 2. Append it to the document body
  document.body.appendChild(newToast);

  newToast.classList.add(`toast-${type}`);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Remove the element, ready for the next call
  newToast.remove();
}

//Display contract balance
async function displayContractBalance() {
  const depositedBal =
    (await contract.userBalance(await signer.getAddress())) / 1e6;
  document.getElementById("Deposited").innerText = `: ${depositedBal} USDC`;
}

//Display wallet balance
async function displayWalletBalance() {
  const walBal = await tokenContract.balanceOf(await signer.getAddress());
  document.getElementById("WalletBalance").innerText = `${walBal / 1e6} USDC`;
}

// Deposit Button Handler
document.getElementById("depositBtn").onclick = async () => {
  if (signer == null) {
    await showToast("Please connect your wallet first.", "warning");
    document.getElementById("depositWithdrawAmount").value = "";
    return;
  }

  if (
    document.getElementById("depositWithdrawAmount").value == false ||
    document.getElementById("depositWithdrawAmount").value <= 0
  ) {
    await showToast("Please enter a valid amount to deposit.", "warning");
    document.getElementById("depositWithdrawAmount").value = "";
    return;
  }

  const minDeposit = await contract.minDeposit();

  if (
    document.getElementById("depositWithdrawAmount").value * 1e6 <
    minDeposit
  ) {
    await showToast(
      `Minimum deposit amount is ${minDeposit / 1e6} USDC.`,
      "warning"
    );
    document.getElementById("depositWithdrawAmount").value = "";
    return;
  }

  const amount = document.getElementById("depositWithdrawAmount").value;
  const walBal = await tokenContract.balanceOf(await signer.getAddress());
  const amountInSmallestUnits = ethers.utils.parseUnits(amount, 6);

  if (amountInSmallestUnits.gt(walBal)) {
    await showToast("Insufficient wallet balance to deposit.", "error");
    document.getElementById("depositWithdrawAmount").value = "";
    return;
  }

  await contract.deposit(amount * 1e6);
  document.getElementById("depositWithdrawAmount").value = "";
  await displayContractBalance();
  await displayWalletBalance();
  await showToast("Deposit successful!", "success");
};

// Withdraw Button Handler
document.getElementById("withdrawBtn").onclick = async () => {
  if (signer == null) {
    await showToast("Please connect your wallet first.", "warning");
    document.getElementById("depositWithdrawAmount").value = "";
    return;
  }

  if (document.getElementById("depositWithdrawAmount").value == false) {
    await showToast("Please enter a valid amount to withdraw.", "warning");
    document.getElementById("depositWithdrawAmount").value = "";
    return;
  }

  const amount = document.getElementById("depositWithdrawAmount").value;
  const depositedBal = await contract.userBalance(await signer.getAddress());

  if (amount > depositedBal / 1e6) {
    await showToast("Requested amount higher than deposited balance.", "error");
    document.getElementById("depositWithdrawAmount").value = "";
    return;
  }

  await contract.withdraw(amount * 1e6);
  document.getElementById("depositWithdrawAmount").value = "";
  await displayContractBalance();
  await displayWalletBalance();
  await showToast("Withdrawal successful!", "success");
};

const recipients = [];
const amounts = [];

//Add receipents Button Handler
document.getElementById("addRecipientBtn").onclick = async () => {
  if (signer == null) {
    await showToast("Please connect your wallet first.", "warning");
  }

  const newRecipient = document.getElementById("recipientAddressInput").value;
  const newAmount = document.getElementById("sendAmountInput").value;

  if (!ethers.utils.isAddress(newRecipient)) {
    await showToast("Please enter a valid recipient address.", "warning");
    document.getElementById("recipientAddressInput").value = "";
    return;
  }

  if (newAmount <= 0 || isNaN(newAmount)) {
    await showToast("Please enter a valid amount to send.", "warning");
    document.getElementById("sendAmountInput").value = "";
    return;
  }

  if (recipients.includes(newRecipient)) {
    await showToast("Recipient already added.", "warning");
    document.getElementById("recipientAddressInput").value = "";
    document.getElementById("sendAmountInput").value = "";
    return;
  }

  if (
    newAmount >
    (await contract.userBalance(await signer.getAddress())) / 1e6
  ) {
    await showToast("Amount exceeds your deposited balance.", "error");
    document.getElementById("sendAmountInput").value = "";
    return;
  }

  recipients.push(newRecipient);
  amounts.push(newAmount);
  document.getElementById("recipientAddressInput").value = "";
  document.getElementById("sendAmountInput").value = "";
  const list = document.getElementById("recipientList");
  const listItem = document.createElement("li");
  listItem.textContent = `Address: ${newRecipient}, Amount: ${newAmount} USDC`;
  list.appendChild(listItem);

  const totalAmount = amounts.reduce((acc, val) => acc + Number(val), 0);

  if (
    totalAmount >
    (await contract.userBalance(await signer.getAddress())) / 1e6
  ) {
    await showToast(
      "Total sending amount exceeds your deposited balance.",
      "error"
    );
    list.removeChild(listItem);
    recipients.pop();
    amounts.pop();
    return;
  }

  document.getElementById(
    "totalSendingAmount"
  ).innerText = `${totalAmount} USDC`;
};

//Reset List
document.getElementById("resetInputBtn").onclick = async () => {
  recipients.length = 0;
  amounts.length = 0;
  document.getElementById("totalSendingAmount").innerText = `0 USDC`;
  document.getElementById("recipientList").innerHTML = "";
  await showToast("Recipient list has been reset.", "info");
};

//Split Funds Button Handler
document.getElementById("sendFundsBtn").onclick = async () => {
  if (signer == null) {
    await showToast("Please connect your wallet first.", "warning");
    return;
  }
  if (recipients.length === 0) {
    await showToast("Please add at least one recipient.", "warning");
    return;
  }

  const totalAmount = amounts.reduce((acc, val) => acc + Number(val), 0);
  const depositedBal = await contract.userBalance(await signer.getAddress());

  if (totalAmount * 1e6 > depositedBal) {
    await showToast("Insufficient deposited balance to split funds.", "error");
    return;
  }

  await contract.splitFunds(
    recipients,
    amounts.map((a) => a * 1e6)
  );
  recipients.length = 0;
  amounts.length = 0;
  document.getElementById("recipientList").innerHTML = "";
  document.getElementById("totalSendingAmount").innerText = `0 USDC`;
  await displayContractBalance();
  await displayWalletBalance();
  await showToast("Funds split and sent successfully!", "success");
};
