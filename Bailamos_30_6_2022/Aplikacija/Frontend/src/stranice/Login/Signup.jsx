import React,{useState} from "react";
import './Signup.css'
//import loginImg from "./dance4.png"; 
import {useHistory, Link} from 'react-router-dom'
import LoadingSpin from '../../komponente/LoadingSpin'

export function Signup()
{
    const history=useHistory();
    const handleHistory=()=>{
        history.push("/Profil")
    }

    const [korisnickoIme, setKorisnickoIme]=useState()
    const [sifra,setSifra]=useState()
    const [spin,setSpin]=useState(false)
    const [sifraGreska,setSifraGreska]=useState(false)
    const[korisnickoImeGreska,setKorisnickoImeGreska]=useState(false)

    const submit=(e)=>{
        setSpin(true)
        fetch("https://localhost:5001/PlesnaSkola/Prijavljivanje",{
            method:"POST",
            headers:{'Content-type':'application/json'},
            credentials:'include',
            body:JSON.stringify(
                {
                    korisnickoIme:korisnickoIme,
                    sifra:sifra
                }
            )
        }).then(p=>{
            setSpin(false)
            if(p.ok)
            {
                handleHistory()
                window.location.reload()
                p.json().then(token=>{
                    localStorage.setItem("jwt", token.message);

                    window.location.href = '/Profil'

                })
            }
            else if(p.status==400)
            {
                setKorisnickoImeGreska(true)
            }
            else if(p.status==409)
            {
                setSifraGreska(true)
            }
        })
    }


    return(

        <form>
            <div className="base-container">
                <div className="header"> Prijavite se na Vaš nalog</div>
                
                <div className="content">
                    <div className="image">
                        

                    </div>
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username">
                                Korisničko ime
                            </label>
                            <input type="text" id="username" placeholder="Korisnicko ime" onChange={e=>setKorisnickoIme(e.target.value)}/>
                            {korisnickoImeGreska?<label className='greska'> Clan sa ovim korisnickim imenom ne postoji</label>:null}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Šifra</label>
                                <input type="password" id="password" placeholder="Sifra" onChange={e=>setSifra(e.target.value)}/>
                                {sifraGreska?<label className='greska'> Pogresna sifra </label>:null}
                                </div>
                                </div>
                                </div>
                                {spin?<LoadingSpin/>:null}
                                <div className="form-group"> 
                                <button type="button" className="btn" onClick={submit}>Prijavite se</button> 
                                <label className='labela'> Nemate nalog? <Link to='/registrujSe' onClick={handleHistory}> Registrujte se</Link></label>
                                </div>
                                </div>
                                </form>

    );





}