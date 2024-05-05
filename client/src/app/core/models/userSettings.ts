export interface UserSettings {
  emailSettings: EmailSettings;
}

export interface EmailSettings {
  generalPromotionalEmails: boolean;
  notificationsForFollowedProducts: boolean;
}