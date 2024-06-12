export default function validateInfo(values)
{
    let errors={};
    if(!values.ime.trim())
    {
        errors.ime="Morate uneti vase ime!"
    }
    if(!values.prezime.trim())
    {
        errors.prezime="Morate uneti vase prezime!"
    }
    if(!values.korisnickoIme.trim())
    {
        errors.korisnickoIme="Morate uneti vase korisicko ime!"
    }
    if(!values.email)
    {
        errors.email="Morate uneti vas e-mail"
    }

    else if(!/\S+@\S+\.\S+/.test(values.email))
    {
        errors.email='E-mail adresa nije validna!'
    }
    if(!values.sifra)
    {
        errors.sifra='Morate uneti sifru'
    }
    else if(values.sifra.length<6)
    {
        errors.sifra='Sifra mora imati minimalno 6 karaktera'
    }
    if(!values.potvrdaSifre)
    {
        errors.potvrdaSifre='Morate uneti sifru'
    }
    else if(values.potvrdaSifre!==values.sifra)
    {
        errors.potvrdaSifre='Sifre se ne poklapaju'
    }

    return errors;

}