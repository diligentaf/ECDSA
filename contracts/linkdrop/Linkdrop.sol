// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @dev Elliptic Curve Digital Signature Algorithm (ECDSA) operations.
 *
 * These functions can be used to verify that a message was signed by the holder
 * of the private keys of a given address.
 */
library ECDSA {
    /**
     * @dev Returns the address that signed a hashed message (`hash`) with
     * `signature`. This address can then be used for verification purposes.
     *
     * The `ecrecover` EVM opcode allows for malleable (non-unique) signatures:
     * this function rejects them by requiring the `s` value to be in the lower
     * half order, and the `v` value to be either 27 or 28.
     *
     * (.note) This call _does not revert_ if the signature is invalid, or
     * if the signer is otherwise unable to be retrieved. In those scenarios,
     * the zero address is returned.
     *
     * (.warning) `hash` _must_ be the result of a hash operation for the
     * verification to be secure: it is possible to craft signatures that
     * recover to arbitrary addresses for non-hashed data. A safe way to ensure
     * this is by receiving a hash of the original message (which may otherwise)
     * be too long), and then calling `toEthSignedMessageHash` on it.
     */
    function recover(bytes32 hash, bytes memory signature)
        internal
        pure
        returns (address)
    {
        // Check the signature length
        if (signature.length != 65) {
            return (address(0));
        }

        // Divide the signature in r, s and v variables
        bytes32 r;
        bytes32 s;
        uint8 v;

        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        // solhint-disable-next-line no-inline-assembly
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (281): 0 < s < secp256k1n ÷ 2 + 1, and for v in (282): v ∈ {27, 28}. Most
        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
        //
        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
        // these malleable signatures as well.
        if (
            uint256(s) >
            0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0
        ) {
            return address(0);
        }

        if (v != 27 && v != 28) {
            return address(0);
        }

        // If the signature is valid (and not malleable), return the signer address
        return ecrecover(hash, v, r, s);
    }

    /**
     * @dev Returns an Ethereum Signed Message, created from a `hash`. This
     * replicates the behavior of the
     * [`eth_sign`](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign)
     * JSON-RPC method.
     *
     * See `recover`.
     */
    function toEthSignedMessageHash(bytes32 hash)
        internal
        pure
        returns (bytes32)
    {
        // 32 is the length in bytes of hash,
        // enforced by the type signature above
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }
}

contract Linkdrop {
    struct Link {
        string campaignID;
        uint256 id;
        uint256 balance;
        address pubwallet;
        bool taken;
    }

    bool public running;

    uint256 public startTime;

    uint256 public duration;

    uint256 public endTime;

    address public creator;

    address public validator;

    string public campaignID;

    mapping(uint256 => Link) public links;

    uint256 public linkCount;

    uint256 public cost;

    uint256 public num;

    uint256 public costPerNum;

    uint256 public generatedLinkCount;

    IERC20 public token;

    string public randomString;

    constructor(
        address _token
        // address _creator,
        // uint256 _cost,
        // uint256 _num,
        // string memory _campaignID,
        // uint256 _duration,
        // string memory _randomString
    ) public {
        token = IERC20(_token);
        // creator = _creator;
        // cost = _cost;
        // num = _num;
        // costPerNum = _cost / _num;
        // validator = msg.sender;
        // campaignID = _campaignID;
        // duration = _duration * 60 * 60 * 24;
        // startTime = block.timestamp;
        // endTime = startTime + duration;
        // running = true;
        // randomString = _randomString;
    }

    function createMultipleLinks() public {
        for (uint256 i = 0; i < num; i++) {
            addLink();
        }
    }

    function addLink() public {
        links[linkCount] = Link(
            campaignID,
            linkCount,
            costPerNum,
            address(0),
            false
        );
        linkCount++;
        cost -= costPerNum;
    }

    function get(uint256 id) public view returns (Link memory) {
        return links[id];
    }

    function fundContract(uint256 _fundingAmount) external {
        require(msg.sender == creator);
        token.transferFrom(msg.sender, address(this), _fundingAmount);
    }

    function airdrop(uint256 _id, uint256 _balance, address _user) public {
        require(msg.sender == validator);
        require(endTime > block.timestamp, "timestamp exceeds expiration date");
        require(links[_id].taken == false);
        require(links[_id].balance == _balance);
        require(running == true);
        token.transfer(_user, links[_id].balance);
        links[_id].taken = true;
        links[_id].balance = 0;
        links[_id].pubwallet = _user;
    }

    function pauseCampaign() public {
        require(msg.sender == creator);
        running = false;
    }

    function resumeCampaign() public {
        require(msg.sender == creator);
        running = true;
    }

    //   function getLink() public view returns (uint[] memory, string[] memory,uint[]
    //   memory){
    //       uint[]    memory id = new uint[](linkCount);
    //       string[]  memory name = new string[](linkCount);
    //       uint[]    memory balance = new uint[](linkCount);
    //       for (uint i = 0; i < linkCount; i++) {
    //           Link storage link = links[i];
    //           id[i] = link.id;
    //           name[i] = link.name;
    //           balance[i] = link.balance;
    //       }
    //       return (id, name,balance);
    //   }

    function getLinks() public view returns (Link[] memory){
        require(msg.sender == creator);
        Link[]    memory id = new Link[](linkCount);
        for (uint i = 0; i < linkCount; i++) {
            Link storage link = links[i];
            id[i] = link;
        }
        return id;
    }

    function verifyLinkdropSignerSignature(
        uint256 _id,
        address _tokenAddress,
        uint256 _tokenAmount,
        uint256 _expiration
    ) public view returns (bytes32) {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(
            keccak256(
                abi.encodePacked(
                    _id,
                    _tokenAddress,
                    _tokenAmount,
                    _expiration,
                    address(this)
                )
            )
        );

        // bytes32 pp = bytes32(bytes("0xe63d5ce5adaf41fd987d79bad07192fd2137831cb589624c34bcfbac59a3d957"));
        // require(pp == prefixedHash, "you suck");
        // address signer = ECDSA.recover(prefixedHash, _signature);
        // return isLinkdropSigner[signer];
        return prefixedHash;
    }

}
