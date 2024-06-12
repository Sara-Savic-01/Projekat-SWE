using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using System.IdentityModel.Tokens.Jwt;
using Backend.Services.PasswordHashers;
using Backend.Response;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http;
using Backend.Services;
using Microsoft.AspNetCore.Hosting;
//using Microsoft.Azure.Management.ResourceManager.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlesnaSkolaController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IWebHostEnvironment _hostEnvironment;
        public PlesnaSkolaContext Context{get;set;}
        public PlesnaSkolaController(PlesnaSkolaContext context,JwtService service,IWebHostEnvironment env)
        {
             Context=context;
            _jwtService=service;
            this. _hostEnvironment=env;
        }
        [Route("PreuzmiSkolu")]
        [HttpGet]
        public async Task<List<PlesnaSkola>> PreuzmiPlesnuSkolu()
        {
            return await Context.PlesnaSkola.Include(p=>p.ClanoviPlesneSkole).Include(p=>p.InstruktoriPlesa).Include(p=>p.Administratori).Include(p=>p.CasoviPlesa).ToListAsync();

        }
        [Route("PreuzmiClanovePlesneSkole")]
        [HttpGet]
        public async Task<List<ClanPlesneSkole>> PreuzmiClanovePlesneSkole()
        {
            return await Context.ClanoviPlesneSkole.Include(p=>p.Clanarina).ToListAsync();
        }
        [Route("PreuzmiInstruktorePlesa")]
        [HttpGet]
        public async Task<List<InstruktorPlesa>> PreuzmiInstruktora()
        {
            return await Context.InstruktoriPlesa.ToListAsync();
        }


        [Route("ObrisiObavestenje/{id}")]
        [HttpDelete]
        public async Task ObrisiObavestenje(int id)
        {
            Obavestenje obavestenje=await Context.Obavestenja.FindAsync(id);

            Context.Obavestenja.Remove(obavestenje);
            await Context.SaveChangesAsync();

        }

        [Route("ObrisiAdministratora/{id}")]
        [HttpDelete]
        public async Task ObrisiAdministratora(int id)
        {
            Administrator administrator=await Context.Administratori.FindAsync(id);

            Context.Administratori.Remove(administrator);
            await Context.SaveChangesAsync();
        }

        [Route("ObrisiinstruktoraPlesa/{id}")]
        [HttpDelete]
        public async Task ObrisiInstruktoraPlesa(int id)
        {
            InstruktorPlesa instruktor=await Context.InstruktoriPlesa.Where(p=>p.ID==id).FirstOrDefaultAsync();
            Context.InstruktoriPlesa.Remove(instruktor);
            await Context.SaveChangesAsync();
        }

        [Route("RegistrujKorisnika")]
        [HttpPost]
        public async Task<IActionResult> RegistrujKorisnika([FromBody] KorisnikSajta korisnikSajta)
        {
            if(!ModelState.IsValid)
            {
                IEnumerable<string> errors=ModelState.Values.SelectMany(v=>v.Errors.Select(e=>e.ErrorMessage));
                return BadRequest(new ErrorResponse(errors));
            }
            if(korisnikSajta.Sifra!=korisnikSajta.PotvrdaSifre)
            {
                return BadRequest(new ErrorResponse("Šifra se ne podudara sa potvrdom."));
            }
            KorisnikSajta proveraEmaila=await this.PronadjiKorisnika(korisnikSajta.Email);
            if(proveraEmaila!=null)
            {  
               return BadRequest("Email već postoji.");
            }
            KorisnikSajta proveraKorisnickogImena=await this.PronadjiPrekoUserName(korisnikSajta.KorisnickoIme);
            if(proveraKorisnickogImena!=null)
            {
                return Conflict(new ErrorResponse("Korisničko ime već postoji."));
            }
           
            string salt=BCrypt.Net.BCrypt.GenerateSalt();
          
            string confirmPass=korisnikSajta.PotvrdaSifre+salt;
            string hashPass=BCrypt.Net.BCrypt.HashPassword(korisnikSajta.Sifra,salt);
            string hashconfirmPass=BCrypt.Net.BCrypt.HashPassword(confirmPass,salt);
           
            PlesnaSkola plesnaSkola= await Context.PlesnaSkola.Where(p=>p.Naziv=="Bailamos").FirstOrDefaultAsync();
            if(korisnikSajta.tip==1)
            {
                Administrator administrator=new Administrator();
                administrator.Ime=korisnikSajta.Ime;
                administrator.Prezime=korisnikSajta.Prezime;
                administrator.BrojTelefona=korisnikSajta.BrojTelefona;
                administrator.Email=korisnikSajta.Email;
                
                administrator.tip=korisnikSajta.tip;
                administrator.KorisnickoIme=korisnikSajta.KorisnickoIme;

                administrator.PlesnaSkola=plesnaSkola;
                administrator.Sifra=hashPass;
                administrator.PotvrdaSifre=hashconfirmPass;
                administrator.RAND_SALT=salt;
                
                Context.Administratori.Add(administrator);
                administrator.ID=await Context.SaveChangesAsync();
                return Ok(administrator);
            } 
            else if(korisnikSajta.tip==2)
            {
              InstruktorPlesa instruktorPlesa=new InstruktorPlesa();
              instruktorPlesa.Ime=korisnikSajta.Ime;
              instruktorPlesa.Prezime=korisnikSajta.Prezime;
              instruktorPlesa.BrojTelefona=korisnikSajta.BrojTelefona;
              instruktorPlesa.Email=korisnikSajta.Email;
             
              instruktorPlesa.tip=korisnikSajta.tip;
              instruktorPlesa.KorisnickoIme=korisnikSajta.KorisnickoIme;

              instruktorPlesa.PlesnaSkola=plesnaSkola;
              instruktorPlesa.Sifra=hashPass;
              instruktorPlesa.PotvrdaSifre=hashconfirmPass;
              instruktorPlesa.RAND_SALT=salt;

              Context.InstruktoriPlesa.Add(instruktorPlesa);
           
              instruktorPlesa.ID=await Context.SaveChangesAsync();
              return Ok(instruktorPlesa);
              
            }
            else if(korisnikSajta.tip==3)
            {
              ClanPlesneSkole clanPlesneSkole=new ClanPlesneSkole();
              clanPlesneSkole.Ime=korisnikSajta.Ime;
              clanPlesneSkole.Prezime=korisnikSajta.Prezime;
              clanPlesneSkole.BrojTelefona=korisnikSajta.BrojTelefona;
              clanPlesneSkole.Email=korisnikSajta.Email;

              clanPlesneSkole.tip=korisnikSajta.tip;
              clanPlesneSkole.KorisnickoIme=korisnikSajta.KorisnickoIme;

              clanPlesneSkole.PlesnaSkola=plesnaSkola;
              clanPlesneSkole.Sifra=hashPass;
              clanPlesneSkole.PotvrdaSifre=hashconfirmPass;
              clanPlesneSkole.RAND_SALT=salt;
              clanPlesneSkole.ProbniTermin=true;
              Context.ClanoviPlesneSkole.Add(clanPlesneSkole);
              
              
              Clanarina clanarina=new Clanarina();
              clanarina.Iznos=0;
              clanarina.ID=clanPlesneSkole.ID;
              clanarina.Placena=false;
              
              Context.Clanarine.Add(clanarina);
              clanPlesneSkole.Clanarina=clanarina;
            
              await Context.SaveChangesAsync();
              return Ok(clanPlesneSkole);
            }

            else
            {
              return BadRequest();
            }
        }

        [Route("Prijavljivanje")]
        [HttpPost]
        public async Task<ActionResult> Prijavljivanje([FromBody] KorisnikSajta korisnikSajta)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(new ErrorResponse("Došlo je do greške."));
            }
            var korisnickoIme=korisnikSajta.KorisnickoIme;
            KorisnikSajta korisnik= await this.PronadjiPrekoUserName(korisnickoIme);
            if(korisnik==null)
            {
                return BadRequest(new ErrorResponse("Član sa ovim korisničkim imenom ne postoji."));
            }
           
            
            string hashPass=BCrypt.Net.BCrypt.HashPassword(korisnikSajta.Sifra,korisnik.RAND_SALT);
            
            if(hashPass!=korisnik.Sifra)
            {
                return Conflict(new ErrorResponse("Pogrešna šifra!"));
            }

            SecurityKey key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes("0x00D1CCE9771AE7554D479F7B93A4561102000000034351AC006D5682610A93166F875E19ACD15065F2908DDBB3A151B9EE45C599"));
            SigningCredentials credentials=new SigningCredentials(key,SecurityAlgorithms.HmacSha256);
            var header=new JwtHeader(credentials);
            
            var payload=new JwtPayload(korisnik.ID.ToString(),null,null,null,DateTime.UtcNow.AddDays(1));
            JwtSecurityToken token=new JwtSecurityToken(header,payload); //Kreirali smo JWT token
            string jwt= new JwtSecurityTokenHandler().WriteToken(token);
            Response.Cookies.Append("jwt",jwt,new CookieOptions
            {
                HttpOnly=true
            });
            return Ok(new
            {
                message=jwt
            });  
        }
        [Route("PreuzmiCasove")]
        [HttpGet]
        public async Task<List<CasPlesa>> PreuzmiCasove()
        {
            return await Context.CasoviPlesa.Include(p=>p.SlobodniTerminiCasova).ToListAsync();
        }
         [Route("PreuzmiClanarine")]
        [HttpGet]
        public async Task<List<Clanarina>> PreuzmiClanarine()
        {
            return await Context.Clanarine.ToListAsync();
        }

        [Route("PreuzmiObavestenja")]
        [HttpGet]
        public async Task<List<Obavestenje>> PreuzmiObavestenje()
        {
            return await Context.Obavestenja.ToListAsync();
        }

         
        [Route("DodajObavestenje")]
        [HttpPost]
        public async Task DodajObavestenje([FromBody] Obavestenje obavestenje )
        {
            Context.Obavestenja.Add(obavestenje);
            await Context.SaveChangesAsync();

        }
        
        
        [Route("UpisiPlesnuSkolu")]
        [HttpPost]
        public async Task UpisiSkolu([FromBody] PlesnaSkola plesnask)
        {
            Context.PlesnaSkola.Add(plesnask);
            await Context.SaveChangesAsync();

        }
        [Route("UpisiCas")]
        [HttpPost]
        public async Task UpisiCas([FromBody] CasPlesa CasPlesa)
        {
             PlesnaSkola ples= await Context.PlesnaSkola.Where(p=>p.Naziv=="Bailamos").FirstOrDefaultAsync();
             CasPlesa.PlesnaSkola=ples;
             
        
            Context.CasoviPlesa.Add(CasPlesa);
          
            
            await Context.SaveChangesAsync();

        }
         [Route("NadjiKorisnika")]
        [HttpGet]
        public async Task<ClanPlesneSkole> NadjiKorisnika(string email)
        {
            ClanPlesneSkole kor= await Context.ClanoviPlesneSkole.Where(p=>p.Email==email).FirstOrDefaultAsync();
            return kor;
        }
        [Route("PronadjiBiloKogKorisnika")]
         [HttpGet]
        public async Task<KorisnikSajta> PronadjiKorisnika(string email)
        {
            ClanPlesneSkole kor= await Context.ClanoviPlesneSkole.Where(p=>p.Email==email).FirstOrDefaultAsync();
            if(kor==null)
            {
                InstruktorPlesa inst= await Context.InstruktoriPlesa.Where(p=>p.Email==email).FirstOrDefaultAsync();
                {
                    if(inst!=null)
                    {
                        return inst;
                    }
                     Administrator adm= await Context.Administratori.Where(p=>p.Email==email).FirstOrDefaultAsync();
                    if(adm!=null)
                    {
                        return adm;
                    }
                    else return null;
                    
                

                }
            }
            else return kor;
        }
        [Route("NadjiKorisnikaPoUserName")]
        [HttpGet]
        public async Task<KorisnikSajta> PronadjiPrekoUserName(string username)
        {

            ClanPlesneSkole kor= await Context.ClanoviPlesneSkole.Where(p=>p.KorisnickoIme==username).FirstOrDefaultAsync();
            if(kor==null)
            {
                InstruktorPlesa inst= await Context.InstruktoriPlesa.Where(w=>w.KorisnickoIme==username).FirstOrDefaultAsync();
                {
                    if(inst!=null)
                    {
                        return inst;
                    }
                    Administrator adm= await Context.Administratori.Where(w=>w.KorisnickoIme==username).FirstOrDefaultAsync();
                    if(adm!=null)
                    {
                        return adm;
                    }
                    else return null;
                    
                

                }
            }
            else return kor;
        }
        [Route("NadjiInstruktora")]
        [HttpGet]
        public async Task<InstruktorPlesa> NadjiInstruktora(string email)
        {
            InstruktorPlesa inst= await Context.InstruktoriPlesa.Where(p=>p.Email==email).FirstOrDefaultAsync();
            return inst;
        }
        [Route("NadjiPrekoID")]
        [HttpGet]
        public async Task<KorisnikSajta> NadjiPrekoID(int id)
        {
            ClanPlesneSkole kor= await Context.ClanoviPlesneSkole.Where(p=>p.ID==id).FirstOrDefaultAsync();
            if(kor==null)
            {
                InstruktorPlesa inst= await Context.InstruktoriPlesa.Where(w=>w.ID==id).FirstOrDefaultAsync();
                {
                    if(inst!=null)
                    {
                        return inst;
                    }
                    Administrator adm= await Context.Administratori.Where(w=>w.ID==id).FirstOrDefaultAsync();
                    if(adm!=null)
                    {
                        return adm;
                    }
                    else return null;
                }
            }
            else return kor;
        }
  

        [Route("ObrisiClana/{id}")]
        [HttpDelete]
        public async Task ObrisiClana(int id)
        {
         ClanPlesneSkole clan= await Context.ClanoviPlesneSkole.Where(p=>p.ID==id).Include(p=>p.Clanarina).FirstOrDefaultAsync();
           
           var idClanarine= clan.Clanarina.ID;
           
           Clanarina clanarina=await Context.Clanarine.Where(p=>p.ID==idClanarine).FirstOrDefaultAsync();
           clan.Clanarina=null;
           Context.ClanoviPlesneSkole.Remove(clan);
           Context.Clanarine.Remove(clanarina);
           await Context.SaveChangesAsync();
        }
        [Route("ObrisiCas/{id}")]
        [HttpDelete]
        public async Task ObrisiCas(int id)
        {
         
           CasPlesa tr= await Context.CasoviPlesa.Include(p=>p.SlobodniTerminiCasova).Where(p=>p.ID==id).FirstOrDefaultAsync();
           List<SlobodanTerminCasa> TerminiCasova= tr.SlobodniTerminiCasova;
             
             foreach (var cas in tr.SlobodniTerminiCasova)
             {
                 Context.Remove(cas);
                 
             }

           Context.CasoviPlesa.Remove(tr);
           
           await Context.SaveChangesAsync();
        }
        [Route("IzmeniCene/{id}")]
        [HttpPut]
        public async Task IzmeniCene(int id,[FromBody]CasPlesa c)
        {
            CasPlesa cas= await Context.CasoviPlesa.FindAsync(id);
               cas.Cena=c.Cena;
               cas.Nedeljno=c.Nedeljno;
               cas.Mesecno=c.Mesecno;
               cas.Polugodisnje=c.Polugodisnje;
               cas.Godisnje=c.Godisnje;

               await Context.SaveChangesAsync();

        }
        [Route("PreuzmiCas/{id}")]
        [HttpGet]
        public async Task<CasPlesa> PreuzmiCas(int id)
        {
            CasPlesa cas=await Context.CasoviPlesa.FindAsync(id);
            return cas;
        }
        [Route("ObrisiClanarinu/{id}")]
        [HttpDelete]
        public async Task ObrisiClanarinu(int id)
        {
           Clanarina clan=await Context.Clanarine.FindAsync(id);
           
           Context.Clanarine.Remove(clan);
           await Context.SaveChangesAsync();
        }

        
        [Route("PreuzmiClana")]
        [HttpGet]
        public async Task<IActionResult> PreuzmiClana( )
        {
            
            
          try{
            //validacija tokena
               var jwt=Request.Headers["Authorization"];
            
               var token=_jwtService.Verify(jwt);
               int korisnikId=int.Parse(token.Issuer);
               KorisnikSajta korisnik= await this.NadjiPrekoID(korisnikId);
               

               if(korisnik!=null)
               {
                   if(korisnik.tip==3)
                   {
                       ClanPlesneSkole clan=await Context.ClanoviPlesneSkole.Where(p=>p.Email==korisnik.Email).Include(p=>p.Clanarina).FirstOrDefaultAsync();
                       return Ok(clan);

                   }
                  else if(korisnik.tip==1)
                   {
                      Administrator adm=await Context.Administratori.Where(p=>p.Email==korisnik.Email).FirstOrDefaultAsync();
                      return Ok(adm);
                   }
                  else if(korisnik.tip==2)
                  {
                      InstruktorPlesa instruktor=await Context.InstruktoriPlesa.Where(p=>p.Email==korisnik.Email).FirstOrDefaultAsync();
                      return Ok(instruktor);
                  }
                  else return BadRequest();
               }
              
               else return BadRequest(new ErrorResponse(jwt.ToString()));

           }
            catch(Exception )
            {
                return Unauthorized();

            }

        }

        [Route("IzmeniClanaPlesneSkole/{id}")]
        [HttpPut]
        public async Task IzmeniClanaPlesneSkole (int id, [FromBody] ClanPlesneSkole clan)
        {
            var c = await Context.ClanoviPlesneSkole.Where(p=>p.ID==id).FirstOrDefaultAsync();

            c.Ime = clan.Ime;
            c.Prezime = clan.Prezime;
            c.Godine = clan.Godine;
            c.BrojTelefona = clan.BrojTelefona;
            c.Email = clan.Email;
            c.Pol = clan.Pol;

            await Context.SaveChangesAsync();
        }

        [Route("IzmeniClanarinu/{idClana}/{promena}")]
        [HttpPut]
        public async Task IzmeniClanarinu (int idClana, int promena)
        {
            ClanPlesneSkole clan = await Context.ClanoviPlesneSkole.Include(p=>p.Clanarina).Where(p=>p.ID==idClana).FirstOrDefaultAsync();

            if(promena==0)
            {
                clan.Clanarina.Placena = false;
            }

            else if(promena==1)
            {
                clan.Clanarina.DatumPlacanja = DateTime.Now.ToString("dd:MM:yyyy");
                clan.Clanarina.Placena = true;
            }

            await Context.SaveChangesAsync();
        }

        [Route("IzmeniAdministratora/{id}")]
        [HttpPut]
        public async Task IzmeniAdministratora (int id, [FromBody] Administrator adm)
        {
            var a = await Context.Administratori.Where(p=>p.ID==id).FirstOrDefaultAsync();

            a.Ime = adm.Ime;
            a.Prezime = adm.Prezime;
            a.Godine = adm.Godine;
            a.BrojTelefona = adm.BrojTelefona;
            a.Email = adm.Email;

            await Context.SaveChangesAsync();

        }

        [Route("IzmeniInstruktoraPlesa/{id}")]
        [HttpPut]

        public async Task IzmeniInstruktoraPlesa (int id, [FromBody] InstruktorPlesa inst)
        {
            var i = await Context.InstruktoriPlesa.Where(p=>p.ID==id).FirstOrDefaultAsync();

            i.Ime = inst.Ime;
            i.Prezime = inst.Prezime;
            i.Godine = inst.Godine;
            i.BrojTelefona = inst.BrojTelefona;
            i.Email = inst.Email;

            await Context.SaveChangesAsync();

        }

        [Route("IzmeniTipCasaPlesa/{id}/{tip}")]
        [HttpPut]
        public async Task IzmeniTipCasaPlesa (int id, string tip)
        {
            CasPlesa cas = await Context.CasoviPlesa.Where(p=>p.ID==id).FirstOrDefaultAsync();

            cas.Tip = tip; 

            await Context.SaveChangesAsync();
        }

        [Route("IzmeniCenuCasaPlesa/{id}/{cena}")]
        [HttpPut]
        public async Task IzmeniCenuCasaPlesa (int id, int cena)
        {
            CasPlesa cas = await Context.CasoviPlesa.Where(p=>p.ID==id).FirstOrDefaultAsync();

            cas.Cena = cena; 

            await Context.SaveChangesAsync();
        }

        [Route("IzmeniSliku/{korisnickoIme}")]
        [HttpPut]
        public async Task<IActionResult> IzmeniSliku (string korisnickoIme, [FromForm]IFormFile profilnaFile)
        {
            var korisnikSajta = await this.PronadjiPrekoUserName(korisnickoIme);

            if(korisnikSajta==null)
            {
                return BadRequest();
            }

            else
            {
                var pom = await SacuvajSliku(profilnaFile);

                korisnikSajta.Slika = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, pom);

                await Context.SaveChangesAsync();

                return Ok();
            }
        }

        [NonAction]
        public async Task<string> SacuvajSliku (IFormFile slika)
        {
            string imeSlike = new String (Path.GetFileNameWithoutExtension(slika.FileName).Take(10).ToArray()).Replace(' ','-');

            imeSlike = imeSlike + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(slika.FileName);

            var slikaPath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imeSlike);
			
            using (var fileStream = new FileStream (slikaPath, FileMode.Create))

            {
                await slika.CopyToAsync(fileStream);
            }

            return imeSlike;

        }

        [Route("DodajCasovePlesaInstruktora/{idCasaPlesa}/{idInstruktoraPlesa}")]
        [HttpPost]
        public async Task DodajCasovePlesaInstruktora (int idCasaPlesa, int idInstruktoraPlesa)
        {
            InstruktorCasPlesa icp = new InstruktorCasPlesa();

            icp.InstruktorPlesaId = idInstruktoraPlesa;
            icp.CasPlesaId = idCasaPlesa;

            Context.InstruktoriCasoviPlesa.Add(icp);

            await Context.SaveChangesAsync();
        }

        [Route("PreuzmiCasovePlesaInstruktora/{id}")]
        [HttpGet]
        public async Task<List<CasPlesa>> PreuzmiCasovePlesaInstruktora (int id)
        {
            List<CasPlesa> cp = new List<CasPlesa> ();
            List<InstruktorCasPlesa> icp = await Context.InstruktoriCasoviPlesa.Where(p=>p.InstruktorPlesaId==id).ToListAsync();

            foreach (var i in icp)
            {
                CasPlesa cas = await Context.CasoviPlesa.Where(p=>p.ID==i.CasPlesaId).FirstOrDefaultAsync();
                cp.Add(cas);
            }

            return cp;
        }

        [Route("PreuzmiInstruktoreCasovaPlesa/{id}")]
        [HttpGet]
        public async Task<List<InstruktorPlesa>> PreuzmiInstruktoreCasovaPlesa (int id)
        {
            List<InstruktorPlesa> ip = new List<InstruktorPlesa> ();
            List<InstruktorCasPlesa> icp = await Context.InstruktoriCasoviPlesa.Where(p=>p.CasPlesaId==id).ToListAsync();

            foreach (var i in icp)
            {
                InstruktorPlesa inst = await Context.InstruktoriPlesa.Where(p=>p.ID==i.InstruktorPlesaId).FirstOrDefaultAsync();
                ip.Add(inst);
            }

            return ip;
        }

        [Route("PreuzmiInstruktoreICasovePlesa")]
        [HttpGet]
        public async Task<List<InstruktorCasPlesa>> PreuzmiInstruktoreICasovePlesa ()
        {
            return await Context.InstruktoriCasoviPlesa.ToListAsync();
        }

        [Route("DodajNoviTerminCasaPlesa/{id}")]
        [HttpPost]
        public async Task DodajNoviTerminCasaPlesa (int id, [FromBody] SlobodanTerminCasa termin)
        {
            CasPlesa cas = await Context.CasoviPlesa.Include(p=>p.SlobodniTerminiCasova).Where(p=>p.ID==id).FirstOrDefaultAsync();

            cas.SlobodniTerminiCasova.Add(termin);
            Context.SlobodniTerminiCasa.Add(termin);

            await Context.SaveChangesAsync();
        }

        [Route("ObrisiSveCasovePlesaInstruktoraPlesa")]
        [HttpDelete]
        public async Task ObrisiSveCasovePlesaInstruktoraPlesa ()
        {
            List<InstruktorCasPlesa> icp = await Context.InstruktoriCasoviPlesa.ToListAsync();

            foreach(var cas in icp)
            {
                Context.InstruktoriCasoviPlesa.Remove(cas);
            }

            await Context.SaveChangesAsync();

        }

        [Route("ObrisiTerminCasaPlesa/{id}")]
        [HttpDelete]
        public async Task ObrisiTerminCasaPlesa (int id)
        {
            SlobodanTerminCasa termin = await Context.SlobodniTerminiCasa.FindAsync(id);

            Context.SlobodniTerminiCasa.Remove(termin);

            await Context.SaveChangesAsync();
        }

        ///

        [Route("PreuzmiSlobodneTermineCasova")]
        [HttpGet]
        public async Task<List<SlobodanTerminCasa>> PreuzmiSlobodneTermineCasova()
        {
            return await Context.SlobodniTerminiCasa.ToListAsync();
        }

        [Route("PreuzmiSlobodneTermineCasova/{nazivPlesa}")]
        [HttpGet]
        public async Task<List<SlobodanTerminCasa>> PreuzmiSlobodneTermineCasova(string nazivPlesa)
        {
            await this.ObrisiZastareleTermine(nazivPlesa);
            return await Context.SlobodniTerminiCasa.Where(p=>p.NazivPlesa==nazivPlesa).ToListAsync();
        }

        [Route("PreuzmiSlobodneTermineCasova/{kImeInstruktora}/{nazivPlesa}")]
        [HttpGet]
        public async Task<List<SlobodanTerminCasa>> PreuzmiSlobodneTermineCasova(string kImeInstruktora,string nazivPlesa)
        {
            await this.ObrisiZastareleTermine(nazivPlesa);
            return await Context.SlobodniTerminiCasa.Where(p=>p.NazivPlesa==nazivPlesa && p.KorisnickoImeInstruktora==kImeInstruktora).ToListAsync();
        }

        [Route("ObrisiZastareleTermine/{nazivPlesa}")]
        [HttpGet]
        public async Task  ObrisiZastareleTermine(string nazivPlesa)
        {
            string trenutniDatum= DateTime.Now.ToString("MM/dd/yyyy");
            
            List<SlobodanTerminCasa> slobodniTermini=await Context.SlobodniTerminiCasa.Where(p=>p.NazivPlesa==nazivPlesa).ToListAsync();
            foreach (var termin in slobodniTermini)
            {
                string [] datumTermin=termin.Datum.Split("/");
                string [] datumDanas=trenutniDatum.Split("/");
                if(Int32.Parse(datumTermin[0])<Int32.Parse(datumDanas[0]) || Int32.Parse(datumTermin[0])==Int32.Parse(datumDanas[0]) && Int32.Parse(datumTermin[1])<Int32.Parse(datumDanas[1]) )
                    {
                        Context.SlobodniTerminiCasa.Remove(termin);
                    }
            }
            await Context.SaveChangesAsync();
        }

        [Route("DodajTermineClanu/{idTermina}/{idClana}")]
        [HttpPost]
        public async Task<IActionResult> DodajTermineClanu(int idTermina,int idClana)
        {
            SlobodanTerminCasa slobodanTermin=await Context.SlobodniTerminiCasa.FindAsync(idTermina);
            ClanPlesneSkole clan = await Context.ClanoviPlesneSkole.Include(p=>p.Clanarina).Where(p=>p.ID==idClana).FirstOrDefaultAsync();
            CasPlesa cas= await Context.CasoviPlesa.Where(p=>p.Naziv==slobodanTermin.NazivPlesa).FirstOrDefaultAsync();
            if(clan.Clanarina.Placena==false && clan.ProbniTermin==false)
            {
                return StatusCode(451);
            }
            else  if(slobodanTermin.TrenutanBrojLjudi>=slobodanTermin.MaximalanBrojLjudi)
            {
                return StatusCode(452);
            }
            else if(clan.Clanarina.Placena==false && clan.ProbniTermin==true)
            {
                slobodanTermin.TrenutanBrojLjudi++;
                ClanSlobodanTermin clanovitermini=new ClanSlobodanTermin();
                clanovitermini.ClanId=idClana;
                clanovitermini.SlobodanTerminId=idTermina;
                Context.ClanoviSlobodniTermini.Add(clanovitermini);
                clan.ProbniTermin=false;
                await Context.SaveChangesAsync();
                return Ok();
            }
            else 
            {
                slobodanTermin.TrenutanBrojLjudi++;
                ClanSlobodanTermin clanovitermini=new ClanSlobodanTermin();
                clanovitermini.ClanId=idClana;
                clanovitermini.SlobodanTerminId=idTermina;
                Context.ClanoviSlobodniTermini.Add(clanovitermini);
                clan.Clanarina.Iznos+=cas.Cena;
                await Context.SaveChangesAsync();
                return Ok();
            }
        }

        
        [Route("PreuzmiTermineClana/{id}")]
        [HttpGet]
        public async Task<List<SlobodanTerminCasa>> PreuzmiTermineClana(int id)
        {
            List<SlobodanTerminCasa> termini=new List<SlobodanTerminCasa>();
            string trDatum= DateTime.Now.ToString("MM/dd/yyyy" );
           List<ClanSlobodanTermin> clanovitermini= await Context.ClanoviSlobodniTermini.Where(p=>p.ClanId==id).ToListAsync();
            foreach (var ter in clanovitermini)
            {
                SlobodanTerminCasa termin= await Context.SlobodniTerminiCasa.Where(p=>p.ID==ter.SlobodanTerminId).FirstOrDefaultAsync();
                if(termin!=null)

                {
                    
                    
                    string [] datumTermin=termin.Datum.Split("/");
                
                    string [] datumDanas=trDatum.Split("/");
                    
                   if((Int16.Parse(datumTermin[0])>Int16.Parse(datumDanas[0])) || (Int16.Parse(datumTermin[0])==Int16.Parse(datumDanas[0])) && (Int16.Parse(datumTermin[1])>=Int16.Parse(datumDanas[1])) )
                    {

                        termini.Add(termin);
                    }
                    
                  

               
                }
            }
           

            return termini;
        }

        [Route("PreuzmiClanoveTermina/{id}")]
        [HttpGet]
        public async Task<List<ClanPlesneSkole>> PreuzmiClanoveTermina(int id)
        {
            List<ClanPlesneSkole> clanovi=new List<ClanPlesneSkole>();
            List<ClanSlobodanTermin> clanovitermini= await Context.ClanoviSlobodniTermini.Where(p=>p.SlobodanTerminId==id).ToListAsync();
            foreach (var ter in clanovitermini)
            {
               ClanPlesneSkole clan= await Context.ClanoviPlesneSkole.Where(p=>p.ID==ter.ClanId).FirstOrDefaultAsync();
                clanovi.Add(clan);
                
            }
            return clanovi;
        }

        [Route("ObrisiClanoveTermina/{id}")]
        [HttpDelete]
        public async Task ObrisiClanoveTermina(int id)
        {
            ClanSlobodanTermin clanoviTerm=await  Context.ClanoviSlobodniTermini.FindAsync(id);
            Context.ClanoviSlobodniTermini.Remove(clanoviTerm);
            await Context.SaveChangesAsync();
        }

        [Route("OtkaziTermin/{idClana}/{idTermina}")]
        [HttpDelete]
        public async Task OtkaziTermin(int idClana,int idTermina)
        {
            ClanSlobodanTermin clanoviTerm=await  Context.ClanoviSlobodniTermini.Where(p=>p.ClanId==idClana && p.SlobodanTerminId==idTermina).FirstOrDefaultAsync();
            ClanPlesneSkole clan= await Context.ClanoviPlesneSkole.Include(p=>p.Clanarina).Where(p=>p.ID==idClana).FirstOrDefaultAsync();
            SlobodanTerminCasa termin =await Context.SlobodniTerminiCasa.FindAsync(idTermina);
            CasPlesa cas= await Context.CasoviPlesa.Where(p=>p.Naziv==termin.NazivPlesa).FirstOrDefaultAsync();
            if(cas.Naziv=="Prvi ples na vencanju")
            {
                Context.SlobodniTerminiCasa.Remove(termin);
                clan.Clanarina.Iznos-=cas.Cena;
            }
            else
            {
                Context.ClanoviSlobodniTermini.Remove(clanoviTerm);
                clan.Clanarina.Iznos-=cas.Cena;
                termin.TrenutanBrojLjudi--;
            }   
            await Context.SaveChangesAsync();
        }

        [Route("PreuzmiClanoveITermine")]
        [HttpGet]
        public async Task<List<ClanSlobodanTermin>> PreuzmiClanoveITermine()
        {
           return await Context.ClanoviSlobodniTermini.ToListAsync();
        }

        [Route("PreuzmiSveZahteve")]
        [HttpGet]
        public async Task<List<Zahtev>> PreuzmiSveZahteve()
        {
           return await Context.Zahtevi.ToListAsync();
        }

        [Route("PosaljiZahtevInstruktoru/{id}")]
        [HttpPost]
        public async Task<IActionResult> PosaljiZahtevInstruktoru(int id,[FromBody]Zahtev zahtev)
        {
            InstruktorPlesa instruktor=await Context.InstruktoriPlesa.Include(p=>p.Zahtevi).Where(p=>p.ID==id).FirstOrDefaultAsync();
            ClanPlesneSkole clan=await Context.ClanoviPlesneSkole.Include(p=>p.Clanarina).Where(p=>p.ID==zahtev.ClanPlesneSkoleId).FirstOrDefaultAsync();
            if(clan.Clanarina.Placena==false && clan.ProbniTermin==false)
            {
                return StatusCode(451);
            }
            else if(clan.Clanarina.Placena==false && clan.ProbniTermin==true)
            {
                zahtev.ClanPlesneSkoleIme=clan.Ime;
                zahtev.ClanPlesneSkolePrezime=clan.Prezime;
                zahtev.ZahtevPrihvacen="Čekanje potvrde";
                clan.ProbniTermin=false;
                Context.Zahtevi.Add(zahtev);
                instruktor.Zahtevi.Add(zahtev);
                await Context.SaveChangesAsync();
                return Ok();
            }
            else if(clan.Clanarina.Placena==true)
            {
                zahtev.ClanPlesneSkoleIme=clan.Ime;
                zahtev.ClanPlesneSkolePrezime=clan.Prezime;
                zahtev.ZahtevPrihvacen="Čekanje potvrde";
                Context.Zahtevi.Add(zahtev);
                instruktor.Zahtevi.Add(zahtev);
                await Context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest();
            } 
        }
        
        [Route("ObrisiZahtev/{id}")]
        [HttpDelete]
        public async Task ObrisiZahtev(int id)
        {
            Zahtev zahtev= await Context.Zahtevi.FindAsync(id);
            Context.Zahtevi.Remove(zahtev);
            await Context.SaveChangesAsync();
        }

        [Route("OdbijZahtev/{idInstruktora}/{idZahteva}")]
        [HttpPut]
        public async Task OdbijZahtev (int idInstruktora,int idZahteva)
        {
           
           Zahtev zahtev= await Context.Zahtevi.FindAsync(idZahteva);
           zahtev.ZahtevPrihvacen="Odbijen";
           await Context.SaveChangesAsync();
        }

        [Route("PreuzmiZahteveInstruktora/{id}")]
        [HttpGet]
        public async Task<List<Zahtev>> PreuzmniZahteveInstruktora(int id)
        {
            InstruktorPlesa instruktor=await Context.InstruktoriPlesa.Include(p=>p.Zahtevi).Where(p=>p.ID==id).FirstOrDefaultAsync();
            List<Zahtev> zahtevi=new List<Zahtev>();
            foreach (var zahtev in instruktor.Zahtevi)
            {
                if(zahtev.ZahtevPrihvacen!="Odbijen" && zahtev.ZahtevPrihvacen!="Prihvaćen")
                {
                    zahtevi.Add(zahtev);
                }
            }
            return  zahtevi;
        }

        [Route("PreuzmiZahteveClana/{id}")]
        [HttpGet]
        public async Task<List<Zahtev>> PreuzmniZahteveClana(int id)
        {
            return await Context.Zahtevi.Where(p=>p.ClanPlesneSkoleId==id).ToListAsync();
        }

        [Route("ObrisiCasInstruktoru/{idCasa}/{idInstruktora}")]
        [HttpDelete]
        public async Task ObrisiCasInstruktoru(int idCasa,int idInstruktora)
        {
            InstruktorCasPlesa instruktorCas=await Context.InstruktoriCasoviPlesa.Where(p=>p.CasPlesaId==idCasa && p.InstruktorPlesaId==idInstruktora).FirstOrDefaultAsync();
            Context.Remove(instruktorCas);
            await Context.SaveChangesAsync();

        }

        [Route("PrihvatiZahtev/{idZahteva}")]
        [HttpPost]
        public async Task PrihvatiZahtev(int idZahteva,[FromBody]Zahtev zaht)
        {
           Zahtev zahtev= await Context.Zahtevi.FindAsync(idZahteva);
           CasPlesa cas=await Context.CasoviPlesa.FindAsync(zahtev.CasPlesaId);
           InstruktorPlesa instruktor= await Context.InstruktoriPlesa.FindAsync(zahtev.InstruktorPlesaId);
           ClanPlesneSkole clan= await Context.ClanoviPlesneSkole.Include(p=>p.Clanarina).Where(p=>p.ID==zahtev.ClanPlesneSkoleId).FirstOrDefaultAsync();
           SlobodanTerminCasa termin=new SlobodanTerminCasa();
           termin.NazivPlesa=cas.Naziv;
           termin.KorisnickoImeInstruktora=instruktor.KorisnickoIme;
           termin.ImeInstruktora=instruktor.Ime;
           termin.PrezimeInstruktora=instruktor.Prezime;
           termin.Datum=zaht.Datum;
           termin.VremePocetkaTermina=zaht.VremePocetka;
           termin.VremeKrajaTermina=zaht.VremeKraja;

           Context.SlobodniTerminiCasa.Add(termin);
           await Context.SaveChangesAsync();

           ClanSlobodanTermin clanTermin= new ClanSlobodanTermin();
           clanTermin.ClanId=zahtev.ClanPlesneSkoleId;
           clanTermin.SlobodanTerminId=termin.ID;
           Context.ClanoviSlobodniTermini.Add(clanTermin);

           //Context.Zahtevi.Remove(zahtev);
           zahtev.ZahtevPrihvacen="Prihvaćen";
           clan.Clanarina.Iznos+=cas.Cena;
           await Context.SaveChangesAsync();
       }

        [Route("IzmeniOpisCasaPlesa/{idCasa}/{noviOpis}")]
        [HttpPut]
        public async Task IzmeniOpisCasaPlesa (int idCasa, string noviOpis)
        {
           CasPlesa cas= await Context.CasoviPlesa.FindAsync(idCasa);
           cas.Opis=noviOpis;
           await Context.SaveChangesAsync();
        }
        
        [Route("IzmeniOpisInstruktora/{idInstruktora}/{noviPrviOpis}/{noviDrugiOpis}")]
        [HttpPut]
        public async Task IzmeniOpisInstruktora (int idInstruktora,string noviPrviOpis,string noviDrugiOpis)
        {
           InstruktorPlesa instruktor= await Context.InstruktoriPlesa.FindAsync(idInstruktora);
           instruktor.PrviOpis=noviPrviOpis;
           instruktor.DrugiOpis=noviDrugiOpis;
           await Context.SaveChangesAsync();
        }

        [Route("IzmeniPrviOpisInstruktora/{idInstruktora}/{noviPrviOpis}")]
        [HttpPut]
        public async Task IzmeniPrviOpisInstruktora (int idInstruktora,string noviPrviOpis)
        {
           InstruktorPlesa instruktor= await Context.InstruktoriPlesa.FindAsync(idInstruktora);
           instruktor.PrviOpis=noviPrviOpis;
           await Context.SaveChangesAsync();
        }

        [Route("IzmeniDrugiOpisInstruktora/{idInstruktora}/{noviDrugiOpis}")]
        [HttpPut]
        public async Task IzmeniDrugiOpisInstruktora (int idInstruktora,string noviDrugiOpis)
        {
           InstruktorPlesa instruktor= await Context.InstruktoriPlesa.FindAsync(idInstruktora);
           instruktor.DrugiOpis=noviDrugiOpis;
           await Context.SaveChangesAsync();
        }

        [Route("DodajCas")]
        [HttpPost]
        public async Task DodajCas([FromBody] CasPlesa cas)
        {
             PlesnaSkola ps= await Context.PlesnaSkola.Where(p=>p.Naziv=="Plesna skola Bailamos").FirstOrDefaultAsync();
             cas.PlesnaSkola=ps;
             Context.CasoviPlesa.Add(cas);
             await Context.SaveChangesAsync();

        }

    }

}
