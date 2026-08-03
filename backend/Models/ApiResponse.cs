using System.Diagnostics;

namespace backend.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }
        public int StatusCode { get; set; }
        public string? TraceId { get; set; }
        public DateTime Timestamp { get; set; }

        // سازنده‌های کمکی
        public ApiResponse()
        {
            Timestamp = DateTime.UtcNow;
            TraceId = Activity.Current?.Id ?? Guid.NewGuid().ToString();
        }

        // متدهای استاتیک برای ساخت پاسخ‌ها
        public static ApiResponse<T> SuccessResponse(T data, string message = "Operation successful")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Data = data,
                Message = message,
                StatusCode = 200,
                Errors = null
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, int statusCode = 400, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                StatusCode = statusCode,
                Errors = errors ?? new List<string>(),
                Data = default
            };
        }

        public static ApiResponse<T> NotFoundResponse(string message = "Resource not found")
        {
            return ErrorResponse(message, 404);
        }

        public static ApiResponse<T> ValidationErrorResponse(List<string> errors)
        {
            return ErrorResponse("Validation failed", 400, errors);
        }

        public static ApiResponse<T> UnauthorizedResponse(string message = "Unauthorized")
        {
            return ErrorResponse(message, 401);
        }

        public static ApiResponse<T> ServerErrorResponse(string message = "Internal server error")
        {
            return ErrorResponse(message, 500);
        }

        internal static ApiResponse<object> ValidationErrorResponse(object value)
        {
            throw new NotImplementedException();
        }
    }

    // برای پاسخ‌های بدون Data (مثل DELETE)
    public class ApiResponse : ApiResponse<object>
    {
        public static ApiResponse SuccessResponse(string message = "Operation successful")
        {
            return new ApiResponse
            {
                Success = true,
                Message = message,
                StatusCode = 200,
                Errors = null
            };
        }
    }
}
