import React from "react";
import { Button } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
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
  isDragging,
  dragStartCard,
  startConnection,
  endConnection,
  ...handlers
}) => {
  return (
    <div className={styles.column} style={{ background: column.color }}>
      <div className={styles.columnHeader}>
        <input
          type="text"
          value={column.title}
          onChange={(e) => editColumnTitle(column.id, e.target.value)}
          className={`${styles.columnTitleInput} ${
            column.color.includes("#000000") ? styles.whiteText : ""
          }`}
        />
        <div className={styles.buttonGroup}>        
          <Button
            variant="outline"
            size="sm"
            onClick={() => openColorModal(column.id)}
            className={styles.colorButton}
          >
            🎨
          </Button>
          {columns.length > 1 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteColumn(column.id)}
              className={styles.deleteButton}
            >
              <Trash size={16} />
            </Button>
          )}     
      </div>
      </div>
      <div className={styles.cards}>
        {cards
          .filter((card) => card.column === column.id)
          .map((card) => (
            <CardKanban
              key={card.id}
              card={card}
              columns={columns}
              ref={(el) => (cardRefs.current[card.id] = el)}
              setSelectedCard={setSelectedCard}
              setShowConnectionsModal={setShowConnectionsModal}
              onStartConnection={startConnection}
              onEndConnection={endConnection}
              isDragging={isDragging}
              dragStartCard={dragStartCard}
              {...handlers}
            />
          ))}
      </div>
      
    </div>
  );
};

export default Column;