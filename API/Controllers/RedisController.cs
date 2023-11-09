using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class RedisController : BaseApiController
    {
        private readonly ITestRedisRepository _testItemRepository;
        private readonly IMapper _mapper;
        public RedisController(ITestRedisRepository testItemRepository, IMapper mapper)
        {
            _mapper = mapper;
            _testItemRepository = testItemRepository;
        }

        [HttpGet]
        public async Task<ActionResult<TestItem>> GetTestItemById(string id)
        {
            var basket = await _testItemRepository.GetTestItemAsync(id);

            return Ok (basket ?? new TestItem(id));
        }

        [HttpPost]
        public async Task<ActionResult<TestItem>> UpdateTestItem(TestItem testItem)
        {
            var customerBasket = _mapper.Map<TestItem>(testItem);

            var updatedBasket = await _testItemRepository.UpdateTestItemAsync(customerBasket);

            return Ok(updatedBasket);
        }

        [HttpDelete]
        public async Task DeleteTestItemAsync(string id)
        {
            await _testItemRepository.DeleteTestItemAsync(id);
        }
    }
}
