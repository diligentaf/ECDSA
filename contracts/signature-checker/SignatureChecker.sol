//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SignatureChecker {
    using ECDSA for bytes32;

    address public ad = address(this);

    bytes32 public constant CAT = keccak256("Cat");
    bytes32 public CAT2 = keccak256(abi.encodePacked("Cat", "Man", "yo", address(this)));
    bytes32 public CAT3 = keccak256(abi.encodePacked("Cat"));
    bytes32 public CAT4 = keccak256(abi.encodePacked("Cat", "Man", "yo", Strings.toHexString(uint160(address(this)), 20)));
    string public checkAd = Strings.toHexString(uint160(address(this)), 20);

    address public immutable claimer;

    uint8 public giftsClaimed = 0;

    constructor() {
        claimer = msg.sender;
    }

    function isValidSignature(bytes calldata signature)
        public
        view
        returns (bool)
    {
        return CAT.toEthSignedMessageHash().recover(signature) == claimer;
    }

    function claimGift(bytes calldata signature) external {
        require(
            isValidSignature(signature),
            "SignatureChecker: Invalid Signature"
        );

        giftsClaimed++;
    }
}
