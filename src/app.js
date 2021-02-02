import worker from "./app.worker";
import packageJson from "../package.json";

let workers = [];

export default class FFMPEG {
  static async process(file, command, callback) {
    const onProcess = (payload) => {
      if (callback) {
        callback(payload);
      }
    };
    const ready_worker = workers.findIndex((x) => x.ready);
    if (ready_worker > -1) {
      workers[ready_worker]
        .process(ready_worker, file, command)
        .then(onProcess);
    } else {
      const new_worker = workers.push(await worker());
      workers[new_worker - 1]
        .process(ready_worker, file, command)
        .then(onProcess);
    }
  }
}
FFMPEG.version = packageJson.version;
