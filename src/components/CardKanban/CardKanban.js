import React, { useState, forwardRef } from "react";
import { Card } from "react-bootstrap";
import CardDetalhadoModal from "../CardDetalhadoModal/CardDetalhadoModal";
import styles from "../../paginas/Home.module.css";

const CardKanban = forwardRef(({ 
  card, 
  columns, 
  setSelectedCard, 
  setShowConnectionsModal,
  ...handlers 
}, ref) => {
  const [showModal, setShowModal] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setSelectedCard(card);
    setShowConnectionsModal(true);
  };

  return (
    <>
      <Card
        ref={ref}
        className={`${styles.cardCompact} ${
          card.connections?.length > 0 ? styles['card-connected'] : ''
        } ${styles['card-has-connections']}`}
        onClick={() => setShowModal(true)}
        onContextMenu={handleContextMenu}
        style={{ cursor: "pointer" }}
      >
        <Card.Body>
          <p><strong>Paciente:</strong> {card.content.paciente}</p>
          <p><strong>Procedimento:</strong> {card.content.procedimento}</p>
          {/* {card.connections?.length > 0 && (
            <small className="text-muted">
              Conectado a {card.connections.length} procedimento(s)
            </small>
          )} */}
        </Card.Body>
      </Card>

      {showModal && (
        <CardDetalhadoModal
          card={card}
          columns={columns}
          onClose={() => setShowModal(false)}
          {...handlers}
        />
      )}
    </>
  );
});

export default CardKanban;