using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace apiKafic.Models{
    public class Porudzbina{
        [Key]
        public int Id { get; set; }
    
        public int Broj { get; set; }
        public int StoId{get; set;}
        
        public virtual List<Stavka> Stavke {get; set;}


    
       
    }
}