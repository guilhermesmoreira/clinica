import React from "react";
import styles from "./SidebarPlanejamento.module.css";

const SidebarPlanejamento = ({ cards = [], cardsDistribuidos, setCardsDistribuidos }) => {
  // cards disponíveis = todos os cards menos os já distribuídos
  const cardsDistribuidosIds = Object.values(cardsDistribuidos || {})
    .flat()
    .map((c) => c.id);

  const cardsDisponiveis = cards.filter((card) => !cardsDistribuidosIds.includes(card.id));

  return (
    <div className={styles.sidebar}>
      <h3 className={styles.titulo}>Planejamento</h3>
      <div className={styles.listaCards}>
        {cardsDisponiveis.length === 0 ? (
          <p className={styles.vazio}>Nenhum procedimento disponível</p>
        ) : (
          cardsDisponiveis.map((card) => (
            <div key={card.id} className={styles.cardItem}>
              <strong>{card.content.procedimento}</strong>
              <p>{card.content.paciente}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SidebarPlanejamento;
