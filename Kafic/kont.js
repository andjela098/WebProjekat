import { Kafic } from "./Kafic.js";
import { Porudzbina } from "./Porudzbina.js";
import { Sto } from "./Sto.js";
export class Kontejner{

    constructor(host){
        this.kont = null;
    }

    drawCont(host){
        
        
        const futerDiv = document.createElement("div");
        futerDiv.className="Prva";
        this.kont = futerDiv;
      
        let Lab = document.createElement("h3");
        Lab.innerText = "Izaberite opciju koju zelite:";
        futerDiv.appendChild(Lab);
        let  divic = document.createElement("div");
        divic.classList.add("SlikaNaziv");

        futerDiv.appendChild(divic);
        let divRAdio = document.createElement("div");
        divRAdio.className = "divRadio";
        
        divic = document.createElement("div");
        let rad = document.createElement("input");
        rad.type = "radio";
        rad.value = 1;
        rad.className = "izbor";
        rad.name = "izbor";
        rad.checked = true;
        let lab = document.createElement("label");
        lab.innerHTML = "Ucitaj sve iz baze";
        divic.appendChild(rad);
        divic.appendChild(lab);
        divRAdio.appendChild(divic);
       
        divic = document.createElement("div");
        rad = document.createElement("input");
        rad.className = "izbor";
        rad.value = 2;
        rad.type = "radio";
        rad.name = "izbor";
        lab = document.createElement("label");
        lab.innerHTML = "Kreirajte Sami";
        divic.appendChild(rad);
        divic.appendChild(lab);
        divRAdio.appendChild(divic);
      
        
        divRAdio.appendChild(divic);
       



        futerDiv.appendChild(divRAdio);
    

        const dugme = document.createElement("button");
        dugme.innerHTML = "Submit";
        dugme.className ="SubmitD";
        futerDiv.appendChild(dugme);

        dugme.onclick = (ev) => {
            let izb = this.kont.querySelector(`input[name='izbor']:checked`).value;
            
         
            if(izb==1){
                this.kont.remove();     
                this.ucitajSve(host);
                

            }
            
            else{
                
                divic = document.createElement("div");
                divic.className = "cena";
                lab = document.createElement("label");
                lab.innerHTML = "Ime Kafica : ";
                divic.appendChild(lab);

                let tb = document.createElement("input");
                tb.className = "naziv";
                divic.appendChild(tb);

                               
                this.kont.appendChild(divic);

                divic = document.createElement("div");
                lab = document.createElement("label");
                lab.innerHTML = "Broj stolova:";
                divic.appendChild(lab);

                tb = document.createElement("input");
                tb.type = "number";
                tb.className = "stobr";
                divic.appendChild(tb);
                this.kont.appendChild(divic);
                const dugme = document.createElement("button");
               
                dugme.innerHTML = "Ok";
                dugme.className="SubmitD"
                this.kont.appendChild(dugme);

                dugme.onclick = (ev) => {
                        this.kont.remove();
                        let ime  = this.kont.querySelector(".naziv").value;
                        let broj = this.kont.querySelector(".stobr").value;
                        this.creirajNovi(host, ime,broj);


                }
            }

        }

        
        host.appendChild(futerDiv);
        
    
    }



    ucitajSve(host){
        this.kont = document.createElement("div");
        var kafici = {};
        let k = 0;
        fetch("https://localhost:5001/Kafic/GetKafic").then(p => {
        p.json().then(data => {

            data.forEach(e => {
                kafici[k] = new Kafic(e.id,e.n,e.naziv);
                
                e.stolovi.forEach(el => {
                        
                        kafici[k].dodajStoIPorudzbinu(el,el.porudzbina);
                  
                
                });

             
                
                kafici[k].kontKafic=this.kont;
                
                kafici[k].crtajKafic(this.kont);
             
                host.appendChild(this.kont);
                k++;
            });
        })
        /*let dugme = document.createElement("button");
        dugme.innerHTML="Nazad";
        this.kont.appendChild(dugme);
        dugme.onclick = (ev) => {
            this.kont.remove();
            this.kont.drawCont(document.body);
        }
    */


    });
    }
    
    creirajNovi( host ,naziv,broj){
      
        this.kont = document.createElement("div");
        fetch("https://localhost:5001/Kafic/CreateKafic" , {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Naziv: naziv,
                N: broj
            })
            }).then(resp => {
                if (resp.status == 200) {
                   resp.json().then(id => {
                            var newKaf = new Kafic(id);
                            newKaf.naziv = naziv;
                            newKaf.n = broj;
                            newKaf.kontKafic=this.kont;
                            newKaf.crtajKafic(this.kont);
                            host.appendChild(this.kont);
                            
                        })
                    }
                    
             });
    }


}