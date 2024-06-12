using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
namespace Backend.Services
{
    public class JwtService
    {
        private string securityKey="0x00D1CCE9771AE7554D479F7B93A4561102000000034351AC006D5682610A93166F875E19ACD15065F2908DDBB3A151B9EE45C599";
    
        public JwtSecurityToken Verify(string jwt)
        {
            var tokenHandler= new JwtSecurityTokenHandler();
            var key=Encoding.ASCII.GetBytes(securityKey);
            tokenHandler.ValidateToken(jwt,new TokenValidationParameters()
            {
                IssuerSigningKey=new SymmetricSecurityKey(key),
                ValidateIssuerSigningKey=true,
                ValidateIssuer=false,
                ValidateAudience=false

            },out SecurityToken validatedToken);
             return(JwtSecurityToken)validatedToken;
        }
    }
}