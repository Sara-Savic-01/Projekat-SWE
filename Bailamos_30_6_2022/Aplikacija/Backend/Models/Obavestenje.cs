using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Obavestenje
    {
        [Key]
        public int ID { get; set; }

        public string Sadrzaj { get; set; }
    }
}