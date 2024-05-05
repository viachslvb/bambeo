using Application.Enums;

namespace API.Helpers
{
    public class ErrorMessages
    {
        private static readonly Dictionary<ErrorCode, string> _errorMessages = new Dictionary<ErrorCode, string>
        {
            { ErrorCode.BadRequest, "Przepraszamy, ale Twoje żądanie nie może zostać zrealizowane. Proszę sprawdzić wprowadzone dane." },
            { ErrorCode.AuthorizationRequired, "Wymagana autoryzacja." },
            { ErrorCode.NotFound, "Przepraszamy, ale nie udało się odnaleźć żądanego zasobu." },
            { ErrorCode.InternalServerError, "Wystąpił nieoczekiwany błąd serwera. Proszę spróbować ponownie później." },
            { ErrorCode.LoginFailed, "Nieprawidłowy adres e-mail lub hasło." },
            { ErrorCode.AlreadyAuthenticated, "Wygląda na to, że już jesteś zalogowany." },
            { ErrorCode.EmailAlreadyInUse, "Adres email jest już używany." },
            { ErrorCode.FailedDeleteUser, "Nie udało się usunąć konta. Prosimy spróbować ponownie później." },
            { ErrorCode.InvalidRefreshToken, "Invalid refresh token." },
            { ErrorCode.InvalidAccessToken, "Invalid access token." },
            { ErrorCode.AccessTokenExpired, "Access token is expired." },
            { ErrorCode.EmailConfirmationFailed, "Nie udało się zweryfikować Twojego adresu email." },
            { ErrorCode.EmailAlreadyConfirmed, "Twój email został już potwierdzony wcześniej." },
            { ErrorCode.InvalidEmailConfirmationToken, "Link jest nieprawidłowy lub wygasł. Proszę o ponowną próbę lub zgłoszenie się po nowy link weryfikacyjny." },
            { ErrorCode.ValidationFailed, "Wprowadzone dane nie spełniają wymagań walidacji." },
            { ErrorCode.PasswordResetFailed, "Link do resetowania hasła jest nieprawidłowy lub wygasł. Prosimy o ponowne złożenie wniosku o resetowanie hasła." },
            { ErrorCode.UserNotFound, "Użytkownik nie został znaleziony." },
            { ErrorCode.InsufficientPermissions, "Brak wystarczających uprawnień." },
        };

        public static string GetErrorMessage(ErrorCode errorCode)
        {
            return _errorMessages.TryGetValue(errorCode, out var errorMessage) ? errorMessage : null;
        }
    }
}
