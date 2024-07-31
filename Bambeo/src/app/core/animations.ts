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

export const slideInAnimation = trigger('routeAnimations', [
  transition('ProductsComponent => ProductDetailComponent, FavoritesComponent => ProductDetailComponent, AccountInfoComponent => AccountSettingsComponent', [
    query(':enter, :leave',
      style({ position: 'fixed',  width: '100%' }),
      { optional: true }),
    group([
      query(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s ease-in-out',
        style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.3s ease-in-out',
        style({ transform: 'translateX(-100%)' }))
        ], { optional: true }),
      ])
    ]),
  transition('ProductDetailComponent => ProductsComponent, ProductDetailComponent => FavoritesComponent, AccountSettingsComponent => AccountInfoComponent', [
    query(':enter, :leave',
      style({ position: 'fixed', width: '100%' }),
      { optional: true }),
    group([
        query(':enter', [
          style({ transform: 'translateX(-100%)' }),
          animate('0.3s ease-in-out',
          style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate('0.3s ease-in-out',
          style({ transform: 'translateX(100%)' }))
        ], { optional: true }),
    ])
  ])
]);