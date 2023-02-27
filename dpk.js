const crypto = require("crypto");

const createHash = (input) => {
  return crypto.createHash("sha3-512").update(input).digest("hex");
}

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;

  let candidate = TRIVIAL_PARTITION_KEY;

  if (event) {
    candidate = event?.partitionKey || createHash(JSON.stringify(event))

    if (typeof candidate !== "string") {
      candidate = JSON.stringify(candidate);
    }

    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
      candidate = createHash(candidate);
    }
  }

  return candidate;
};