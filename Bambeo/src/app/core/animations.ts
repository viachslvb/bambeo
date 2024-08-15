import { trigger, state, style, transition, animate, query, animateChild, group, keyframes } from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  state('void', style({ opacity: 0.5 })),
  transition('void => *', [
    animate('0.2s ease-out', keyframes([
      style({ opacity: 0.5, offset: 0 }),
      style({ opacity: 0.75, offset: 0.5 }),
      style({ opacity: 1, offset: 1 })
    ]))
  ])
]);

export const fadeOutAnimation = trigger('fadeOut', [
  state('*', style({ opacity: 1 })),
  state('void', style({ opacity: 0 })),
  transition(':leave', [
    animate('0.30s ease-out')
  ])
]);

export const fadeInOutAnimation = trigger('fadeInOut', [
  state('void', style({ opacity: 0 })),
  transition('void => *', [
    animate('0.20s ease-in')
  ]),
  transition('* => void', [
    animate('0.20s ease-out')
  ])
]);