const player = document.querySelector('div.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const fullScreen = player.querySelector('.fullScreen');

const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

const togglePlay = () => {
  if (video.paused) return video.play();
  video.pause();
};

function updateButton() {
  toggle.textContent = this.paused ? '►' : '❚ ❚';
}

function handleSkip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  let progressPercent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${progressPercent}%`;
}

function scrubProgress(e) {
  video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration;
}

function toggleFullScreen() {
  video.webkitRequestFullScreen();
}

video.addEventListener('click', togglePlay);
video.addEventListener('pause', updateButton);
video.addEventListener('play', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

ranges.forEach(range => {
  range.addEventListener('change', handleRangeUpdate);
});

skipButtons.forEach(btn => {
  btn.addEventListener('click', handleSkip);
});

progress.addEventListener('click', scrubProgress);

let progressMousedown = false;
progress.addEventListener('mousedown', () => (progressMousedown = true));
progress.addEventListener('mouseup', () => (progressMousedown = false));
progress.addEventListener(
  'mousemove',
  e => progressMousedown && scrubProgress(e)
);

fullScreen.addEventListener('click', toggleFullScreen);
