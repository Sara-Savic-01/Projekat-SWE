using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    [Table("PlesnaSkola")]
    public class PlesnaSkola
    {
        [Key]
        [Column("ID")]
        public int ID {get; set;}

        [Column("Naziv")]
        public string Naziv {get; set;}

        public virtual List <ClanPlesneSkole> ClanoviPlesneSkole {get; set;}
        public virtual List <InstruktorPlesa> InstruktoriPlesa {get; set;}
        public virtual List <Administrator> Administratori {get; set;}
        public virtual List <CasPlesa> CasoviPlesa {get; set;}
        public virtual List <Obavestenje> Obavestenja {get; set;}     

    }


}