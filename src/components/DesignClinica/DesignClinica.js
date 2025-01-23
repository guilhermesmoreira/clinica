import style from "./_designClinica.module.css";
import LogoClinica from "../../assets/LogoClinica.png";
import React, { useState } from "react";
import Agendamento from "./Agendamento";
import Execucao from "./Execucao";
import Pagamento from "./Pagamento";

const DesignClinica = ({ paciente, procedimento, onRemoveCard }) => {
  return (
    <>
      <div className={style.wrapper}>
        <hr />
        <div className={style.cabecalho}>
          <div className={style.header}>
            <div>
              <b>ID: 1 - Paciente: {paciente}</b>
            </div>
          </div>
          <div className={style.saldo}>
            <b>Saldo R$: 2000/3000.</b>
          </div>
        </div>
        <hr/>
        <div className={style.procedimento}>
          <p>
            <strong>Procedimento:</strong> {procedimento}
          </p>
        </div>
        <hr/> 

        <div className={style.row}>          
        <div className={style.agendamento}>           
          <Agendamento></Agendamento>
        </div>
        <div className={style.execucao}>
          <Execucao></Execucao>
        </div>
        <div className={style.pagamento}>
          <Pagamento></Pagamento>
        </div>
        </div>
        {/* Botão de remoção do card */}
        <div className={style.removeButtonWrapper}>
          <button onClick={onRemoveCard} className={style.removeButton}>
            Remover Card
          </button>
        </div>
      </div>
    </>
  );
};

export default DesignClinica;
