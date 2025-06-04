import React, { useState } from "react";
import styles from "./Planejamento.module.css";
import SidebarPlanejamento from "../components/SidebarPlanejamento/SidebarPlanejamento";
import Column from "../components/Column/Column";

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

  // cardsDistribuidos = { col1: [...], col2: [...] }
  const [cardsDistribuidos, setCardsDistribuidos] = useState({});

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
  );
};

export default Planejamento;
