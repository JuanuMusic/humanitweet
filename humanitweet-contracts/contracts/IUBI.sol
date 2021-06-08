// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
interface IUBI is IERC20 {
    function mint(address dest, uint256 amount) external virtual;

    function burn(address from, uint256 amount) external virtual;
}