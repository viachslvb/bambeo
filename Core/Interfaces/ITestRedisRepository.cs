using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ITestRedisRepository
    {
        Task<TestItem> GetTestItemAsync(string testItemId);
        Task<TestItem> UpdateTestItemAsync(TestItem testItem);
        Task<bool> DeleteTestItemAsync(string testItemId);
    }
}
