console.log('OK :)');

// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext2 = new AudioContext();
const struct = {

};

const addAudioToStruct = (src) => {
  const audio = new Audio(src);
  audio.onended = () => {
    for (const instance of struct[src].instances) {
      if (instance.audio === audio) {
        console.log('found');
        instance.playing = false;
        // TODO instead of playing : status = PLAYING | ENDED | PAUSED
      }
    }
  };
  const track = audioContext2.createMediaElementSource(audio);
  track.connect(audioContext2.destination);

  const instance = {
    playing: false,
    audio: audio,
  };

  struct[src].instances.push(instance);
  return instance;
};

const load = (src) => {
  if (src in struct) {
    return struct[src];
  }

  struct[src] = {
    instances: [],
  };

  const instance = addAudioToStruct(src);

  return struct[src];
};

const play = (src) => {
  if (audioContext2.state === 'suspended') {
    console.log('resume');
    audioContext2.resume();
  }

  for (const instance of struct[src].instances) {
    if (instance.playing === false) {
      instance.playing = true;
      instance.audio.play();
      return;
    }
  }

  const instance = addAudioToStruct(src);
  instance.playing = true;
  instance.audio.play();
};

// const file = "../../res/computerNoise_000.ogg";
const file = "../../res/lowFrequency_explosion_000.ogg";

load(file);

document.getElementById('toto').onclick = () => {
  console.log('clicked');
  play(file);
  console.log(struct[file].instances.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.playing ? 1 : 0)
  }, 0), struct[file].instances.length);
};



/*
Perfect API ?
smth like that :

const levelAudio = AudioManager()
const BoomPlayer = levelAudio.load('boom')
const BoomAudio = BoomPlayer.play(loop=True, volume=4)
BoomPlayer.play()
BoomPlayer.play()

// TODO resume, volume, stop, ...
onPause = () => {
  levelAudio.pauseAll();
}

*/



/*const struct = {};

const loadAudio = (src) => {
  // if not in struct
  struct[src] = {
    loaded: false,
    instances: [],
  };
  const audio = new Audio(src);

  audio.onPlayThrough = (e) => { // TODO onFinishedLoading ? :(
    console.log(src, 'PLAYTHROUGH', e, e.target);
    struct[src].loaded = true;
    struct[src].instances.push(audio);
  };
  return audio;
};



//const audio1 = loadAudio("../res/computerNoise_000.ogg");
const audio1 = new Audio("../res/computerNoise_000.ogg");
const audio2 = new Audio("../res/doorClose_000.ogg");
const audio3 = new Audio("../res/engineCircular_000.ogg");
const audio4 = new Audio("../res/explosionCrunch_000.ogg");

// setTimeout(() => audio1.play(), 1000);


audio1.addEventListener('playthrough', (e) => {
  console.log('LOADED DATA', e);
  console.log(e.target);

  audio1.play();
  setTimeout(() => {
    audio1.load();
  }, 1000);
  // The duration variable now holds the duration (in seconds) of the audio clip
});
*/

