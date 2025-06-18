import React from "react";
import { Modal, Button, Card, Form } from "react-bootstrap";
import styles from "../../paginas/Home.module.css";

const CardDetalhadoModal = ({
  card,
  onClose,
  toggleEtapa,
  handleAgendar,
  handleColumnChange,
  deleteCard,
  columns,
  toggleAgendamentoStatus,
}) => {
  if (!card) return null;

  const { content } = card;

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do Procedimento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card.Body>
          <div className={styles.cardHeader}>
            <h4>Cartão do Procedimento</h4>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                deleteCard(card.id);
                onClose();
              }}
              className={styles.deleteButton}
            >
              Remover
            </Button>
          </div>

          <p><strong>ID Paciente:</strong> {content?.pacienteId}</p>
          <p><strong>Paciente:</strong> {content?.paciente}</p>
          <p><strong>Procedimento:</strong> {content?.procedimento}</p>

          <div className={styles.etapas}>
            <strong>Etapas:</strong>
            {content.etapas && content.etapas.length > 0 ? (
              content.etapas.map((etapa, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    checked={etapa.concluida}
                    onChange={() => toggleEtapa(card.id, index)}
                  />
                  {etapa.etapa}
                </div>
              ))
            ) : (
              <p>Nenhuma etapa cadastrada.</p>
            )}
          </div>

          <div className={styles.etapas}>
            <strong>Status de Agendamento:</strong>
            <div>
              <input
                type="checkbox"
                checked={content.agendamento.status === "agendar"}
                onChange={() => toggleAgendamentoStatus(card.id, "agendar")}
              />
              Agendar
            </div>
            <div>
              <input
                type="checkbox"
                checked={content.agendamento.status === "agendado"}
                onChange={() => toggleAgendamentoStatus(card.id, "agendado")}
              />
              Agendado
            </div>
            <div>
              <input
                type="checkbox"
                checked={content.agendamento.status === "realizado"}
                onChange={() => toggleAgendamentoStatus(card.id, "realizado")}
              />
              Realizado
            </div>
          </div>

          <p><strong>Saldo:</strong> {content.saldo}</p>
          <p className={`${styles.status} ${content.status}`}>
            Status: {content.status}
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CardDetalhadoModal;
