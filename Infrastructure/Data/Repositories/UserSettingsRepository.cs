using Core.Entities;
using Core.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repositories
{
    public class UserSettingsRepository : IUserSettingsRepository
    {
        private readonly ApplicationDbContext _context;

        public UserSettingsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserSettings> CreateAsync(UserSettings userSettings)
        {
            _context.UserSettings.Add(userSettings);
            await _context.SaveChangesAsync();

            return userSettings;
        }

        public async Task<UserSettings> GetByUserIdAsync(string userId)
        {
            return await _context.UserSettings
                .FirstOrDefaultAsync(us => us.UserId == userId);
        }

        public async Task UpdateAsync(UserSettings userSettings)
        {
            _context.UserSettings.Update(userSettings);
            await _context.SaveChangesAsync();
        }
    }
}