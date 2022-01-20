using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace apiKafic.Models{
    public class Stavka{
        [Key]
        public int Id { get; set; }
       
        [MaxLength(5)]
        public string Vrsta { get; set; }
       
        public int Cena{ get; set; }
        
        [MaxLength(15)]
        public string Naziv { get; set; }
        
        public int PorudzbinaId { get; set;}
        

    }
}