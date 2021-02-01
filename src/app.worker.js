export async function init(i) {
  return new Promise(async (resolve) => {
    await importScripts("https://dev.nullion.com/ffmpeg.js");
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
export async function process(i, file, command) {
  return new Promise(async (resolve) => {
    const arrayBuffer = await readFileAsBufferArray(file);
    const filename = `video-${Date.now()}.webm`;
    const inputCommand = `-i ${filename} ${command} ${file.name}`;
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
      TOTAL_MEMORY: 20000000,
    };
    const time = Date.now();
    const result = await ffmpeg_run(Module);
    const video = result[0];
    var arrayBufferView = new Uint8Array(video.data);
    var blob = new Blob([arrayBufferView], {
      type: file.type,
    });
    resolve({
      worker: i,
      result: new File([blob], video.name, { type: file.type }),
    });
  });
}
