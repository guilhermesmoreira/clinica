import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Planejamento.module.css";
import TopbarPlanejamento from "../components/Topbar/TopbarPlanejamento";
import SidebarPlanejamento from "../components/Sidebar/SidebarPlanejamento";
import Column from "../components/Column/Column";
import ModalConnections from "../components/ModalConnections/ModalConnections";
import CardDetalhadoModal from "../components/CardDetalhadoModal/CardDetalhadoModal";
import { useLocation, useNavigate } from "react-router-dom";

const colunasFixas = [
  { id: "col1", title: "Etapa 1", color: "#f5f5f5" },
  { id: "col2", title: "Etapa 2", color: "#f5f5f5" },
  { id: "col3", title: "Etapa 3", color: "#f5f5f5" },
  { id: "col4", title: "Etapa 4", color: "#f5f5f5" },
  { id: "col5", title: "Etapa 5", color: "#f5f5f5" },
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

  const svgRef = useRef(null);
  const columnsContainerRef = useRef(null);

  useEffect(() => {
    if (!paciente) navigate("/");
  }, [paciente, navigate]);

  // Atualizar posições dos cards
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
            {Object.keys(cardsDistribuidos).flatMap((colunaId) => {
              return (cardsDistribuidos[colunaId] || []).flatMap((card) => {
                return (card.connections || []).map((connectedCardId) => {
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
                });
              });
            })}
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
            />
          ))}
        </div>
      </div>

      {/* Modal de Detalhe */}
      {selectedCardDetalhe && (
        <CardDetalhadoModal
          card={{
            id: selectedCardDetalhe.id,
            content: {
              pacienteId: paciente?.PatientId,
              paciente: selectedCardDetalhe.paciente,
              procedimento: selectedCardDetalhe.procedimento,
              etapas: [],
              agendamento: { status: "" },
              saldo: 0,
              status: "",
            },
          }}
          onClose={() => setSelectedCardDetalhe(null)}
          toggleEtapa={() => { }}
          handleAgendar={() => { }}
          handleColumnChange={() => { }}
          deleteCard={() => { }}
          columns={colunasFixas}
          toggleAgendamentoStatus={() => { }}
        />
      )}

      {/* Modal de Conexões */}
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
