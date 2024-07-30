import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyAccountService } from '../my-account.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { UserSettingsUpdateModel } from 'src/app/core/models/api/requests/userSettingsUpdateModel';
import { ContentLoadingComponent } from 'src/app/core/components/content-loading/content-loading.component';
import { UiLoadingService } from 'src/app/core/services/ui-loading.service';
import { fadeInAnimation } from 'src/app/core/animations';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css'],
  animations: [fadeInAnimation]
})
export class AccountSettingsComponent extends ContentLoadingComponent implements OnInit, OnDestroy {
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
    private myAccountService: MyAccountService,
    uiLoadingService: UiLoadingService
  ) {
    super(uiLoadingService);
    this.settingsForm = this.formBuilder.group({
      emailSettings: this.formBuilder.group({
        generalPromotionalEmails: false,
        notificationsForFollowedProducts: false
      })
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadContent(): Observable<any> {
    this.loadingTimeout = setTimeout(() => {
      this.showLoadingSpinner = true;
    }, 50);

    return this.myAccountService.getUserSettings().pipe(
      tap(settings => {
        this.showLoadingSpinner = false;
        clearTimeout(this.loadingTimeout);

        this.settingsForm.patchValue(settings);
        this.settingsState = this.settingsForm.value;
        this.dataLoaded = true;
        this.trackChanges();
      })
    );
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
