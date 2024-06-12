import React,{useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom'
import './Nav.css'

import logo from "../komponente/slike/logo.png";

function Navbar(){
    const history=useHistory();
    const [click,setClick] =useState(false)
    const [button,setButton]=useState(true)
    const [prikazAdmin,setPrikazAdmin]=useState(false)
    const [prikazi,setPrikazi]=useState(true)  
    const [prikaziOdjaviSe,setPrikaziOdjaviSe]=useState(false)  
    const handleClick=()=>setClick(!click)
    const closeMobileMenu=()=>setClick(false)

    const handleHistory=()=>{
        history.push("/")
    }

    const prikaziDugme=()=>{
        if(window.innerWidth <=960){
            setButton(false)
        }
        else{
            setButton(true)
        }   
    }

    window.addEventListener('resize',prikaziDugme)
    useEffect(()=>{
        prikaziDugme()
        let tok=localStorage.getItem("jwt");
        if(tok!=null){
            setPrikazi(false)
            setPrikaziOdjaviSe(true)
        }
        let tip=localStorage.getItem("tip")
        if(tip==1){
            setPrikazAdmin(true)
            
        }
    },[])
   
    const odjaviSe=()=>{
         localStorage.clear()
         handleHistory()
         window.location.reload()
    }
      
return(
    <>
    <nav className="navbar">
        <div className="navbar-container">
        <Link to='/' className="navbar-logo" onClick={closeMobileMenu}>
            <img className='icon' src={logo} alt=""/>
          </Link>
 
            <div className='menu-icon' onClick={handleClick}>
                <i className={click ? 'fas fa-times' :'fas fa-bars'}/>
            </div>
            <ul className={click? 'nav-menu active':'nav-menu'}>
            
            { prikaziOdjaviSe?<li className='nav-item'>
                    <Link to='/Profil' className='nav-links' onClick={closeMobileMenu}>
                     Profil
                    </Link>
                </li>:null}
                {prikazAdmin?<li className='nav-item'>
                    <Link to='/Podaci' className='nav-links' onClick={closeMobileMenu}>
                     Članovi plesne skole
                    </Link>
                </li>:null}
               
                {prikaziOdjaviSe?<li className='nav-item'>
                    <Link to='/Casovi' className='nav-links' onClick={closeMobileMenu}>
                     Časovi plesa                    </Link>
                </li>:null}
                <li className='nav-item'>
                    <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                     Početna
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link to='/oNama' className='nav-links' onClick={closeMobileMenu}>
                     O nama
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link to='/NasTim' className='nav-links' onClick={closeMobileMenu}>
                     Naš tim
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link to='/usluge' className='nav-links' onClick={closeMobileMenu}>
                     Usluge
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link to='/Obavestenja' className='nav-links' onClick={closeMobileMenu}>
                     Obaveštenja
                    </Link>
                </li>

                <li className='nav-item'>
                    <Link to='/Cenovnik' className='nav-links' onClick={closeMobileMenu}>
                        Cenovnik
                    </Link>
                </li>
                  
            { prikazi?<li className='nav-item'>
                    <Link to='/prijaviSe' className='nav-links' onClick={closeMobileMenu}>
                     Prijavi se
                    </Link>
                </li>:null}
              {prikazi?  <li className='nav-item'>
                    <Link to='/registrujSe' className='nav-links' onClick={closeMobileMenu}>
                     Registruj se
                    </Link>
                </li>:null}
                   
            { prikaziOdjaviSe?<li className='nav-item'>
                    <Link to='/' className='nav-links' onClick={odjaviSe}>
                    Odjavi se
                    </Link>
                </li>:null}
            </ul>
           
        </div>
    </nav>
    </>
)

}
export default Navbar
