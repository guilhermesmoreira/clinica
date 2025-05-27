import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { Plus, Trash } from "react-bootstrap-icons";
import { addDays, subDays, format } from "date-fns";
import styles from "./Home.module.css";
import Topbar from "../components/Topbar/Topbar";
import axios from "axios";

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fromDate, setFromDate] = useState(subDays(new Date(), 14));
  const [toDate, setToDate] = useState(addDays(new Date(), 14));
  const [balanceData, setBalanceData] = useState({
    total: 15000,
    entradas: 8000,
    programado: 12000,
    entregue: 5000,
  });
  const [columns, setColumns] = useState([
    {
      id: 1,
      title: "Etapa 1",
      color: "linear-gradient(45deg, #f3f4f6, #e5e7eb, #f3f4f6)",
    },
  ]);
  const [cards, setCards] = useState([]);
  const [nextCardId, setNextCardId] = useState(1);
  const [nextColumnId, setNextColumnId] = useState(2);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState(null);
  const [newCardData, setNewCardData] = useState({
    paciente: "",
    procedimentos: [{ procedimento: "", columnId: columns[0].id }],
  });
  const [nextBatchId, setNextBatchId] = useState(1);
  const [cardPositions, setCardPositions] = useState({});
  const cardRefs = useRef({});
  const containerRef = useRef(null);

  const updateCardPositions = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const positions = {};
    Object.keys(cardRefs.current).forEach((cardId) => {
      const element = cardRefs.current[cardId];
      if (element) {
        const rect = element.getBoundingClientRect();
        positions[cardId] = {
          startX: rect.right - containerRect.left,
          startY: rect.top + rect.height / 2 - containerRect.top,
          endX: rect.left - containerRect.left,
          endY: rect.top + rect.height / 2 - containerRect.top,
        };
      }
    });
    setCardPositions(positions);
  };
  const [procedimentosDisponiveis, setProcedimentosDisponiveis] = useState([]);
  const [filtroProcedimento, setFiltroProcedimento] = useState("");

  useEffect(() => {
    const fetchProcedimentos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/procedimentos");
        const rawData = response.data;

        const procedimentosArray = Object.values(rawData)
          .flat()
          .filter((p) => p && typeof p === "object" && p.ProcedureName);

        setProcedimentosDisponiveis(procedimentosArray);
      } catch (error) {
        console.error("Erro ao buscar procedimentos da Clinicorp:", error);
      }
    };
    fetchProcedimentos();
  }, []);


  useEffect(() => {
    updateCardPositions();
    const handleResizeOrScroll = () => updateCardPositions();
    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll);
    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll);
    };
  }, [cards]);

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        id: nextColumnId,
        title: `Etapa ${nextColumnId}`,
        color: "linear-gradient(45deg, #f3f4f6, #e5e7eb, #f3f4f6)",
      },
    ]);
    setNextColumnId(nextColumnId + 1);
  };

  const deleteColumn = (columnId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar esta coluna?");
    if (confirmDelete && columns.length > 1) {
      setColumns(columns.filter((column) => column.id !== columnId));
      setCards(cards.filter((card) => card.column !== columnId));
    }
  };

  const editColumnTitle = (columnId, newTitle) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId ? { ...column, title: newTitle } : column
      )
    );
  };

  const changeColumnColor = (columnId, newColor) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId ? { ...column, color: newColor } : column
      )
    );
  };

  const openColorModal = (columnId) => {
    setCurrentColumnId(columnId);
    setIsColorModalOpen(true);
  };

  const closeColorModal = () => {
    setIsColorModalOpen(false);
    setCurrentColumnId(null);
  };

  const handleColorSelect = (color) => {
    if (currentColumnId) {
      changeColumnColor(currentColumnId, color);
    }
    closeColorModal();
  };

  const openAddCardModal = () => {
    setIsAddCardModalOpen(true);
  };

  const closeAddCardModal = () => {
    setIsAddCardModalOpen(false);
    setNewCardData({
      paciente: "",
      procedimentos: [{ procedimento: "", columnId: columns[0].id }],
    });
  };

  const addNewProcedimento = () => {
    setNewCardData({
      ...newCardData,
      procedimentos: [
        ...newCardData.procedimentos,
        { procedimento: "", columnId: columns[0].id },
      ],
    });
  };

  const updateProcedimento = (index, field, value) => {
    const updatedProcedimentos = newCardData.procedimentos.map((proc, i) =>
      i === index ? { ...proc, [field]: value } : proc
    );
    setNewCardData({ ...newCardData, procedimentos: updatedProcedimentos });
  };

  const removeProcedimento = (index) => {
    if (newCardData.procedimentos.length > 1) {
      setNewCardData({
        ...newCardData,
        procedimentos: newCardData.procedimentos.filter((_, i) => i !== index),
      });
    }
  };

  const handleAddCard = () => {
    if (
      !newCardData.paciente ||
      newCardData.procedimentos.some((proc) => !proc.procedimento)
    ) {
      alert("Por favor, preencha o paciente e todos os procedimentos.");
      return;
    }
    const currentBatchId = nextBatchId;
    const newCards = newCardData.procedimentos.map((proc, index) => ({
      id: nextCardId + index,
      column: proc.columnId,
      batchId: currentBatchId,
      content: {
        ID: `${nextCardId + index}`,
        paciente: newCardData.paciente,
        procedimento: proc.procedimento,
        etapas: [
          { etapa: "Etapa 1 [30min]", concluida: false },
          { etapa: "Etapa 2 [45min]", concluida: false },
        ],
        agendamento: {
          agendar: "Agendar",
          dataAgendada: null,
        },
        saldo: "R$ 2000/3000",
        status: "verde",
      },
    }));

    setCards([...cards, ...newCards]);
    setNextCardId(nextCardId + newCards.length);
    setNextBatchId(nextBatchId + 1);
    closeAddCardModal();
  };

  const deleteCard = (cardId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este card?");
    if (confirmDelete) {
      setCards(cards.filter((card) => card.id !== cardId));
    }
  };

  const toggleEtapa = (cardId, etapaIndex) => {
    setCards(
      cards.map((card) =>
        card.id === cardId
          ? {
            ...card,
            content: {
              ...card.content,
              etapas: card.content.etapas.map((etapa, index) =>
                index === etapaIndex ? { ...etapa, concluida: !etapa.concluida } : etapa
              ),
            },
          }
          : card
      )
    );
  };

  const handleAgendar = (cardId, dateString) => {
    const localDate = new Date(dateString + "T00:00:00");
    setCards(
      cards.map((card) =>
        card.id === cardId
          ? {
            ...card,
            content: {
              ...card.content,
              agendamento: {
                agendar: `Agendado: ${format(localDate, "dd/MM/yy")}`,
                dataAgendada: localDate,
              },
            },
          }
          : card
      )
    );
  };

  const handleColumnChange = (cardId, newColumnId) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, column: parseInt(newColumnId) } : card
      )
    );
    updateCardPositions();
  };

  const ColorModal = ({ isOpen, onClose, onSelectColor }) => {
    if (!isOpen) return null;

    const colors = [
      "linear-gradient(45deg, #4CAF50, #A5D6A7, #4CAF50)",
      "linear-gradient(45deg, #FF5252, #FF8A80, #FF5252)",
      "linear-gradient(45deg, #2196F3, #90CAF9, #2196F3)",
      "linear-gradient(45deg, #FFFFFF, #E0E0E0, #FFFFFF)",
      "linear-gradient(45deg, #000000, #424242, #000000)",
    ];

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h3>Escolha uma cor</h3>
          <div className={styles.colorOptions}>
            {colors.map((color, index) => (
              <button
                key={index}
                className={styles.colorButton}
                style={{ background: color }}
                onClick={() => onSelectColor(color)}
              />
            ))}
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            Fechar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Topbar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        balanceData={balanceData}
        onAddCard={openAddCardModal}
      />

      <div className={styles.content}>
        <div className={styles.columnsContainer} ref={containerRef}>
          <svg className={styles.connectionSvg}>
            {Object.entries(
              cards.reduce((acc, card) => {
                if (card.batchId) {
                  acc[card.batchId] = acc[card.batchId] || [];
                  acc[card.batchId].push(card);
                }
                return acc;
              }, {})
            )
              .filter(([_, batchCards]) => batchCards.length > 1)
              .map(([batchId, batchCards]) =>
                batchCards
                  .sort((a, b) => a.column - b.column)
                  .reduce((lines, card, index, arr) => {
                    if (index < arr.length - 1) {
                      const nextCard = arr[index + 1];
                      if (card.column !== nextCard.column) {
                        const start = cardPositions[card.id];
                        const end = cardPositions[nextCard.id];
                        if (start && end) {
                          lines.push(
                            <line
                              key={`${card.id}-${nextCard.id}`}
                              className={styles.connectionLine}
                              x1={start.startX}
                              y1={start.startY}
                              x2={end.endX}
                              y2={end.endY}
                            />
                          );
                        }
                      }
                    }
                    return lines;
                  }, [])
              )}
          </svg>
          <div className={styles.columns}>
            {columns.map((column) => (
              <div
                key={column.id}
                className={styles.column}
                style={{ background: column.color }}
              >
                <div className={styles.columnHeader}>
                  <input
                    type="text"
                    value={column.title}
                    onChange={(e) => editColumnTitle(column.id, e.target.value)}
                    className={`${styles.columnTitleInput} ${column.color.includes("#000000") ? styles.whiteText : ""
                      }`}
                  />
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openColorModal(column.id)}
                      className={styles.colorButton}
                    >
                      🎨
                    </Button>
                    {columns.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteColumn(column.id)}
                        className={styles.deleteButton}
                      >
                        <Trash size={16} />
                      </Button>
                    )}
                  </div>
                </div>

                <div className={styles.cards}>
                  {cards
                    .filter((card) => card.column === column.id)
                    .map((card) => (
                      <Card
                        key={card.id}
                        className={styles.card}
                        ref={(el) => (cardRefs.current[card.id] = el)}
                      >
                        <Card.Body>
                          <div className={styles.cardHeader}>
                            <h4>Cartão do Procedimento</h4>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteCard(card.id)}
                              className={styles.deleteButton}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                          <p>
                            <strong>ID:</strong> {card.content.ID}
                          </p>
                          <p>
                            <strong>Paciente:</strong> {card.content.paciente}
                          </p>
                          <p>
                            <strong>Procedimento:</strong> {card.content.procedimento}
                          </p>
                          <div className={styles.etapas}>
                            <strong>Etapas:</strong>
                            {card.content.etapas.map((etapa, index) => (
                              <div key={index}>
                                <input
                                  type="checkbox"
                                  checked={etapa.concluida}
                                  onChange={() => toggleEtapa(card.id, index)}
                                />
                                {etapa.etapa}
                              </div>
                            ))}
                          </div>
                          <p>
                            <strong>Agendamento:</strong> {card.content.agendamento.agendar}
                          </p>
                          <input
                            type="date"
                            value={
                              card.content.agendamento.dataAgendada?.toISOString().split("T")[0] || ""
                            }
                            onChange={(e) => handleAgendar(card.id, e.target.value)}
                            className={styles.dateInput}
                          />
                          <p>
                            <strong>Saldo:</strong> {card.content.saldo}
                          </p>
                          <p className={`${styles.status} ${card.content.status}`}>
                            Status: {card.content.status}
                          </p>
                          <Form.Group controlId={`formColumn-${card.id}`}>
                            <Form.Label>Coluna</Form.Label>
                            <Form.Select
                              value={card.column}
                              onChange={(e) => handleColumnChange(card.id, e.target.value)}
                            >
                              {columns.map((col) => (
                                <option key={col.id} value={col.id}>
                                  {col.title}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Card.Body>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className={styles.addColumnButton}
            onClick={addColumn}
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>

      <ColorModal
        isOpen={isColorModalOpen}
        onClose={closeColorModal}
        onSelectColor={handleColorSelect}
      />

      <Modal show={isAddCardModalOpen} onHide={closeAddCardModal}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Novos Cards</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPaciente">
              <Form.Label>Paciente</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do paciente"
                value={newCardData.paciente}
                onChange={(e) =>
                  setNewCardData({ ...newCardData, paciente: e.target.value })
                }
              />
            </Form.Group>

            <h5 className="mt-3">Procedimentos</h5>
            {newCardData.procedimentos.map((proc, index) => (
              <div key={index} className="mb-3 d-flex align-items-end">
                <Form.Group controlId={`formProcedimento-${index}`} className="flex-grow-1 mr-2">
                  <Form.Label>Procedimento {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Buscar procedimento..."
                    value={filtroProcedimento}
                    onChange={(e) => setFiltroProcedimento(e.target.value)}
                  />
                  <Form.Select
                    value={proc.procedimento}
                    onChange={(e) => updateProcedimento(index, "procedimento", e.target.value)}
                    className="mt-2"
                  >
                    {procedimentosDisponiveis
                      .filter((p) =>
                        p.ProcedureName &&
                        p.ProcedureName.toLowerCase().includes(filtroProcedimento.toLowerCase())
                      )
                      .map((p) => (
                        <option key={p.id} value={p.ProcedureName}>
                          {p.ProcedureName}
                        </option>
                      ))}
                  </Form.Select>

                </Form.Group>

                <Form.Group
                  controlId={`formColuna-${index}`}
                  className="flex-grow-1 mr-2"
                >
                  <Form.Label>Coluna</Form.Label>
                  <Form.Control
                    as="select"
                    value={proc.columnId}
                    onChange={(e) =>
                      updateProcedimento(index, "columnId", parseInt(e.target.value))
                    }
                  >
                    {columns.map((column) => (
                      <option key={column.id} value={column.id}>
                        {column.title}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                {newCardData.procedimentos.length > 1 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeProcedimento(index)}
                    className="mt-2"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="outline-primary"
              size="sm"
              onClick={addNewProcedimento}
              className="mt-2"
            >
              Adicionar outro procedimento
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddCardModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleAddCard}>
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;