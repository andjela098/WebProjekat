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
    public class KaficController : ControllerBase
    {
        public KaficContext Context;
        public KaficController(KaficContext context)
        {
            Context=context;
        }

        [Route("GetKafic")]
        [HttpGet]
        public async Task<IEnumerable<Kafic>> GetKafic(){

          
            return await Context.Kafic.Include("Stolovi.Porudzbina.Stavke").ToListAsync();
          
        }

        
        
        [HttpGet]
        [Route("GetKafic/{id}")]
        public async Task<Kafic> GetKafic(int id) {
            return await Context.Kafic.Include("Stolovi.Porudzbina.Stavke").FirstOrDefaultAsync(p => p.Id == id);
          
        }
        
        [HttpPost]
        [Route("CreateKafic")]
        public async Task<int> CreateKafic([FromBody] Kafic kafic )
        {
            Context.Kafic.Add(kafic);
            await Context.SaveChangesAsync();
            return kafic.Id;
        }
        
        [HttpPut]
        [Route("EditKafic/{id}")]
        public async Task<IActionResult> EditKafic(int id,[FromBody] Kafic k)
        {
            Kafic old = await Context.Kafic.FindAsync(id);
            if(old == null) return StatusCode(404);
            old.Naziv =k.Naziv;
            old.N = k.N;
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }
        
        [HttpDelete]
        [Route("DeleteKafic/{id}")]
        public async Task<IActionResult> DeleteKafic(int id)
        {
            Kafic kafic = await Context.Kafic.Include("Stolovi.Porudzbina.Stavke").FirstOrDefaultAsync(p => p.Id == id);
            if(kafic==null) return StatusCode(404);
            Context.Remove(kafic);
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }
        

    }
}
