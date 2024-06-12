using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace Backend.Models{
    [Table("ClanSlobodanTermin")]
    public class ClanSlobodanTermin{
        [Key]
        public int ID { get; set; }

        public int ClanId { get; set; }
        public int SlobodanTerminId { get; set; }
    }
}