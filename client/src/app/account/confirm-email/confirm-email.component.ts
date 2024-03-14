import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})

export class ConfirmEmailComponent {
  title = "Potwierdzenie adresu email...";
  redirectMessage = "";
  isLoading = false;
  errorMessage?: string;
  countdown = 10;

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
    this.userService.confirmEmail(userId, token).subscribe({
      next: () => {
        this.isLoading = false;

        this.toastService.add({ 
          severity: 'success', 
          life: 10000,
          summary: 'Email Zweryfikowany',
          detail: 'Twój adres email został pomyślnie potwierdzony.'
        });

        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.isLoading = false;

        this.title = "Nie udało się :(";
        if (error.displayMessage) {
          this.errorMessage = error.message;
        }

        this.startCountdownAndRedirect();
      }
    });
  }

  startCountdownAndRedirect() {
    this.redirectMessage = `Zostaniesz przekierowany za ${this.countdown} sekund.`;
    const interval = setInterval(() => {
      this.countdown--;
      this.redirectMessage = `Zostaniesz przekierowany za ${this.countdown} sekund.`;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.router.navigateByUrl('/');
      }
    }, 1000);
  }
}
