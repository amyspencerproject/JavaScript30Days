const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo () {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
        video.srcObject = localMediaStream;
        // video.src = window.URL.createObjectURL(localMediaStream); *This is an outdated method*
        video.play();
    })

    .catch(err => {
        console.error('Oh No!', err);
    });
};

function paintToCanvas () { //grabs a still shot of the video every 16 ms and put in canvas space
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0,0, width, height); 

        //take pixels out of canvas
        let pixels = ctx.getImageData(0,0,width, height);

        //mess with pixels
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        pixels = greenScreen(pixels);

        // ctx.globalAlpha = 0.8; //ghosting effect with alpha writing over the original image

        //put them back
        ctx.putImageData(pixels, 0, 0);
        
    }, 16); 
};

function takePhoto () {
    //plays photo snap audio
    snap.currentTime = 0;
    snap.play(); 

    //take the data out of canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="handsome user" />`
    strip.insertBefore(link, strip.firstChild)
};

function redEffect (pixels) { //loop over every single pixel using special loop for such large array
    for( let i = 0; i < pixels.data.length; i += 4) {
        pixels.data [i + 0] = pixels.data [i + 0] + 100; //red channel
        pixels.data [i + 1] = pixels.data [i + 1] -50;   //green
        pixels.data [i + 2] = pixels.data [i + 2] * .5;  //blue
    }
    return pixels;
};

function rgbSplit (pixels) {
    for( let i = 0; i < pixels.data.length; i += 4) {
        pixels.data [i - 150] = pixels.data [i + 0]; //red 
        pixels.data [i + 500] = pixels.data [i + 1]; //green
        pixels.data [i - 550] = pixels.data [i + 2];  //blue
    }
    return pixels;
};

function greenScreen(pixels) {
    const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // if any of the rgb are in the range then take it out!
      pixels.data[i + 3] = 0; //take it out by setting alpha to completely transparent
    }
  }

  return pixels; 
};

getVideo();

video.addEventListener('canplay', paintToCanvas); //canplay is from video playing