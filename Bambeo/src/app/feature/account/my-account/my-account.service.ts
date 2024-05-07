import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { UserSettingsUpdateModel } from 'src/app/core/models/api/requests/userSettingsUpdateModel';
import { UserUpdateModel } from 'src/app/core/models/api/requests/userUpdateModel';
import { DeleteAccountResponse } from 'src/app/core/models/api/responses/deleteAccountResponse';
import { User } from 'src/app/core/models/user';
import { UserSettings } from 'src/app/core/models/userSettings';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable()
export class MyAccountService {

  constructor(private apiService: ApiService)
  { }

  getUserInfo(): Observable<User> {
    const endpoint = 'user/info';

    return this.apiService.get<User>(endpoint);
  }

  updateUserInfo(userInfo: UserUpdateModel): Observable<User> {
    const endpoint = 'user/info';

    return this.apiService.put<User>(endpoint, userInfo);
  }

  deleteUser() {
    const endpoint = 'account';

    return this.apiService.delete<DeleteAccountResponse>(endpoint);
  }

  sendVerificationLink(): Observable<void> {
    const endpoint = 'user/verify-email';

    return this.apiService.post<void>(endpoint).pipe();
  }

  sendChangePasswordLink(): Observable<void> {
    const endpoint = 'user/change-password';

    return this.apiService.post<void>(endpoint).pipe();
  }

  getUserSettings(): Observable<UserSettings> {
    const endpoint = 'user/settings';

    return this.apiService.get<UserSettings>(endpoint);
  }

  updateUserSettings(userSettings: UserSettingsUpdateModel): Observable<UserSettings> {
    const endpoint = 'user/settings';
    
    return this.apiService.put<UserSettings>(endpoint, userSettings);
  }
}