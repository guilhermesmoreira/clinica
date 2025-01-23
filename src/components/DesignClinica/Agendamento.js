import React, { useState } from "react";
import style from "./_agendamento.module.css"

const Agendamento = () => {
  const [data, setData] = useState("");
  const [dataFormatada, setDataFormatada] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false); // Estado para controlar o checkbox

  const handleDateChange = (event) => {
    const novaData = event.target.value; // Formato yyyy-mm-dd
    setData(novaData);
    formatarData(novaData); // Chama a função para formatar a data
  };

  const formatarData = (data) => {
    const [ano, mes, dia] = data.split("-"); // Separa a data no formato yyyy-mm-dd
    setDataFormatada(`${dia}-${mes}-${ano}`); // Formata a data para dd-mm-yyyy
  };

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked); // Alterna o valor do checkbox
  };

  return (
    <div>
      <b>Agendado: {/*dataFormatada*/}</b>      
      <div className={style.inputContainer} alt=''>
        <label htmlFor="dataAgendamento"></label>
        <input
          type="date"
          id="dataAgendamento"
          name="dataAgendamento"
          value={data}
          onChange={handleDateChange}
        />
      </div>
      {/* <label>
        Agendado:
          <input className={style.executado}
            type="checkbox" 
            checked={checkboxChecked} 
            onChange={handleCheckboxChange} 
          />          
        </label> */}
    </div>
  );
};

export default Agendamento;
