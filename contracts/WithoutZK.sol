//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;


contract WithoutZK {
  string greeting = "hello world";
  uint256 answer = 1770;

  function greet() public view returns (string memory) {
    return greeting;
  }

  function _setGreeting(string memory _greeting) internal {
    greeting = _greeting;
  }

  function process(uint256 _secret) public {
    require(verify(_secret), "invalid");
    _setGreeting("answer to the ultimate question of life, the universe, and everything");
  }

  function verify(uint256 _secret) public view returns(bool){
    if (calculate(_secret) == answer) {
      return true;
    }
    return false;
  }

  function calculate(uint256 _secret) public pure returns(uint256) {
    return _secret*_secret + 6;
  }
}
