import { Porudzbina } from "./Porudzbina.js";
import { Stavka } from "./Stavka.js";
import { Sto } from "./Sto.js";

export class Kafic {
    constructor(id,n,naziv){   
        this.id =id;
        this.n=n; 
        this.naziv=naziv; 
        this.stolovi=[];
        this.kontKafic = null;
    }
    
    async load(){
        var resp = await fetch("https://localhost:5001/Kafic/GetKafic/" + this.id);
        var data = await resp.json();
        this.naziv = data["naziv"];
        this.n = data["n"];
        
      
        data.stolovi.forEach(e => {
           this.dodajStoIPorudzbinu(e,e.porudzbina);
           
        });
      
    }
    dodajSto(sto){
        this.stolovi[sto.broj]=sto;
    }
    async crtajKafic(host){
        if (this.naziv == null) await this.load();
       
        var PokazivacNaKafic = this;
    
        const kontejner = document.createElement("div");
        kontejner.classList.add("kontejner");
        this.kontKafic = kontejner;
        const futerDiv = document.createElement("div");
        futerDiv.classList.add("futerDiv");
        let dugmeEdit = document.createElement("button");
        dugmeEdit.innerHTML="&#9998;";
        dugmeEdit.classList.add("dugmeX");
        dugmeEdit.disabled = false;

        //res
        let Lab = document.createElement("h2");
        Lab.innerText = this.naziv;
        Lab.appendChild(dugmeEdit);
        dugmeEdit.onclick = (ev) =>{
            ev.preventDefault();
            var newName = prompt("Novo ime:");
            if (newName != null){  
                if (newName == ""){
                alert("Molimo vas unesite novo ime:");
                return;
            }
            if (newName.length > 255) {
                alert("Ime kafica ne moze da sadrzi vise od 255 karaktera!");
                return;
            }
                fetch("https://localhost:5001/Kafic/EditKafic/" + PokazivacNaKafic.id, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        N: PokazivacNaKafic.n,
                        Naziv: newName
                    })
                }).then(resp => {
                    if (resp.status == 204) {
                        PokazivacNaKafic.naziv = newName;
                        Lab.innerText=newName;
                        Lab.appendChild(dugmeEdit);
                        alert("Ime kafica je uspesno azurirano!");
                    }
                });
            }
        }
      
        futerDiv.appendChild(Lab)
     
      

        let Laba = document.createElement("labela");
        Laba.innerHTML = "Broj stolova: "+this.n;
        futerDiv.appendChild(Lab);

         const glavniDiv = document.createElement("div");
        glavniDiv.className = "glavniDiv";
       
        const divZASto = document.createElement("div");
        divZASto.className = "divZaSto";

        const divZaPorIFormu = document.createElement("div");
        divZaPorIFormu.className = "divZaPorIFormu";



        

        let dugme = document.createElement("button");
        dugme.innerHTML="Dodaj sto";
        dugme.className = "dugmePlus";
        dugme.disabled = false;
        futerDiv.appendChild(dugme);
        let idkaf = this.id;

        


        dugme.onclick=(ev)=>{
            PokazivacNaKafic.n++;
            let k= document.getElementById("Por++");
            
            if(k!=null && k.disabled == true)
                k.disabled = false;
                fetch("https://localhost:5001/Sto/CreateSto/" + idkaf, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                            Broj: PokazivacNaKafic.n,
                            Status: "+",
                            KaficId: idkaf
                    })
                }).then(resp => {
                    if (resp.status == 200) {
                       resp.json().then(id => {
                                var newSto = new Sto(id,PokazivacNaKafic.n,"Slobodan",PokazivacNaKafic.id,null);
                                this.dodajSto(newSto);
                                Laba.innerHTML="Broj stolova: "+this.n;
                                newSto.crtajSto(divZaPorIFormu,divZASto);
                                
                            })
                        }
                        
                 });
        };
             

        futerDiv.appendChild(dugme);

        let dugme2 = document.createElement("button");
        dugme2.innerHTML="&#127860";
        dugme2.className = "dugmePlus";
        dugme2.id = "Por++";
        futerDiv.appendChild(dugme2);
        
        kontejner.appendChild(futerDiv);
        

        for(let i=1; i<=this.n;i++){
            if(this.stolovi[i]==null){

                  fetch("https://localhost:5001/Sto/CreateSto/" + idkaf, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Broj: i,
                        Status: "Slobodan"
                      
                        
                    })  
                }).then(resp => {
                    if (resp.status == 200) {
                        resp.json().then(id => {
                            var newSto = new Sto(id,i,"Slobodan",PokazivacNaKafic.id,null);
                            this.dodajSto(newSto);
                            newSto.crtajSto(divZaPorIFormu,divZASto);
                           
                        })
                    }
                });
            
                   

            } else
            this.stolovi[i].crtajSto(divZaPorIFormu,divZASto);
        }
        var niz= [];
        dugme2.onclick=(ev)=>{
            niz = this.stolovi.filter(p=> p.status == "Slobodan" ).map((item) => item.broj);
        
            if(!niz.length)
            dugme2.disabled = true;
            else{
            this.formaZaIzborStola(niz,kontejner);
            glavniDiv.classList.add("noneNulaCetiri");
            futerDiv.classList.add("noneNulaCetiri");
            
            }
        }

        
        glavniDiv.appendChild(divZaPorIFormu);
        glavniDiv.appendChild(divZASto);
        kontejner.appendChild(glavniDiv);
        host.appendChild(kontejner);
    
    

    }
    formaZaIzborStola(niz, host){
       
        const formaZaIzborSt = document.createElement("div");
        formaZaIzborSt.className = "formaZaIzborSt";
    
        let p = new Porudzbina(null,null,null,null,null,null); 
        

        p.kreirajOpcijezaJela(formaZaIzborSt,niz,"Br.Stola:",0);

        let dugmeX = document.createElement("button");
        dugmeX.innerHTML="x";
        dugmeX.className="dugmeX";
    
        dugmeX.onclick=(ev)=>{

            this.kontKafic.querySelector(".glavniDiv").classList.remove("noneNulaCetiri"); 
            this.kontKafic.querySelector(".futerDiv").classList.remove("noneNulaCetiri"); 
          

            this.kontKafic.removeChild(formaZaIzborSt);
        }
        formaZaIzborSt.appendChild(dugmeX);
        dugmeX = document.createElement("button");
        dugmeX.innerHTML="&#x2714";
        dugmeX.className="dugme";
    
        dugmeX.onclick=(ev)=>{
            let div1 = this.kontKafic.querySelector(".glavniDiv");  
            div1.classList.remove("noneNulaCetiri"); 
           
            let div2=this.kontKafic.querySelector(".futerDiv");
            div2.classList.remove("noneNulaCetiri"); 
           
            div1 = this.kontKafic.querySelector(".divZaPorIFormu");
           
            div2 = this.kontKafic.querySelector(".divZaSto");
            
            let br = parseInt(document.getElementById("Br.Stola:0").value);

            if(this.stolovi[br]==null){
            fetch("https://localhost:5001/Sto/CreateSto/" + this.id, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Broj: br,
                        Status: "Slobodan",
                        Porudzbine: null,
                        KaficId: this.id
                        
                    })  
                }).then(resp => {
                    if (resp.status == 200) {
                        resp.json().then(id => {
                            this.stolovi[br]= new Sto(id,br,"Slobodan",this.id,null);
                           
                        })
                    }
                });
            }

           
            this.stolovi[br].status = "Zauzet";
            this.stolovi[br].crtajSto(div1,div2); 
            fetch("https://localhost:5001/Sto/ZauzmiSto/" + this.stolovi[br].id, 
            {
                method: 'PUT',
                mode: 'cors',
                headers: {
                            'Content-Type': 'application/json'
                         },
                body: JSON.stringify({
                        Broj:br,
                         Status: "Zauzet",
                         KaficId: this.stolovi[br].id
                        })
                        }).then(resp => {
                        if (resp.status == 204) {
        
                        
                            alert(`Sto ${this.stolovi[br].broj} je upravo zauzet.Molimo vas dodajte porudzbinu!`);
                        }
                });

            let niz = this.stolovi.filter(p=> p.status == "Slobodan" ).map((item) => item.broj);
        
            if(!niz.length)
                document.getElementById("Por++").disabled =true;
            this.kontKafic.removeChild(formaZaIzborSt);
        }
        formaZaIzborSt.appendChild(dugmeX);
    
        host.appendChild(formaZaIzborSt);
   
    }
    dodajStoIPorudzbinu(el, porudzbina){
        var st;
        
        if(el.status=="Zauzet" && porudzbina!=null){
        var p = new Porudzbina(porudzbina.id,el.id,el.broj, el.kaficId,null,null,null);
        porudzbina.stavke.forEach(el=>{
            p.stavke.push(new Stavka(el.id,el.vrsta,el.cena,el.naziv,p));
        });
        }
        else p=null;
       
        st = new Sto(el.id,el.broj,el.status,el.kaficId, p);
        
        this.dodajSto(st);
        if(p!=null){
        this.stolovi[st.broj].porudzbinica.sto= this.stolovi[st.broj];
        this.stolovi[st.broj].porudzbinica.stokont = this.stolovi[st.broj].refDiv;
        }
    }
}