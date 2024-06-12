import React from 'react'
import '../App.css'
import Pocetna from './Pocetna/Pocetna'
import ONama from './ONama/ONama'
import Obavestenja from './Obavestenja/Obavestenja'
import Cenovnik from './Cenovnik/Cenovnik'
import NasTim from './NasTim/nasTim'
import Usluge from './Usluge/Usluge'
function Glavna()
{
    return(
        <>   
        <Pocetna/>
        <ONama/>
        <NasTim/>
        <Usluge/>
        <Obavestenja/>
        <Cenovnik/>
        </>
    )
}
export default Glavna