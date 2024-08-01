import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { Observable, filter, map, switchMap, take } from "rxjs";
import { AuthService } from "../state/auth.service";
import { MessageService } from "primeng/api";

export const AuthGuard: CanActivateFn = (): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService);
    const toastService: MessageService = inject(MessageService);

    return authService.authCheckCompleted$.pipe(
      filter(value => value),
      take(1),
      switchMap(() => {
        return authService.isAuthenticated$;
      }),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          toastService.add({
            severity: 'warn',
            life: 10000,
            summary: 'Wymagana autoryzacja',
            detail: 'Ta sekcja jest dostępna tylko dla zalogowanych użytkowników. Proszę, zaloguj się, aby kontynuować.'
          });

          router.navigate(['/account/login']);
          return false;
        }
        return true;
      })
    );
}