// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IUBI.sol";

contract DummyUBI is ERC20, IUBI  {

    constructor() ERC20("Universal Basic Income", "UBI") {

    }

    function mint(address dest, uint256 amount) public override {
        _mint(dest, amount);
    }

    function burn(address from, uint256 amount) public override {
        _burn(from, amount);
    }

    function startAccruing(address _human) external override {    
        // TODO: implement basic logic of accruing dummy UBIs
    }
}