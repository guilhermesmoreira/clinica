import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalConnections = ({ 
  show, 
  onHide, 
  currentCard, 
  allCards, 
  onAddConnection, 
  onRemoveConnection 
}) => {
  if (!currentCard) return null;

  const isConnected = (otherCard) => {
    return currentCard.connections?.some(conn => conn.targetId === otherCard.id) || false;
  };

  const toggleConnection = (otherCard) => {
    const isAlreadyConnected = isConnected(otherCard);

    if (isAlreadyConnected) {
      // Remover conexão existente
      const updatedConnections = currentCard.connections?.filter(conn => conn.targetId !== otherCard.id) || [];
      onRemoveConnection(currentCard.id, otherCard.id);
    } else {
      // Adicionar nova conexão (padrão: right -> left)
      const newConnection = {
        targetId: otherCard.id,
        sourceSide: 'right',
        targetSide: 'left'
      };
      onAddConnection(currentCard.id, newConnection);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Gerenciar Conexões</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Card atual: {currentCard.content.procedimento}</h5>
        
        <div className="mt-4">
          <h6>Conectar a:</h6>
          {allCards
            .filter(card => card.id !== currentCard.id)
            .map(otherCard => (
              <div key={otherCard.id} className="d-flex align-items-center mb-2">
                <input
                  type="checkbox"
                  checked={isConnected(otherCard)}
                  onChange={() => toggleConnection(otherCard)}
                  className="me-2"
                />
                <span>
                  {otherCard.content.procedimento} (Coluna {otherCard.column})
                </span>
              </div>
            ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConnections;