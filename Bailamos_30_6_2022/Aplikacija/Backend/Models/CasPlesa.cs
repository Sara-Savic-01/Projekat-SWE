using System;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    [Table("CasPlesa")]
    public class CasPlesa
    {
        [Key]
        [Column("ID")]
        public int ID {get; set;}

        [Column("Naziv")]
        public string Naziv {get; set;}

        [Column("Tip")]
        public string Tip {get; set;} //prvi ples na vencanju, grupni ples

        [Column("Cena")]
        public int Cena {get; set;}

        [Column("Nedeljno")]
        public int Nedeljno {get; set;}

        [Column("Mesecno")]
        public int Mesecno {get; set;}

        [Column("Polugodisnje")]
        public int Polugodisnje {get; set;}

        [Column("Godisnje")]
        public int Godisnje {get; set;}

        [Column("Opis")]
        public string Opis {get; set;}

        
        [NotMapped]
        public IFormFile ProfilnaFileJedan {get; set;}

        [NotMapped]
        public string ProfilnaSrcJedan {get; set;}

        [NotMapped]
        public IFormFile ProfilnaFileDva {get; set;}

        [NotMapped]
        public string ProfilnaSrcDva {get; set;}

        [NotMapped]
        public IFormFile ProfilnaFileTri {get; set;}

        [NotMapped]
        public string ProfilnaSrcTri {get; set;}
        

        [JsonIgnore]
        public PlesnaSkola PlesnaSkola {get; set;}

        public virtual List<SlobodanTerminCasa> SlobodniTerminiCasova {get; set;}

    }
}