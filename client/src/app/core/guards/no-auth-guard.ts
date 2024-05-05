import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Observable, filter, map, switchMap, take } from "rxjs";
import { AuthService } from "../services/auth.service";

export const NoAuthGuard: CanActivateFn = (): Observable<boolean> => {
    const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService);

    return authService.authCheckCompleted$.pipe(
      filter(value => value),
      take(1),
      switchMap(() => {
        return authService.isAuthenticated$;
      }),
      map(isAuthenticated => {
        if (isAuthenticated) {
          router.navigate(['/user']);
          return false;
        }
        return true;
      })
    );
}