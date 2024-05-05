using Application.Helpers;
using Application.Interfaces;
using Application.Models.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces.Repositories;

namespace Application.Services
{
    public class StoreService : IStoreService
    {
        private readonly IGenericRepository<Store> _storesRepository;
        private readonly IMapper _mapper;

        public StoreService(IGenericRepository<Store> storesRepository, IMapper mapper)
        {
            _storesRepository = storesRepository;
            _mapper = mapper;
        }

        public async Task<ServiceResult<IReadOnlyList<StoreDto>>> GetStores()
        {
            var stores = await _storesRepository.ListAllAsync();
            var storesDto = _mapper.Map<IReadOnlyList<StoreDto>>(stores);

            return ServiceResult<IReadOnlyList<StoreDto>>.SuccessResult(storesDto);
        }
    }
}
