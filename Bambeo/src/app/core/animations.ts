import { trigger, state, style, transition, animate, query, animateChild, group } from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  state('void', style({ opacity: 0 })),
  transition('void => *', [
    animate('0.15s ease-in')
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