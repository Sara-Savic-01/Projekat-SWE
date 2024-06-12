import React,{useState,useEffect,useMemo} from 'react'
import './Obavestenja.css'
import {Button,Jumbotron,Modal,Alert} from 'react-bootstrap'
import PaginationComponent from '../../komponente/PaginationComponent'
import Search from '../../komponente/Search'
import LoadingSpin from '../../komponente/LoadingSpin'

export default function Obavestenja() {

    const [obavestenja,setObavestenja]=useState({pod:[]})
    const [ukupnoStavki,setUkupnoStavki]=useState(0)
    const [trStranica,setTrStranica]=useState(1)
    const [pretrazi,setPretrazi] =useState("")
    const [prikaziAdm,setPrikaziAdm]=useState(false)
    const STAVKE_PO_STRANICI=5
    const [modal,setModal]=useState(false) 
    const [modalUspesnoDodavanje,setModalUspesnoDodavanje]=useState(false)
    const [modalGreska,setModalGreska]=useState(false)
    const [modalUspesnoBrisanje,setModalUspesnoBrisanje]=useState(false)
    const [modalBrisanjeGreska,setModalBrisanjeGreska]=useState(false)
    const [modalObrisi,setModalObrisi]=useState(false)
    const [novoObavestenje,setNovoObavestenje]=useState("")
    const [idBrisanje,setIdBrisanje]=useState("")
    const [spin,setSpin]=useState(false)
    const tip=localStorage.getItem("tip")

    useEffect(() => {

        fetch("https://localhost:5001/PlesnaSkola/PreuzmiObavestenja").then(pod=>{
            pod.json().then(obv=>{
                setObavestenja({pod:obv})    
                  
                if(tip==1)
                setPrikaziAdm(true)     
            })
        })
        
    },[])

    const svaObavestenja=useMemo(()=>{

        let obv=obavestenja.pod;
        
        if(pretrazi)
        {
            obv=obv.filter(
                obav=>obav.sadrzaj.toLowerCase().includes(pretrazi.toLowerCase())
            )
        }
        setUkupnoStavki(obv.length)
        obv.sort(function(a,b){
            if(a.id<b.id)
            {
                return 1
            }
            else return -1
        })
    
        return obv.slice((trStranica-1)*STAVKE_PO_STRANICI,(trStranica-1)*STAVKE_PO_STRANICI+STAVKE_PO_STRANICI)

     },[obavestenja,trStranica,pretrazi])

    const dodajObavestenje=()=>{

        setModal(false) 
        setSpin(true)
         
        fetch("https://localhost:5001/PlesnaSkola/DodajObavestenje",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(
              {
                sadrzaj:novoObavestenje
              }
            )
            }).then(p=>{
                setSpin(false)
                if(p.ok)
                {
                    setModalUspesnoDodavanje(true)
                }
                else
                {
                    setModalGreska(true)
                }
        })

    }

    const uspesnoDodavanje=()=>{

        setModalUspesnoDodavanje(false)
        window.location.reload()
    }

    const uspesnoBrisanje=()=>{

        setModalUspesnoBrisanje(false)
        window.location.reload()
    }

    const potvrdiBrisanje=(id)=>{

        if(tip==1)
        {

            setModalObrisi(true)
            setIdBrisanje(id)

        }
    }

    const obrisiObavestenje=()=>{

        setModalObrisi(false)
        setSpin(true)

        fetch("https://localhost:5001/PlesnaSkola/ObrisiObavestenje/"+idBrisanje,{
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

    return (
        <div className='glavniDivObavestenja'>

           <h3 className='naslovObavestenje'>Obaveštenja</h3>
           <label>____________________________________________________________________________________________________________________</label>
           <Search pretrazi={(value)=>{
               setPretrazi(value)
               setTrStranica(1)
           }}/>

           <div className='pomObavestenja'>

            <PaginationComponent
            ukupno={ukupnoStavki}
            stavkePoStranici={STAVKE_PO_STRANICI}
            trenutnaStranica={trStranica}
            promeniStranicu={page=>setTrStranica(page)}/>

            {prikaziAdm? <Button className='dugmeDodajObavestenje' onClick={()=>setModal(true)}>Dodaj novo obaveštenje</Button>:null}

            </div>

            {prikaziAdm?<label className='labelObavestenja'>*Možete da obrišite obaveštenje klikom na njega.</label>:null}

            {svaObavestenja.map((obv)=>(
            <Jumbotron className='jumbotronObavestenja' key={obv.id} onClick={()=>potvrdiBrisanje(obv.id)} >{obv.sadrzaj}</Jumbotron>
            ))}

            <Modal show={modal}>
               <Modal.Header >Dodajte novo obaveštenje</Modal.Header>
               <Modal.Body>
               <input type='text' className='modalDodajObavestenje' onChange={e=>setNovoObavestenje(e.target.value)} />
              </Modal.Body>
               <Modal.Footer>
                   <Button onClick={dodajObavestenje}>Potvrdi</Button>
                   <Button onClick={()=>setModal(false)}>Otkazi</Button>
               </Modal.Footer>
           </Modal>

           <Modal show={modalUspesnoDodavanje}>
               <Modal.Header >Uspešno dodavanje</Modal.Header>
               <Modal.Body>
               <Alert className='alert alert-success'>Uspešno ste dodali novo obaveštenje <i className="far fa-check-circle ikonica"></i></Alert>
              </Modal.Body>
               <Modal.Footer>
                   <Button onClick={uspesnoDodavanje}>Ok</Button>
               </Modal.Footer>
           </Modal>

           <Modal show={modalGreska}>
               <Modal.Header >Greška</Modal.Header>
               <Modal.Body>
               <Alert className='alert alert-danger'>Došlo je do greške prilikom dodavanja obaveštenja. Molimo Vas pokušajte ponovo.</Alert>
              </Modal.Body>
               <Modal.Footer>
                   <Button onClick={()=>setModalGreska(false) }>Ok</Button>
               </Modal.Footer>
           </Modal>

           <Modal show={modalObrisi}>
              
               <Modal.Body>
               <Alert className='alert alert-info'>Da li ste sigurni da želite da obrišete ovo obaveštenje?</Alert>
               </Modal.Body>
               <Modal.Footer>
                   <Button onClick={()=>obrisiObavestenje() }>Potvrdi</Button>
                   <Button onClick={()=>setModalObrisi(false)}>Otkazi</Button>
               </Modal.Footer>
           </Modal>

           <Modal show={modalUspesnoBrisanje}>
               <Modal.Header >Uspešno brisanje</Modal.Header>
               <Modal.Body>
               <Alert className='alert alert-success'>Uspešno ste obrisali obaveštenje <i className="far fa-check-circle ikonica"></i></Alert>
              </Modal.Body>
               <Modal.Footer>
                   <Button onClick={uspesnoBrisanje}>Ok</Button>
               </Modal.Footer>
           </Modal>

           <Modal show={modalBrisanjeGreska}>
               <Modal.Header >Greška</Modal.Header>
               <Modal.Body>
               <Alert className='alert alert-danger'>Došlo je do greške prilikom brisanja obaveštenja. Molimo Vas pokušajte ponovo.</Alert>
              </Modal.Body>
               <Modal.Footer>
                   <Button onClick={()=>setModalBrisanjeGreska(false) }>Ok</Button>
               </Modal.Footer>
           </Modal>
     
           {spin?<LoadingSpin/>:null} 
        </div>
    )

}