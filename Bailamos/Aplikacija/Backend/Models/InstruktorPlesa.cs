using System;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;
namespace Backend.Models
{
    [Table("InstruktorPlesa")]
    public class InstruktorPlesa:KorisnikSajta
    {
       
        
    [Column("PrviOpis")]
    public string PrviOpis {get;set;}

    [Column("DrugiOpis")]
    public string DrugiOpis {get;set;}
        
    public List<Zahtev> Zahtevi{get;set;}
       
    }
    
}