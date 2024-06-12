using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class PlesnaSkolaContext:DbContext
    {
        public DbSet<PlesnaSkola> PlesnaSkola { get ; set ; }
        public DbSet<Administrator> Administratori {get;set;}
        public DbSet<ClanPlesneSkole> ClanoviPlesneSkole{get;set;}
        public DbSet<InstruktorPlesa> InstruktoriPlesa {get;set;}
         public DbSet<CasPlesa> CasoviPlesa {get;set;}
        public DbSet<SlobodanTerminCasa> SlobodniTerminiCasa {get;set;}
        public DbSet<ClanSlobodanTermin> ClanoviSlobodniTermini {get;set;}
        public DbSet<InstruktorCasPlesa> InstruktoriCasoviPlesa {get;set;}
         public DbSet<Obavestenje> Obavestenja { get; set; }
        public DbSet<Clanarina> Clanarine { get; set; }
        public DbSet<Zahtev> Zahtevi {get;set;}
        
        public PlesnaSkolaContext(DbContextOptions options):base(options)
        {

        }
        
    }
}