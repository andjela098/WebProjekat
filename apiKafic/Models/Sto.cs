using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace apiKafic.Models{
    public class Sto{
        [Key]
        public int Id { get; set; }
        
        public int Broj { get; set; }
        
        [MaxLength(10)]
        public string Status{get; set;}

        public virtual Porudzbina Porudzbina{get;set;}
        
        public int KaficId {get; set;}
    }
}