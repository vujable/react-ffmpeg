import worker from "./app.worker";
import packageJson from "../package.json";

let workers = [];
let config = {
  amount: 6,
};

export default class Compress {
  static async init(_config, callback) {
    let count = 0;
    config = { ...config, ..._config };
    console.log("Compress Config: ", config);
    const onReady = () => {
      count++;
      if (count === config.amount) {
        if (callback) {
          callback();
        }
      }
    };
    for (let i = 0; i < config.amount; i++) {
      workers.push(await worker());
      workers[i].init(i).then(onReady);
    }
  }

  static async process(file, command, callback) {
    let count = 0;
    const onProcess = (payload) => {
      count++;
      console.log(
        "process #",
        payload.worker,
        " completed ",
        `(${count}/${config.amount})`,
        " result = ",
        payload.result
      );
      if (count === config.amount) {
        if (callback) {
          callback();
        }
      }
    };
    for (let i = 0; i < config.amount; i++) {
      workers[i].process(i, file, command).then(onProcess);
    }
  }
}
Compress.version = packageJson.version;
