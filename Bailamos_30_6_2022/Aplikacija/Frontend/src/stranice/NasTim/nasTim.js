import React,{useEffect,useState} from 'react'
import {Row,Col,Modal,Button,Alert} from 'react-bootstrap'
import './nasTim.css';
import "bootstrap/dist/css/bootstrap.min.css"
import LoadingSpin from '../../komponente/LoadingSpin'
import {useHistory} from "react-router-dom"


export default function NasTim () {

    const [podaci,setPodaci]=useState({pod:[]})
    const history=useHistory()
   
    useEffect(() => {
           
        fetch("https://localhost:5001/PlesnaSkola/PreuzmiInstruktorePlesa").then(pod=>{
            pod.json().then(instruktori=>{
               
                setPodaci({pod:instruktori})

             })
             if(localStorage.getItem("tip")==="1")
             {
                 setPrikaziAdmin(true)
             }
        })
        
         
     }, [])
     const potvrdiBrisanje=(id)=> {
       console.log("Brisanje")
       setModalObrisi(true)
       setIdBrisanje(id)
       
       
     }
     const [modalUspesnoBrisanje,setModalUspesnoBrisanje]=useState(false)
     const [modalBrisanjeGreska,setModalBrisanjeGreska]=useState(false)
     const [modalObrisi,setModalObrisi]=useState(false)
     const [idBrisanje,setIdBrisanje]=useState("")
     const [prikaziAdmin,setPrikaziAdmin]=useState(false)
  //   const [modalIzmeni,setModalIzmeni]=useState(false)
     
     
     const [spin,setSpin]=useState(false)
     const uspesnoBrisanje=()=>{
        setModalUspesnoBrisanje(false)
        window.location.reload()
    }
    const obrisiInstruktora=()=>
     {
         setModalObrisi(false)
         setSpin(true)
         fetch("https://localhost:5001/PlesnaSkola/ObrisiinstruktoraPlesa/"+idBrisanje,{
             method:"DELETE",
             headers:{'Content-Type':'application/json'},
             credentials:'include'
         }).then(p=>{
             setSpin(false)
             if(p.ok)
                {
                    setModalUspesnoBrisanje(true)
                }
                else
                {
                   setModalBrisanjeGreska(true)
                }
         })

     }
     const[modalIzmeniPrviOpis,setModalIzmeniPrviOpis]=useState(false)
     const [opisIzmenaPrvi,setOpisIzmenaPrvi]=useState("")
     const [opisIzmenaDrugi,setOpisIzmenaDrugi]=useState("")
     const[modalIzmeniDrugiOpis,setModalIzmeniDrugiOpis]=useState(false)
     const[idIzmenaOpisa,setModalIdIzmenaOpisa]=useState("")
     const izmeniPrviOpis=(id)=>{
         setModalIzmeniPrviOpis(true)
         setModalIdIzmenaOpisa(id)
        podaci.pod.filter(pod=>pod.id==id).map((instruktor)=>(
            setOpisIzmenaPrvi(instruktor.prviOpis)

         )

        )
         

     }
     const izmeniDrugiOpis=(id)=>{
        setModalIzmeniDrugiOpis(true)
        setModalIdIzmenaOpisa(id)
        podaci.pod.filter(pod=>pod.id==id).map((instruktor)=>(
            setOpisIzmenaDrugi(instruktor.drugiOpis)
         )

        )
         
     }
     const potvrdiPrvuIzmenu=()=>{
        setSpin(true)
        
        fetch("https://localhost:5001/PlesnaSkola/IzmeniPrviOpisInstruktora/"+idIzmenaOpisa+"/"+opisIzmenaPrvi,{
            method:'PUT'
        }).then(p=>{
            if(p.ok)
            {
                setSpin(false)
                setModalIzmeniPrviOpis(false)
                window.location.reload()

            }
        })
     }
     const potvrdiDruguIzmenu=()=>{
        console.log(opisIzmenaDrugi)
        fetch("https://localhost:5001/PlesnaSkola/IzmeniDrugiOpisInstruktora/"+idIzmenaOpisa+"/"+opisIzmenaDrugi,{
            method:'PUT'
        }).then(p=>{
            if(p.ok)
            {
                setSpin(false)
                setModalIzmeniDrugiOpis(false)
                window.location.reload()

            }
        })
     }

    return (
        <div className='nastimcontainer'>
 
           <h2 className='nastimnaslov'>Naš tim</h2>
           <h4 className='nastimpodnaslov'>Upoznajte članove našeg tima i uverite se u našu stručnost!</h4>

           

           {podaci.pod.map((instruktor)=>(
           <div className='nastimInstruktor' key={instruktor.id}>
                <img src = {instruktor.slika} alt = "instruktor1" className = "slikaClan" />
                <div className = "clanInfo">
                        <h4 className = "clanIme">{instruktor.ime} {instruktor.prezime}</h4>
                        <h5 className ="clanProfesija">{instruktor.prviOpis}</h5>
                        <span className = "clanOpis">{instruktor.drugiOpis}</span>
                </div>
                {prikaziAdmin? <button className='dugmeObrisiNasTim'  onClick={()=>potvrdiBrisanje(instruktor.id)}>Obriši instruktora</button>:null}
                {prikaziAdmin? <button className='dugmeObrisiNasTim'  onClick={()=>izmeniPrviOpis(instruktor.id)}>Izmeni opis profesije</button>:null}
                {prikaziAdmin? <button className='dugmeObrisiNasTim'  onClick={()=>izmeniDrugiOpis(instruktor.id)}>Izmeni opis</button>:null}
           </div>
           ))
            }
        
        
        
            <Modal show={modalObrisi}>
              
              <Modal.Body>
              <Alert className='alert alert-info'>Da li ste sigurni da želite da obrišete ovog instruktora?</Alert>
             </Modal.Body>
              <Modal.Footer>
                  <Button onClick={()=>obrisiInstruktora() }>Potvrdi</Button>
                  <Button onClick={()=>setModalObrisi(false)}>Poništi</Button>
              </Modal.Footer>
          </Modal>

          <Modal show={modalUspesnoBrisanje}>
              <Modal.Header >Uspešno dodavanje</Modal.Header>
              <Modal.Body>
              <Alert className='alert alert-success'>Uspešno ste obrisali ovog instruktora <i className="far fa-check-circle ikonica"></i></Alert>
             </Modal.Body>
              <Modal.Footer>
                  <Button onClick={uspesnoBrisanje}>Ok</Button>
              </Modal.Footer>
          </Modal>

          <Modal show={modalBrisanjeGreska}>
              <Modal.Header >Greška</Modal.Header>
              <Modal.Body>
              <Alert className='alert alert-danger'>Žao nam je, došlo je do greške prilikom brisanja instruktora.Molimo Vas pokušajte ponovo.</Alert>
             </Modal.Body>
              <Modal.Footer>
                  <Button onClick={()=>setModalBrisanjeGreska(false) }>Ok</Button>
              </Modal.Footer>
          </Modal>
          <Modal show={modalIzmeniPrviOpis}>
               <Modal.Header >Izmenite opis</Modal.Header>
               <Modal.Body>
               <input type='text' className='modalDodajObavestenje' defaultValue={opisIzmenaPrvi} onChange={e=>setOpisIzmenaPrvi(e.target.value)} />
              </Modal.Body>
               <Modal.Footer>
               <Button onClick={()=>potvrdiPrvuIzmenu()} >Potvrdi</Button>
                   <Button onClick={()=>setModalIzmeniPrviOpis(false)}>Poništi</Button>
               </Modal.Footer>
           </Modal>
           <Modal show={modalIzmeniDrugiOpis}>
               <Modal.Header >Izmenite opis</Modal.Header>
               <Modal.Body>
               <input type='text' className='modalDodajObavestenje' defaultValue={opisIzmenaDrugi} onChange={e=>setOpisIzmenaDrugi(e.target.value)}/>
              </Modal.Body>
               <Modal.Footer>
                   <Button onClick={()=>potvrdiDruguIzmenu()} >Potvrdi</Button>
                   <Button onClick={()=>setModalIzmeniDrugiOpis(false)}>Poništi</Button>
               </Modal.Footer>
           </Modal>



     
          {spin?<LoadingSpin/>:null}
        
    
          </div>
    )
}

