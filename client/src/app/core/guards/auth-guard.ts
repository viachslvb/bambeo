import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { Observable, filter, map, switchMap, take } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

export const AuthGuard: CanActivateFn = (): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService);

    return authService.authCheckCompleted$.pipe(
      filter(value => value),
      take(1),
      switchMap(() => {
        return authService.isAuthenticated$;
      }),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          router.navigate(['/account/login']);
          return false;
        }
        return true;
      })
    );
}