﻿using System.ComponentModel.DataAnnotations;

namespace Application.Models.Dtos
{
    public class ConfirmEmailDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string Token { get; set; }
    }
}