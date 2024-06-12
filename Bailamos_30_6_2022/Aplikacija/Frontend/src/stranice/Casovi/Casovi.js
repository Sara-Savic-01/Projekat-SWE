import React,{useState, useEffect,useMemo} from 'react'
import PaginationComponent from '../../komponente/PaginationComponent'
import {Table,Button,Modal,Alert,Row} from 'react-bootstrap'
import TimePicker from 'react-time-picker'
import DatePicker from 'react-datepicker'
import LoadingSpin from '../../komponente/LoadingSpin'
import Search from '../../komponente/Search'
import './Casovi.css'
import {useHistory} from "react-router-dom"

export default function Casovi()
{
    const [podaci,setPodaci]=useState({pod:[]})
    const [instruktori,setInstruktori]=useState({pod:[]})
    const [termini,setTermini]=useState({pod:[]})
    const [spin,setSpin]=useState(false)


    const [ukupnoStavki,setUkupnoStavki]=useState(0)
    const [trStranica,setTrStranica]=useState(1)
    const [pretrazi,setPretrazi] =useState("")
    const STAVKE_PO_STRANICI=5

    const [modalUspesnoBrisanje,setModalUspesnoBrisanje]=useState(false)
    const [modalBrisanjeGreska,setModalBrisanjeGreska]=useState(false)
    const [modalObrisi,setModalObrisi]=useState(false)

    const [modalUspesnoZakazivanjeClan,setModalUspesnoZakazivanjeClan]=useState(false)
    const [modalZakazivanjeGreskaBroj,setModalZakazivanjeGreskaBroj]=useState(false)
    const [modalZakazivanjeGreskaClanarina,setModalZakazivanjeGreskaClanarina]=useState(false)
    const [modalPosaljiZahtev,setModalPosaljiZahtev]=useState(false)


    const [idBrisanje,setIdBrisanje]=useState("")

    const [modalDodajCas,setModalDodajCas]=useState(false)

    const [naziv,setNaziv]= useState("")
    const [tip,setTip]= useState("1")
    const [cena,setCena] =useState("")
    const [cenaNedeljno,setCenaNedeljno] =useState("")
    const [cenaMesecno,setCenaMesecno] =useState("")
    const [cenaPolaGodine,setCenaPolaGodine] =useState("")
    const [cenaGodisnje,setCenaGodisnje] =useState("")

    const [prikazClan,setPrikazClan]=useState(false)

    const [validacijaNaziv,setValidacijaNaziv]=useState(false)
    const [validacijaCena,setValidacijaCena]=useState(false)
    const [validacijaCenaNedeljno,setValidacijaCenaNedeljno]=useState(false)
    const [validacijaCenaMesecno,setValidacijaCenaMesecno]=useState(false)
    const [validacijaCenaPolaGodine,setValidacijaCenaPolaGodine]=useState(false)
    const [validacijaCenaGodisnje,setValidacijaCenaGodisnje]=useState(false)
    const [validacijaTip,setValidacijaTip]=useState(false)
    
    
    const [modalUspesnoDodavanje,setModalUspesnoDodavanje]=useState(false)
    const [modalDodavanjeGreska,setModalDodavanjeGreska] =useState(false)

    const [idIzmena,setIdIzmena]=useState("")
    const [cenaIzmena,setCenaIzmena]=useState("")
    const [trCena,setTrCena]=useState("")
    const [modalIzmeni,setModalIzmeni]=useState(false)
    const [tipIzmena,setTipIzmena]=useState("")
    const [nazivIzmena,setNazivIzmena]=useState("")
    const [prikaziAdmin,setPrikaziAdmin]=useState(false)
    

    const [modalInstruktori,setModalInstruktori]=useState(false)
    const [modalTermini,setModalTermini]=useState(false)
    const [modalUspesnoPoslatZahtev,setModalUspesnoPoslatZahtev]=useState(false)
    const [modalPoslatZahtevGreska,setModalPoslatZahtevGreska]=useState(false)

    const [datum,setDatum]=useState("")
    const [vremePocetak,setVremePocetak]=useState("")
    const [vremeKraj,setVremeKraj]=useState("")
    const[instruktorZahtev,setInstruktorZahtev]=useState("")
    const[opisZahteva,setOpisZahteva]=useState("")
    const [instruktorZahtevaId,setInstruktorZahtevaId]=useState("")

    const history=useHistory()

    useEffect(() => {

        fetch("https://localhost:5001/PlesnaSkola/PreuzmiCasove").then(pod=>{
            pod.json().then(casovi=>{
               
                setPodaci({pod:casovi})
                setUkupnoStavki(podaci.pod.length)
                let tip=localStorage.getItem("tip")
                if(tip==1)
                {
                    setPrikaziAdmin(true)
                }
             })
        })
       
        if(localStorage.getItem("tip")==3)
        {
            setPrikazClan(true)
        }
        else
        {
            setPrikazClan(false)
        }
        
     },[])
     const sviCasovi=useMemo(()=>{

        let obv=podaci.pod;
        
        if(pretrazi)
        {
            obv=obv.filter(
                obav=>
                obav.naziv.toLowerCase().includes(pretrazi.toLowerCase()) ||
                obav.tip.toLowerCase().includes(pretrazi.toLowerCase())
            )
        }
        setUkupnoStavki(obv.length)
        return obv.slice((trStranica-1)*STAVKE_PO_STRANICI,(trStranica-1)*STAVKE_PO_STRANICI+STAVKE_PO_STRANICI)
     },[podaci,trStranica,pretrazi])
     const izmeniCenuModal=(id)=> {
         
        setIdIzmena(id)
        const cas=podaci.pod.filter(p=>p.id===id)
        setNazivIzmena(cas.map((pod)=>pod.naziv))
        setTipIzmena(cas.map((pod)=>pod.tip))
        setTrCena(cas.map((pod)=>pod.cena))
       
        setModalIzmeni(true)    
  }

  const izmeniCenuCasa=()=>
  {
      
      setModalIzmeni(false)
      setSpin(true)
      fetch("https://localhost:5001/PlesnaSkola/IzmeniCenuCasaPlesa/"+idIzmena+"/"+cenaIzmena,{
            method:"PUT",
            headers:{'Content-Type':'application/json'},
            credentials:'include'
      }).then(p=>{
          setSpin(false)
          window.location.reload()
      })

  }
  
  const potvrdiBrisanje=(id)=> {
         
    setModalObrisi(true)
    setIdBrisanje(id)

  }

  const obrisiClana=()=>
    {
         setModalObrisi(false)
         setSpin(true)
         fetch("https://localhost:5001/PlesnaSkola/ObrisiCas/"+idBrisanje,{
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

  const uspesnoBrisanje=()=>{
    setModalUspesnoBrisanje(false)
    window.location.reload()
}

const dodajNoviCas=()=>{
    console.log(naziv,cena,tip)
    if(!naziv)
    {
        setValidacijaNaziv(true)
    }
    
    else if(!cena)
    {
        setValidacijaCena(true)
    }
    else if(!cenaNedeljno)
    {
        setValidacijaCenaNedeljno(true)
    }
    else if(!cenaMesecno)
    {
        setValidacijaCenaMesecno(true)
    }
    else if(!cenaPolaGodine)
    {
        setValidacijaCenaPolaGodine(true)
    }
    else if(!cenaGodisnje)
    {
        setValidacijaCenaGodisnje(true)
        
    }
    else if(!tip)
    {
        setValidacijaTip(true)
    }
    else
    {
        let noviTip=''
        setModalDodajCas(false)
        setValidacijaTip(false)
        setValidacijaCena(false)
        setValidacijaNaziv(false)
        if(tip==0)
        {
            
            noviTip='Sportski ples'
            
        }
        else if(tip==1)
        {
           noviTip='Prvi ples'
        }
        console.log(tipIzmena)
          setSpin(true)
        fetch("https://localhost:5001/PlesnaSkola/DodajCas",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(
              {
                naziv:naziv,
                tip:noviTip,
                cena:cena,
                nedeljno: cenaNedeljno,
                mesecno: cenaMesecno,
                polugodisnje: cenaPolaGodine,
                godisnje: cenaGodisnje
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
                  setModalDodavanjeGreska(true)

              }
          })

    }
    }

    const [instruktoriPersonal,setInstruktoriPersonal]=useState({pod:[]})

    const prikaziModalZakaziCas=()=>{
    fetch("https://localhost:5001/PlesnaSkola/PreuzmiInstruktoreCasovaPlesa/7").then(p=>{
        p.json().then(instruktori=>{
            setInstruktoriPersonal({pod:instruktori})
        })
       
        
        })
        setModalPosaljiZahtev(true)
    }

    const posaljiZahtev=()=>{
        setSpin(true)
        fetch("https://localhost:5001/PlesnaSkola/PosaljiZahtevInstruktoru/"+instruktorZahtev.split(' ')[0],{
         method:"POST",
         headers:{'Content-Type':'application/json'},
         body:JSON.stringify(
           {
             datum:datum.toLocaleDateString("en-US",options),
             casPlesaId:7,
             instruktorPlesaId:instruktorZahtev.split(' ')[0],//ovde instruktor id
             instruktorPlesaIme: instruktorZahtev.split(' ')[1],
             instruktorPlesaPrezime: instruktorZahtev.split(' ')[2],
             clanPlesneSkoleId:localStorage.getItem("ID"),
             vremePocetka:vremePocetak.toString(),
             vremeKraja:vremeKraj.toString(),
             opis:opisZahteva
           }
         )
         }).then(p=>{
         setSpin(false)
         if(p.ok)
         {
           setModalUspesnoPoslatZahtev(true)
         }
         else if(p.status==451)
         {
            setModalZakazivanjeGreskaClanarina(true)
         }
        else
         {
           setModalPoslatZahtevGreska(true)
           
         }
       })
    }
    const options = {
        year: "2-digit",
        month:"2-digit",
        day:"2-digit"
        }

    const uspesnoDodavanje=()=>{
        setModalUspesnoDodavanje(false)
        window.location.reload()
    }

    const [idCasaBrisanje,setIdCasaBrisanje]=useState("")

    const prikaziInstruktore=(id)=>{
        setSpin(true)
        setIdCasaBrisanje(id)
        fetch("https://localhost:5001/PlesnaSkola/PreuzmiInstruktoreCasovaPlesa/"+id).then(pod=>{
            pod.json().then(instruktori=>{
            setSpin(false)
            setInstruktori({pod:instruktori})
            setModalInstruktori(true)
            
            })
        })
    }

    const prikaziTermine=(id)=>{
        setSpin(true)
        let naziv= podaci.pod.filter(p=>p.id==id).map(tr=>tr.naziv).toString()
    fetch("https://localhost:5001/PlesnaSkola/PreuzmiSlobodneTermineCasova/"+naziv).then(pod=>{
        pod.json().then(termini=>{
            setSpin(false)
            setTermini({pod:termini})
            setModalTermini(true)
            
            })
    })
    }

    const zakaziTermin=(terminId)=>{
        setSpin(true)
        fetch("https://localhost:5001/PlesnaSkola/DodajTermineClanu/"+terminId+"/"+localStorage.getItem("ID"),{
            method:"POST",
            headers:{'Content-Type':'application/json'}
    }).then(p=>{
        setSpin(false)
        setModalTermini(false)
        if(p.ok)
        {
            setModalUspesnoZakazivanjeClan(true)

        }
        else if(p.status==451)
        {
            setModalZakazivanjeGreskaClanarina(true)

        }
        else if(p.status==452)
        {
            setModalZakazivanjeGreskaBroj(true)

        }
    })
    }
    const uspesnoZakazivanje=()=>{
        setModalUspesnoZakazivanjeClan(false)
        
    }
    const [modalDodajInstruktoraCasu,setModalDodajInstruktoraCasu]=useState(false)
    const dodajInstruktoraCasu=(id)=>{
        fetch("https://localhost:5001/PlesnaSkola/PreuzmiInstruktorePlesa").then(pod=>{
            pod.json().then(instruktori=>{
            setSpin(false)
            setInstruktori({pod:instruktori})
            
            
            })
        })
        setModalDodajInstruktoraCasu(true)
        setIdIzmena(id)
    }
    const dodajInstruktoraIzabrInstr=(id)=>{
        setSpin(true)
        fetch("https://localhost:5001/PlesnaSkola/DodajCasovePlesaInstruktora/"+idIzmena+"/"+id,{
            method:"POST",
        headers:{'Content-Type':'application/json'}
        }).then(p=>{
        setSpin(false)   
        if(p.ok)
            {
                setModalDodajInstruktoraCasu(false)
            }
        })
    }


    const obrisiInstruktoraIzCasa=(id)=>{
        fetch("https://localhost:5001/PlesnaSkola/ObrisiCasInstruktoru/"+idCasaBrisanje+"/"+id,{
            method:"DELETE"
        }).then(p=>{
            if(p.ok)
            {
                setModalInstruktori(false)
            }
        })
         
     }  
   
    return (
           <div>
              
               <Search 
                pretrazi={(value)=>{
                  setPretrazi(value)
                  setTrStranica(1)
              }}/>
               <div className='pomRedDodajCas'>
             <PaginationComponent
               ukupno={ukupnoStavki}
               stavkePoStranici={STAVKE_PO_STRANICI}
               trenutnaStranica={trStranica}
               promeniStranicu={page=>setTrStranica(page)}/>
             
             {prikaziAdmin?
             <Button onClick={()=>setModalDodajCas(true)}>Dodaj novi cas</Button>:null}
              </div>
               
     <Table striped bordered hover>
     <thead>
       <tr>
         <th>Redni broj</th>
         <th>Naziv</th>
         <th>Tip</th>
         
         
       </tr>
     </thead>
     <tbody>
         {
           sviCasovi.map((cas)=>(
               <tr key={cas.id}>
               <td>{cas.id}</td>
               <td>{cas.naziv}</td>
               <td>{cas.tip}</td>
               
           <td><Button onClick={()=>prikaziInstruktore(cas.id)}>Prikaži instruktore</Button></td>
           {cas.naziv=='Prvi ples' && localStorage.getItem("tip")=='3'?  <td><Button onClick={()=>prikaziModalZakaziCas()} >Pošalji zahtev instruktoru</Button></td>:  <td><Button onClick={()=>prikaziTermine(cas.id)}>Prikaži termine</Button></td>}
           {prikaziAdmin? <td><Button onClick={()=>dodajInstruktoraCasu(cas.id)}>Dodaj instruktora</Button></td>:null}
          
           {prikaziAdmin? <td><Button className='btn btn-danger'  onClick={()=>potvrdiBrisanje(cas.id)}><i class="fa fa-trash" aria-hidden="true"></i> Obriši</Button></td>:null}
           
           
             </tr>
             ))
         }
      
     </tbody>
   </Table>
           <Modal show={modalInstruktori}>
             <Modal.Header>Instruktori</Modal.Header> 
                 <Modal.Body>
                     {
                       instruktori.pod.map((instruktor)=>(
                           <div key={instruktor.id} className='divModal'>
                                <img className='profilnaSlikaInstruktora' src={instruktor.slika} alt='profilna'/>
                               <Row>Ime: {instruktor.ime} </Row>
                               <Row>Prezime: {instruktor.prezime} </Row>
                               <Row>Email: {instruktor.email} </Row>
                             {prikaziAdmin?<Row><Button onClick={()=>obrisiInstruktoraIzCasa(instruktor.id)}>Obriši instruktora</Button></Row>:null}  
   
                           </div>
                       ))
                     }
                 
                </Modal.Body>
                 <Modal.Footer>
                    
                     <Button onClick={()=>setModalInstruktori(false)}>Ok</Button>
                 </Modal.Footer>
             </Modal>
             <Modal show={modalTermini}>
             <Modal.Header>Termini</Modal.Header> 
                 <Modal.Body>
                     {
                       termini.pod.map((termin)=>(
                           <div key={termin.id} className='divModal'>
                              
                               <Row>Datum: {termin.datum}</Row>
                               <Row>Vreme pocetka: {termin.vremePocetkaTermina} </Row>
                               <Row>Vreme kraja: {termin.vremeKrajaTermina}</Row>
                               {termin.nazivCasa== 'Prvi ples' ? null : <Row>Trenutan broj ljudi: {termin.trenutanBrojLjudi}</Row>} 
                             
                              {termin.nazivCasa== 'Prvi ples' ? null : <Row>Maksimalan broj ljudi: {termin.maximalanBrojLjudi} </Row>}
                               <Row>Ime instruktora:{termin.imeInstruktora}</Row>
                               <Row>Prezime instruktora:{termin.prezimeInstruktora}</Row>
                               {prikazClan? <Row><Button onClick={()=>zakaziTermin(termin.id)}>Zakazi termin</Button></Row>:null}
   
                           </div>
                       ))
                     }
                 
                </Modal.Body>
                 <Modal.Footer>
                    
                     <Button onClick={()=>setModalTermini(false)}>Ok</Button>
                 </Modal.Footer>
             </Modal>
            
   
             <Modal show={modalDodajCas}>
             <Modal.Header>Dodaj novi cas</Modal.Header> 
                 <Modal.Body>
                 <Row>Naziv: <input  className='unosIzmena' onChange={e=>setNaziv(e.target.value)} /></Row>
                 {validacijaNaziv?<Row style={{color:'red'}} className='redValidacija' >Morate uneti naziv.</Row>:null}
                 <Row>Cena po casu: <input className='unosIzmena' onChange={e=>setCena(e.target.value)}/> </Row>
                 {validacijaCena?<Row style={{color:'red'}} className='redValidacija'>Morate uneti cenu.</Row>:null}
                 <Row>Cena nedeljno: <input className='unosIzmena' onChange={e=>setCenaNedeljno(e.target.value)}/> </Row>
                 {validacijaCenaNedeljno?<Row style={{color:'red'}} className='redValidacija'>Morate uneti cenu.</Row>:null}
                 <Row>Cena mesecno: <input className='unosIzmena' onChange={e=>setCenaMesecno(e.target.value)}/> </Row>
                 {validacijaCenaMesecno?<Row style={{color:'red'}} className='redValidacija'>Morate uneti cenu.</Row>:null}
                 <Row>Cena za pola godine: <input className='unosIzmena' onChange={e=>setCenaPolaGodine(e.target.value)}/> </Row>
                 {validacijaCenaPolaGodine?<Row style={{color:'red'}} className='redValidacija'>Morate uneti cenu.</Row>:null}
                 <Row>Cena godišnje: <input className='unosIzmena' onChange={e=>setCenaGodisnje(e.target.value)}/> </Row>
                 {validacijaCenaGodisnje?<Row style={{color:'red'}} className='redValidacija'>Morate uneti cenu.</Row>:null}
                 <Row>Tip:  <select className='unosIzmena'
                 onChange={(e)=>{
                  const daLiJePlacena=e.target.value
                  setTip(daLiJePlacena)
                  
                }}>
                  <option value= '1'>Prvi ples na vencanju</option>
                  <option value= '0'>Sportski ples</option>
                </select></Row>
                {validacijaTip?<Row style={{color:'red'}} className='redValidacija'>Morate uneti tip.</Row>:null}
       
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={()=>dodajNoviCas() }>Potvrdi</Button>
                     <Button onClick={()=>setModalDodajCas(false)}>Poništi</Button>
                 </Modal.Footer>
             </Modal>
   
             <Modal show={modalObrisi}>
                 
                 <Modal.Body>
                 <Alert className='alert alert-info'>Da li ste sigurni da želite da obrišete ovaj cas iz ponude?</Alert>
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={()=>obrisiClana() }>Potvrdi</Button>
                     <Button onClick={()=>setModalObrisi(false)}>Poništi</Button>
                 </Modal.Footer>
             </Modal>
   
   
   
             <Modal show={modalUspesnoBrisanje}>
                 <Modal.Header >Uspešno brisanje</Modal.Header>
                 <Modal.Body>
                 <Alert className='alert alert-success'>Uspešno ste obrisali ovaj cas<i className="far fa-check-circle ikonica"></i></Alert>
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={uspesnoBrisanje}>Ok</Button>
                 </Modal.Footer>
             </Modal>
   
             <Modal show={modalBrisanjeGreska}>
                 <Modal.Header >Greška</Modal.Header>
                 <Modal.Body>
                 <Alert className='alert alert-danger'>Žao nam je, došlo je do greške prilikom brisanja casa. Molimo Vas pokušajte ponovo.</Alert>
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={()=>setModalBrisanjeGreska(false) }>Ok</Button>
                 </Modal.Footer>
             </Modal>
             <Modal show={modalPosaljiZahtev}>
                 <Modal.Header >Pošalji zahtev</Modal.Header>
                 <Modal.Body>
                 <Row>Izaberite instruktora:</Row>
                 <Row><select 
                 onChange={(e)=>{
                   const izabraniInstruktor=e.target.value
                   
                   setInstruktorZahtev(izabraniInstruktor)
                   
                  }}>
                   {
                       instruktoriPersonal.pod.map((instruktor)=>(
                           <option key={instruktor.id}>{instruktor.id} {instruktor.ime} {instruktor.prezime}</option>
                       ))
                   
                   }
                     </select></Row>
                 <Row>Datum:</Row>
                 <Row>
                 <DatePicker
                  closeOnScroll={true}
                  selected={datum}
                  onChange={(date) => setDatum(date)}
                   />
                  </Row>
                  <Row>Izaberite okvirno vreme koje vam odgovara:</Row>
                  <Row>Vreme od:</Row> 
                  <Row>     
                   <TimePicker
                   onChange={(vreme)=>setVremePocetak(vreme)}
                   value={vremePocetak}
                   timeIntervals={30}
                    />
                   </Row>
                    
                    <Row>Vreme do:</Row>
                    <Row>
                      <TimePicker
                    onChange={(vreme)=>setVremeKraj(vreme)}
                    value={vremeKraj}
                    
                     />
                    </Row>
                    <Row>Dodajte dodatne informacije ako želite:</Row>
                    <Row><input onChange={e=>setOpisZahteva(e.target.value)}/></Row>
                
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={()=>posaljiZahtev()}>Pošalji</Button>
                     <Button onClick={()=>setModalPosaljiZahtev(false) }>Otkaži</Button>
                 </Modal.Footer>
             </Modal>
   
             <Modal show={modalUspesnoZakazivanjeClan}>
                 <Modal.Header >Uspešno zakazivanje</Modal.Header>
                 <Modal.Body>
                 <Alert className='alert alert-success'>Uspešno ste zakazali novi termin<i className="far fa-check-circle ikonica"></i></Alert>
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={uspesnoZakazivanje}>Ok</Button>
                 </Modal.Footer>
             </Modal>
   
             <Modal show={modalZakazivanjeGreskaBroj}>
                 <Modal.Header >Greška</Modal.Header>
                 <Modal.Body>
                 <Alert className='alert alert-danger'>Žao nam je,ne možete zakazati ovaj termin, maksimalni kapacitet je popunjen.</Alert>
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={()=>setModalZakazivanjeGreskaBroj(false) }>Ok</Button>
                 </Modal.Footer>
             </Modal>
             <Modal show={modalUspesnoPoslatZahtev}>
                 <Modal.Header >Uspešno poslat zahtev</Modal.Header>
                 <Modal.Body>
                 <Alert className='alert alert-success'>Uspešno ste poslali zahtev<i className="far fa-check-circle ikonica"></i></Alert>
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={()=>setModalUspesnoPoslatZahtev(false)}>Ok</Button>
                 </Modal.Footer>
             </Modal>
             <Modal show={modalDodajInstruktoraCasu}>
                 <Modal.Header >Izaberite instruktora</Modal.Header>
                 <Modal.Body>
                     {instruktori.pod.map((instruktor)=>(
                         <Row key={instruktor.id} style={{marginBottom:'5px'}}>{instruktor.ime} {instruktor.prezime} <Button onClick={()=>dodajInstruktoraIzabrInstr(instruktor.id)}>Izaberi</Button></Row>
                     ))
   
                     }
                 
                </Modal.Body>
                 <Modal.Footer>
                    
                     <Button onClick={()=>setModalDodajInstruktoraCasu(false)}>Otkaži</Button>
                 </Modal.Footer>
             </Modal>
            
             <Modal show={modalPoslatZahtevGreska}>
                 <Modal.Header >Greška</Modal.Header>
                 <Modal.Body>
                 <Alert className='alert alert-danger'>Žao nam je, došlo je do greške.Molimo Vas pokušajte ponovo.</Alert>
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={()=>setModalPoslatZahtevGreska(false) }>Ok</Button>
                 </Modal.Footer>
             </Modal>
             <Modal show={modalZakazivanjeGreskaClanarina}>
                 <Modal.Header >Greška</Modal.Header>
                 <Modal.Body>
                 <Alert className='alert alert-danger'>Žao nam je, ovu funkciju ne možete izvršiti jer niste platili članarinu.</Alert>
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={()=>setModalZakazivanjeGreskaClanarina(false) }>Ok</Button>
                 </Modal.Footer>
             </Modal>
   
             <Modal show={modalUspesnoDodavanje}>
                 <Modal.Header >Uspešno dodavanje</Modal.Header>
                 <Modal.Body>
                 <Alert className='alert alert-success'>Uspešno ste dodali novi cas<i className="far fa-check-circle ikonica"></i></Alert>
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={uspesnoDodavanje}>Ok</Button>
                 </Modal.Footer>
             </Modal>
   
             <Modal show={modalDodavanjeGreska}>
                 <Modal.Header >Greška</Modal.Header>
                 <Modal.Body>
                 <Alert className='alert alert-danger'>Žao nam je, došlo je do greške prilikom dodavanja casa.Molimo Vas pokušajte ponovo.</Alert>
                </Modal.Body>
                 <Modal.Footer>
                     <Button onClick={()=>setModalDodavanjeGreska(false) }>Ok</Button>
                 </Modal.Footer>
             </Modal>
   
   
             {spin?<LoadingSpin/>:null}
               
           </div>
       )
   }







