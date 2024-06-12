import './Button.css'

const VELICINA=['btn-medium', 'btn--large']
const STIL=['btn--prymary', 'btn--outline']

export const Button=({children, type, onClick, BStyle, BSize})=>{
    const checkButtonSize=STIL.includes(BSize)? BSize:VELICINA[0]
    const checkButtonStyle=STIL.includes(BStyle)? BStyle:STIL[0]

    return(
        <button className={`btn ${checkButtonStyle} ${checkButtonSize}`}
        onClick={onClick}
        type={type}>
            {children}
        </button>
    )
}