import logo from './logo.svg';
import './App.css';
import Button from './components/Button/Button';
import MeuComponente from './components/Form/MeuComponente';
import LogoA from './components/Form/Logo';
import { useEffect, useState } from 'react';

function App() {
  const[valor, setValor] = useState("Olá"); 
  
  useEffect(() => {
    setTimeout(() => {
      setValor("Bem Vindo!")
    }, 2000)
  },[])

  const [contador, setContador] = useState(0);

  const incrementar = () => {
    setContador(contador + 1);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Contador: {contador}</h1>
        <button onClick={incrementar}>Incrementar</button>
        <h2>{valor}</h2>
        <Button label='Minha Label:' color='blue' size='medium'>
          Botão Teste          
        </Button>   
        <LogoA></LogoA>    
      </header>
    </div>
  );
}

export default App;
