// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./IProofOfHumanity.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyProofOfHumanity is IProofOfHumanity, ERC20  {

    address _governor;

    mapping(address => bool) _registrants;
    /** @dev Constructor.
     */
    constructor(address governor) ERC20("Universal Basic Income", "UBI") {
        _governor = governor;
    }
    //constructor(IProofOfHumanity _PoH) virtual;
    
    /** @dev Changes the address of the the governor.
     *  @param governor The address of the new governor.
     */
    function changeGovernor(address governor) external { _governor = governor; }
    

    /** @dev Returns true if the submission is registered and not expired.
     *  @param submissionID The address of the submission.
     *  @return Whether the submission is registered or not.
     */
    function isRegistered(address submissionID) public override view returns (bool) {
        return _registrants[submissionID];
    }

    function register(address submissionID) public {
        // Dummy contracts assigns free ERC20
        _mint(submissionID, 100*10**18);
        _registrants[submissionID] = true;
    }

    function submissionCounter() external override view returns(uint) { return 0; } 

    // // /** @dev Returns the balance of a particular submission of the ProofOfHumanity contract.
    // //  *  Note that this function takes the expiration date into account.
    // //  *  @param _submissionID The address of the submission.
    // //  *  @return The balance of the submission.
    // //  */
    // function balanceOf(address _submissionID) external override view returns (uint256) {
    //     return _poh.balanceOf(_submissionID);
    // }

    // // /** @dev Returns the count of all submissions that made a registration request at some point, including those that were added manually.
    // //  *  Note that with the current implementation of ProofOfHumanity it'd be very costly to count only the submissions that are currently registered.
    // //  *  @return The total count of submissions.
    // //  */
    // function totalSupply() external override  view returns (uint256) {
    //     return _poh.totalSupply();
    // }

    // function transfer(address _recipient, uint256 _amount) external override returns (bool) { return _poh.transfer(_recipient, _amount); }

    // function allowance(address _owner, address _spender) external override view returns (uint256) { return _poh.allowance(_owner, _spender); }

    // function approve(address _spender, uint256 _amount) external override returns (bool) { return _poh.approve(_spender, _amount); }

    // function transferFrom(address _sender, address _recipient, uint256 _amount) external override returns (bool) { return _poh.transferFrom(_sender, _recipient, _amount); }
}