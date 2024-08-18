import { Component } from '@angular/core';
import { fadeOutAnimation } from '../../animations';

const COOKIE_CONSENT_VERSION = '1.1';

@Component({
  selector: 'app-cookie-notice',
  templateUrl: './cookie-notice.component.html',
  styleUrls: ['./cookie-notice.component.css'],
  animations: [fadeOutAnimation]
})
export class CookieNoticeComponent {
  showNotice: boolean = true;

  constructor() {
    this.checkCookieConsent();
  }

  checkCookieConsent() {
    const consent = localStorage.getItem('cookie-consent');
    const consentVersion = localStorage.getItem('cookie-consent-version');

    if (consent === 'true' && consentVersion === COOKIE_CONSENT_VERSION) {
      this.showNotice = false;
    }
  }

  acceptCookies() {
    localStorage.setItem('cookie-consent', 'true');
    localStorage.setItem('cookie-consent-version', COOKIE_CONSENT_VERSION);
    this.showNotice = false;
  }
}
