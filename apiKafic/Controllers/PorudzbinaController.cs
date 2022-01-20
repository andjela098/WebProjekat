using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using apiKafic.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace apiKafic.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PorudzbinaController : ControllerBase
    {
        public KaficContext Context;
        public PorudzbinaController(KaficContext context)
        {
            Context=context;
        }
        [HttpPost]
        [Route("CreatePorudzbina/{stoId}")]
        public async Task<int> CreatePorudzbina(int stoId, [FromBody] Porudzbina por ){
           
            Sto c=null;
    
                c = await Context.Stolovi.FindAsync(stoId);
                if(c!=null){
                    c.Status = "Zauzet";
                    c.Porudzbina = por;
                    Context.Porudzbine.Add(por);
                    await Context.SaveChangesAsync();
                    }
                
            return por.Id; 
    
        }
        [HttpGet]
        [Route("GetPorudzbinaByStoId/{stoid}")]
        public async Task<Porudzbina> GetPorudzbinaByStoId(int stoId) {
            return await Context.Porudzbine.Include("Stavke").FirstOrDefaultAsync(p=>p.StoId==stoId);
        }
        [HttpGet]
        [Route("GetPorudzbina/{id}")]
        public async Task<Porudzbina> GetPorudzbina(int Id) {
            return await Context.Porudzbine.FindAsync(Id);
        }
        [HttpPut]
        [Route("DodajStavku/{id}")]
        public async Task<IActionResult> DodajStavku(int Id,[FromBody] Stavka s) {
           Porudzbina por= await Context.Porudzbine.FindAsync(Id);
            if(por!=null)
                return StatusCode(404);
            else{
                s.PorudzbinaId=Id;
                por.Stavke.Add(s);
                Context.Stavke.Add(s);
                Context.Porudzbine.Add(por);
                return StatusCode(204);
            }

        }
        
        [HttpDelete]
        [Route("DeletePorudzbina/{id}")]
        public async Task<IActionResult> DeletePorudzbina(int id) {
            Porudzbina old = await Context.Porudzbine.FindAsync(id);
            if (old == null) return StatusCode(404);
            Context.Porudzbine.Remove(old);
            await Context.SaveChangesAsync();
            return StatusCode(200);
        }
        
    }
}