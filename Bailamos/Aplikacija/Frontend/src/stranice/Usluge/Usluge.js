import React,{useState,useEffect} from 'react'
import {Button} from '../../komponente/Button'
import './Usluge.css'
import {useHistory} from "react-router-dom"
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css"
import  Slider  from './Slider'
import  Slider2  from './Slider2'
import  Slider3  from './Slider3'
import  Slider4  from './Slider4'
import  Slider5  from './Slider5'
import  Slider6  from './Slider6'
import  Slider7  from './Slider7'

function Usluge() {

    const history=useHistory()
    const [casovi,setCas]=useState([])

    useEffect(() => {
    axios.get('https://localhost:5001/PlesnaSkola/PreuzmiCasove').then(response=>{
        
        setCas(response.data);
    })
},[])

    return (
                
        <div className='uslugecontainer'>

            <h2 className='naslov'>Naše usluge</h2> 

            <h4 className="tip">Prvi ples na venčanju</h4>
            <div  className="div">       
            <p className='tekst'>Prvi ples je najromantičniji trenutak na venčanju, čarobna slika koja se ne zaboravlja, ona i on zagrljeni, sa pogledima punim ljubavi, i venčanica koja se njiše uz tonove pesme… Bilo to brža ili sporija ljubavna pesma, ili možda neki miks specijalno napravljen samo za mladence i tu priliku, svakako da izbor pada na pesmu koja za par ima posebno značenje i obeležava neke zajednički provedene momente. Ili jednostavno to bude pesma koju oboje vole, toliko vole da su oboje poželeli i da je čuju i zaplešu iz nju i na svom venčanju. I dok mladenci plešu, posmatraju ih svi prisutni, nasmejani i nadahnuti njihovom ljubavlju, a onda zaplešu i oni…</p>
            <Slider2 slides={Slider2}/>
            </div>
     
            <div className="linija"></div>

            <h3 className="naslov">Sportski plesovi</h3>

            <h4 className="tip">Samba</h4>
            <div className="div">
            <p className='tekst'>Samba je ples koji pripada grupi Latino-američkih plesova. Nastao je u Brazilu. Od 1959. godine spada u grupu takmičarskih sportskih plesova. Kao takav je visoko stilizovan i prvenstveno se igra u paru. Karakteriše ga veliki broj figura koji se zasniva na dve vrste kretanja, a to su: bounce i kontrakcije (bouce znači podizanje i spuštanje u kolenima uz kontrakcije karlicom a bez vidljive promene visine). Ovo je jako teško ali bez toga ples gubi veliki deo svog karaktera. Takođe, za razliku od ostalih latino plesova gde se parovi neznatno pomeraju, samba je ‘putujući’ ples i parovi prelaze velike delove podijuma koristeći se šetnjama, spinovima. Ovo znači da se samba igra u plesnom pravcu po obodu sale kao i standardni plesovi (valcer, tango…)</p>
            <Slider4 slides={Slider4}/>
            </div>

            <h4 className="tip">Rumba</h4>
            <div  className="div">
            <p className='tekst'>Rumba se razvila u 16. veku s dolaskom crnih robova iz Afrike. Izvorna rumba, tj. rhumba, kao folklorni ples u osnovi je seksi pantomima koja se pleše vrlo brzo, a karakterišu ga preterani pokreti bokovima, agresivan, ali ujedno i senzualan stav muškarca i obrambeni stav žene. To je ples zavođenja. Upravo zbog svoje tzv. lascivnosti rumba je bila ples niže društvene klase. Rumba se svira u (šp. staccato) ritmu i prati izražajne pokrete plesača. Ona se svira maracasima, clavama, marimbolom i bubnjevima.</p>
            <Slider5 slides={Slider5}/>
            </div>     
       
            <h4 className="tip">Argentski tango</h4>
            <div className="div">
            <p className='tekst'>Argentinski tango ili Tango argentino ima takođe nekoliko podstilova. Danas su dominantni „salonski tango“ i „tango milongero“ odnosno milonga. Muzika je u 2/4, 4/8, i 4/4 taktu. U poslednje vreme se pleše i „tango vals“ odnosno tango valcer gde je muzika u 3/4 taktu. Tempo moze biti brži i sporiji i može biti promenljiv i u jednoj plesnoj numeri. Postoji podela i na „scenski tango“, karakterističan po veoma zahtevnim figurama skoro akrobacijama, kao i na elektro tango (tango nuevo). Kod argentinskog tanga stav je zatvoren, grudi na grudi, moze obraz uz obraz, ali i kao u valceru otvoren stav (tango vals). Zatvoren stav omogućava stabilno voženje od strane muškarca, a ženi omogućava punu slobodu pokreta nogama. Tango argentino je potrebno vezbati duže vreme da bi se savladao, zato što je kretanje specificno sa savijenim kolenima, što u drugim plesovima ne postoji, i ova stavka daje karekter tangu. Ritam tanga omogućava improvizaciju, dakle nema klasičnog osnovnog koraka koji se nauči pa se onda uče figure kao nadgradnja, ali baš zbog toga je potrebno vreme da se ovlada ritmom da bi moglo da se improvizuje. Zbog zatvorenog, intimnog stava, takođe je potrebno vreme da bi se ovladalo pravilnim vođenjem.</p>
            <Slider3 slides={Slider3}/>
            </div>
      
            <h4 className="tip">Valcer</h4>
            <div  className="div">
            <p className='tekst'>Reč valcer potiče od nem. walzen što znači „kotrljati, okretati, kliziti”. Bečki valcer je nastao u bečkim četvrtima i alpskim regijama Austrije. Izvori su mu u folklornim plesovima austrijskih seljaka. Pojavio se u 17. veku, a u 18. veku je bio masovno prihvaćen od austrijskog plemstva. U Engleskoj se prvi zapisi o valceru javljaju 1801. godine, a zbog strogog engleskog morala, valcer je bio prihvaćen u sporijem i laganijem ritmu. Osnovni koraci su se lako i brzo učili, pa je valcer bio izložen kritikama dvorskih majstora plesa. Takođe je bio moralno kritkovan zbog preblizog i prisnog držanja i brzih okreta.
Pleše se u paru i spada u grupu standardnih plesova. Muzika je 3/4 i 3/8 takta, oko 54-60 taktova u minutu. Između muzičkog ritma, i ritma u igri parova, javlja se karakterističan kontakt između trodelnosti takta i dvodelnosti ritmičke osnove igračkih pokreta, jer za izvršenje jedne propisane figure potrebna su dva takta muzike.Osnovni korak u stranu, osnovni korak napred-nazad, osnovni korak u krug, desni okret, levi okret, desni okret u mestu, levi okret u mestu. Ovo su osnovni koraci i figure koji se uče u svim plesnim školama i svi ih uglavnom znaju. Koraci su jednostavni za učenje ali zbog brzine dosta zahtevni za izvođenje, tako da veliki broj ljudi zapravo nepravilno pleše i plesanje bečkog valcera im pradstavlja napor a ne uživanje. Ključ uspeha u plesanju bečkog valcera je u dobro pokazanoj i uvežbanoj tehnici izvođenja osnovnog koraka. Ukoliko se pravilno savladaju osnovni koraci i nauči intenzivno okretanje, a da vam se ne zavrti u glavi, onda plesanje bečkog valcera stvara neponovljiv osećaj uživanja.</p>
            <Slider6 slides={Slider6}/>
            </div>

            <h4 className="tip">Hip-hop</h4>
            <div className="div">
            <p className='tekst'>Hip hop je kulturni ili umetnički pokret koji je nastao u Bronksu, Njujork. Poreklo imena je često sporno. Takođe se vode rasprave da li je hip hop započeo u Južnom ili Zapadnom Bronksu. Iako se termin hip hop često koristi isključivo za hip hop muziku (uključujući i rep), hip hop karakteriše devet elemenata, od kojih se samo četiri elementa smatraju ključnim za muzičko razumevanje hip hopa. Glavni elementi hip hopa sastoje se od četiri glavna stuba. Afrika Bambata iz hip hop kolektiva Zulu Nacija sumirao je stubove hip hop kulture, formulišući pojmove: repovanje (koji se takođe naziva em-sing), ritmički stil vokalne rime (oralnost); di-džejing (i turntablizam), koje stvara muziku sa gramofonom i di-džej miksetom (slušno/zvučno i muzičko stvaranje); brejkdens (pokret/ples); i grafiti. Ostali elementi hip hop podkulture i umetničkih pokreta izvan glavna četiri su: hip hop kultura i istorijsko znanje o pokretu (intelektualno/filozofsko); bitboks, vokalni stil udaraljki; ulično preduzetništvo; hip hop jezik; između ostalog i hip hop moda i stil. Peti element, iako se o njemu raspravlja, obično se smatra ulično znanje, hip hop moda ili bitboks. Bronks hip hop scena se pojavila sredinom 1970-ih iz kvartovskih zabava, koje su priređivali Blek Spejds, afroamerička grupa koja je opisana kao banda, klub i muzička grupa. Kao rođendan pokreta se često navodi 11. avgust 1973., odnosno žurka Back to School Jam koju je organizovao DJ Kool Herc.</p>
            <Slider slides={Slider}/>
            </div>
       
            <h4 className="tip">Bachata</h4>
            <div className="div">
            <p className='tekst'>Bachata je ples iz Dominikanske Republike. Osnovni korak se sastoji od tri koraka i tepa. Kod prva tri koraka težina se prebacuje na stajnu nogu, a na četvrtom koraku se izbacuje kuk suprotno od smera kretanja nogu ili se napravi tep (dodirivanje poda prstima). Partneri igraju odvojeni ili telo uz telo, u zavisnosti od raspoloženja. Svaki četvrti takt je u muzici posebno naglašen. Partneri mogu biti odvojeni ili igrati jedan uz drugo, u zavisnosti od raspoloženja. Muškarac vodi partnerku tako što joj rukama i gornjim delom tela daje signale. Žena na isti način odgovara odnosno prati partnera. Po osnovnom koraku bačata je slična salsi (broji se 1-2-3 pauza, 5-6-7-pauza) ali je karakter plesa i kretanje odnosno izvođenje koraka sasvim drugacije. Možete se kretati u stranu, napred, nazad, u krug, igrati u mestu. Po ovome je bačata slična merengi. Kada se sve ovo ukombinuje osnovni korak i kretanje su veoma jednostavni, ali za figure treba vežba kao i za salsu. Figure koje se izvode u salsi moguće je izvoditi i u bačati.</p>
            <Slider7 slides={Slider7}/>   
            </div>

              
        
        </div>
    
    )

}

export default Usluge