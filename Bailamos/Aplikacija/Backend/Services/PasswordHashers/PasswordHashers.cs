using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Services.PasswordHashers
{
    public class PasswordHashers: IPasswordHashers
    {
       
       public string HashPassword(string password)
       {
           return BCrypt.Net.BCrypt.HashPassword(password);
       }
    }
}