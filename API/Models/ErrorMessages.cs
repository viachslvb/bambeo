using API.Models.Enums;

namespace API.Models
{
    public class ErrorMessages
    {
        private static readonly Dictionary<ApiErrorCode, string> _errorMessages = new Dictionary<ApiErrorCode, string>
        {
            { ApiErrorCode.BadRequest, "Przepraszamy, ale Twoje żądanie nie może zostać zrealizowane. Proszę sprawdzić wprowadzone dane." },
            { ApiErrorCode.AuthorizationRequired, "Wymagana autoryzacja." },
            { ApiErrorCode.NotFound, "Przepraszamy, ale nie udało się odnaleźć żądanego zasobu." },
            { ApiErrorCode.InternalServerError, "Wystąpił nieoczekiwany błąd serwera. Proszę spróbować ponownie później." },
            { ApiErrorCode.LoginFailed, "Nieprawidłowy adres e-mail lub hasło." },
            { ApiErrorCode.AlreadyAuthenticated, "Wygląda na to, że już jesteś zalogowany." },
            { ApiErrorCode.EmailAlreadyInUse, "Adres email jest już używany." },
            { ApiErrorCode.InvalidRefreshToken, "Invalid refresh token." },
            { ApiErrorCode.InvalidAccessToken, "Invalid access token." },
            { ApiErrorCode.AccessTokenExpired, "Access token is expired." },
            { ApiErrorCode.EmailConfirmationFailed, "Nie udało się zweryfikować Twojego adresu email." },
            { ApiErrorCode.EmailAlreadyConfirmed, "Twój email został już potwierdzony wcześniej." },
            { ApiErrorCode.InvalidEmailConfirmationToken, "Link jest nieprawidłowy lub wygasł. Proszę o ponowną próbę lub zgłoszenie się po nowy link weryfikacyjny." },
            { ApiErrorCode.ValidationFailed, "Wprowadzone dane nie spełniają wymagań walidacji." },
            { ApiErrorCode.PasswordResetFailed, "Link do resetowania hasła jest nieprawidłowy lub wygasł. Prosimy o ponowne złożenie wniosku o resetowanie hasła." },

            // Others
            { ApiErrorCode.UserNotFound, "Użytkownik nie został znaleziony." },
            { ApiErrorCode.InsufficientPermissions, "Brak wystarczających uprawnień." },
        };

        public static string GetErrorMessage(ApiErrorCode errorCode)
        {
            return _errorMessages.TryGetValue(errorCode, out var errorMessage) ? errorMessage : null;
        }
    }
}
