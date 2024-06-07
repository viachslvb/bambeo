import { Renderer2 } from "@angular/core";

export function isIphoneSafari(): boolean {
  const ua = window.navigator.userAgent;
  const isIphone = /iPhone/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua);
  return isIphone && isSafari;
}

export function isIphone(): boolean {
  const ua = window.navigator.userAgent;
  const isIphone = /iPhone/.test(ua);
  return isIphone;
}

export function setViewportMetaTag() {
  let viewportMetaTag = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;

  if (!viewportMetaTag) {
    viewportMetaTag = document.createElement('meta');
    viewportMetaTag.name = 'viewport';
    document.head.appendChild(viewportMetaTag);
  }

  viewportMetaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1';
}

export function preventDoubleTapZoom(renderer: Renderer2) {
  let lastTouchEnd = 0;

  renderer.listen('document', 'touchend', (event) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  });
}

export function scrollToTop() {
  setTimeout(() => {
    window.scroll({ top: -1, left: 0, behavior: "smooth" });
  }, 10);
}