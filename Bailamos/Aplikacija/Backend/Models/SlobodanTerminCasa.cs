using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models{
    [Table("SlobodanTerminCasa")]
    public class SlobodanTerminCasa{
        [Key]
        [Column("ID")]
        public int ID { get; set; }
        
        [Column("Naziv")]
        public string NazivPlesa { get; set; }

        [Column("MaximalanBrojLjudi")]
        public int MaximalanBrojLjudi { get; set; }

         [Column("KorisnickoImeInstruktora")]
        public string KorisnickoImeInstruktora {get;set;}

        [Column("ImeInstruktora")]
        public string ImeInstruktora{get;set;}

        [Column("PrezimeInstruktora")]
        public string PrezimeInstruktora {get;set;}
       
        [Column("Datum")]
        public string Datum { get; set; }

        [Column("VremePocetkaCasa")]
        public string VremePocetkaTermina { get; set; }

        [Column("VremeKrajaCasa")]
        public string VremeKrajaTermina { get; set; }

        [Column("TrenutanBrojLJudi")]
        public int TrenutanBrojLjudi { get; set; }


    }

}