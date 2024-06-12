using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System;

namespace Backend.Models
{
    [Table("Zahtev")]
    public class Zahtev
    {
        [Column("ID")]
        public int ID {get; set;}

        [Column("Datum")]
        public string Datum {get; set;}

        [Column("CasPlesaId")]
        public int CasPlesaId {get; set;}

        [Column("InstruktorPlesaId")]
        public int InstruktorPlesaId {get; set;}

        [Column("InstruktorPlesaIme")]
        public string InstruktorPlesaIme {get; set;}

        [Column("InstruktorPlesaPrezime")]
        public string InstruktorPlesaPrezime {get; set;}

        [Column("ClanPlesneSkoleId")]
        public int ClanPlesneSkoleId {get; set;}

        [Column("ClanPlesneSkoleIme")]
        public string ClanPlesneSkoleIme {get; set;}

        [Column("ClanPlesneSkolePrezime")]
        public string ClanPlesneSkolePrezime {get; set;}

        [Column("VremePocetka")]
        public string VremePocetka {get; set;}

        [Column("VremeKraja")]
        public string VremeKraja {get; set;}

        [Column("Opis")]
        public string Opis {get; set;}

        [Column("ZahtevPrihvacen")]
        public string ZahtevPrihvacen {get; set;}

    }

}