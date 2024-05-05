namespace Core.Common.Helpers
{
    public class EResult<T>
    {
        public bool Success { get; private set; }
        public string ErrorMessage { get; private set; }
        public T Data { get; private set; }

        public static EResult<T> SuccessResponse(T data)
        {
            return new EResult<T> { Success = true, Data = data };
        }

        public static EResult<T> Failure(string message)
        {
            return new EResult<T> { Success = false, ErrorMessage = message };
        }
    }
}