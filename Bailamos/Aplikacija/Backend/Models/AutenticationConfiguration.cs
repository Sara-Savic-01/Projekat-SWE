namespace Backend.Models
{
    public class AutenticationConfiguration
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string AccessTokenSecret{ get; set; }
        public int AccessTokenExpirationMinutes { get; set; }
    }
}