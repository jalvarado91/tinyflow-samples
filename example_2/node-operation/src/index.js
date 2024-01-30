const redis = require("redis")
// import { createClient } from 'redis';
const createClient = redis.createClient;

const redisUrl = process.env.REDIS_CONNECTION_URL ?? "noconnectionurlread"
const runId = process.env.RUN_ID ?? ""
const operation = process.env.OPERATION ?? "SUM"
const input_a_k = process.env.INPUT_A ?? "0"
const input_b_k = process.env.INPUT_B ?? "0"
const result_loc = process.env.RES_LOC ?? "RES"


async function run() {
  const client = await createClient({
    url: redisUrl
  })
    .on('error', err => console.error('Redis Client Error', err))
    .connect();

  const input_a = await client.get(`${runId}.${input_a_k}`);
  const input_b = await client.get(`${runId}.${input_b_k}`)

  let res = 0
  switch (operation) {
    case "SUM":
      res = input_a + input_b
      break
    case "SUB":
      res = input_a - input_b
      break
    case "MULT":
      res = input_a * input_b
      break
    default:
      throw new Error(`Operation ${operation} not supported. Must be "SUM | "SUB" | "MULT"`)
  }

  const resK = `${runId}.${result_loc}`
  await client.set(resK, res);

  await client.disconnect();
}

run()
  .then(() => console.log("Finished successully"))
  .catch((err) => {
    console.error(err.Error)
    process.exitCode = 1
  })