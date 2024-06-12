using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models;
namespace Backend.Services.PasswordHashers
{
    public interface IPasswordHashers
    {
       
       string HashPassword(string password);
    }
}