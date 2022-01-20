using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using apiKafic.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
namespace apiKafic.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StavkaController : ControllerBase
    {
        public KaficContext Context;
        public StavkaController(KaficContext context)
        {
            Context=context;
        }
        
        [HttpPost]
        [Route("CreateStavku/{porudzbinaId}")]
         public async Task<int> CreateStavku(int porudzbinaId, [FromBody] Stavka s) {
            Porudzbina cat = await Context.Porudzbine.FindAsync(porudzbinaId);
            if(cat!= null)
            Context.Stavke.Add(s);
            await Context.SaveChangesAsync();
            return s.Id;
        }
        
        [HttpGet]
        [Route("GetStavke/{porudzbinaId}")]
        public async Task<List<Stavka>> GetStavke(int kid){
            
            return await Context.Stavke.Include(p=> p.PorudzbinaId==kid).ToListAsync();
        }

        [HttpDelete]
        [Route("DeleteStavku/{id}")]
        public async Task<IActionResult> DeleteStavku(int id) {
            Stavka old = await Context.Stavke.FindAsync(id);
            if (old == null) return StatusCode(404);
            Context.Stavke.Remove(old);
            await Context.SaveChangesAsync();
            return StatusCode(200);
        }
        
    }
}