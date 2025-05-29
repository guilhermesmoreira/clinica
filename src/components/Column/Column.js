// src/components/Column.js
import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import styles from "../../paginas/Home.module.css";

const Column = ({
  column,
  cards = [], // ✅ fallback preventivo
  cardRefs,
  deleteColumn,
  editColumnTitle,
  openColorModal,
  deleteCard,
  toggleEtapa,
  handleAgendar,
  handleColumnChange,
  columns = [], // ✅ fallback preventivo
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
        <div>
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
            <Card
              key={card.id}
              className={styles.card}
              ref={(el) => (cardRefs.current[card.id] = el)}
            >
              <Card.Body>
                <div className={styles.cardHeader}>
                  <h4>Cartão do Procedimento</h4>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteCard(card.id)}
                    className={styles.deleteButton}
                  >
                    <Trash size={16} />
                  </Button>
                </div>

                <p><strong>ID:</strong> {card.content.ID}</p>
                <p><strong>Paciente:</strong> {card.content.paciente}</p>
                <p><strong>Procedimento:</strong> {card.content.procedimento}</p>

                <div className={styles.etapas}>
                  <strong>Etapas:</strong>
                  {card.content.etapas.map((etapa, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        checked={etapa.concluida}
                        onChange={() => toggleEtapa(card.id, index)}
                      />
                      {etapa.etapa}
                    </div>
                  ))}
                </div>

                <p><strong>Agendamento:</strong> {card.content.agendamento.agendar}</p>
                <input
                  type="date"
                  value={
                    card.content.agendamento.dataAgendada?.toISOString().split("T")[0] || ""
                  }
                  onChange={(e) => handleAgendar(card.id, e.target.value)}
                  className={styles.dateInput}
                />
                <p><strong>Saldo:</strong> {card.content.saldo}</p>
                <p className={`${styles.status} ${card.content.status}`}>
                  Status: {card.content.status}
                </p>

                <Form.Group controlId={`formColumn-${card.id}`}>
                  <Form.Label>Coluna</Form.Label>
                  <Form.Select
                    value={card.column}
                    onChange={(e) => handleColumnChange(card.id, e.target.value)}
                  >
                    {columns.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Column;
