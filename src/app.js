import worker from "./app.worker";
import packageJson from "../package.json";

let workers = [];
let config = {
  amount: 1,
};

export default class FFMPEG {
  static async init(_config, callback) {
    let count = 0;
    config = { ...config, ..._config };
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
          callback(payload);
        }
      }
    };
    for (let i = 0; i < config.amount; i++) {
      workers[i].process(i, file, command).then(onProcess);
    }
  }
}
FFMPEG.version = packageJson.version;
