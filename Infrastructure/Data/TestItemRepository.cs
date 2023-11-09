using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class TestItemRepository : ITestRedisRepository
    {
        private readonly IDatabase _database;
        public TestItemRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task<bool> DeleteTestItemAsync(string testItemId)
        {
            return await _database.KeyDeleteAsync(testItemId);
        }

        public async Task<TestItem> GetTestItemAsync(string testItemId)
        {
            var data = await _database.StringGetAsync(testItemId);

            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<TestItem>(data);
        }

        public async Task<TestItem> UpdateTestItemAsync(TestItem testItem)
        {
            var created = await _database.StringSetAsync(testItem.Id, JsonSerializer.Serialize(testItem),
                TimeSpan.FromDays(30));

            if (!created) return null;

            return await GetTestItemAsync(testItem.Id);
        }
    }
}
