import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyAccountService } from '../my-account.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserSettingsUpdateModel } from 'src/app/core/models/api/requests/userSettingsUpdateModel';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('0.15s ease-in')
      ]),
    ])
  ]
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  settingsForm: FormGroup;
  emailSettingsOptions = [
    { label: 'Ogólne maile promocyjne od serwisu', formControlName: 'generalPromotionalEmails' },
    { label: 'Powiadomienia o nowych promocjach na obserwowane produkty', formControlName: 'notificationsForFollowedProducts' }
  ];

  private settingsState: any;
  private loadingTimeout: any;
  dataLoaded = false;
  showLoadingSpinner = false;
  isSettingsChanged = false;
  isSavingInfo = false;

  constructor(
    private formBuilder: FormBuilder,
    private myAccountService: MyAccountService
  ) {
    this.settingsForm = this.formBuilder.group({
      emailSettings: this.formBuilder.group({
        generalPromotionalEmails: false,
        notificationsForFollowedProducts: false
      })
    });
  }

  ngOnInit(): void {
    this.loadAccountSettings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAccountSettings() {
    this.loadingTimeout = setTimeout(() => {
      this.showLoadingSpinner = true;
    }, 50);

    this.myAccountService.getUserSettings().subscribe({
      next: (settings) => {
        clearTimeout(this.loadingTimeout);
        this.settingsForm.patchValue(settings);
        this.settingsState = this.settingsForm.value;
        this.dataLoaded = true;
        this.trackChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  trackChanges() {
    this.settingsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const isFormChanged = JSON.stringify(this.settingsState) !== JSON.stringify(this.settingsForm.value);
        this.settingsForm.markAsPristine();
        this.settingsForm.markAsUntouched();

        this.isSettingsChanged = isFormChanged;
        if (isFormChanged) {
          this.settingsForm.markAsDirty();
        }
      }
    );
  }

  saveAccountSettings() {
    if (this.settingsForm.valid) {
      this.isSavingInfo = true;

      const payload = {
        ...this.settingsForm.value.emailSettings
      };

      this.myAccountService.updateUserSettings(payload as UserSettingsUpdateModel).subscribe({
        next: () => {
          this.settingsState = this.settingsForm.value;
          this.isSavingInfo = false;
          this.settingsForm.markAsPristine();
          this.isSettingsChanged = false;
        },
        error: (error) => {
          console.error(error);
          this.isSavingInfo = false;
        }
      });
    }
    else {
      this.settingsForm.markAllAsTouched();
    }
  }
}
