import React from "react";
import { Button } from "react-bootstrap";
import { Gear, Plus } from "react-bootstrap-icons"; // Importando ícones do Bootstrap
import { subDays, addDays, format } from "date-fns"; // Importando funções do date-fns
import styles from "./Topbar.module.css";

const Topbar = ({
  selectedDate,
  setSelectedDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  balanceData,
  onAddCard,
}) => {
  // Função para atualizar o período com base na data selecionada
  const handleDateChange = (e) => {
    const dateString = e.target.value;
    const localDate = new Date(dateString + "T00:00:00"); // Ajusta para o fuso horário local
    setSelectedDate(localDate);
    setFromDate(subDays(localDate, 14)); // Duas semanas para trás
    setToDate(addDays(localDate, 14)); // Duas semanas para frente
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.dateRange}>
        <h3>Período Selecionado:</h3>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
          className={styles.dateInput}
        />
        <div className={styles.dates}>
          <span>{format(fromDate, "dd/MM/yy")}</span>
          <span className={styles.selectedDate}>{format(selectedDate, "dd/MM/yy")}</span>
          <span>{format(toDate, "dd/MM/yy")}</span>
        </div>
      </div>

      <div className={styles.balance}>
        <h3>Saldo:</h3>
        <div className={styles.balanceValues}>
          <p style={{ color: "black" }}>Total: R$ {balanceData.total.toLocaleString()}</p>
          <p style={{ color: "orange" }}>Entradas: R$ {balanceData.entradas.toLocaleString()}</p>
          <p style={{ color: "red" }}>Programado: R$ {balanceData.programado.toLocaleString()}</p>
          <p style={{ color: "blue" }}>Entregue: R$ {balanceData.entregue.toLocaleString()}</p>
        </div>
      </div>

      <div className={styles.actions}>
      <Button
          variant="primary"
          className={styles.iconButton}
          onClick={onAddCard} // Chama a função para adicionar card
        >
          <Plus size={20} />
        </Button>
        <Button variant="secondary" className={styles.iconButton}>
          <Gear size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Topbar;