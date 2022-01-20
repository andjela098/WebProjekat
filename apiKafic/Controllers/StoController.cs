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
    public class StoController : ControllerBase
    {
        public KaficContext Context;
        public StoController(KaficContext context)
        {
            Context=context;
        }
        [HttpPost]
        [Route("CreateSto/{kaficId}")]
         public async Task<int> CreateSto(int kaficId, [FromBody] Sto s) {
            Kafic cafe=null;
            if(s.Status=="+"){
                cafe = await Context.Kafic.FindAsync(kaficId);
                cafe.N++;
         
            }
            s.Status="Slobodan";
            s.KaficId=kaficId;
          
            Context.Stolovi.Add(s);
            await Context.SaveChangesAsync();
            return s.Id;
        }
        
        [Route("ZauzmiSto/{id}")]
        [HttpPut]
        public async Task<IActionResult> ZauzmiSto(int id, [FromBody] Sto c) {
            
            Sto old= await Context.Stolovi.FindAsync(id);
            if(old==null )
                return StatusCode(404);
            if(old.Status=="Zauzet")
                 return StatusCode(403);
            
            old.Status=c.Status;
            
            await Context.SaveChangesAsync();
            return StatusCode(204);
           
            
        }
        [HttpGet]
        [Route("GetSto/{id}")]
        public async Task<Sto> GetStolovi(int id){
            
            return await Context.Stolovi.FindAsync(id);
        }
        [Route("OslobodiSto/{id}")]
        [HttpPut]
        public async Task<IActionResult> OslobodiSto(int id, [FromBody] Sto c) {
            
            Sto old = await Context.Stolovi.FindAsync(id);
            if(old==null || old.Status=="Slobodan")
                return StatusCode(405);
            old.Status =c.Status;
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }

        [HttpDelete]
        [Route("DeleteSto/{id}")]
        public async Task<IActionResult> DeleteSto(int id) {
            Sto old = await Context.Stolovi.FindAsync(id);
            if (old == null) return StatusCode(403);
            Context.Stolovi.Remove(old);
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }
        
    }
}