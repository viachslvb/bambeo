using API.Models.Enums;

namespace API.Models
{
    public class ErrorMessages
    {
        private static readonly Dictionary<ApiErrorCode, string> _errorMessages = new Dictionary<ApiErrorCode, string>
        {
            { ApiErrorCode.LoginFailed, "Nieprawidłowy adres e-mail lub hasło." },
            { ApiErrorCode.EmailAlreadyInUse, "Adres email jest już używany." }, // make general message for validation
            { ApiErrorCode.ValidationFailed, "Wprowadzone dane nie spełniają wymagań walidacji." },

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
