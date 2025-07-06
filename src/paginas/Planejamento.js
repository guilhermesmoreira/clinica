import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Planejamento.module.css";
import TopbarPlanejamento from "../components/Topbar/TopbarPlanejamento";
import SidebarPlanejamento from "../components/Sidebar/SidebarPlanejamento";
import Column from "../components/Column/Column";
import ModalConnections from "../components/ModalConnections/ModalConnections";
import CardDetalhadoModal from "../components/CardDetalhadoModal/CardDetalhadoModal";
import { useLocation, useNavigate } from "react-router-dom";

const colunasFixas = [
  { id: "col1", title: "Etapa 1", color: "#000000" },
  { id: "col2", title: "Etapa 2", color: "#000000" },
  { id: "col3", title: "Etapa 3", color: "#000000" },
  { id: "col4", title: "Etapa 4", color: "#000000" },
  { id: "col5", title: "Etapa 5", color: "#000000" },
];

const Planejamento = () => {
  const { state } = useLocation();
  const paciente = state?.paciente;
  const navigate = useNavigate();

  const [cardsSidebar, setCardsSidebar] = useState([]);
  const [cardsDistribuidos, setCardsDistribuidos] = useState({});
  const [selectedCardDetalhe, setSelectedCardDetalhe] = useState(null);
  const [cardPositions, setCardPositions] = useState({});
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [connectionStart, setConnectionStart] = useState(null);

  const svgRef = useRef(null);
  const columnsContainerRef = useRef(null);

  useEffect(() => {
    if (!paciente) navigate("/");
  }, [paciente, navigate]);

  const updateCardPositions = useCallback(() => {
    if (!columnsContainerRef.current || !svgRef.current) return;

    const containerRect = columnsContainerRef.current.getBoundingClientRect();
    const scrollLeft = columnsContainerRef.current.scrollLeft;
    const scrollTop = columnsContainerRef.current.scrollTop;

    const positions = {};

    Object.keys(cardsDistribuidos).forEach((colunaId) => {
      (cardsDistribuidos[colunaId] || []).forEach((card) => {
        const element = document.getElementById(`card-${card.id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          positions[card.id] = {
            startX: rect.right - containerRect.left + scrollLeft,
            startY: rect.top - containerRect.top + scrollTop + rect.height / 2,
            endX: rect.left - containerRect.left + scrollLeft,
            endY: rect.top - containerRect.top + scrollTop + rect.height / 2,
          };
        }
      });
    });

    setCardPositions(positions);
  }, [cardsDistribuidos]);

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

  const addConnection = (cardId, connectedCardId) => {
    setCardsDistribuidos((prev) => {
      const novo = { ...prev };
      Object.keys(novo).forEach((colunaId) => {
        novo[colunaId] = novo[colunaId].map((card) => {
          if (card.id === cardId && !card.connections?.includes(connectedCardId)) {
            return {
              ...card,
              connections: [...(card.connections || []), connectedCardId],
            };
          }
          return card;
        });
      });
      return novo;
    });
  };

  const removeConnection = (cardId, connectedCardId) => {
    setCardsDistribuidos((prev) => {
      const novo = { ...prev };
      Object.keys(novo).forEach((colunaId) => {
        novo[colunaId] = novo[colunaId].map((card) => {
          if (card.id === cardId) {
            return {
              ...card,
              connections: (card.connections || []).filter((id) => id !== connectedCardId),
            };
          }
          return card;
        });
      });
      return novo;
    });
  };

  // ✅ Função local para atualizar o status de agendamento
  const toggleAgendamentoStatusPlanejamento = (cardId, novoStatus) => {
    setCardsDistribuidos((prev) => {
      const novo = { ...prev };
      Object.keys(novo).forEach((colunaId) => {
        novo[colunaId] = novo[colunaId].map((card) =>
          card.id === cardId
            ? {
              ...card,
              content: {
                ...card.content,
                agendamento: {
                  ...card.content.agendamento,
                  status: novoStatus,
                },
              },
            }
            : card
        );
      });
      return novo;
    });

    // ✅ Atualiza também o card que está aberto no modal
    setSelectedCardDetalhe((prev) =>
      prev && prev.id === cardId
        ? {
          ...prev,
          content: {
            ...prev.content,
            agendamento: {
              ...prev.content.agendamento,
              status: novoStatus,
            },
          },
        }
        : prev
    );
  };

  const moveCardToColumn = (cardId, targetColumnId) => {
    setCardsDistribuidos((prev) => {
      const novo = { ...prev };
      let movedCard = null;

      // Remove o card de todas as colunas
      Object.keys(novo).forEach((colunaId) => {
        novo[colunaId] = novo[colunaId].filter((card) => {
          if (card.id === cardId) {
            movedCard = { ...card, column: targetColumnId };
            return false;
          }
          return true;
        });
      });

      // Adiciona o card na nova coluna
      if (movedCard) {
        novo[targetColumnId] = [...(novo[targetColumnId] || []), movedCard];
      }

      return novo;
    });
  };

  const handleStartConnection = (cardId) => {
    setConnectionStart(cardId);
  };

  const handleEndConnection = (targetCardId) => {
    if (connectionStart && connectionStart !== targetCardId) {
      addConnection(connectionStart, targetCardId);
    }
    setConnectionStart(null);
  };

  return (
    <div className={styles.planejamentoContainer}>
      <TopbarPlanejamento paciente={paciente} />

      <div className={styles.corpo}>
        <SidebarPlanejamento
          paciente={paciente}
          cardsSidebar={cardsSidebar}
          setCardsSidebar={setCardsSidebar}
          setCardsDistribuidos={setCardsDistribuidos}
        />

        <div className={styles.colunasArea} ref={columnsContainerRef}>
          {/* Conexões SVG */}
          <svg ref={svgRef} className={styles.connectionSvg}>
            {Object.keys(cardsDistribuidos).flatMap((colunaId) =>
              (cardsDistribuidos[colunaId] || []).flatMap((card) =>
                (card.connections || []).map((connectedCardId) => {
                  const start = cardPositions[card.id];
                  const end = cardPositions[connectedCardId];
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
              )
            )}
          </svg>

          {/* Colunas */}
          {colunasFixas.map((col) => (
            <Column
              key={col.id}
              column={col}
              cards={cardsDistribuidos[col.id] || []}
              columnId={col.id}
              isPlanejamento
              setCardsDistribuidos={setCardsDistribuidos}
              cardsSidebar={cardsSidebar}
              setCardsSidebar={setCardsSidebar}
              setSelectedCardDetalhe={setSelectedCardDetalhe}
              setSelectedCard={setSelectedCard}
              setShowConnectionsModal={setShowConnectionsModal}
              moveCardToColumn={moveCardToColumn}
              toggleAgendamentoStatus={toggleAgendamentoStatusPlanejamento}
              onStartConnection={handleStartConnection}
              onEndConnection={handleEndConnection}
            />
          ))}
        </div>
      </div>
      
      {/* Modal Detalhado */}
      {selectedCardDetalhe && (
        <CardDetalhadoModal
          card={selectedCardDetalhe}
          columns={colunasFixas}
          onClose={() => setSelectedCardDetalhe(null)}
          toggleEtapa={() => { }}
          handleAgendar={() => { }}
          handleColumnChange={() => { }}
          deleteCard={() => { }}
          toggleAgendamentoStatus={toggleAgendamentoStatusPlanejamento}
        />
      )}
      {/* Modal Conexões */}
      <ModalConnections
        show={showConnectionsModal}
        onHide={() => setShowConnectionsModal(false)}
        currentCard={selectedCard}
        allCards={Object.values(cardsDistribuidos).flat()}
        onAddConnection={addConnection}
        onRemoveConnection={removeConnection}
      />
    </div>
  );
};

export default Planejamento;
