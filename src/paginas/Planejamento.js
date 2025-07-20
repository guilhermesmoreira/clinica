import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Planejamento.module.css";
import TopbarPlanejamento from "../components/Topbar/TopbarPlanejamento";
import SidebarPlanejamento from "../components/Sidebar/SidebarPlanejamento";
import Column from "../components/Column/Column";
import ModalConnections from "../components/ModalConnections/ModalConnections";
import CardDetalhadoModal from "../components/CardDetalhadoModal/CardDetalhadoModal";
import useProcedimentos from "../hooks/useProcedimentos";
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
  const [dragState, setDragState] = useState({
    isDragging: false,
    fromCard: null,
    fromSide: null,
    currentPos: null,
    hasMoved: false, // Novo campo para rastrear movimento do mouse
  });
  const [, actions] = useProcedimentos();


  const svgRef = useRef(null);
  const columnsContainerRef = useRef(null);

  useEffect(() => {
    if (!paciente) navigate("/");
  }, [paciente, navigate]);

  const getDotElementId = (cardId, side) => `dot-${cardId}-${side}`;

  const getDotPosition = useCallback((cardId, side) => {
    const dotElement = document.getElementById(getDotElementId(cardId, side));
    const containerElement = columnsContainerRef.current;

    if (!dotElement || !containerElement) {
      console.warn(`Elemento não encontrado: cardId=${cardId}, side=${side}`);
      return { x: 0, y: 0 };
    }

    const dotRect = dotElement.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();
    const scrollLeft = containerElement.scrollLeft;
    const scrollTop = containerElement.scrollTop;

    const position = {
      x: dotRect.left - containerRect.left + dotRect.width / 2 + scrollLeft,
      y: dotRect.top - containerRect.top + dotRect.height / 2 + scrollTop,
    };
    console.log(`Posição calculada para cardId=${cardId}, side=${side}:`, position);
    return position;
  }, []);

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
            leftX: rect.left - containerRect.left + scrollLeft,
            leftY: rect.top - containerRect.top + scrollTop + rect.height / 2,
            rightX: rect.right - containerRect.left + scrollLeft,
            rightY: rect.top - containerRect.top + scrollTop + rect.height / 2,
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

  const addConnection = (fromCardId, fromSide, toCardId, toSide) => {
    setCardsDistribuidos((prev) => {
      const novo = { ...prev };
      Object.keys(novo).forEach((colunaId) => {
        novo[colunaId] = novo[colunaId].map((card) => {
          if (card.id === fromCardId) {
            const existingConnection = (card.connections || []).find(
              (conn) => conn.id === toCardId && conn.side === toSide
            );
            if (!existingConnection) {
              return {
                ...card,
                connections: [...(card.connections || []), { id: toCardId, side: toSide }],
              };
            }
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
              connections: (card.connections || []).filter((conn) => conn.id !== connectedCardId),
            };
          }
          return card;
        });
      });
      return novo;
    });
  };

  const handleDotMouseDown = (cardId, side, event) => {
    event.preventDefault();
    const pos = getDotPosition(cardId, side);

    setDragState({
      isDragging: true,
      fromCard: cardId,
      fromSide: side,
      currentPos: pos,
      hasMoved: false,
    });
  };

  const handleMouseMove = useCallback((event) => {
    if (!dragState.isDragging || !columnsContainerRef.current) return;

    const containerRect = columnsContainerRef.current.getBoundingClientRect();
    const pos = {
      x: event.clientX - containerRect.left + columnsContainerRef.current.scrollLeft,
      y: event.clientY - containerRect.top + columnsContainerRef.current.scrollTop,
    };

    setDragState((prev) => ({ ...prev, currentPos: pos, hasMoved: true }));
  }, [dragState.isDragging]);

  const handleMouseUp = useCallback((event) => {
    if (!dragState.isDragging || !dragState.hasMoved) {
      setDragState({
        isDragging: false,
        fromCard: null,
        fromSide: null,
        currentPos: null,
        hasMoved: false,
      });
      return;
    }

    const target = event.target.closest("[data-dot]");
    if (target) {
      const toCardId = target.getAttribute("data-card-id");
      const toSide = target.getAttribute("data-side");
      if (toCardId && toSide && toCardId !== dragState.fromCard) {
        addConnection(dragState.fromCard, dragState.fromSide, toCardId, toSide);
      }
    }

    setDragState({
      isDragging: false,
      fromCard: null,
      fromSide: null,
      currentPos: null,
      hasMoved: false,
    });
  }, [dragState]);

  const handleLineClick = useCallback((fromCardId, toCardId) => {
    removeConnection(fromCardId, toCardId);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

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

      Object.keys(novo).forEach((colunaId) => {
        novo[colunaId] = novo[colunaId].filter((card) => {
          if (card.id === cardId) {
            movedCard = { ...card, column: targetColumnId };
            return false;
          }
          return true;
        });
      });

      if (movedCard) {
        novo[targetColumnId] = [...(novo[targetColumnId] || []), movedCard];
      }

      return novo;
    });
  };

  const renderConnections = () => {
    return Object.keys(cardsDistribuidos).flatMap((colunaId) =>
      (cardsDistribuidos[colunaId] || []).flatMap((card) =>
        (card.connections || []).map((conn) => {
          const fromPos = getDotPosition(card.id, conn.side === "left" ? "right" : "left");
          const toPos = getDotPosition(conn.id, conn.side);
          if (fromPos && toPos && fromPos.x !== 0 && fromPos.y !== 0 && toPos.x !== 0 && toPos.y !== 0) {
            return (
              <line
                key={`${card.id}-${conn.id}-${conn.side}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                className={styles.connectionLine}
                onClick={() => handleLineClick(card.id, conn.id)}
                style={{ cursor: "pointer" }}
              />
            );
          }
          return null;
        })
      )
    );
  };

  const renderDragLine = () => {
    if (!dragState.isDragging || !dragState.fromCard || !dragState.currentPos) return null;

    const fromPos = getDotPosition(dragState.fromCard, dragState.fromSide);

    console.log("Renderizando linha temporária:", { fromPos, toPos: dragState.currentPos });

    if (fromPos.x === 0 && fromPos.y === 0) return null;

    return (
      <line
        x1={fromPos.x}
        y1={fromPos.y}
        x2={dragState.currentPos.x}
        y2={dragState.currentPos.y}
        stroke="#EF4444"
        strokeWidth="2"
        strokeDasharray="3,3"
        opacity="0.7"
      />
    );
  };

  const deleteCard = (id) => {
    setCardsDistribuidos((prev) => {
      const novo = {};
      Object.keys(prev).forEach((colunaId) => {
        novo[colunaId] = prev[colunaId].filter((card) => card.id !== id);
      });
      return novo;
    });
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
          <svg
            ref={svgRef}
            className={styles.connectionSvg}
            style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
          >
            {renderConnections()}
            {renderDragLine()}
          </svg>
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
              onDotMouseDown={handleDotMouseDown}
              onEndConnection={handleMouseUp}
            />
          ))}
        </div>
      </div>
      {selectedCardDetalhe && (
        <CardDetalhadoModal
          card={selectedCardDetalhe}
          columns={colunasFixas}
          onClose={() => setSelectedCardDetalhe(null)}
          toggleEtapa={() => { }}
          handleAgendar={() => { }}
          handleColumnChange={() => { }}
          deleteCard={deleteCard}
          toggleAgendamentoStatus={toggleAgendamentoStatusPlanejamento}
        />
      )}
      <ModalConnections
        show={showConnectionsModal}
        onHide={() => setShowConnectionsModal(false)}
        currentCard={selectedCard}
        allCards={Object.values(cardsDistribuidos).flat()}
        onAddConnection={(fromCardId, toCardId) =>
          addConnection(fromCardId, "right", toCardId, "left")
        }
        onRemoveConnection={removeConnection}
      />
    </div>
  );
};

export default Planejamento;