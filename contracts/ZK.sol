//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface IVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input // publicSignals
    ) external view returns (bool r);
}

contract ZK {
  string greeting = "hello world";
  uint256 public answer = 1770;

  IVerifier public verifier;

  constructor (IVerifier _verifier) {
    verifier = _verifier;
  }

  function greet() public view returns (string memory) {
    return greeting;
  }

  function _setGreeting(string memory _greeting) internal {
    greeting = _greeting;
  }

  function process(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[1] memory publicSignals) public {
    require(isAnswer(publicSignals[0]), "incorrect answer");
    require(verifier.verifyProof(a, b, c, publicSignals), "invalid");

    _setGreeting("answer to the ultimate question of life, the universe, and everything");
  }

  function isAnswer(uint256 _answer) public view returns(bool) {
    return answer == _answer;
  }
}