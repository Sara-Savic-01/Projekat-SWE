import React from 'react'
import './Welcome.css'
import {Register} from '../Login/Index.jsx'

import {useHistory} from 'react-router-dom'

export default function Welcome() {

    const history =useHistory();
  
    const handleHistory1=()=>
    {
        history.push("/")
    }
    const handleHistory2=()=>
    {
        history.push("/prijaviSe")
    }

    return(
        <div >
            <div className='welcomeCont'>
                <div className='pomCont'>
                        <h2 className='naslovCont'>Uspešno ste se registrovali! Dobrodošli na naš sajt! <i className="far fa-check-circle ikonica"></i></h2>
                        <div className='divZaDugmice'>
                            <button className='dugme' onClick={handleHistory1}>Vratite se na početnu stranu</button>
                            <br></br>
                            <button className='dugme' onClick={handleHistory2}>Prijavite se na naš sajt</button>
                        </div>
                </div>
            </div>   
        </div>
    )
    }

