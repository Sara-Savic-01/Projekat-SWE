import React,{useState,useEffect,useMemo} from 'react'
import {Table,Button,Modal,Alert,Row} from 'react-bootstrap'
import PaginationComponent from '../../komponente/PaginationComponent'
import Search from '../../komponente/Search'
import "./Podaci.css"
import LoadingSpin from '../../komponente/LoadingSpin'
import { Select } from '@material-ui/core'
import {Redirect} from 'react-router-dom'
import {useHistory} from "react-router-dom"

export default function Podaci() {
    const [podaci,setPodaci]=useState({pod:[]})
    const [ukupnoStavki,setUkupnoStavki]=useState(0)
    const [trStranica,setTrStranica]=useState(1)
    const [pretrazi,setPretrazi] =useState("")
    const STAVKE_PO_STRANICI=5
    const [modalUspesnoBrisanje,setModalUspesnoBrisanje]=useState(false)
    const [modalBrisanjeGreska,setModalBrisanjeGreska]=useState(false)
    const [modalObrisi,setModalObrisi]=useState(false)
    const [idBrisanje,setIdBrisanje]=useState("")
    const [modalIzmeni,setModalIzmeni]=useState(false)
    const placenaClanarina="Jeste";
    const nijePlacenaClanarina="Nije"
    const [spin,setSpin]=useState(false)
    const [imeIzmena,setImeIzmena]=useState("")
    const [idIzmena,setIdIzmena]=useState("")
    const [prezimeIzmena,setPrezimeIzmena]=useState("")
    const [trClanarina,setTrClanarina]=useState("")
    const [clanarinaIzmena,setClanarinaIzmena]=useState("")
    const [korisnickoImeIzmena,setKorisnickoImeIzmena]=useState("")
    const [prikaziAdm,setPrikaziAdm]=useState(false)
    const [prikaziKor,setPrikaziKor]=useState(false)
    const [tip,setTip]= useState("1")
    const history=useHistory()

    useEffect(() => {
        
        const token=localStorage.getItem("jwt")
               
                fetch("https://localhost:5001/PlesnaSkola/PreuzmiClana", {
                    headers:{'Content-Type':'application/json',
                    'Authorization':token},
                    credentials:'include',
                }).then(korisnik=>{
        
                   korisnik.json().then(podaci=>{
                      
                      localStorage.setItem("tip",podaci.tip)
                      setTip(podaci.tip)
              
                   localStorage.setItem("ID",podaci.id)
                   if(localStorage.getItem("tip")==1)
                   { 
                        setPrikaziAdm(true)
                   }
                   else{
                   
                        setPrikaziKor(true)
                   }
                }
           )}
      
            )
                   
                   
               
            
            },[])
          
            
       
    
    
    useEffect(() => { 
       fetch("https://localhost:5001/PlesnaSkola/PreuzmiClanovePlesneSkole").then(pod=>{
           pod.json().then(clanovi=>{     
               setPodaci({pod:clanovi})
               setUkupnoStavki(podaci.pod.length)
                
            })
       })
    },[])

    const obrisiClana=()=>
    {
        setModalObrisi(false)
        setSpin(true)
        fetch("https://localhost:5001/PlesnaSkola/ObrisiClana/"+idBrisanje,{
             method:"DELETE",
             headers:{'Content-Type':'application/json'},
             credentials:'include'
        }).then(p=>{
            setSpin(false)
            if(p.ok){
                setModalUspesnoBrisanje(true)
            }
            else{
                setModalBrisanjeGreska(true)
            }
        })
    }

    const potvrdiBrisanje=(id)=> 
    {     
        setModalObrisi(true)
        setIdBrisanje(id)
    }

    const uspesnoBrisanje=()=>{
        setModalUspesnoBrisanje(false)
        window.location.reload()
    }

    const izmeniClanaModal=(id)=> 
    {
        setIdIzmena(id)
        const osoba=podaci.pod.filter(p=>p.id===id)
        setImeIzmena(osoba.map((pod)=>pod.ime))
        setPrezimeIzmena(osoba.map((pod)=>pod.prezime))
        setKorisnickoImeIzmena(osoba.map((pod)=>pod.korisnickoIme))
        console.log(imeIzmena,prezimeIzmena,trClanarina)
        console.log(osoba.map((clan)=>clan.clanarina).map((clanarina)=>clanarina.placena))
        if(osoba.map((clan)=>clan.clanarina).map((clanarina)=>clanarina.placena)=='false')
        setTrClanarina('0')//da pise da nije platio
        else
        setTrClanarina('1')//da pise da jeste platio
        
        setModalIzmeni(true)
    }

    const izmeniStanjeClanarineKorisnika=()=>
    {
        console.log(clanarinaIzmena)
        setModalIzmeni(false)
        setSpin(true)
        fetch("https://localhost:5001/PlesnaSkola/IzmeniClanarinu/"+idIzmena+"/"+clanarinaIzmena,{
            method:"PUT",
            headers:{'Content-Type':'application/json'},
            credentials:'include'
      }).then(p=>{
          setSpin(false)
          window.location.reload()
      })
    }

    const sviClanovi=useMemo(()=>{
        let obv=podaci.pod;
    
        if(pretrazi){
            obv=obv.filter(
                obav=>
                obav.ime.toLowerCase().includes(pretrazi.toLowerCase()) ||
                obav.prezime.toLowerCase().includes(pretrazi.toLowerCase())
            )
        }
        setUkupnoStavki(obv.length)
        return obv.slice((trStranica-1)*STAVKE_PO_STRANICI,(trStranica-1)*STAVKE_PO_STRANICI+STAVKE_PO_STRANICI)
    },[podaci,trStranica,pretrazi])

    return (
        <div className='podaciCont'>
       
         {prikaziAdm ? <Search 
            pretrazi={(value)=>{
               setPretrazi(value)
               setTrStranica(1)
            }}/> :null}
         {prikaziAdm ? <PaginationComponent
            ukupno={ukupnoStavki}
            stavkePoStranici={STAVKE_PO_STRANICI}
            trenutnaStranica={trStranica}
            promeniStranicu={page=>setTrStranica(page)}/> :null}
         {prikaziAdm ? <Table striped bordered hover >
            <thead>
            <tr>
                <th className='Broj'>ID</th>
                <th>Ime</th>
                <th>Prezime</th>
                <th>Korisnicko ime</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Trenutni iznos članarine</th>
                <th>Plaćena članarina</th>
            </tr>
            </thead>
            <tbody>
            {
                sviClanovi.map((clan)=>(
                <tr key={clan.id}>
                <td className='Broj'>{clan.id}</td>
                <td>{clan.ime}</td>
                <td>{clan.prezime}</td>
                <td>{clan.korisnickoIme}</td>
                <td>{clan.email}</td>
                <td>{clan.brojTelefona}</td>
                <td>{clan.clanarina.iznos}</td>
                {clan.clanarina.placena?<td className='placena'>{placenaClanarina}</td>:<td className='nijePlacena'>{nijePlacenaClanarina}</td>}
                <td><Button onClick={()=>izmeniClanaModal(clan.id)}>Izmeni</Button></td>
                <td><Button  onClick={()=>potvrdiBrisanje(clan.id)}>Obriši</Button></td>
                </tr>
                ))
            }  
            </tbody>
        </Table> :null}

        {prikaziKor?<h2 className='naslovContt'><i className="fas fa-exclamation-triangle"></i> Ovu stranicu može otvoriti samo administrator!</h2>:null}
        {prikaziKor? <Button className='dugmence' onClick={()=>history.push("/")}>Vrati se na početnu stranicu</Button>:null}

        <Modal show={modalObrisi}>      
            <Modal.Body>
              <Alert className='alert alert-info'>Da li ste sigurni da želite da obrišete ovog člana?</Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>obrisiClana() }>Potvrdi</Button>
                <Button onClick={()=>setModalObrisi(false)}>Poništi</Button>
            </Modal.Footer>
            </Modal>

            <Modal show={modalUspesnoBrisanje}>
                <Modal.Header >Uspešno brisanje</Modal.Header>
                <Modal.Body>
                    <Alert className='alert alert-success'>Uspešno ste obrisali ovog člana <i className="far fa-check-circle ikonica"></i></Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={uspesnoBrisanje}>Ok</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={modalBrisanjeGreska}>
                <Modal.Header >Greška</Modal.Header>
                <Modal.Body>
                <Alert className='alert alert-danger'>Žao nam je, došlo je do greške prilikom brisanja člana.Molimo Vas pokušajte ponovo.</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>setModalBrisanjeGreska(false) }>Ok</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={modalIzmeni}>
            <Modal.Header>Izmeni stanje članarine</Modal.Header> 
                <Modal.Body>
                <Row>Ime: <input className='unosIzmena' defaultValue={imeIzmena} disabled /></Row>
                <Row>Prezime: <input className='unosIzmena' defaultValue={prezimeIzmena} disabled /></Row>
                <Row>Korisnicko ime: <input className='unosIzmena' defaultValue={korisnickoImeIzmena} disabled /></Row>
                <Row>Plaćena članarina:  <select className='unosIzmena'
                defaultValue= {trClanarina}
                onChange={(e)=>{
                    const daLiJePlacena=e.target.value
                    setClanarinaIzmena(daLiJePlacena)
                }}>
                <option value= '1'>Jeste</option>
                <option value= '0'>Nije</option>
                </select></Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>izmeniStanjeClanarineKorisnika() }>Potvrdi</Button>
                    <Button onClick={()=>setModalIzmeni(false)}>Poništi</Button>
                </Modal.Footer>
            </Modal>
          {spin?<LoadingSpin/>:null}
    </div>
    )
}
