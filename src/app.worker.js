export async function init(i) {
  return new Promise(async (resolve) => {
    await importScripts("https://raw.githubusercontent.com/vujable/react-ffmpeg/master/ffmpeg.js");
    console.log("Worker #", i, " : Initialized");
    resolve({ worker: i });
  });
}

function readFileAsBufferArray(file) {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    fileReader.onload = function () {
      resolve(this.result);
    };
    fileReader.onerror = function () {
      reject(this.error);
    };
    fileReader.readAsArrayBuffer(file);
  });
}
//"-ss 00:00:00 -t 00:00:01 -vcodec libx264 -vf scale=1920x1080 -b 1500k -r 30 -strict -2 test.mp4",
export async function process(i, file) {
  return new Promise(async (resolve) => {
    console.log("Worker #", i, " : processing");
    const arrayBuffer = await readFileAsBufferArray(file);
    const filename = `video-${Date.now()}.webm`;
    const inputCommand = `-i ${filename} -ss 00:00:00 -t 00:00:01 -vcodec libx264 -vf scale=1920x1080 -b 1500k -r 30 -strict -2 test.mp4`;
    const Module = {
      print: (text) => {},
      printErr: (text) => {},
      files: [
        {
          data: new Uint8Array(arrayBuffer),
          name: filename,
        },
      ],
      arguments: inputCommand.split(" "),
      TOTAL_MEMORY: 200000000,
    };
    const time = Date.now();
    const result = ffmpeg_run(Module);
    const totalTime = Date.now() - time;
    console.log(
      "Worker #",
      i,
      " : Finished processing (took " + totalTime + "ms)"
    );
    resolve({ worker: i, result: result });
  });
}
