import { Porudzbina } from "./Porudzbina.js";

export class Sto {
    constructor(id,broj,stat,kafeid,por){
        this.id=id;
        this.broj=broj;
         // status je slobodan i zauzet; 
        
        this.status=stat;
        this.kaficid=kafeid;
        this.porudzbinica=por; 
        this.refDiv = null; //kafa, caj
        this.kontPorudzbina=null; 
    }
   
    crtajSto(host,hostzaSto){
        if(!host || !hostzaSto)
            throw new Error("Host doesn't exist!");

     
      
        let kont= document.createElement("div");
        kont.className="Sto"+this.id;
        

        let StoLabela = document.createElement("label");
        StoLabela.innerHTML = "Sto: "+this.broj+"  "+this.status;
        kont.appendChild(StoLabela);
        
        let dugme = document.createElement("button");
        
        dugme.innerHTML="Porudzbina";
        dugme.className = "dugmePlus";
        //dugme.classList.add("btn btn-primary");
        
        dugme.disabled = true;
        kont.appendChild(dugme);
        
        
        let dugme2 = document.createElement("button");
        dugme2.innerHTML="Oslobodi";
        dugme2.className = "dugmePlus";
        dugme2.disabled = true;
        kont.appendChild(dugme2);
        
        
        if(this.status=="Zauzet"){
           
            if(this.porudzbinica==null || this.porudzbinica.stavke.length==0)
            kont.classList.add("Roza");  
            else 
            kont.classList.add("Zelena");  
            
            dugme.disabled = false;
            dugme2.disabled = false;
        
            dugme.onclick=(ev)=>{
               
                    this.funkcijaZadugme1(host);
               
            }

            dugme2.onclick=(ev)=>{
               
                this.Oslobodi(host);
               
            }  
            if(this.refDiv==null){
                this.refDiv=kont;
                hostzaSto.appendChild(this.refDiv); 
            }
            else{
                
               this.Zauzmi(host);
                
            }
        }
       
        else{
            this.refDiv=kont;
            hostzaSto.appendChild(this.refDiv); 
        }
        
    }
    funkcijaZadugme1(host){
       
        if(this.porudzbinica==null || this.porudzbinica.kontPorudzbina ==null )
        {
            
            if(this.porudzbinica == null){

            this.refDiv.classList.add("Roza");
            fetch("https://localhost:5001/Porudzbina/CreatePorudzbina/" + this.id, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                            Broj:this.broj,
                            StoId:this.id

                    })
                    }).then(resp => {
                    if (resp.status == 200) {
                       resp.json().then(id => {
                         this.porudzbinica = new Porudzbina( id, this.id, this.broj, this.kaficid, null,this, this.refDiv);
                         this.porudzbinica.crtajPoruzbinu(host);
                        
                                
                            })
                        }
                        
                     });
            }
            else{
            
            this.porudzbinica.crtajPoruzbinu(host);
           
        }
        }
        
       else{

        this.porudzbinica.kontPorudzbina.classList.remove("sakrivenaPor");
        
        }
    }

    Zauzmi(host){
        if(!this.refDiv.classList.contains("Zelena") && this.status=="Zauzet");
        this.refDiv.classList.add("Roza");
       
        this.refDiv.querySelector("label").innerHTML="Sto: "+this.broj+"  "+this.status;
        this.refDiv.querySelectorAll("button").forEach( (element, index)=>{
                element.disabled =false;
                element.onclick=(ev)=>{
                    if(index==0)
                    this.funkcijaZadugme1(host);
                    if(index==1)
                    this.Oslobodi(host);

                }
        });
    
    }
    
    Oslobodi(host){
        console.log("Pozvana");
        document.getElementById("Por++").disabled=false;
        if(this.porudzbinica!=null && this.porudzbinica.kontPorudzbina!=null)
        {  console.log("Prvi if");
            fetch("https://localhost:5001/Porudzbina/DeletePorudzbina/" + this.porudzbinica.id,{
                method: 'DELETE', 
                headers: {
                 'Content-type': 'application/json'
                }
                }).then(resp =>{
                if (resp.status == 200) {
                    

                this.porudzbinica.kontPorudzbina.remove();
                this.porudzbinica.kontPorudzbina = null;
                this.porudzbinica = null; 
            
                fetch("https://localhost:5001/Sto/OslobodiSto/" + this.id, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Broj:this.broj,
                        Status: "Slobodan",
                        KaficId: this.kaficid
                
                    })}).then(resp => {
                        if (resp.status == 204) {
                            alert(`Sto ${this.broj} je upravo Oslobodjen!`);
                    }
                    else{
                        alert("Sto nije oslobodjen!")
                    }
                    });
            
                this.refDiv.classList.remove("Zelena","Roza");
                this.status = "Slobodan";
                this.refDiv.querySelector("label").innerHTML="Sto: "+this.broj+"  "+this.status;
                this.refDiv.querySelectorAll("button").forEach( (element)=>{
                element.disabled =true;
                element.onclick=(ev)=>{
                    this.Zauzmi(host);

                }
                });
    
            }})
        }
        else{
            console.log("Prvi else");
            
                fetch("https://localhost:5001/Sto/OslobodiSto/" + this.id, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Broj:this.broj,
                        Status: "Slobodan",
                        KaficId: this.kaficid
                
                    })}).then(resp => {
                        if (resp.status == 204) {
                            alert(`Sto ${this.broj} je upravo Oslobodjen!`);
                            this.refDiv.classList.remove("Zelena","Roza");
                            this.status = "Slobodan";
                            this.refDiv.querySelector("label").innerHTML="Sto: "+this.broj+"  "+this.status;
                            this.refDiv.querySelectorAll("button").forEach( (element)=>{
                            element.disabled =true;
                            element.onclick=(ev)=>{
                                this.Zauzmi(host);

                            }
                            });
                    }
                    else{
                        alert("Sto nije oslobodjen!")
                    }
                    });

                
        }

}   
}