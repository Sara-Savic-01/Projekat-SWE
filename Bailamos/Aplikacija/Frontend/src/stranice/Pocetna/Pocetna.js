import React/*,{useState,useEffect}*/ from 'react'
import { Button } from '../../komponente/Button'
import './Pocetna.css'
import {useHistory} from "react-router-dom"
//import { Link } from '@material-ui/core'


function Pocetna() {
   const history=useHistory()
   const handleHistory1=()=>
  {
    history.push("/oNama")
  }
  /*const handleHistory2=()=>
  {
    history.push("/prijaviSe")
  }*/
  const handleHistory3=()=>
  {
    history.push("/registrujSe")
  }
    
    return (
        <div className='pocetna-container'>
           
           <h1 className="Naslov">Bailamos</h1>
           <p>Prijavite se da zaplešemo zajedno</p>
           
           
            <div className="pocetna-Dugmici">
            
                <Button
                className='btns hover-zoom'
                buttonStyle='btn--primary'
                buttonSize='btn--large'
                onClick={handleHistory1} 
                >
                 Upoznajte nas
                </Button>
                <br/>
                
                <Button
                className='btns'
                buttonStyle='btn--primary'
                buttonSize='btn--large'
                onClick={handleHistory3}>
                    Pridružite nam se      
               </Button>
               
                
            </div>
            
            
        </div>
      )
    
}

export default Pocetna
