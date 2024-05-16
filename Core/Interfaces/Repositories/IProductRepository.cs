﻿using Core.Entities;

namespace Core.Interfaces.Repositories
{
    public interface IProductRepository
    {
        Task<Product> GetByIdAsync(int id);
    }
}
