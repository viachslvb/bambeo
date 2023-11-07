using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class StoresController : BaseApiController
    {
        private readonly IGenericRepository<Store> _storesRepo;

        public StoresController(IGenericRepository<Store> storesRepo)
        {
            _storesRepo = storesRepo;
        }

        // GET api/stores
        [HttpGet]
        public async Task<ActionResult<List<Store>>> GetStores()
        {
            var stores = await _storesRepo.ListAllAsync();
            return Ok(stores);
        }
    }
}
