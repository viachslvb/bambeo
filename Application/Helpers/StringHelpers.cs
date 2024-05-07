using System.Globalization;
using System.Text.RegularExpressions;

namespace Application.Helpers
{
    public static class StringHelpers
    {
        public static string ToTitleCase(this string input)
        {
            if (string.IsNullOrEmpty(input)) return input;
            return CultureInfo.CurrentCulture.TextInfo.ToTitleCase(input.ToLower());
        }

        public static string RemoveExtraSpaces(this string input)
        {
            if (string.IsNullOrEmpty(input)) return input;
            return Regex.Replace(input, @"\s+", " ");
        }
    }
}
