import React from "react";
import styles from "../../paginas/Home.module.css";
import CardKanban from "../CardKanban/CardKanban";

const Column = ({
  column,
  cards = [],
  cardRefs,
  deleteColumn,
  editColumnTitle,
  openColorModal,
  columns = [],
  setSelectedCard,
  setShowConnectionsModal,
  setCardsDistribuidos,
  columnId,
  isPlanejamento = false,
  cardsSidebar,
  setCardsSidebar,
  setSelectedCardDetalhe,
  ...handlers
}) => {

  const handleDragOver = (e) => {
    if (isPlanejamento) e.preventDefault();
  };

  const handleDrop = (e) => {
    if (!isPlanejamento) return;

    e.preventDefault();
    const cardJson = e.dataTransfer.getData("text/plain");
    if (!cardJson) return;

    const card = JSON.parse(cardJson);

    setCardsDistribuidos(prev => {
      const novoDistribuido = { ...prev };

      // Remove de outras colunas
      Object.keys(novoDistribuido).forEach(col => {
        novoDistribuido[col] = novoDistribuido[col].filter(c => c.id !== card.id);
      });

      // Adiciona nesta coluna
      if (!novoDistribuido[columnId]) novoDistribuido[columnId] = [];
      novoDistribuido[columnId].push(card);

      return novoDistribuido;
    });

    if (setCardsSidebar) {
      setCardsSidebar(prev => prev.filter(c => c.id !== card.id));
    }
  };

  const handleDragStart = (e, card) => {
    if (isPlanejamento) {
      e.dataTransfer.setData("text/plain", JSON.stringify(card));
    }
  };

  return (
    <div
      className={styles.column}
      style={{ background: column.color }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={styles.columnHeader}>
        {!isPlanejamento && (
          <input
            type="text"
            value={column.title}
            onChange={(e) => editColumnTitle(column.id, e.target.value)}
            className={`${styles.columnTitleInput} ${column.color?.includes("#000000") ? styles.whiteText : ""}`}
          />
        )}

        {isPlanejamento && (
          <h5 className={styles.columnTitle}>{column.title}</h5>
        )}

        {!isPlanejamento && (
          <div className={styles.buttonGroup}>
            <button
              className={styles.deleteButton}
              onClick={() => deleteColumn(column.id)}
            >
              X
            </button>
            <button
              onClick={() => openColorModal(column.id)}
              className={styles.colorButton}
            >
              🎨
            </button>
          </div>
        )}
      </div>

      <div className={styles.cards}>
        {cards.map((card) => (
          isPlanejamento ? (
            <div
              key={card.id}
              className={styles.card}
              draggable
              onDragStart={(e) => handleDragStart(e, card)}
              onClick={() => setSelectedCardDetalhe && setSelectedCardDetalhe(card)}
            >
              <p><strong>Paciente:</strong> {card.content.paciente}</p>
              <p><strong>Procedimento:</strong> {card.content.procedimento}</p>
            </div>
          ) : (
            <CardKanban
              key={card.id}
              card={card}
              columns={columns}
              cardRefs={cardRefs}
              setSelectedCard={setSelectedCard}
              setShowConnectionsModal={setShowConnectionsModal}
              {...handlers}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default Column;
