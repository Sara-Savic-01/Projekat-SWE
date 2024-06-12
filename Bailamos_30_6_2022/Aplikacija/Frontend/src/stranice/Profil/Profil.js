import React,{useState,useEffect} from 'react'
import './Profil.css'
import {Button,Modal, Row,Table,Alert} from 'react-bootstrap'
//import { makeStyles } from '@material-ui/core/styles';
import LoadingSpin from '../../komponente/LoadingSpin'
import axios from 'axios'
import TimePicker from 'react-time-picker'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import {useHistory} from "react-router-dom"
 

function Profil(){
  const history=useHistory()
  const handleHistory=()=>
  {
    history.push("/Casovi")
  }
   const [ime,setIme]=useState("")
   
   const [prezime,setPrezime]=useState("")
   const [godine,setGodine]=useState("")
   const [brojTelefona,setBrojTelefona]=useState("")
   const [email,setEmail]=useState("")
 
 
   const [tip,setTip]=useState("")
 
   const [korisnickoIme,setKorisnickoIme]=useState("")
   const [modal,setModal]=useState(false) 
   const [spin,setSpin]=useState(false)

   const [zahteviInstruktora,setZahteviInstruktora]=useState({pod:[]})
   const [casovi,setCasovi]=useState({pod:[]})
   const [termini,setTermini]=useState({pod:[]})
   const [zahteviClan,setZahteviClan]=useState({pod:[]})
  
   
   const [profilnaIme,setProfilnaIme]=useState("")
   const [profilnaSrc,setProfilnaSrc]=useState('/slike/profil.jpg')
   const [profilnaFile,setProfilnaFile]=useState(null)

  
   const [prikazClan,setPrikazClan]=useState(false)
   const [prikazInstruktor,setPrikazInstruktor]=useState(false)
   const [prikazFormeZaIzborSlike,setPrikazFormeZaIzborSlike]=useState(false)
   const [prikazDugmetaIzmeniSliku,setPrikazDugmetaIzmeniSliku]=useState(true)
   const [iznosClanarine,setIznos]=useState("")
   const [placenaClanarina,setPlacenaClanarina]=useState(false)
   const [datumPlacanja,setDatumPlacanja]=useState("")

   const [maksBrojOsoba,setMaksBrojOsoba]=useState("")
 
   const [godineIzmena,setGodineIzmena]=useState("")
   const [telefonIzmena,setTelefonIzmena]=useState("")
   const [emailIzmena,setEmailIzmena]=useState("")
 
   const [placenaCl,setPlacenaCl]=useState(false)

  const [terminiClan,setTerminiClan]=useState({pod:[]})
   const [idIzmenaCasa,setIdIzmenaCasa]=useState("")
   const[imeCasa,setImeCasa]=useState("")
  const [modalZakaziTermin,setModalZakaziTermin]=useState(false)
  const [datum,setDatum]=useState(new Date())

  const [modalUspesnoZakazanTermin,setModalUspesnoZakazanTermin]=useState(false)
  const [modalZakazanTerminGreska,setModalZakazanTerminGreska]=useState(false)
  const [modalTermini,setModalTermini]=useState(false)
  const [modalPotvrdiOtkazivanje,setModalPotvrdiOtkazivanje]=useState(false)
 
  const[vremePocetak,setVremePocetak]=useState('10:00')
  const[vremeKraj,setVremeKraj]=useState('10:00')
  const [idTerminaOtkazivanje,setIdTerminaOtkazivanje]=useState("")
  const [modalUspesnoOtkazivanje,setModalUspesnoOtkazivanje]=useState(false)
  const [modalOtkazivanjeGreska,setModalOtkazivanjeGreska]=useState(false)
  const [modalZahteviInstruktora,setModalZahteviInstruktora]=useState(false)
  const [modalPrihvatiZahtev,setModalPrihvatiZahtev]=useState(false)
  const [probniTermin,setProbniTermin]=useState("")
  const options = {
    year: "2-digit",
    month:"2-digit",
    day:"2-digit"
    }
 
   const dodajTermin=()=>{
    
     let idCasa=casovi.pod.filter(p=>p.naziv==imeCasa).map(c=>c.id).toString()
     
     setSpin(true)
     setModalZakaziTermin(false)
     fetch("https://localhost:5001/PlesnaSkola/DodajNoviTerminCasaPlesa/"+idCasa,{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(
        {
          nazivPlesa:imeCasa.toString(),
          maximalanBrojLjudi:maksBrojOsoba,
          korisnickoImeInstruktora:korisnickoIme,
          imeInstruktora:ime,
          prezimeInstruktora:prezime,
          datum:datum.toLocaleDateString("en-US",options),
          vremePocetkaTermina:vremePocetak.toString(),
          vremeKrajaTermina:vremeKraj.toString(),
          trenutanBrojLjudi:0
          
          
        }
      )
    }).then(p=>{
      setSpin(false)
      if(p.ok)
      {
        setModalUspesnoZakazanTermin(true)
      }
      else
      {
        setModalZakazanTerminGreska(true)
        
      }
    })
   }
   const obrisiZahtev=(id)=>{
   
    setSpin(true)
    fetch("https://localhost:5001/PlesnaSkola/ObrisiZahtev/"+id,{
        method:"DELETE",
        headers:{'Content-Type':'application/json'},
        credentials:'include'
    }).then(p=>{
        setSpin(false)
        if(p.ok)
           {
              window.location.reload()
           }
          
    })

   }
   
   const prikaziTermine=(id)=>{
    setSpin(true)
    let naziv= casovi.pod.filter(p=>p.id==id).map(c=>c.naziv).toString()
   
   fetch("https://localhost:5001/PlesnaSkola/PreuzmiSlobodneTermineCasova/"+korisnickoIme+"/"+naziv).then(pod=>{
       pod.json().then(term=>{
          setSpin(false)
          setTermini({pod:term})
         
         
          
        })
   })
   setModalTermini(true)
}
 
const odbijZahtev=(id)=>{
  
  setSpin(true)
  fetch("https://localhost:5001/PlesnaSkola/OdbijZahtev/"+localStorage.getItem("ID")+"/"+id,{
      method:"PUT",
      headers:{'Content-Type':'application/json'},
      credentials:'include'
  }).then(p=>{
      setSpin(false)
      if(p.ok)
         {
            setModalZahteviInstruktora(false)
             setModalUspesnoOtkazivanje(true)
             
         }
         else
         {
            setModalOtkazivanjeGreska(true)
         }
  })
}
  
     
  useEffect(() => {
     
    const token=localStorage.getItem("jwt")
           
            fetch("https://localhost:5001/PlesnaSkola/PreuzmiClana", {
                headers:{'Content-Type':'application/json',
                'Authorization':token},
                credentials:'include',
            }).then(korisnik=>{
    
               korisnik.json().then(podaci=>{
                  
                  localStorage.setItem("tip",podaci.tip)
                  
                   setIme(podaci.ime)
                   setPrezime(podaci.prezime)
                   setGodine(podaci.godine)
                   setBrojTelefona(podaci.brojTelefona)
                   setEmail(podaci.email)
                   setEmailIzmena(podaci.email)
                   setTelefonIzmena(podaci.brojTelefona)
                   setGodineIzmena(podaci.godine)
                   setKorisnickoIme(podaci.korisnickoIme)
                   
                   setTip(podaci.tip)
              
                   localStorage.setItem("ID",podaci.id)
                   if(podaci.slika!=null)
                   {
                    setProfilnaSrc(podaci.slika)
                   }               
          
                   if(localStorage.getItem("tip")==3)
                   {
                     
                     
                     setPrikazClan(true)
                     setDatumPlacanja(podaci.clanarina.datumPlacanja)
                     setPlacenaCl(podaci.clanarina.placena)
                     setProbniTermin(podaci.probniTermin)
                     
                     
                     if(podaci.clanarina.placena==true)
                     setPlacenaClanarina("Jeste")
                
                     else 
                     setPlacenaClanarina("Nije")
                     setIznos(podaci.clanarina.iznos)
                  fetch("https://localhost:5001/PlesnaSkola/PreuzmiTermineClana/"+localStorage.getItem("ID")).then(pod=>{
                   if(pod.ok)
                   {  
                   pod.json().then(termini=>{
                      
                         setTerminiClan({pod:termini})
                         
                       })
                    }
                  })
                  fetch("https://localhost:5001/PlesnaSkola/PreuzmiZahteveClana/"+localStorage.getItem("ID")).then(pod=>{
                   if(pod.ok)
                   {  
                   pod.json().then(termini=>{
                      
                         setZahteviClan({pod:termini})
                         
                       })
                    }
                  })

                   }
                   else if(localStorage.getItem("tip")==2)
                   {
                    
                     fetch("https://localhost:5001/PlesnaSkola/PreuzmiCasovePlesaInstruktora/"+localStorage.getItem("ID")).then(p=>{
                       if(p.ok)
                       {
                         p.json().then(cas=>{
                          
                           setCasovi({pod:cas})
                           setPrikazInstruktor(true)
                           
                         })
                       }
                     })
                                   
                   }       
               })
          })
        
   
  },[])
  const otkaziTerminKorisnik=(id)=>{
    setSpin(true)
    setModalPotvrdiOtkazivanje(false)
    fetch("https://localhost:5001/PlesnaSkola/OtkaziTermin/"+localStorage.getItem("ID")+"/"+idTerminaOtkazivanje,{
      method:"DELETE",
      headers:{'Content-Type':'application/json'},
      credentials:'include'
  }).then(p=>{
      setSpin(false)
      if(p.ok)
         {
          setModalUspesnoOtkazivanje(true)
         window.location.reload()
         }
         else
         {
             setModalOtkazivanjeGreska(true)
         }
  })

  }
  const otkaziTerminInstrktor=(id)=>{
    setSpin(true)
    setModalPotvrdiOtkazivanje(false)
    console.log(idTerminaOtkazivanje)
    fetch("https://localhost:5001/PlesnaSkola/ObrisiTerminCasaPlesa/"+idTerminaOtkazivanje,{
      method:"DELETE",
      headers:{'Content-Type':'application/json'},
      credentials:'include'
  }).then(p=>{
      setSpin(false)
      if(p.ok)
         {
          setModalUspesnoOtkazivanje(true)
             setModalTermini(false)
         }
         else
         {
             setModalOtkazivanjeGreska(true)
         }
      
  })
 }
  const potvrdiOtkazivanje=(id)=>{
    setIdTerminaOtkazivanje(id)
    setModalPotvrdiOtkazivanje(true)
  }
  
    
  const izmeni=(e)=>{
      setModal(false) 
      setSpin(true)
      console.log(tip)
      if(tip==3)
      {

          
        fetch("https://localhost:5001/PlesnaSkola/IzmeniClanaPlesneSkole/"+localStorage.getItem("ID"),{
            method:"PUT",
            headers:{'Content-Type':'application/json'},
            credentials:'include',
            body:JSON.stringify(
              {
               
                ime:ime,
                prezime:prezime,
                godine:godineIzmena,
                email:emailIzmena,
                brojTelefona:telefonIzmena,
                
              }
            )
          }).then(p=>{
            setSpin(false)
              if(p.ok)
              {
                  
                  window.location.reload()
                  
              }
          })
      }
      else if(tip==2)
      {
        fetch("https://localhost:5001/PlesnaSkola/IzmeniInstruktoraPlesa/"+localStorage.getItem("ID"),{
            method:"PUT",
            headers:{'Content-Type':'application/json'},
            credentials:'include',
            body:JSON.stringify(
              {
               
                ime:ime,
                prezime:prezime,
                godine:godineIzmena,
                email:email,
                brojTelefona:telefonIzmena
               
              }
            )
          }).then(p=>{
            setSpin(false)
            if(p.ok)
            {
                window.location.reload()
            }
        })

      }
      else if(tip==1)
      {
        fetch("https://localhost:5001/PlesnaSkola/IzmeniAdministratora/"+localStorage.getItem("ID"),{
            method:"PUT",
            headers:{'Content-Type':'application/json'},
            credentials:'include',
            body:JSON.stringify(
              {
               
                ime:ime,
                prezime:prezime,
                godine:godineIzmena,
                email:email,
                brojTelefona:telefonIzmena
               
              }
            )
          }).then(p=>{
            setSpin(false)
            if(p.ok)
            {
                window.location.reload()
            }
        })

      }
    
  }
 
   const izmeniSliku=(e)=>{
     if(e.target.files && e.target.files[0])
     {
       let imgFile=e.target.files[0]
       const reader= new FileReader()
       reader.onload=x=>{
         
         setProfilnaSrc(x.target.result)
       }
       reader.readAsDataURL(imgFile)
       setProfilnaFile(imgFile)
       setProfilnaIme(imgFile.name)
     }

   }
   const izmeniTrajnoSliku=()=>{

    const formData=new FormData()
    formData.append("profilnaFile",profilnaFile)
    
    setSpin(true)
 
      axios.put("https://localhost:5001/PlesnaSkola/IzmeniSliku/"+korisnickoIme,formData).then(p=>{
        if(p!=null)
        {
          setSpin(false)
        
         setPrikazDugmetaIzmeniSliku(true)
         setPrikazFormeZaIzborSlike(false) 
        }
      })
        

   }
   const podaciZaIzmenuCasova=(id)=>{
    const cas=casovi.pod.filter(p=>p.id==id)
     setIdIzmenaCasa(id)
     setImeCasa(cas.map((pod)=>pod.naziv))
     setModalZakaziTermin(true)
   }
   const izmeniDatum=datum=>{
     setDatum(datum)
   }
   const preuzmiZahteve=()=>{
    setSpin(true)
    
   fetch("https://localhost:5001/PlesnaSkola/PreuzmiZahteveInstruktora/"+localStorage.getItem("ID")).then(pod=>{
       pod.json().then(term=>{
          setSpin(false)
          setZahteviInstruktora({pod:term})
         
          
         
          
        })
   })
   setModalZahteviInstruktora(true)
     
   }
   const prihvatiZahtev=(id)=>{
     console.log(id)
     console.log(datum.toLocaleDateString("en-US",options))
     console.log(vremePocetak)
     console.log(vremeKraj)
    setSpin(true)
 
   fetch("https://localhost:5001/PlesnaSkola/PrihvatiZahtev/"+id,{
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(
        {
          datum:datum.toLocaleDateString("en-US",options),
          casPlesaId:7,
          instruktorPlesaId:localStorage.getItem("ID"),
          clanPlesneSkoleId:localStorage.getItem("ID"),
          vremePocetka:vremePocetak.toString(),
          vremeKraja:vremeKraj.toString(),
        
          
        }
      )
   }).then(p=>{
     setSpin(false)
     setModalZahteviInstruktora(false)

   })
   }

    return(
        <div className='glavniDivProfil'>
          <div className='pomocniDivProfilll'> 
           
             <div className='pomocniDivProfil'>
             <label className='pomInfo' style={{marginLeft:"50px", marginTop:"20px"}}>Lični podaci</label>
           <img className='profilnaSlika' src={profilnaSrc} alt='profilna'/>
        {prikazFormeZaIzborSlike? 
           <input type='file'
         placeholder='Izaberi sliku'
         id='profilnaSlika'
          className='form-control-file chooseFile' onChange={izmeniSliku}/>:null}
          {prikazFormeZaIzborSlike?<Button className='btn btn-info btnIzmeniSliku'
          onClick={()=> izmeniTrajnoSliku()}>Sacuvaj izmenu</Button>:null}
          {prikazDugmetaIzmeniSliku? <Button className='btn btn-info btnIzmeniSliku' 
          onClick={()=>{setPrikazFormeZaIzborSlike(true) ;setPrikazDugmetaIzmeniSliku(false)}}><i class="fa fa-edit" aria-hidden="true"></i> Izmenite sliku</Button>:null}
           <label>Ime: <label className='pomInfo'>{ime}</label></label>
           <label>Prezime: <label className='pomInfo'>{prezime}</label></label>
           <label>Godine: <label className='pomInfo'>{godine}</label> </label>
           <label>Broj telefona: <label className='pomInfo'>{brojTelefona}</label> </label>
           <label>Email: <label className='pomInfo'>{email}</label></label>
          {godine==0 || brojTelefona==null? <label style={{color:'red'}}>Molimo Vas da unesete sve podatke o sebi.</label>:null } 
          
           <Button className='btn btn-success dugmIzmeni' onClick={()=>setModal(true)}>Izmenite podatke</Button>
          
           {spin?<LoadingSpin/>:null}
           
         


        </div>
       {prikazClan? <div className='divClanarina'>
       <label className='naslovEvidencija'>Evidencija članarine</label>
        <Table striped bordered hover size="sm">
        
  <tbody>
    <tr>
      <td>Poslednji put plaćena</td>
      <td>{datumPlacanja}</td>
    
    </tr>
    <tr>
      <td>Trenutni iznos</td>
      <td>{iznosClanarine}</td>
     
    </tr>
    <tr>
      <td>Izmireno zaduženje za ovaj mesec</td>
      <td className={placenaCl?'placenaClanarina':'nijePlacena'}>{placenaClanarina}</td>
      
    </tr>
  </tbody>
</Table >
{placenaCl==false && probniTermin==false ?<Row style={{color:'red'}}>*Molimo vas da platite članarinu jer u suprotnom nećete moći da zakažete novi termin.</Row>:null}
{placenaCl==false && probniTermin==true ?<Row style={{color:'green'}}>*Iskoristite mogućnost i zakažite prvi probni besplatni čas.</Row>:null}
<label className='naslovEvidencija' style={{marginTop:"50px"}}>Vaši zakazani termini</label>
        <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <td>Naziv casa plesa</td>
            <td>Datum</td>
            <td>Početak</td>
            <td>Kraj</td>
            <td>Ime instruktora</td>
            <td>Prezime instruktora</td>
          </tr>
        </thead>
  <tbody>
   { 
   terminiClan.pod.filter(obj=>obj!=null).map((termin)=>(
     
     <tr key={termin.id}>
       
      <td>{termin.nazivPlesa}</td>
      <td>{termin.datum}</td>
      <td>{termin.vremePocetkaTermina}</td>
      <td>{termin.vremeKrajaTermina}</td>
      <td>{termin.imeInstruktora}</td>
      <td>{termin.prezimeInstruktora}</td>
      <td><Button variant='danger' onClick={()=>potvrdiOtkazivanje(termin.id)} >Otkažite</Button></td>
     
    </tr>

   ))
    }
   
  </tbody>
</Table>
<label className='naslovEvidencija' style={{marginTop:"50px", marginLeft:"240px"}}>Želite da isprobate nešto novo?</label>
{probniTermin==true?<Button className='dugmence' onClick={handleHistory}>Zakažite termin</Button>:<Button className='dugmence' onClick={handleHistory}>Zakažite novi termin</Button>} 

 <label className='naslovEvidencija' style={{marginTop:"50px"}}>Vaši poslati zahtevi </label>
        <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <td>Naziv časa plesa</td>
            <td>Datum</td>
            <td>Vreme od:</td>
            <td>Vreme do:</td>
            <td>Ime instruktora</td>
            <td>Prezime instruktora</td>
            <td>Status:</td>
          </tr>
        </thead>
  <tbody>
   { 
   zahteviClan.pod.filter(obj=>obj!=null).map((zahtev)=>(
     
     <tr key={zahtev.id}>
       
      <td>Prvi ples</td>
      <td>{zahtev.datum}</td>
      <td>{zahtev.vremePocetka}</td>
      <td>{zahtev.vremeKraja}</td>
      <td>{zahtev.instruktorPlesaIme}</td>
      <td>{zahtev.instruktorPlesaPrezime}</td>
    {zahtev.zahtevPrihvacen=='Odbijen'?<td style={{color:'red'}}>{zahtev.zahtevPrihvacen}</td>:null}
    {zahtev.zahtevPrihvacen=='Prihvaćen'?<td style={{color:'green'}}>{zahtev.zahtevPrihvacen}</td>:null} 
    {zahtev.zahtevPrihvacen=='Čekanje potvrde'?<td style={{color:'blue'}}>{zahtev.zahtevPrihvacen}</td>:null} 
      <td><Button onClick={()=>obrisiZahtev(zahtev.id)} ><i class="fa fa-trash" aria-hidden="true"></i> Obrišite</Button></td>
     
    </tr>

   ))
    }
   
  </tbody>
</Table>

        </div>:null}





        {prikazInstruktor? <div className='divClanarina'>
       <label className='naslovEvidencija'>Vaši časovi</label>
       
        <Table striped bordered hover size="sm">
     <tbody>
    {casovi.pod.filter(cas=>cas!=null).map((cas)=>(
      <tr key={cas.id}>
      <td>{cas.naziv}</td>
    {cas.naziv=='Prvi ples'? <td><Button onClick={preuzmiZahteve}>Prikaži zahteve</Button></td>:<td><Button onClick={()=>podaciZaIzmenuCasova(cas.id)}>Zakaži novi termin</Button></td>}
      <td><Button  onClick={()=>prikaziTermine(cas.id)}>Prikaži termine</Button></td>
      

    </tr>

    )
    
  )}
    
    

  </tbody>
</Table>
        </div>:null}

     
        </div>
       
        <Modal show={modalUspesnoZakazanTermin}>
              <Modal.Header >Uspešno zakazivanje</Modal.Header>
              <Modal.Body>
              <Alert className='alert alert-success'>Uspešno ste zakazali novi termin<i className="far fa-check-circle ikonica"></i></Alert>
             </Modal.Body>
              <Modal.Footer>
                  <Button onClick={()=>setModalUspesnoZakazanTermin(false)}>Ok</Button>
              </Modal.Footer>
          </Modal>

          <Modal show={modalZakazanTerminGreska}>
              <Modal.Header >Greška</Modal.Header>
              <Modal.Body>
              <Alert className='alert alert-danger'>Žao nam je, došlo je do greške prilikom zakazivanja termina.Molimo Vas pokušajte ponovo.</Alert>
             </Modal.Body>
              <Modal.Footer>
                  <Button onClick={()=>setModalZakazanTerminGreska(false) }>Ok</Button>
              </Modal.Footer>
          </Modal>
          <Modal show={modalPotvrdiOtkazivanje}>
              
              <Modal.Body>
              <Alert className='alert alert-info'>Da li ste sigurni da želite da otkažete ovaj termin?</Alert>
             </Modal.Body>
              <Modal.Footer>
               { localStorage.getItem("tip")=='3'?<Button onClick={otkaziTerminKorisnik}  >Potvrdi</Button>:null}
               { localStorage.getItem("tip")=='2'?<Button onClick={otkaziTerminInstrktor}  >Potvrdi</Button>:null}
                  <Button onClick={()=>setModalPotvrdiOtkazivanje(false)}>Poništi</Button>
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
                           
                         
                           {termin.nazivPlesa== 'Prvi ples' ? null : <Row>Trenutni broj ljudi: {termin.trenutanBrojLjudi}</Row>} 
                          
                           {termin.nazivPlesa== 'Prvi ples' ? null : <Row>Maksimalni broj ljudi: {termin.maximalanBrojLjudi} </Row>}
                            <Row><Button className='btn-danger' onClick={()=>potvrdiOtkazivanje(termin.id)}>Otkažite</Button></Row>

                        </div>
                    ))
                  }
              
             </Modal.Body>
             <Modal.Footer>
                  <Button onClick={()=>setModalTermini(false) }>Ok</Button>
              </Modal.Footer>
             </Modal>
             <Modal show={modalUspesnoOtkazivanje}>
              <Modal.Header >Uspešno brisanje</Modal.Header>
              <Modal.Body>
              <Alert className='alert alert-success'>Uspešno ste otkazali ovaj termin<i className="far fa-check-circle ikonica"></i></Alert>
             </Modal.Body>
              <Modal.Footer>
                  <Button onClick={()=>setModalUspesnoOtkazivanje(false)}>Ok</Button>
              </Modal.Footer>
          </Modal>

          <Modal show={modalOtkazivanjeGreska}>
              <Modal.Header >Greška</Modal.Header>
              <Modal.Body>
              <Alert className='alert alert-danger'>Žao nam je, došlo je do greške prilikom otkazivanja termina. Molimo Vas pokušajte ponovo.</Alert>
             </Modal.Body>
              <Modal.Footer>
                  <Button onClick={()=>setModalOtkazivanjeGreska(false) }>Ok</Button>
              </Modal.Footer>
          </Modal>
          <Modal show={modal}>
               <Modal.Header >Izmenite podatke o sebi</Modal.Header>
               <Modal.Body>
               <Row>Ime: <input className='unosIzmena' defaultValue={ime} disabled /></Row>
               <Row>Prezime: <input className='unosIzmena' defaultValue={prezime} disabled /></Row>
               <Row>Godine: <input className='unosIzmena' defaultValue={godine}  onChange={e=>setGodineIzmena(e.target.value)}/></Row>
               <Row>Broj telefona: <input className='unosIzmena' defaultValue={brojTelefona}  onChange={e=>setTelefonIzmena(e.target.value)}/></Row>
               <Row>Email: <input className='unosIzmena' defaultValue={email}  onChange={e=>setEmailIzmena(e.target.value)}/></Row>
               </Modal.Body>
               <Modal.Footer>
                   <Button onClick={izmeni}>Potvrdi</Button>
                   <Button onClick={()=>setModal(false)}>Poništi</Button>
               </Modal.Footer>
           </Modal>
           <Modal show={modalZakaziTermin}>
               <Modal.Header >Zakaži novi termin</Modal.Header>
               <Modal.Body>
               <Row className='redZakazi'>Naziv časa: <h5 style={{color:"#00008b"}}>{imeCasa}</h5></Row>
              <Row>Datum:</Row>
              <Row>
              <DatePicker
               
               selected={datum}
               onChange={(date) => setDatum(date)}
                />
               </Row>
              

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
                 timeIntervals={30}
                  />
                 </Row>
                
                 <Row>Maksimalni broj osoba:</Row>
                 <Row>
                   <input type='number' onChange={e=>setMaksBrojOsoba(e.target.value)}></input>
                 </Row>

               </Modal.Body>
               <Modal.Footer>
                   <Button onClick={()=>dodajTermin()}>Potvrdi</Button>
                   <Button onClick={()=>setModalZakaziTermin(false)}>Poništi</Button>
               </Modal.Footer>
           </Modal>
           <Modal show={modalZahteviInstruktora}>
        
        <Modal.Header>Zahtevi</Modal.Header> 
            <Modal.Body>
                {
                 zahteviInstruktora.pod.map((zahtev)=>(
                      <div key={zahtev.id} className='divModal'>
                        
                           <Row>Član: {zahtev.clanPlesneSkoleIme} {zahtev.clanPlesneSkolePrezime}</Row>
                          <Row>Datum: {zahtev.datum}</Row>
                          <Row>Vreme od: {zahtev.vremePocetka} </Row>
                          <Row>Vreme do: {zahtev.vremeKraja}</Row>
                          <Row style={{marginBottom:'10px'}}>Opis: {zahtev.opis}</Row>
                          <Row style={{color:'blue'}}>* U slučaju da Vam odgovara ovaj termin izaberite datum i vreme i prihvatite zahtev.</Row>
                          <Row>Datum:</Row>
              <Row>
              <DatePicker
               
               selected={datum}
               onChange={(date) => setDatum(date)}
                />
               </Row>
              

               <Row>Vreme od:</Row> 
               <Row>     
                <TimePicker
                 onChange={(vreme)=>setVremePocetak(vreme)}
                value={vremePocetak}
                
                 />
                </Row>
                 
                 <Row>Vreme do:</Row>
                 <Row>
                   <TimePicker
                 onChange={(vreme)=>setVremeKraj(vreme)}
                 value={vremeKraj}
                 
                  />
                 </Row>
                


                           <Row className='redDugmiciPrihvOtkazi'><Button onClick={()=>prihvatiZahtev(zahtev.id)}>Prihvati</Button><Button onClick={()=>odbijZahtev(zahtev.id)}>Odbij</Button></Row>
                          

                      </div>
                  ))
                }
            
           </Modal.Body>
           <Modal.Footer>
                <Button onClick={()=>setModalZahteviInstruktora(false) }>Ok</Button>
            </Modal.Footer>
           </Modal>
           



          
          
           

  

        </div>
    )
}
export default Profil