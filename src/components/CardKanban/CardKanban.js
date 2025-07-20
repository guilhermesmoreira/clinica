import React, { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import styles from "./CardKanban.module.css";
import CardDetalhadoModal from "../CardDetalhadoModal/CardDetalhadoModal";

const CardKanban = forwardRef(
  (
    {
      card,
      columns,
      setSelectedCard,
      setShowConnectionsModal,
      setSelectedCardDetalhe,
      moveCardToColumn,
      toggleAgendamentoStatus,
      onStartConnection,
      onEndConnection,
    },
    ref
  ) => {
    const [showModal, setShowModal] = useState(false);
    const status = card.content.agendamento?.status || "";

    const getStatusConfig = () => {
      switch (status) {
        case "agendar":
          return { color: "danger", icon: "❗" };
        case "agendado":
          return { color: "success", icon: "✅" };
        case "realizado":
          return { color: "secondary", icon: "✔️" };
        default:
          return { color: "secondary", icon: "❔" };
      }
    };

    const { icon } = getStatusConfig();

    const handleDragStart = (e) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(card));
      e.currentTarget.style.opacity = "0.4";
    };

    const handleDragEnd = (e) => {
      e.currentTarget.style.opacity = "1";
    };

    return (
      <>
        <Card
          ref={ref}
          id={`card-${card.id}`}
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className={`${styles.cardCompact} ${
            card.connections?.length > 0 ? styles["card-connected"] : ""
          }`}
          onClick={() => setShowModal(true)}
          style={{ cursor: "pointer", position: "relative" }}
        >
          {/* 🔵 Bolinha esquerda */}
          <div
            id={`dot-${card.id}-left`}
            data-dot
            data-card-id={card.id}
            data-side="left"
            className={styles.connectionDotLeft}
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartConnection(card.id, "left", e);
            }}
          />

          {/* 🟢 Bolinha direita */}
          <div
            id={`dot-${card.id}-right`}
            data-dot
            data-card-id={card.id}
            data-side="right"
            className={styles.connectionDotRight}
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartConnection(card.id, "right", e);
            }}
          />

          <Card.Body>
            <p>
              <strong>Paciente:</strong> {card.content.paciente}
            </p>
            <p>
              <strong>Procedimento:</strong> {card.content.procedimento}
            </p>
            <div
              className={`${styles.statusBadge} ${
                status === "agendar"
                  ? styles.statusAgendar
                  : status === "agendado"
                  ? styles.statusAgendado
                  : status === "realizado"
                  ? styles.statusRealizado
                  : ""
              }`}
            >
              {icon}
            </div>
          </Card.Body>
        </Card>

        {showModal && (
          <CardDetalhadoModal
            card={card}
            columns={columns}
            onClose={() => setShowModal(false)}
            toggleAgendamentoStatus={toggleAgendamentoStatus}
            moveCardToColumn={moveCardToColumn}
            setSelectedCard={setSelectedCard}
            setShowConnectionsModal={setShowConnectionsModal}
            onEndConnection={onEndConnection}
          />
        )}
      </>
    );
  }
);

CardKanban.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.shape({
      paciente: PropTypes.string,
      procedimento: PropTypes.string,
      agendamento: PropTypes.shape({
        status: PropTypes.string,
      }),
    }).isRequired,
    connections: PropTypes.array,
  }).isRequired,
  columns: PropTypes.array,
  setSelectedCard: PropTypes.func,
  setShowConnectionsModal: PropTypes.func,
  setSelectedCardDetalhe: PropTypes.func,
  moveCardToColumn: PropTypes.func,
  toggleAgendamentoStatus: PropTypes.func,
  onStartConnection: PropTypes.func,
  onEndConnection: PropTypes.func,
};

CardKanban.defaultProps = {
  columns: [],
  setSelectedCard: () => {},
  setShowConnectionsModal: () => {},
  setSelectedCardDetalhe: () => {},
  moveCardToColumn: () => {},
  toggleAgendamentoStatus: () => {},
  onStartConnection: () => {},
  onEndConnection: () => {},
};

export default CardKanban;