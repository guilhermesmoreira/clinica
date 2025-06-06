import React, { useState } from "react";
import styles from "./Planejamento.module.css";
import SidebarPlanejamento from "../components/SidebarPlanejamento/SidebarPlanejamento";
import Column from "../components/Column/Column";
import Topbar from "../components/Topbar/Topbar";
import { subDays, addDays } from "date-fns";

const colunasFixas = [
  { id: "col1", title: "Etapa 1", color: "#f5f5f5" },
  { id: "col2", title: "Etapa 2", color: "#e0e0e0" },
  { id: "col3", title: "Etapa 3", color: "#d0d0d0" },
  { id: "col4", title: "Etapa 4", color: "#bfbfbf" },
  { id: "col5", title: "Etapa 5", color: "#afafaf" },
];

const Planejamento = () => {
  const [cardsPlanejamento, setCardsPlanejamento] = useState([]); // todos os cards do paciente
  const [columns, setColumns] = useState(colunasFixas);
  const [cardsDistribuidos, setCardsDistribuidos] = useState({});

  // Props obrigatórias da Topbar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(subDays(new Date(), 14));
  const [toDate, setToDate] = useState(addDays(new Date(), 14));

  const balanceData = {
    total: 0,
    entradas: 0,
    programado: 0,
    entregue: 0,
  };

  const onAddCard = () => {}; // não usado na tela de planejamento

  const handleSalvar = () => {
    const todosCards = Object.entries(cardsDistribuidos).flatMap(([colunaId, cards]) => {
      return cards.map((card) => ({ ...card, columnId: colunaId }));
    });

    // Simula envio para backend
    console.log("Salvar planejamento:", todosCards);
    // Aqui você pode usar fetch/axios para salvar e redirecionar para a Home
  };

  return (
    <div className={styles.planejamentoContainer}>
      <Topbar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        balanceData={balanceData}
        onAddCard={onAddCard}
      />

      <div className={styles.planejamentoContent}>
        <SidebarPlanejamento
          cards={cardsPlanejamento}
          setCardsDistribuidos={setCardsDistribuidos}
          cardsDistribuidos={cardsDistribuidos}
        />

        <div className={styles.colunasArea}>
          {columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              cards={cardsDistribuidos[col.id] || []}
              setCardsDistribuidos={setCardsDistribuidos}
              allCards={cardsPlanejamento}
              columnId={col.id}
              isPlanejamento
            />
          ))}
          <button className={styles.salvarButton} onClick={handleSalvar}>
            Salvar Planejamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default Planejamento;
