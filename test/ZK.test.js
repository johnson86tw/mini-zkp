const { expect } = require("chai");
const { groth16 } = require("snarkjs");
const path = require("path");
const { unstringifyBigInts } = require("../utils/circuit");

const wasmPath = path.join(__dirname, "../build/circuits/circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits/circuit_final.zkey");

let Verifier;
let ZK;

let verifier;
let zk;

before(async () => {
  Verifier = await ethers.getContractFactory("Verifier");
  ZK = await ethers.getContractFactory("ZK");
});

beforeEach(async () => {
  verifier = await Verifier.deploy();
  await verifier.deployed();

  zk = await ZK.deploy(verifier.address);
  await zk.deployed();
});

describe("ZK", function () {
  it("should process", async () => {
    const secret = 42;
    const input = { secret };
    const output = secret * secret + 6;
    const publicSignals = [BigInt(output)];

    let { proof } = await groth16.fullProve(input, wasmPath, zkeyPath);
    const calldata = await groth16.exportSolidityCallData(unstringifyBigInts(proof), publicSignals);
    const args = JSON.parse("[" + calldata + "]");

    await zk.process(...args);
    expect(await zk.greet()).to.equal(
      "answer to the ultimate question of life, the universe, and everything",
    );
  });

  it("should be invalid when secret not equal to 42", async () => {
    const secret = 42;
    for (let i = 40; i < 45; i++) {
      if (i === secret) continue;

      const input = { secret: i };
      const output = secret * secret + 6;
      const publicSignals = [BigInt(output)];

      let { proof } = await groth16.fullProve(input, wasmPath, zkeyPath);
      const calldata = await groth16.exportSolidityCallData(unstringifyBigInts(proof), publicSignals);
      const args = JSON.parse("[" + calldata + "]");

      await expect(zk.process(...args)).to.revertedWith("invalid");
    }
  });

  it("should be incorrect answer even though proof is verified", async () => {
    const secret = 40;
    const input = { secret };

    let { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);
    const calldata = await groth16.exportSolidityCallData(
      unstringifyBigInts(proof),
      unstringifyBigInts(publicSignals),
    );
    const args = JSON.parse("[" + calldata + "]");

    await expect(zk.process(...args)).to.be.revertedWith("incorrect answer");
  });
});
