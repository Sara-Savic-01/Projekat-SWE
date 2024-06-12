using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;
namespace Backend.Models
{
    [Table("ClanPlesneSkole")]
    public class ClanPlesneSkole:KorisnikSajta
    {
        [Column("Pol")]
        public string Pol { get; set; }

        


      //  [JsonIgnore]
        public Clanarina Clanarina{get;set;}
        
        [Column("ProbniTermin")]
        public bool ProbniTermin {get;set;}
        

    }
}