using Microsoft.Extensions.Primitives;

namespace API.Middleware
{
    public class TrimMiddleware
    {
        private readonly RequestDelegate _next;

        public TrimMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            context.Request.Query = new QueryCollection(context.Request.Query
                .ToDictionary(p => p.Key, p => new StringValues(p.Value.Select(v => v.Trim()).ToArray())));

            if (context.Request.HasFormContentType)
            {
                var form = new FormCollection(context.Request.Form
                    .ToDictionary(p => p.Key, p => new StringValues(p.Value.Select(v => v.Trim()).ToArray())));
                context.Request.Form = form;
            }

            await _next(context);
        }
    }
}
