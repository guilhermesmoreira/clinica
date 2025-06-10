import React, { useEffect, useRef, useCallback, useState } from "react";
import styles from "./Home.module.css";
import useProcedimentos from "../hooks/useProcedimentos";
import Column from "../components/Column/Column";
import ModalAddCard from "../components/ModalAddCard/ModalAddCard";
import ColorModal from "../components/ColorModal/ColorModal";
import ModalConnections from "../components/ModalConnections/ModalConnections";

const Home = () => {
  const [state, handlers] = useProcedimentos();
  const svgRef = useRef(null);
  const columnsContainerRef = useRef(null);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const updateCardPositions = useCallback(() => {
    if (!columnsContainerRef.current || !svgRef.current) return;

    const containerRect = columnsContainerRef.current.getBoundingClientRect();
    const scrollLeft = columnsContainerRef.current.scrollLeft;
    const scrollTop = columnsContainerRef.current.scrollTop;

    const positions = {};

    Object.keys(state.cardRefs.current).forEach((cardId) => {
      const element = state.cardRefs.current[cardId];
      if (element) {
        const rect = element.getBoundingClientRect();
        positions[cardId] = {
          startX: rect.right - containerRect.left + scrollLeft,
          startY: rect.top - containerRect.top + scrollTop + rect.height / 2,
          endX: rect.left - containerRect.left + scrollLeft,
          endY: rect.top - containerRect.top + scrollTop + rect.height / 2,
        };
      }
    });

    handlers.setCardPositions(positions);
  }, [state.cards, handlers]);

  useEffect(() => {
    const container = columnsContainerRef.current;
    if (!container) return;

    const observer = new MutationObserver(updateCardPositions);
    observer.observe(container, { childList: true, subtree: true });

    container.addEventListener('scroll', updateCardPositions, { passive: true });
    window.addEventListener('resize', updateCardPositions);

    updateCardPositions();

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', updateCardPositions);
      window.removeEventListener('resize', updateCardPositions);
    };
  }, [updateCardPositions]);

  useEffect(() => {
    if (selectedCard) {
      const updatedCard = state.cards.find(c => c.id === selectedCard.id);
      if (updatedCard) {
        setSelectedCard(updatedCard);
      }
    }
  }, [state.cards, selectedCard]);

  const addConnection = (cardId, connectedCardId) => {
    handlers.setCards(prevCards =>
      prevCards.map(card => {
        if (card.id === cardId && !card.connections?.includes(connectedCardId)) {
          return {
            ...card,
            connections: [...(card.connections || []), connectedCardId]
          };
        }
        return card;
      })
    );
  };

  const removeConnection = (cardId, connectedCardId) => {
    handlers.setCards(prevCards =>
      prevCards.map(card => {
        if (card.id === cardId) {
          return {
            ...card,
            connections: (card.connections || []).filter(id => id !== connectedCardId)
          };
        }
        return card;
      })
    );
  };

  return (
    <div className={styles.content}>
      <div className={styles.columnsContainer} ref={columnsContainerRef}>
        <svg ref={svgRef} className={styles.connectionSvg}>
          {state.cards.flatMap(card => {
            return (card.connections || []).map(connectedCardId => {
              if (card.id > connectedCardId) return null;

              const connectedCard = state.cards.find(c => c.id === connectedCardId);
              if (!connectedCard) return null;

              const start = state.cardPositions[card.id];
              const end = state.cardPositions[connectedCardId];

              if (start && end) {
                return (
                  <line
                    key={`${card.id}-${connectedCardId}`}
                    x1={start.startX}
                    y1={start.startY}
                    x2={end.endX}
                    y2={end.endY}
                    className={styles.connectionLine}
                  />
                );
              }
              return null;
            });
          })}
        </svg>

        <div className={styles.columns}>
          {state.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={state.cards}
              cardRefs={state.cardRefs}
              columns={state.columns}
              setSelectedCard={setSelectedCard}
              setShowConnectionsModal={setShowConnectionsModal}
              {...handlers}
            />
          ))}
        </div>
      </div>

      <ColorModal
        isOpen={state.isColorModalOpen}
        onClose={handlers.closeColorModal}
        onSelectColor={handlers.handleColorSelect}
      />

      <ModalAddCard {...state} {...handlers} columns={state.columns} />

      <ModalConnections
        show={showConnectionsModal}
        onHide={() => setShowConnectionsModal(false)}
        currentCard={selectedCard}
        allCards={state.cards}
        onAddConnection={addConnection}
        onRemoveConnection={removeConnection}
      />
    </div>
  );
};

export default Home;
