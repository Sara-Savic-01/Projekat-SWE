import React, {useState} from "react"
//import loginImg from "./dance4.png"
import {useHistory,Link} from 'react-router-dom'
import LoadingSpin from '../../komponente/LoadingSpin'

export function Register()
{
    const history=useHistory(); 

    const handleHistory=()=>
    {
        history.push("/Dobrodosli")
    }

    const [ime,setIme]=useState("");
    const [prezime,setPrezime]=useState("");
    const [korisnickoIme,setKorisnickoIme]=useState("");
    const [email,setEmail] = useState("")
    const [sifra,setSifra] = useState("")
    const [potvrdaSifre,setPotvrdaSifre] = useState("")
    const [tip,setTip]=useState("2")
    const [spin,setSpin]=useState(false)
    const [imeGreska,setImeGreska] = useState({})//prazan objekat
    const [prezimeGreska,setPrezimeGreska] = useState({})
    const [korisnickoImeGreska,setKorisnickoImeGreska] = useState({})
    const [korisnickoImeDuplikat,setKorisnickoImeDuplikat] = useState({})
    const [emailGreska,setEmailGreska] = useState({})
    const [emailDuplikat,setEmailDuplikat]=useState({})
    const [sifraGreska,setSifraGreska] = useState({})
    const [potvrdaSifreGreska,setPotvrdaSifreGreska] = useState({})
    const [tipGreska,setTipGreska]=useState({})

    const submit=(e)=>
    {
        setSpin(true)
        const validan=validacija()
        if(!validan)
        {
            setSpin(false)
        }
        else if(validan)
        {
            fetch("https://localhost:5001/PlesnaSkola/RegistrujKorisnika",{
                method:"POST",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    ime:ime,
                    prezime:prezime,
                    korisnickoIme:korisnickoIme,
                    email:email,
                    sifra:sifra,
                    potvrdaSifre:potvrdaSifre,
                    tip:tip
                })
            }).then(p=>{
                setSpin(false)
                let val=true
                let val2=true
                if(p.ok)
                {
                    console.log("Novi clan je dodat!")
                    handleHistory();
                }
                else if(p.status==400)
                {
                    val=validacija2(p.status)
                    val2=validacija3(p.status)
                }
                else if(p.status==409)
                {
                    val=validacija2(p.status)
                    val2=validacija3(p.status)
                }
            })
        }
    }

    const validacija=()=>
    {
        const imeGreska={}
        let validno=true
        if(!ime)
        {
            imeGreska.PraznoPolje="Morate uneti vase ime."
            validno=false
        }

        const prezimeGreska={}
        if(!prezime)
        {
            prezimeGreska.PraznoPoljePrezime="Morate uneti vase prezime."
            validno=false
        }

        const emailGreska={}
        if(!email)
        {
            emailGreska.PraznoPoljeEmail="Morate uneti vas e-mail."
            validno=false
        }
        else if(!/\S+@\S+\.\S+/.test(email))
        {
            emailGreska.Forma="E-mail mora biti zadat u formi: email@domain.com"
            validno=false
        }

        const korisnickoImeGreska={}
        if(!korisnickoIme)
        {
            korisnickoImeGreska.PraznoPoljeKorisnickoIme="Morate uneti vase korisnicko ime."
            validno=false
        }
        else if(korisnickoIme.length<6)
        {
            korisnickoImeGreska.Duzina="Korisnicko ime mora imati bar 6 karaktera."
            validno=false
        }

        const sifraGreska={}
        if(!sifra)
        {
            sifraGreska.PraznoPoljeSifra="Morate uneti sifru!"
            validno=false
        }
        else if(sifra.length<5)
        {
            sifraGreska.DuzinaSifre="Sifra mora imati bar 5 karaktera."
            validno=false
        }

        const potvrdaSifreGreska={}
        if(!potvrdaSifre)
        {
            potvrdaSifreGreska.PraznoPoljeSifrePotvrde="Morate uneti potvrdu sifre!"
            validno=false
        }
        else if(potvrdaSifre!==sifra)
        {
            potvrdaSifreGreska.DuzinaPotvrde="Sifre se ne poklapaju!"
            validno=false
        }

        const tipGreska={}
        if(!tip)
        {
            tipGreska.PraznoPoljeTip="Morate izabrati tip naloga!"
            validno=false
        }

        setImeGreska(imeGreska)
        setPrezimeGreska(prezimeGreska)
        setEmailGreska(emailGreska)
        setSifraGreska(sifraGreska)
        setPotvrdaSifreGreska(potvrdaSifreGreska)
        setKorisnickoImeGreska(korisnickoImeGreska)
        setTipGreska(tipGreska)
        setEmailDuplikat(emailDuplikat)
        setKorisnickoImeDuplikat(korisnickoImeDuplikat)

        return validno
    }

    const validacija2=(status)=>
    {
        let validno2=true

        const emailDuplikat={}
        //console.log(status)
        if(status==400)
        {
            emailDuplikat.Duplikat="Ovaj e-mail vec postoji!"
            validno2=false
        }
        setEmailDuplikat(emailDuplikat)

        return validno2
    }

    const validacija3=(status)=>
    {
        let validno2=true

        const korisnickoImeDuplikat={}
        //console.log(status)
        if(status==409)
        {
            korisnickoImeDuplikat.DuplikatIme="Vec postoji ovo korisnicko ime!"
            validno2=false
        }
        setKorisnickoImeDuplikat(korisnickoImeDuplikat)

        return validno2
    }

    return(

        <form>
            <div className="base-container">
                <div className="header"> Postani član plesne škole Bailamos!</div>
                <div className="content">
                    <div className="image">
                        
                    </div>
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="ime"> Ime </label>
                            <input type="text" id="ime" placeholder="Ime" onChange={e=>setIme(e.target.value)}/>
                            {Object.keys(imeGreska).map((key)=>{
                                return <div style={{color:"red"}}>{imeGreska[key]}</div>
                            })}
                            </div>
                            <div className="form-group">
                                <label htmlFor="prezime"> Prezime </label>
                                <input type="text" id="prezime" placeholder="Prezime" onChange={e=>setPrezime(e.target.value)}/>
                                {Object.keys(prezimeGreska).map((key)=>{
                                    return <div style={{color:"red"}}>{prezimeGreska[key]}</div>

                                })}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="kime">
                                        Korisničko ime
                                    </label>
                                    <input type="text" id="kime" placeholder="Korisnicko ime" onChange={e=>setKorisnickoIme(e.target.value)}/>
                                    {Object.keys(korisnickoImeGreska).map((key)=>{
                                        return <div style={{color:"red"}}> 
                                        {korisnickoImeGreska[key]}</div>
                                    })}
                                    {Object.keys(korisnickoImeDuplikat).map((key)=>{
                                        return <div style={{color:"red"}}>{korisnickoImeDuplikat[key]}</div>
                                    })}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input id="email" type="email"  placeholder="Email" onChange={e=>
                                            setEmail(e.target.value)
                                        }/>
                                        {Object.keys(emailGreska).map((key)=>{
                                            return <div style={{color:"red"}}>{emailGreska[key]}</div>
                                        })}
                                        {Object.keys(emailDuplikat).map((key)=>{
                                            return <div style={{color:"red"}}>{emailDuplikat[key]}</div>
                                        })}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password"> Šifra </label>
                                            <input type="password" id="password" placeHolder="Sifra" onChange={e=>setSifra(e.target.value)}/>
                                            {Object.keys(sifraGreska).map((key)=>{
                                                return <div style={{color:"red"}}>{sifraGreska[key]}</div>

                                            })}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password"> Potvrdi šifru </label>
                                                <input type="password" id="password" placeholder="Sifra" onChange={e=>setPotvrdaSifre(e.target.value)}/>
                                                {Object.keys(potvrdaSifreGreska).map((key)=>{
                                                    return <div style={{color:"red"}}>{potvrdaSifreGreska[key]}</div>

                                                })}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="username"> Registrujte se kao: </label>
                                                    <select onChange={(e)=>{
                                                        const izabraniTip=e.target.value
                                                        setTip(izabraniTip)
                                                    }}>
                                                        <option value='2'> Instruktor </option>
                                                        <option value='3'> Član </option>

                                                    </select>
                                                    {Object.keys(tipGreska).map((key)=>{
                                                        return <div style={{color:"red"}}> {tipGreska[key]}
                                                        </div>
                                                    })}

                                                        </div>
                                                        </div>
                                                        {spin?<LoadingSpin/>:null}
                                                        </div>
                                                    <div className="form-group">
                                                        <button type="button" className="btn" onClick={submit}> Registrujte se </button>

                                                        <label className='labela'> Već imate nalog? <Link to='/prijaviSe' onclick={handleHistory}> Prijavite se</Link> </label> 
                                                        </div>

                                                        </div>
                                                        </form>

    );

}