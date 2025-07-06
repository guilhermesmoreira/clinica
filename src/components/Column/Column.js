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
  moveCardToColumn,
  toggleAgendamentoStatus,
  onStartConnection,
  onEndConnection,
  ...handlers
}) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    if (!isPlanejamento) return;

    e.preventDefault();
    const cardJson = e.dataTransfer.getData("text/plain");
    if (!cardJson) return;

    const card = JSON.parse(cardJson);

    setCardsDistribuidos((prev) => {
      const novoDistribuido = { ...prev };

      // Remove o card de todas as colunas
      Object.keys(novoDistribuido).forEach((col) => {
        novoDistribuido[col] = novoDistribuido[col].filter((c) => c.id !== card.id);
      });

      // Adiciona na nova coluna
      if (!novoDistribuido[columnId]) novoDistribuido[columnId] = [];
      novoDistribuido[columnId].push({ ...card, column: columnId });

      return novoDistribuido;
    });

    if (setCardsSidebar) {
      setCardsSidebar((prev) => prev.filter((c) => c.id !== card.id));
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
            className={`${styles.columnTitleInput} ${
              column.color?.includes("#000000") ? styles.whiteText : ""
            }`}
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
          <CardKanban
            key={card.id}
            card={card}
            columns={columns}
            cardRefs={cardRefs}
            setSelectedCard={setSelectedCardDetalhe}
            setShowConnectionsModal={setShowConnectionsModal}
            setSelectedCardDetalhe={setSelectedCardDetalhe}
            moveCardToColumn={moveCardToColumn}
            toggleAgendamentoStatus={toggleAgendamentoStatus}
            onStartConnection={onStartConnection}
            onEndConnection={onEndConnection}
            {...handlers}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
