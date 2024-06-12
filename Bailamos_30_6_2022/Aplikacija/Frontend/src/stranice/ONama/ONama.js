import React from 'react'
import About from './About'
import './About.css'
import { Slider } from './Slider'
import "bootstrap/dist/css/bootstrap.min.css"
export default function oNama() {
    return (
        <div className="badge-dark" >
              <h3 className='onama'color="black"> O nama</h3>
              
              <div className="divText">  
              <div className="jumbotron" > 
                Moderno opremljen ambijent i pozitivna atmosfera ušuškana u zvuke latinoameričkih i standardnih plesova pruža Vam mogućnost da se opustite i zaplešete zajedno sa nama!
                Dodjite i uverite se u naš kvalitet!
                <br></br>
                "Bailamos" je sa Vama od 1985.godine u Nišu.
                <br></br>
                Uz instruktore sa dugogodišnjim iskustvom u plesu i radu sa polaznicima,"Bailamos" predstavlja plesnu školu koja nudi plesne grupe za sve generacije!
                <br></br>
                <br></br>
                <br></br> <i className="fa fa-phone "></i>
                Kontakt telefon: 067-123-2333

               
                <br></br>
                <br></br> <i className="far fa-clock "></i>
                Radno vreme: 09:00-22:00

                <br></br>
                <br></br> <i className="fa fa-map-marker "></i>
                Adresa: Bulevar Zorana Djindjića, Niš

                
              </div>
              
             
              
            
              </div>
              <About slides={Slider}/>
        </div>
    )
}
