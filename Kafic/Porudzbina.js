import { Stavka } from "./Stavka.js";


export class Porudzbina {
    constructor(id,idStola,broj,kaficid,kontPorudzbina,sto,stokon) {
        this.id =id;
        this.idS = idStola;
        this.brojStola=broj;
        this.kaficid=kaficid;
        this.sto=sto;
        this.stokont=stokon;
        this.stavke=[];
        this.kontPorudzbina = kontPorudzbina;
    }
    
    crtajPoruzbinu(host){
        
        this.kontPorudzbina = document.createElement("div");
        this.kontPorudzbina.className="kontPorudzbina"+this.id;
        
        let cenaLab = document.createElement("h3");
        
        cenaLab.innerHTML = "Sto: "+this.brojStola;
        this.kontPorudzbina.appendChild(cenaLab);

        let divZaStavku = document.createElement("div");
        divZaStavku.className= "divSlikaNaziv";
        
        this.stavke.forEach(el=>{
            if(el!=null)
                el.crtajStavku(divZaStavku);
            
        });
        this.kontPorudzbina.appendChild(divZaStavku);
       
        let divZaNovustavku = document.createElement("div");
        divZaNovustavku.className= "divZastavku";
        let jela= ["None","Palacinka", "Sendvic", "Pomfrit", "Kolac","Pica","Pasta"];
        let pica= ["None","Sok","Kafa","Caj","Pivo","Voda"];
        this.kreirajOpcijezaJela(divZaNovustavku,jela,"Jelo: ",this.id);

        let cenaL = document.createElement("labela");
        cenaL.innerHTML = "Cena Jela: ";
        divZaNovustavku.appendChild(cenaL);
        let cena = document.createElement("input");
        cena.className = "cenaJ"+this.id; 
        cena.type = "number";
        divZaNovustavku.appendChild(cena);
        
        this.kreirajOpcijezaJela(divZaNovustavku,pica,"Pice: ",this.id);
        cenaL = document.createElement("labela");
        cenaL.innerHTML = "Cena Pica: ";
        divZaNovustavku.appendChild(cenaL);

        cena = document.createElement("input");
        cena.className = "cenaP"+this.id;
        cena.type = "number";
        divZaNovustavku.appendChild(cena);
        this.kontPorudzbina.appendChild(divZaNovustavku);

        let divZaDugmice = document.createElement("div");
        divZaDugmice.className= "divZaDugmice";
        let dugmePlus = document.createElement("button");
        dugmePlus.innerHTML="Dodaj Stavku";
        dugmePlus.className = "dugmeDodaj";
       
        dugmePlus.onclick=(ev)=>{
            
            this.preuzmiStavkeIzForme(divZaStavku);
        }
        divZaDugmice.appendChild(dugmePlus);

        let dugmeX = document.createElement("button");
        dugmeX.innerHTML="x";
        dugmeX.className = "dugmePlus";
    
        dugmeX.onclick=(ev)=>{
            if(this.stavke.length==0 && this.sto!=null){
                if(this.stokont==null) this.stokont = this.sto.refDiv;
            this.stokont.classList.add("Roza");
        }
            this.kontPorudzbina.classList.add("sakrivenaPor");
            
            
        }
        divZaDugmice.appendChild(dugmeX);
      
        this.kontPorudzbina.appendChild(divZaDugmice);  
        host.appendChild(this.kontPorudzbina);
    
    }

    kreirajOpcijezaJela(host , niz, naziv,br){ 
    
        let SelJela = document.createElement("select");
        SelJela.id= naziv+br;
    
        let  labela = document.createElement("label");
        labela.innerHTML = naziv;
        host.appendChild(labela);
        host.appendChild(SelJela);
    
        niz.forEach(el=>{
            let opcija = document.createElement("option");
            opcija.innerHTML = el;
            opcija.value = el;
            SelJela.appendChild(opcija);
        })
    }
    preuzmiStavkeIzForme(host){
       

        let jelo = document.getElementById("Jelo: "+this.id).value;
        let pice = document.getElementById("Pice: "+this.id).value;

        let cenaJ = parseInt(this.kontPorudzbina.querySelector(".cenaJ"+this.id).value);
        let cenaP = parseInt(this.kontPorudzbina.querySelector(".cenaP"+this.id).value);

        let NovoJelo=null;
        let NovoPice=null;
           
        if(isNaN(cenaJ) && jelo!="None" )
            alert("Niste uneli cenu za jelo!");
        else if(isNaN(cenaJ) && jelo=="None" )
        {
            
        }
        else{
                
            if(jelo!="None"){
                
                NovoJelo = new Stavka(null,"jelo",cenaJ,jelo, this );   //dodaj u bazu 
                if(NovoJelo!=null){

                    fetch("https://localhost:5001/Stavka/CreateStavku/" + this.id, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                            Vrsta: "jelo",
                            Cena: cenaJ,
                            Naziv: jelo,
                            PorudzbinaId: this.id
                    })
                    }).then(resp => {
                    if (resp.status == 200) {
                       resp.json().then(id => {
                                NovoJelo.id = id;
                                this.stavke.push(NovoJelo);
                    
                                this.azurirajPrikaz(host,NovoJelo);
                                
                            })
                        }
                        
                     });
                   
                }
            }
        }  
             
        if(isNaN(cenaP) && pice!="None")
            alert("Niste uneli cenu za pice!"); 
        else if(isNaN(cenaP) && pice=="None" )
        {
                
        }
       
        else{
            
            if(pice!="None"){
                
                NovoPice = new Stavka(null,"pice",cenaP,pice,this ); //dodaj u bazu
                if(NovoPice!=null){
                    fetch("https://localhost:5001/Stavka/CreateStavku/" + this.id, {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                                Vrsta: "pice",
                                Cena: cenaP,
                                Naziv: pice,
                                PorudzbinaId: this.id
                        })
                        }).then(resp => {
                        if (resp.status == 200) {
                           resp.json().then(id => {
                                    NovoPice.id = id;
                                    this.stavke.push(NovoPice);
                        
                                    this.azurirajPrikaz(host,NovoPice);
                                    
                                })
                            }
                            
                         });
                            } 
                       
            }  
             
        }

        document.getElementById("Jelo: "+this.id).value = "None";
        document.getElementById("Pice: "+this.id).value= "None";
    
        this.kontPorudzbina.querySelector(".cenaJ"+this.id).value=null;
        this.kontPorudzbina.querySelector(".cenaP"+this.id).value=null;
    
    }
    azurirajPrikaz(host, stavka){
      
        document.querySelector(".Sto"+this.idS).classList.add("Zelena");
        this.kontPorudzbina.querySelector("h3").innerHTML="Sto: "+this.brojStola;
        stavka.crtajStavku(host);
      
    }

}

