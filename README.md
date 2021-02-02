# React FFMPEG 🎬

#### Installation

```js
npm install react-ffmpeg

//or

yarn add react-ffmpeg
```

#### Usage

To remove metadata location and author:

```js
import React, { Component } from "react";
import FFMPEG from "react-ffmpeg";

class App extends Component {
  async onFileChange(e) {
    const file = e.target.files[0];
    await FFMPEG.process(
      file,
      '-metadata location="" -metadata location-eng="" -metadata author="" -c:v copy -c:a copy',
      function (e) {
        const video = e.result;
        console.log(video);
      }.bind(this)
    );
  }

  render() {
    return (
      <input
        type="file"
        accept="audio/*,video/*"
        onChange={this.onFileChange}
      />
    );
  }
}

export default App;
```

## Roadmap 📈
