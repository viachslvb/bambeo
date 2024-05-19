import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { UserUpdateModel } from 'src/app/core/models/api/requests/userUpdateModel';
import { UserService } from 'src/app/core/state/user.service';
import { MyAccountService } from '../my-account.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/state/auth.service';
import { ApiErrorCode } from 'src/app/core/models/api/apiErrorCode';
import { Router } from '@angular/router';
import { NoWhitespaceValidator } from 'src/app/core/validators/whitespaces.validator';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('0.15s ease-in')
      ]),
    ])
  ]
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  accountInfoForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    displayName: new FormControl('', [Validators.required, NoWhitespaceValidator()])
  })

  passwordControl = new FormControl({ value: '••••••••', disabled: true });

  private accountInfoState: any;
  private loadingTimeout: any;
  isEmailVerified = false;
  dataLoaded = false;
  errors: string[] | null = null;
  deleteAccountErrorMessage?: string;
  showLoadingSpinner = false;

  // Data triggers
  isSendingConfirmationLink = false;
  confirmationLinkSent = false;
  isSavingInfo = false;
  isAccountInfoChanged = false;
  isSendingChangePasswordLink = false;
  changePasswordLinkSent = false;
  isDeletingAccount = false;
  accountIsDeleted = false;

  constructor(private myAccountService: MyAccountService, private userService: UserService,
    private confirmationService: ConfirmationService, private authService: AuthService,
    private router: Router, private toastService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAccountInfo();
  }

  private loadAccountInfo() {
    this.loadingTimeout = setTimeout(() => {
      this.showLoadingSpinner = true;
    }, 50);

    this.myAccountService.getUserInfo().subscribe({
      next: (accountInfo) => {
        clearTimeout(this.loadingTimeout);

        this.isEmailVerified = accountInfo.emailConfirmed;
        this.accountInfoForm.patchValue(accountInfo);
        this.accountInfoState = this.accountInfoForm.value;
        this.dataLoaded = true;
        this.trackChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackChanges() {
    this.accountInfoForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const isFormChanged = JSON.stringify(this.accountInfoState) !== JSON.stringify(this.accountInfoForm.value);
        this.accountInfoForm.markAsPristine();
        this.accountInfoForm.markAsUntouched();

        this.isAccountInfoChanged = isFormChanged;
        if (isFormChanged) {
          this.accountInfoForm.markAsDirty();
        }
      }
    );
  }

  saveAccountInfo() {
    if (this.accountInfoForm.valid) {
      this.isSavingInfo = true;
      this.myAccountService.updateUserInfo(this.accountInfoForm.value as UserUpdateModel).subscribe({
        next: (user) => {
          this.accountInfoForm.patchValue(user);
          this.accountInfoState = this.accountInfoForm.value;
          this.userService.setUser(user);
          this.isSavingInfo = false;
          this.accountInfoForm.markAsPristine();
          this.isAccountInfoChanged = false;
        },
        error: (error) => {
          if (error.displayMessage && error.errors) {
            this.errors = error.errors;
          }
          else {
            console.error(error);
          }
          this.isSavingInfo = false;
        }
      });
    }
    else {
      this.accountInfoForm.markAllAsTouched();
    }
  }

  sendVerificationEmail() {
    this.isSendingConfirmationLink = true;
    this.myAccountService.sendVerificationLink().subscribe({
      next: () => {
        this.confirmationLinkSent = true;
        this.isSendingConfirmationLink = false;
      },
      error: (error) => {
        console.error(error);
        this.isSendingConfirmationLink = false;
      }
    });
  }

  sendChangePasswordLink() {
    this.isSendingChangePasswordLink = true;
    this.myAccountService.sendChangePasswordLink().subscribe({
      next: () => {
        this.changePasswordLinkSent = true;
        this.isSendingChangePasswordLink = false;
      },
      error: (error) => {
        console.error(error);
        this.isSendingChangePasswordLink = false;
      }
    });
  }

  confirmDeletingAccount() {
    this.confirmationService.confirm({
      message: 'Czy jesteś pewien, że chcesz to zrobić?',
      header: 'Potwierdzenie',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Tak',
      rejectLabel: 'Nie',
      defaultFocus: 'reject',
      accept: () => {
        this.deleteAccount();
      }
    });
  }

  private deleteAccount() {
    this.isDeletingAccount = true;
    this.deleteAccountErrorMessage = undefined;

    this.myAccountService.deleteUser().pipe(
      switchMap(() => {
        this.accountIsDeleted = true;
        return this.authService.logout();
      })
    ).subscribe({
      next: () => {
        this.isDeletingAccount = false;
        this.toastService.add({
          severity: 'success',
          life: 10000,
          summary: 'Informacja',
          detail: 'Twoje konto zostało pomyślnie usunięte.'
        });
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.error('Error during account deletion or logout:', error);

        if (error.type === ApiErrorCode.FailedDeleteUser) {
          this.deleteAccountErrorMessage = error.message;
        }

        this.isDeletingAccount = false;
      }
    });
  }
}
