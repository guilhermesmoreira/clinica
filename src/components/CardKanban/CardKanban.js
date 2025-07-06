import React, { useState, forwardRef } from "react";
import { Card } from "react-bootstrap";
import CardDetalhadoModal from "../CardDetalhadoModal/CardDetalhadoModal";
import styles from "../../paginas/Home.module.css";

const CardKanban = forwardRef(
  (
    {
      card,
      columns,
      setSelectedCard,
      setShowConnectionsModal,
      setSelectedCardDetalhe,
      toggleAgendamentoStatus,
      moveCardToColumn,
      onStartConnection,
      onEndConnection,
      ...handlers
    },
    ref
  ) => {
    const [showModal, setShowModal] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

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
      if (isConnecting) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData("text/plain", JSON.stringify(card));
      e.currentTarget.style.opacity = "0.4";
    };

    const handleDragEnd = (e) => {
      e.currentTarget.style.opacity = "1";
    };

    return (
      <>
        <Card
          id={`card-${card.id}`}
          ref={ref}
          draggable={!isConnecting}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className={`${styles.cardCompact} ${
            card.connections?.length > 0 ? styles["card-connected"] : ""
          }`}
          onClick={() => setShowModal(true)}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <div className={styles.connectionDotLeft}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              e.dataTransfer.setData("text/plain", card.id);
              setIsConnecting(true);
              onStartConnection(card.id);
            }}
            onDragEnd={() => setIsConnecting(false)}
          ></div>

          <div className={styles.connectionDotRight}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const fromCardId = e.dataTransfer.getData("text/plain");
              if (fromCardId && fromCardId !== card.id) {
                onEndConnection(card.id);
              }
            }}
          ></div>

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
            {...handlers}
          />
        )}
      </>
    );
  }
);

export default CardKanban;
