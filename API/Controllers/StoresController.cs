using API.Responses;
using Application.Helpers;
using Application.Interfaces;
using Application.Models.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class StoresController : BaseApiController
    {
        private readonly IStoreService _storeService;

        public StoresController(IStoreService storeService)
        {
            _storeService = storeService;
        }

        // GET api/stores
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<StoreDto>>> GetStores()
        {
            ServiceResult<IReadOnlyList<StoreDto>> result = await _storeService.GetStores();
            return Ok(new ApiResponse<IReadOnlyList<StoreDto>>(result.Data));
        }
    }
}
