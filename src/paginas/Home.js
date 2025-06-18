import React, { useEffect, useRef, useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./Home.module.css";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import useProcedimentos from "../hooks/useProcedimentos";
import Column from "../components/Column/Column";
import ColorModal from "../components/ColorModal/ColorModal";
import ModalConnections from "../components/ModalConnections/ModalConnections";
import ModalSelecionarPaciente from "../components/ModalSelecionarPaciente/ModalSelecionarPaciente";
import { useNavigate } from "react-router-dom";

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

  const [showPacienteModal, setShowPacienteModal] = useState(false);
  const navigate = useNavigate();

  const handleConfirmarPaciente = async (pacienteSelecionado) => {
    console.log("Paciente selecionado:", pacienteSelecionado);

    // Primeiro fecha o modal
    setShowPacienteModal(false);

    // Aguarda o ciclo de renderização completar
    await new Promise(resolve => setTimeout(resolve, 0));

    // Depois navega
    navigate("/planejamento", {
      state: { paciente: pacienteSelecionado },
      replace: true
    });
  };


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

  useEffect(() => {
    const atualizarSaldo = async () => {
      const dados = await fetchBalanceData(state.fromDate, state.toDate);
      setBalanceData(dados);
    };

    atualizarSaldo();
  }, [state.fromDate, state.toDate]);

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

  // Armazene em uma ref ou isole fora do loop de renderização
  handlers.setCardPositions(positions);
}, [state.cardRefs, handlers.setCardPositions]);


  useEffect(() => {
    const container = columnsContainerRef.current;
    if (!container) return;

    const observer = new MutationObserver(updateCardPositions);
    observer.observe(container, { childList: true, subtree: true });

    container.addEventListener("scroll", updateCardPositions, { passive: true });
    window.addEventListener("resize", updateCardPositions);

    updateCardPositions();

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", updateCardPositions);
      window.removeEventListener("resize", updateCardPositions);
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
            connections: [...(card.connections || []), connectedCardId],
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
            connections: (card.connections || []).filter(id => id !== connectedCardId),
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
        abrirModalAdicionar={() => setShowPacienteModal(true)}
      />

      <div className={styles.pageBody}>
        <Sidebar cards={state.cards} />
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div className={styles.columnsContainer} ref={columnsContainerRef}>
              <svg ref={svgRef} className={styles.connectionSvg}>
                {state.cards.flatMap(card =>
                  (card.connections || []).map(connectedCardId => {
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
                  })
                )}
              </svg>

              <div className={styles.columns}>
                {state.columns.map(column => (
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
        </div>
      </div>

      <ColorModal
        isOpen={state.isColorModalOpen}
        onClose={handlers.closeColorModal}
        onSelectColor={handlers.handleColorSelect}
      />

      <ModalConnections
        show={showConnectionsModal}
        onHide={() => setShowConnectionsModal(false)}
        currentCard={selectedCard}
        allCards={state.cards}
        onAddConnection={addConnection}
        onRemoveConnection={removeConnection}
      />

      <ModalSelecionarPaciente
        show={showPacienteModal}
        onHide={() => setShowPacienteModal(false)}
        onConfirm={handleConfirmarPaciente}
      />
    </div>
  );
};


export default Home;
