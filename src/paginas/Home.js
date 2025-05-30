import React, { useEffect, useRef, useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./Home.module.css";
import Topbar from "../components/Topbar/Topbar";
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
  const [balanceData, setBalanceData] = useState({
    total: 0,
    entradas: 0,
    programado: 0,
    entregue: 0,
  });

  useEffect(() => {
    const atualizarSaldo = async () => {
      const dados = await fetchBalanceData(state.fromDate, state.toDate);
      setBalanceData(dados);
    };

    atualizarSaldo();
  }, [state.fromDate, state.toDate]);


  // Atualiza posições dos cards para desenhar linhas
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
          // Ponto de SAÍDA (lado direito do card)
          startX: rect.right - containerRect.left + scrollLeft,
          startY: rect.top - containerRect.top + scrollTop + rect.height / 2,
          // Ponto de ENTRADA (lado esquerdo do card)
          endX: rect.left - containerRect.left + scrollLeft,
          endY: rect.top - containerRect.top + scrollTop + rect.height / 2,
        };
      }
    });

    handlers.setCardPositions(positions);
  }, [state.cards, handlers]);

  // Efeito para atualizar posições
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

  const fetchBalanceData = async (fromDate, toDate) => {
    try {
      const response = await fetch(
        `http://localhost:8000/estimativas?from=${fromDate.toISOString().split("T")[0]}&to=${toDate.toISOString().split("T")[0]}`
      );
      const data = await response.json();

      return {
        total: (data.OpenTotalAmount || 0) + (data.FollowUpTotalAmount || 0),
        entradas: data.OpenTotalAmount || 0,
        programado: data.ApprovedTotalAmount || 0,
        entregue: data.FollowUpTotalAmount || 0,
      };
    } catch (error) {
      console.error("Erro ao buscar estimativas:", error);
      return {
        total: 0,
        entradas: 0,
        programado: 0,
        entregue: 0,
      };
    }
  };


  // Atualiza o selectedCard quando o estado global muda
  useEffect(() => {
    if (selectedCard) {
      const updatedCard = state.cards.find(c => c.id === selectedCard.id);
      if (updatedCard) {
        setSelectedCard(updatedCard);
      }
    }
  }, [state.cards, selectedCard]);

  // Funções para manipular conexões - Modifique assim:
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
    <div className={styles.container}>
      <Topbar
        {...state}
        {...handlers}
        balanceData={balanceData}
        onAddCard={handlers.openAddCardModal}
      />

      <div className={styles.content}>
        <div className={styles.columnsContainer} ref={columnsContainerRef}>
          {/* SVG das linhas entre cards conectados */}
          <svg ref={svgRef} className={styles.connectionSvg}>
            {state.cards.flatMap(card => {
              return (card.connections || []).map(connectedCardId => {
                // Evita renderizar a conexão inversa
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

          {/* Colunas com os cards */}
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

          <Button
            variant="outline"
            size="sm"
            className={styles.addColumnButton}
            onClick={handlers.addColumn}
          >
            +
          </Button>
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