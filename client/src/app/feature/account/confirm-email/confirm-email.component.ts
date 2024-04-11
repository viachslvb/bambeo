import { Component } from '@angular/core';
import { UserService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiErrorCode } from 'src/app/core/models/api/apiErrorCode';
import { ConfirmEmailModel } from 'src/app/core/models/api/requests/confirmEmailModel';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})

export class ConfirmEmailComponent {
  title = "Potwierdzenie adresu e-mail...";
  isLoading = false;
  isError = false;
  errorMessage?: string;
  countdown = 30;

  constructor(private userService: UserService, private router: Router, 
    private route: ActivatedRoute, private toastService: MessageService) {
      const userId = this.route.snapshot.queryParams['userId'];
      const token = this.route.snapshot.queryParams['token'];

      if (userId && token) {
        this.confirmEmail(userId, token);
      } else {
        this.router.navigateByUrl('/');
      }
  }

  confirmEmail(userId: string, token: string) {
    this.isLoading = true;

    const ConfirmEmailData: ConfirmEmailModel = {
      userId: userId,
      token: token
    };

    this.userService.confirmEmail(ConfirmEmailData).subscribe({
      next: () => {
        this.isLoading = false;

        this.toastService.add({ 
          severity: 'success', 
          life: 10000,
          summary: 'E-mail potwierdzony',
          detail: 'Twój adres e-mail został pomyślnie zweryfikowany.'
        });

        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.isLoading = false;

        this.title = error.type === ApiErrorCode.EmailAlreadyConfirmed 
            ? "Twój e-mail jest już potwierdzony" 
            : 'Nie Udało Się :(';

        this.isError = error.type !== ApiErrorCode.EmailAlreadyConfirmed;

        if (error.displayMessage) {
          this.errorMessage = error.message;
        }
        else {
          this.router.navigateByUrl('/');
        }
      }
    });
  }
}
