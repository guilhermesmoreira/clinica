import React, { useState } from "react";
import style from "./_pagamento.module.css";

const Pagamento = () => {  
  const [checkboxChecked, setCheckboxChecked] = useState(false); // Estado para controlar o checkbox
  const [valor, setValor] = useState(""); // Estado para armazenar o valor dos procedimentos

    const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked); // Alterna o valor do checkbox
  };

  const handleValorChange = (event) => {
    setValor(event.target.value); // Atualiza o valor do campo de entrada
  };

  return (
    <div className={style.execucao}>
      <b>Proximo Agendamento:</b>
      <div className={style.valor}>
        <b>AGENDAR</b>
        {/* <input 
          className={style.valorInput}
          type="number" 
          value={valor} 
          onChange={handleValorChange} 
          placeholder="Digite o valor"
        /> */}
        </div>      
      
      <div>
        {/* Exibe o texto Executado com o checkbox
        <label>
        Pago:
          <input 
            className={style.executado}
            type="checkbox" 
            checked={checkboxChecked} 
            onChange={handleCheckboxChange} 
          />          
        </label> */}
      </div>
    </div>
  );
};

export default Pagamento;
