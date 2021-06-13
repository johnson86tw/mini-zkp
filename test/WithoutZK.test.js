const { expect } = require("chai");

let WithoutZK;
let withoutZK;

before(async () => {
  WithoutZK = await ethers.getContractFactory("WithoutZK");
});

beforeEach(async () => {
  withoutZK = await WithoutZK.deploy();
  await withoutZK.deployed();
});

describe("WithoutZK", function () {
  it("should process", async () => {
    const secret = 42;
    await withoutZK.process(secret);
    expect(await withoutZK.greet()).to.equal(
      "answer to the ultimate question of life, the universe, and everything",
    );
  });

  it("should be invalid when secret not equal to 42", async () => {
    const secret = 42;
    for (let i = 0; i < 100; i++) {
      if (i === secret) continue;
      await expect(withoutZK.process(i)).to.revertedWith("invalid");
    }
  });
});
