export let initialized = false;
export let ready = false;

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
    ready = false;
    if (!initialized) {
      await importScripts("ffmpeg.js");
      initialized = true;
    }
    const arrayBuffer = await readFileAsBufferArray(file);
    const type = file.type.split("/")[1]
    const filename = `video-${Date.now()}.webm`;
    const filename2 = `video-${Date.now()}.${type}`;
    const inputCommand = `-i ${filename} ${command} ${filename2}`;
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
      TOTAL_MEMORY: 2100000000,
    };
    const result = await ffmpeg_run(Module);
    const video = result[0];
    var arrayBufferView = new Uint8Array(video.data);
    var blob = new Blob([arrayBufferView], {
      type: file.type,
    });
    ready = true;
    resolve({
      worker: i,
      result: new File([blob], video.name, { type: file.type }),
    });
  });
}
