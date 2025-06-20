import React from "react";
import styles from "../../paginas/Home.module.css";

const CardPlanejamento = ({ card, onClick, onDragStart }) => {
  if (!card || !card.content) return null;

  return (
    <div
      className={styles.card}
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <p><strong>Paciente:</strong> {card.content.paciente}</p>
      <p><strong>Procedimento:</strong> {card.content.procedimento}</p>
    </div>
  );
};

export default CardPlanejamento;
