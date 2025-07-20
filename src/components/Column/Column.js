import React from "react";
import PropTypes from "prop-types";
import styles from "../../paginas/Home.module.css";
import CardKanban from "../CardKanban/CardKanban";

const getContrastTextColor = (backgroundColor) => {
  if (!backgroundColor) return "black";
  const hex = backgroundColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.5 ? "black" : "white";
};

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
  onDotMouseDown,
  onEndConnection,
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

    try {
      const card = JSON.parse(cardJson);
      setCardsDistribuidos((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((colId) => {
          updated[colId] = updated[colId].filter((c) => c.id !== card.id);
        });
        updated[columnId] = [...(updated[columnId] || []), { ...card, column: columnId }];
        return updated;
      });
      setCardsSidebar?.((prev) => prev.filter((c) => c.id !== card.id));
    } catch (error) {
      console.error("Erro ao parsear card JSON:", error);
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
        {isPlanejamento ? (
          <h5 className={styles.columnTitle} style={{ color: getContrastTextColor(column.color) }}>
            {column.title}
          </h5>
        ) : (
          <input
            type="text"
            value={column.title}
            onChange={(e) => editColumnTitle(column.id, e.target.value)}
            className={styles.columnTitleInput}
            style={{ color: getContrastTextColor(column.color) }}
            aria-label={`Título da coluna ${column.title}`}
          />
        )}

        {!isPlanejamento && (
          <div className={styles.buttonGroup}>
            <button
              className={styles.deleteButton}
              onClick={() => deleteColumn(column.id)}
              aria-label="Excluir coluna"
            >
              X
            </button>
            <button
              onClick={() => openColorModal(column.id)}
              className={styles.colorButton}
              aria-label="Alterar cor da coluna"
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
            setSelectedCard={setSelectedCard}
            setShowConnectionsModal={setShowConnectionsModal}
            setSelectedCardDetalhe={setSelectedCardDetalhe}
            moveCardToColumn={moveCardToColumn}
            toggleAgendamentoStatus={toggleAgendamentoStatus}
            onStartConnection={onDotMouseDown}
            onEndConnection={onEndConnection}
          />
        ))}
      </div>
    </div>
  );
};

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
  }).isRequired,
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
  cardRefs: PropTypes.object,
  deleteColumn: PropTypes.func,
  editColumnTitle: PropTypes.func,
  openColorModal: PropTypes.func,
  columns: PropTypes.array,
  setSelectedCard: PropTypes.func,
  setShowConnectionsModal: PropTypes.func,
  setCardsDistribuidos: PropTypes.func,
  columnId: PropTypes.string,
  isPlanejamento: PropTypes.bool,
  cardsSidebar: PropTypes.array,
  setCardsSidebar: PropTypes.func,
  setSelectedCardDetalhe: PropTypes.func,
  moveCardToColumn: PropTypes.func,
  toggleAgendamentoStatus: PropTypes.func,
  onDotMouseDown: PropTypes.func,
  onEndConnection: PropTypes.func,
};

Column.defaultProps = {
  cards: [],
  columns: [],
  isPlanejamento: false,
  onDotMouseDown: () => {},
  onEndConnection: () => {},
};

export default Column;