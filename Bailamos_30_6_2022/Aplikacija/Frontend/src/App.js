import './App.css';
import Navbar from "./komponente/Navbar"
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import { Redirect } from 'react-router-dom';
import Glavna from './stranice/Glavna'
import ONama from './stranice/ONama/ONama'

import {Register} from './stranice/Login/Index.jsx'
import {Signup} from './stranice/Login/Index.jsx'
import Profil from './stranice/Profil/Profil'
import Welcome from './stranice/Welcome/Welcome'
import Podaci from './stranice/Podaci/Podaci'

import Obavestenja from './stranice/Obavestenja/Obavestenja'
import Casovi from './stranice/Casovi/Casovi'
import Cenovnik from './stranice/Cenovnik/Cenovnik'
import NasTim from './stranice/NasTim/nasTim'
import Usluge from './stranice/Usluge/Usluge'
import RouteGuard from "./rute/RouteGuard"
import RouteGuard2 from "./rute/RouteGuard2"

function App(){
    
    return(
        <>
        <Router >
            <Navbar/>
                <Switch>
                    <Route exact path='/' component={Glavna}/>
                    <Route path='/ONama' component={ONama}/>
                    <RouteGuard2 path='/prijaviSe' component={Signup}/>
                    <RouteGuard2 path='/registrujSe' component={Register}/>
                    
                    <RouteGuard path='/Profil' component={Profil}/>
                    <Route path='/Dobrodosli' component={Welcome}/>
                    <RouteGuard path='/Podaci' component={Podaci}/>
                    <Route path='/Usluge' component={Usluge}/>
                    <Route path='/Obavestenja' component={Obavestenja}/>
                    <RouteGuard path='/Casovi' component={Casovi}/>
                    <Route path='/Cenovnik'  component={Cenovnik}/>
                    <Route path='/NasTim'  component={NasTim}/>
                </Switch>
        </Router>
        </>
    );
}

export default App;