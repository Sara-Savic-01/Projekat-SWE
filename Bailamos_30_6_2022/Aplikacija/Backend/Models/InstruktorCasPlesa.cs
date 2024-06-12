using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace Backend.Models{
    [Table("InstruktorCasPlesa")]
    public class InstruktorCasPlesa{

        [Key]
        public int ID { get; set; }
        public int  InstruktorPlesaId{ get; set; }
        public int CasPlesaId { get; set; }
       

    }
}