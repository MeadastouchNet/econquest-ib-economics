import { h } from './ui.js';
import { icon } from './icons.js';
import { APP } from './config.js';
import { stopSpeaking } from './audio.js';
import * as store from './store.js';

const media = {
  class: 'trailer', src: 'promo/econquest-trailer.mp4',
  poster: 'promo/trailer-poster.jpg', controls: true, playsinline: true,
  'aria-label': 'EconQuest: 30-second introduction'
};

// Remember dismissal in the same device-local settings as the learning app.
export function trailerIntro() {
  if (store.get().settings.trailerSeen || document.querySelector('dialog.trailer-intro')) return;
  stopSpeaking();
  const opener = document.activeElement;
  const video = h('video', { ...media, preload: 'metadata' });
  const sound = h('button', {
    type: 'button', class: 'btn big trailer-sound', hidden: true,
    onclick: () => {
      video.muted = false;
      sound.hidden = true;
      video.play().catch(() => { /* Native controls remain available. */ });
    }
  }, icon('volume-2'), 'Tap for sound');
  const close = h('button', {
    type: 'button', class: 'btn ghost trailer-close', 'aria-label': 'Close the trailer',
    onclick: () => dialog.close()
  }, icon('x'), 'Close');
  const dialog = h('dialog', { class: 'trailer-intro', 'aria-label': `${APP.name} trailer` },
    close, h('div', { class: 'trailer-wrap' }, video, sound));
  dialog.addEventListener('close', () => {
    video.pause();
    store.setSetting('trailerSeen', true);
    dialog.remove();
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  // Only clicks outside the dialog's contents dismiss it; video controls do not.
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  video.addEventListener('volumechange', () => { sound.hidden = !video.muted; });
  document.body.append(dialog);
  dialog.showModal();
  close.focus();
  // Try the narration first; muted playback is allowed on a fresh browser visit.
  video.play().catch(() => {
    if (!dialog.open) return;
    video.muted = true;
    sound.hidden = false;
    video.play().catch(() => { /* Native play controls also handle blocked autoplay. */ });
  });
}

export function trailerView(app) {
  app.replaceChildren(
    h('a', { href: '#/', class: 'muted small' }, '← Home'),
    h('h1', { style: 'margin-top:6px' }, 'The trailer'),
    h('p', { class: 'muted' }, `30 seconds of ${APP.name}: explore, practise and understand.`),
    h('video', { ...media, preload: 'none' })
  );
}
