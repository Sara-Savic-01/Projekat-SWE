using System;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;
namespace Backend.Models
{
    [Table("KorisnikSajta")]
    public class KorisnikSajta
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Ime")]
        public string Ime { get; set; }

        [Column("Prezime")]
        public string Prezime { get; set; }

        [Column("Godine")]

        public int Godine {get;set;}

        [Column ("BrojTelefona")]
        public string BrojTelefona {get;set;}

        [Column ("Email")]
        public string Email{get;set;}

        [Column ("KorisnickoIme")]
        public string KorisnickoIme{get;set;}

        [Column ("Sifra")]
        public string Sifra{get;set;}

        [Column ("PovrdaSifre")]
        public string PotvrdaSifre{get;set;}

        [Column ("RAND_SALT")]
        public string RAND_SALT{get;set;}

        [Column ("Slika")]
        public string Slika{get;set;}

        [Column("Tip")]
        public int tip { get; set; } //1 administrator,2 instruktor plesa, 3 clan plesne skole
        
        [NotMapped]
        public IFormFile ProfilnaFile { get;set;}

        [NotMapped]
        public string ProfilnaSrc { get;set;}

        [JsonIgnore]
        public PlesnaSkola PlesnaSkola{get;set;}



      


    }
}
