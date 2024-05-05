namespace API.Responses
{
    public class ApiResponse<T> : IApiResponse where T : class
    {
        public bool Success { get; private set; }
        public T Payload { get; private set; }

        public ApiResponse(T payload)
        {
            Success = true;
            Payload = payload;
        }
    }
}