import { trigger, state, style, transition, animate, query, animateChild, group, keyframes } from '@angular/animations';

export const fadeInAnimation = trigger('fadeIn', [
  /* state('void', style({ opacity: 0 })),
  transition('void => *', [
    animate('0.15s ease-in')
  ]), */
  state('void', style({ opacity: 0.5 })),
  transition('void => *', [
    animate('0.2s ease-out', keyframes([
      style({ opacity: 0.5, offset: 0 }),
      style({ opacity: 0.75, offset: 0.5 }),
      style({ opacity: 1, offset: 1 })
    ]))
  ])
  /* state('void', style({ opacity: 0.5, transform: 'scale(0.98)' })),
  transition('void => *', [
    animate('0.3s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ]) */
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