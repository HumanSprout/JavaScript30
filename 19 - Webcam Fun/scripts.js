const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const inputs = document.querySelectorAll('.rgb input');

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let img = ctx.getImageData(0, 0, width, height);
    //img.data = redEffect(img.data);
    //img.data = rgbSplit(img.data);
    //ctx.globalAlpha = 0.1;
    img.data = greenScreen(img.data);
    ctx.putImageData(img, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'filename');
  link.innerHTML = `<img src=${data} alt='webcam capture' />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = pixels[i] + 100;
    pixels[i + 1] = pixels[i + 1] - 50;
    pixels[i + 2] = pixels[i + 2] * 0.5;
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i - 150] = pixels[i];
    pixels[i + 500] = pixels[i + 1];
    pixels[i - 550] = pixels[i + 2];
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  inputs.forEach(input => {
    levels[input.name] = input.value;
  })

  for (i = 0; i < pixels.length; i = i + 4) {
    red = pixels[i + 0];
    green = pixels[i + 1];
    blue = pixels[i + 2];
    alpha = pixels[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      console.log('found one')
      pixels[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
