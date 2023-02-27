const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

const createHash = (input) => {
  return crypto.createHash("sha3-512").update(input).digest("hex");
}

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the hash of the event when it's empty", () => {
    const event = {}
    const currentKey = deterministicPartitionKey(event);

    expect(currentKey).toBe(createHash(JSON.stringify(event)));
  });

  it("Returns the hash of the event when the partitionKey is empty string", () => {
    const event = {
      "partitionKey": ""
    }

    const currentKey = deterministicPartitionKey(event);
    expect(currentKey).toBe(createHash(JSON.stringify(event)));
  });

  it("Returns the the partitionKey value if it's not empty", () => {
    const event = {
      "partitionKey": 1234
    }

    const currentKey = deterministicPartitionKey(event);
    expect(currentKey).toBe("1234");
  });

  it("it should only return partitionKey if its length does not exceed 256", () => {
    const event = {
      "partitionKey": "Only-256-ca2c70bc13298c5109ee0cb342d014906e6365249005fd4beee6f01aee44edb531231e98b50bf6810de6cf687882b09320fdd5f6375d1f2debd966fbf8d03efaca2c70bc13298c5109ee0cb342d014906e6365249005fd4beee6f01aee44edb531231e98b50bf6810de6cf687882b09320fdd5f6375d1f2debd966f"
    }

    const currentKey = deterministicPartitionKey(event);
    expect(currentKey).toBe(event.partitionKey)
    expect(currentKey.length).toBe(256);
  });

  it("it should not return a key of length more than 256 if the partitionKey exceeds that length", () => {
    const event = {
      "partitionKey": "More-than-256-ca2c70bc13298c5109ee0cb342d014906e6365249005fd4beee6f01aee44edb531231e98b50bf6810de6cf687882b09320fdd5f6375d1f2debd966fbf8d03efaca2c70bc13298c5109ee0cb342d014906e6365249005fd4beee6f01aee44edb531231e98b50bf6810de6cf687882b09320fdd5f6375d1f2debd966fbf8d03efa"
    }

    const currentKey = deterministicPartitionKey(event);
    expect(currentKey.length).toBeLessThan(257);
  });
});