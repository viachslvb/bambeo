using Core.Entities;

namespace Core.Interfaces.Repositories
{
    public interface IUserSettingsRepository
    {
        Task<UserSettings> GetByUserIdAsync(string userId);
        Task<UserSettings> CreateAsync(UserSettings userSettings);
        Task UpdateAsync(UserSettings userSettings);
    }
}
