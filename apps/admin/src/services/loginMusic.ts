const MUSIC_SRC = '/audio/pipo-bee-login.mp3';

let player: HTMLAudioElement | null = null;

export function playLoginMusic() {
  stopLoginMusic();
  const audio = new Audio(MUSIC_SRC);
  audio.preload = 'auto';
  audio.volume = 0.7;
  audio.play().catch(() => {
    // Browsers may block autoplay if login was not a direct click.
  });
  player = audio;
}

export function stopLoginMusic() {
  if (!player) return;
  player.pause();
  player.currentTime = 0;
  player = null;
}

export function isLoginMusicPlaying() {
  return Boolean(player && !player.paused);
}
