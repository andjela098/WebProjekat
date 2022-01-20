export class Stavka {
    constructor(id,vrsta, cena, naziv,por){
      
        this.id = id;
        this.vrsta=vrsta; 
        this.cena = cena;
        this.naziv=naziv;
        this.por = por;
        
        this.kontStavka=null;
    }
    crtajStavku(host){
        var thisPok =this;

        if(!host)
            throw new Error("Host doesn't exist!");

        const divZasliku = document.createElement("div");
        if(this.vrsta=="jelo" || this.vrsta=="Jelo")
            divZasliku.className="jelo";
        else
            divZasliku.className="pice";

        const SlikaNaziv = document.createElement("div");
        SlikaNaziv.className= "SlikaNaziv";
        SlikaNaziv.appendChild(divZasliku);
        const nazivJela = document.createElement("label");
        nazivJela.innerHTML = this.naziv +", "+this.cena;
        nazivJela.style.alignSelf="center";
        let dugmeObrisiStavku = document.createElement("button");
        dugmeObrisiStavku.className = "dugmeX";
        dugmeObrisiStavku.style.flexGrow = 0;
        dugmeObrisiStavku.innerHTML = 	"&#x1f5d1;";


        dugmeObrisiStavku.onclick=(ev)=>{
           
           

            fetch("https://localhost:5001/Stavka/DeleteStavku/" + this.id ,{
                method: 'DELETE', 
                headers: {
                 'Content-type': 'application/json'
                }
            }).then(resp =>{
                if (resp.status == 200) {
                   
                    this.por.stavke.splice(this.por.stavke.findIndex(v => v.id==this.id ), 1); 
                    
                    if(this.por.stavke.length==0)
                    {   

                       // document.querySelector(".kontPorudzbina"+this.por.id).remove();
                        //this.por.stokont.classList.add("Roze");
                        this.por.sto.Oslobodi(this.por.kontPorudzbina);
                       // this.por.kontPorudzbina.remove();
                        ///this.por.kontPorudzbina = null;
                        
                    }
                    thisPok.kontStavka.remove(); //brisi iz baze 
                   
                    alert("Stavka Obrisana!");
                } 
                else if(resp.status == 404 )
                    alert("Error 404!");
                else{
                    alert(resp.status);
                }
            
            })
            
           
              
        }


        SlikaNaziv.appendChild(nazivJela);
        SlikaNaziv.appendChild(dugmeObrisiStavku);
        
        this.kontStavka=SlikaNaziv;
        host.appendChild(this.kontStavka);
    }
    
    
}