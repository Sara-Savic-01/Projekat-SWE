import React,{useState,useEffect} from 'react';
import  './Cenovnik.css';
import filter from './filter.jpg';
import {useHistory} from "react-router-dom";
import *as ReactBootStrap from 'react-bootstrap';
import {Table,Button,Modal,Row} from 'react-bootstrap';
import LoadingSpin from '../../komponente/LoadingSpin';

export default function Cenovnik()
{
    const history=useHistory();
    const [podaci,setPodaci]=useState({pod:[]})
    const [podaciFilt,setPodaciFilt]=useState({pod:[]})
    const [podaciSort,setPodaciSort]=useState({pod:[]})
    const [prikaziAdmin,setPrikaziAdmin]=useState(false)
    const [naziv,setNaziv]=useState("")
    const [poCasuPlesa,setPoCasuPlesa]=useState("")
    const [nedeljno,setNedeljno]=useState("")
    const [mesecno,setMesecno]=useState("")
    const [polugodisnje,setPolugodisnje]=useState("")
    const [godisnje,setGodisnje]=useState("")
    const [spin,setSpin]=useState(false)
    const [modalIzmeniCenu,setModalIzmeniCenu]=useState(false)
    const [idCasaPlesa,setIdCasaPlesa]=useState("")

    useEffect(() => {                
        
        fetch("https://localhost:5001/PlesnaSkola/PreuzmiCasove").then(pod=>{
            pod.json().then(casovi=>{
               
                setPodaci({pod:casovi})
                setPodaciFilt({pod:casovi})
                setPodaciSort({pod:casovi})
              
                let tip=localStorage.getItem("tip")
                if(tip==1)
                {
                    setPrikaziAdmin(true)
                }
             })
        })       
        
    },[])

    const izmeniCene=(id)=>{

        fetch("https://localhost:5001/PlesnaSkola/PreuzmiCas/"+id).then(pod=>{
            pod.json().then(cas=>{

                setNaziv(cas.naziv)
                setPoCasuPlesa(cas.cena)
                setNedeljno(cas.nedeljno)
                setMesecno(cas.mesecno)
                setPolugodisnje(cas.polugodisnje)
                setGodisnje(cas.godisnje)
                setModalIzmeniCenu(true)
                setIdCasaPlesa(id)
            })
        })
    
    }

    const izmeniCenuCasaPlesa=()=>{

        console.log(naziv,poCasuPlesa,nedeljno,mesecno,polugodisnje,godisnje)

        setSpin(true)

        fetch("https://localhost:5001/PlesnaSkola/IzmeniCene/"+idCasaPlesa,{

         method:"PUT",
         headers:{'Content-Type':'application/json'},
         body:JSON.stringify(
           {

            cena:poCasuPlesa,
            nedeljno:nedeljno,
            mesecno:mesecno,
            polugodisnje:polugodisnje,
            godisnje:godisnje
             
           }
         )
       }).then(p=>{
         setSpin(false)
         setModalIzmeniCenu(false)
         window.location.reload()
       })
    }

    const filtriraj=(vrsta)=>{

        let prikazi=podaciFilt.pod
 
        if(vrsta=='0')
        {
            prikazi=podaciFilt.pod
        }
        else if(vrsta=='1')
        {
            prikazi=podaciFilt.pod.filter(cas=>cas.tip=='Prvi ples na vencanju')
        }
        else if(vrsta=='2')
        {
           prikazi=podaciFilt.pod.filter(cas=>cas.tip=='Sportski ples')
        }
       setPodaci({pod:prikazi})
    }

    const sortiraj=(tip)=>{
        
        let prikazi=podaciSort.pod
    
        if(tip=='0')
        {
            prikazi=podaciSort.pod
        }
        else if(tip=='1')
        {
            prikazi=podaciFilt.pod.sort((a,b)=>a.cena-b.cena)
        }
        else if(tip=='2')
        {
            prikazi=podaciFilt.pod.sort((a,b)=>b.cena-a.cena)
        }
        else if(tip=='3')
        {
            prikazi=podaciFilt.pod.sort((a,b)=>a.nedeljno-b.nedeljno)
        }
        else if(tip=='4')
        {
            prikazi=podaciFilt.pod.sort((a,b)=>b.nedeljno-a.nedeljno)
        }
        else if(tip=='5')
        {
            prikazi=podaciFilt.pod.sort((a,b)=>a.mesecno-b.mesecno)
        }
        else if(tip=='6')
        {
            prikazi=podaciFilt.pod.sort((a,b)=>b.mesecno-a.mesecno)
        }
        else if(tip=='7')
        {
            prikazi=podaciFilt.pod.sort((a,b)=>a.polugodisnje-b.polugodisnje)
        }
        else if(tip=='8')
        {
            prikazi=podaciFilt.pod.sort((a,b)=>b.polugodisnje-a.polugodisnje)
        }
        else if(tip=='9')
        {
            prikazi=podaciFilt.pod.sort((a,b)=>a.godisnje-b.godisnje)
        }
        else if(tip=='10')
        {
            prikazi=podaciFilt.pod.sort((a,b)=>b.godisnje-a.godisnje)
        }

       setPodaci({pod:prikazi})

    }

    return (
        <div className='cenovnikKlasa'>
            

            <div className='cenovnikContainer'>
                <h3 className='naslovCenovnik'> Cenovnik usluga</h3>
                <h4 className='motivacionaCenovnik'> Usudi se da probas nesto novo! Pridruzi nam se!</h4>
            </div>

            <div>
              <img src={filter} className='slikaFilter'  alt=""/>  
              <select className='selectCenovnik'
              onChange={(e)=>{
                  const vrsta=e.target.value
                  filtriraj(vrsta)
              }}>
                  <option value='0'>Svi casovi plesa</option>
                  <option value='1'>Prvi ples na vencanju</option>
                  <option value='2'>Sportski plesovi</option>
              </select>
              <label className='lblSortiraj'>Sortiraj</label>
              <select className='selectCenovnik'
              onChange={(e)=>{
                  const vrsta=e.target.value
                 sortiraj(vrsta)
              }}>
                  <option value='0'>Sve cene</option>
                  <option value='1'>Prvo najjeftiniji dnevni</option>
                  <option value='2'>Prvo najskuplji dnevni</option>
                  <option value='3'>Prvo najjeftiniji nedeljni</option>
                  <option value='4'>Prvo najskuplji nedeljni</option>
                  <option value='5'>Prvo najjeftiniji mesečni</option>
                  <option value='6'>Prvo najskuplji mesečni</option>
                  <option value='7'>Prvo najjeftiniji polugodisnji</option>
                  <option value='8'>Prvo najskuplji polugodisnji</option>
                  <option value='9'>Prvo najjeftiniji godisnji</option>
                  <option value='10'>Prvo najskuplji godisnji</option>
              </select>
            </div>

            <div className='tabelaCenovnik'>
                   <ReactBootStrap.Table striped border hover>
                       <thead>
                           <tr>
                             <th className='thCenovnik'>Cas plesa</th>
                             <th className='thCenovnik'>Dnevno</th>
                             <th className='thCenovnik'>Nedeljno</th>
                             <th className='thCenovnik'>Mesecno</th>
                             <th className='thCenovnik'>Polugodisnje</th>
                             <th className='thCenovnik'>Godisnje</th>
                           </tr>
                       </thead>
                    <tbody className='tbodyCenovnik'>
                    {podaci.pod.map((cas)=>(
                           <tr key={cas.id}>
                           <td>{cas.naziv}</td>
                           <td>{cas.cena}</td>
                           <td>{cas.nedeljno}</td>
                           <td>{cas.mesecno}</td>
                           <td>{cas.polugodisnje}</td>
                           <td>{cas.godisnje}</td>
                          {prikaziAdmin? <td><button className='manjeDugme' onClick={()=>izmeniCene(cas.id)}>Izmeni cene</button></td>:null}
                       </tr>

                    ))}
                  
                    </tbody>

                    </ReactBootStrap.Table>                       
                
            </div>

            <div className='poruke'>
                
                < h5 className='probniCas'>Probni cas je besplatan</h5>
            </div>

           <Modal show={modalIzmeniCenu}>
          <Modal.Header>Izmeni cenu casa plesa</Modal.Header> 
              <Modal.Body>
              <Row>Naziv: <input className='unosIzmena' defaultValue={naziv} disabled /></Row>
              <Row>Dnevno: <input className='unosIzmena' defaultValue={poCasuPlesa} onChange={(e)=>setPoCasuPlesa(e.target.value)} /></Row>
              <Row>Nedeljno: <input className='unosIzmena' defaultValue={nedeljno} onChange={(e)=>setNedeljno(e.target.value)}/>    </Row>
              <Row>Mesečno: <input className='unosIzmena' defaultValue={mesecno} onChange={(e)=>setMesecno(e.target.value)} />    </Row>
              <Row>Polugodisnje: <input className='unosIzmena' defaultValue={polugodisnje} onChange={(e)=>setPolugodisnje(e.target.value)} /></Row>
              <Row>Godišnje: <input className='unosIzmena' defaultValue={godisnje} onChange={(e)=>setGodisnje(e.target.value)} />    </Row>
             </Modal.Body>
              <Modal.Footer>
                  <Button onClick={()=>izmeniCenuCasaPlesa() }>Potvrdi</Button>
                  <Button onClick={()=>setModalIzmeniCenu(false)}>Otkazi</Button>
              </Modal.Footer>
          </Modal>           

          {spin?<LoadingSpin/>:null}
        </div>      
        
    )

}