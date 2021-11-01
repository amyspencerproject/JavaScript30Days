/* Get our elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = document.querySelectorAll('[data-skip]');
const range = document.querySelectorAll('.player__slider');

/* Build our functions */
function togglePlay () {
    if (video.paused) /* .paused intrinsic to video element */ {
        video.play();
    } else {
        video.pause();
    }
};

function updateButton () {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
};

function skip () {
    video.currentTime += parseFloat(this.dataset.skip);
};

function handleRangeUpdate () {
    video[this.name] = this.value;
};

function handleProgress () {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
};

function scrub (e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
};

/* Hook up our event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

video.addEventListener('timeupdate', handleProgress);


toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip));

range.forEach (range => range.addEventListener('change', handleRangeUpdate));
// range.forEach (range => range.addEventListener('mousemove', handleRangeUpdate));
//could add a flag here for only changing value when mouse is clicked down, similar to Canvas exercise

let mousedown = false;
progress.addEventListener ('click', scrub);

progress.addEventListener ('mousemove', (e) => mousedown && scrub(e))
progress.addEventListener ('mousedown', () => mousedown = true);
progress.addEventListener ('mouseup', () => mousedown = false);
