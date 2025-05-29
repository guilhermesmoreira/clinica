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

  const isConnected = (otherId) => {
    return currentCard.connections?.includes(otherId) || false;
  };

  const toggleConnection = (otherCard) => {
    const isAlreadyConnected = isConnected(otherCard.id);

    if (isAlreadyConnected) {
      onRemoveConnection(currentCard.id, otherCard.id);
    } else {
      onAddConnection(currentCard.id, otherCard.id);
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
                  checked={isConnected(otherCard.id)}
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