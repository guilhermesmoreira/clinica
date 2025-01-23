import MeuComponente from '../Form/MeuComponente'
import style  from './_button.module.css'

const COLOR = {
    orange: style.orange,
    blue: style.blue,
}

const SIZE = {
    small: style.small,
    medium: style.medium,
    large: style.large,
}

//Declarar uma função anonima
const Button = ({children, label, color, size}) => {
    function handleClick(){
        console.log(label)
    }
    return <>    
        <label>{label}</label>
        <button onClick={handleClick} className={`${style.button_example} ${COLOR[color]} ${SIZE[size]}`}>{children}</button>
    </>   
}

export default Button