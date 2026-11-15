const INSTALLED_KEY = 'pipo_app_installed';
const PROMPT_SESSION_KEY = 'pipo_install_prompt_seen';

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  if (localStorage.getItem(INSTALLED_KEY) === '1') return true;
  const standalone = window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return standalone || iosStandalone;
}

export function markAppInstalled() {
  localStorage.setItem(INSTALLED_KEY, '1');
  deferredPrompt = null;
  notify();
}

export function hasDeferredInstallPrompt() {
  return Boolean(deferredPrompt);
}

export function getDeferredInstallPrompt() {
  return deferredPrompt;
}

/** Show once per browser session after login, until installed. */
export function shouldShowInstallPopup(): boolean {
  if (isAppInstalled()) return false;
  if (sessionStorage.getItem(PROMPT_SESSION_KEY) === '1') return false;
  return true;
}

export function markInstallPopupSeenThisSession() {
  sessionStorage.setItem(PROMPT_SESSION_KEY, '1');
}

/** Call on logout so the next login can show the popup again. */
export function resetInstallPopupForNextLogin() {
  sessionStorage.removeItem(PROMPT_SESSION_KEY);
}

export function subscribeInstallPrompt(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function initInstallPromptCapture() {
  if (typeof window === 'undefined') return () => undefined;

  const onBeforeInstall = (event: Event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  };

  const onInstalled = () => {
    markAppInstalled();
  };

  window.addEventListener('beforeinstallprompt', onBeforeInstall);
  window.addEventListener('appinstalled', onInstalled);

  if (isAppInstalled()) {
    localStorage.setItem(INSTALLED_KEY, '1');
  }

  return () => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    window.removeEventListener('appinstalled', onInstalled);
  };
}

export async function promptInstallApp(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (isAppInstalled()) return 'accepted';
  const promptEvent = deferredPrompt;
  if (!promptEvent) return 'unavailable';
  await promptEvent.prompt();
  const choice = await promptEvent.userChoice;
  if (choice.outcome === 'accepted') {
    markAppInstalled();
  }
  deferredPrompt = null;
  notify();
  return choice.outcome;
}

export function isIosDevice() {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
