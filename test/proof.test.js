const { expect } = require("chai");
const { groth16 } = require("snarkjs");
const path = require("path");

const wasmPath = path.join(__dirname, "../build/circuits/circuit.wasm");
const zkeyPath = path.join(__dirname, "../build/circuits/circuit_final.zkey");
const vkeyPath = path.join(__dirname, "../build/circuits/verification_key.json");
const vkey = require(vkeyPath);

describe("proof", function () {
  it("should generate expected output", async () => {
    const secret = 24;
    const input = { secret };
    const output = secret * secret + 6;

    let { publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);
    expect(publicSignals[0]).to.equal(BigInt(output).toString());
  });

  it("should be verified", async () => {
    const secret = 16;
    const input = { secret };
    const output = secret * secret + 6;

    let { proof } = await groth16.fullProve(input, wasmPath, zkeyPath);
    const isValid = await groth16.verify(vkey, [output.toString()], proof);
    expect(isValid).to.equal(true);
  });
});
