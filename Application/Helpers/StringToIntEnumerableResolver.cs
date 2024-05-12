using AutoMapper;

namespace Application.Helpers
{
    public class StringToIntEnumerableResolver : IValueResolver<object, object, IEnumerable<int>>
    {
        public IEnumerable<int> Resolve(object source, object destination, IEnumerable<int> destMember, ResolutionContext context)
        {
            if (source == null)
            {
                return Enumerable.Empty<int>();
            }

            var stringValue = source as string;
            if (string.IsNullOrEmpty(stringValue))
            {
                return Enumerable.Empty<int>();
            }

            return stringValue.Split('-')
                              .Where(id => int.TryParse(id, out _))
                              .Select(id => int.Parse(id));
        }
    }
}
