using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Clanarina
    {
        [Key]
        public int ID { get; set; }

        public int Iznos { get; set; }

        public bool Placena { get; set; }
        
        public string DatumPlacanja { get; set; }
    }
}