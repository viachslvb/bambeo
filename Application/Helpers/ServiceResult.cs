using Application.Enums;

namespace Application.Helpers
{
    public class ServiceResult<T>
    {
        public bool Success { get; set; }
        public T Data { get; set; }
        public ErrorCode ErrorCode { get; set; }
        public static ServiceResult<T> SuccessResult(T data) => new ServiceResult<T> { Success = true, Data = data };
        public static ServiceResult<T> FailureResult(ErrorCode errorCode) => new ServiceResult<T> { Success = false, ErrorCode = errorCode };
    }
}