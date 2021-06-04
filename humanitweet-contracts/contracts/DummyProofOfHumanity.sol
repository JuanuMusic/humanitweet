// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./IProofOfHumanity.sol";

contract DummyProofOfHumanity is IProofOfHumanityProxy {

    address _governor;
    /** @dev Constructor.
     */
    constructor(address governor) {
        _governor = governor;
    }
    //constructor(IProofOfHumanity _PoH) virtual;

    /** @dev Changes the address of the the related ProofOfHumanity contract.
     *  @param _PoH The address of the new contract.
     */
    function changePoH(IProofOfHumanity _PoH) override external {}
    
    /** @dev Changes the address of the the governor.
     *  @param _governor The address of the new governor.
     */
    function changeGovernor(address _governor) override external {}
    

    /** @dev Returns true if the submission is registered and not expired.
     *  @param _submissionID The address of the submission.
     *  @return Whether the submission is registered or not.
     */
    function isRegistered(address _submissionID) override public view virtual returns (bool) {
        return _submissionID == _governor;
    }
}