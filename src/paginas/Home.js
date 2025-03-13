import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Plus, Trash } from "react-bootstrap-icons";
import { addDays, subDays } from "date-fns";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./Home.module.css";
import Topbar from "../components/Topbar/Topbar";

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
    { id: 1, title: "Coluna 1", color: "linear-gradient(45deg, #f3f4f6, #e5e7eb, #f3f4f6)" }, // Gradiente inicial
  ]);
  const [cards, setCards] = useState([]);
  const [nextCardId, setNextCardId] = useState(1);
  const [nextColumnId, setNextColumnId] = useState(2);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState(null);

  const updateDateRange = (newSelectedDate) => {
    setSelectedDate(newSelectedDate);
    setFromDate(subDays(newSelectedDate, 14));
    setToDate(addDays(newSelectedDate, 14));
  };

  const handleSelectedDateChange = (date) => {
    updateDateRange(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const addColumn = () => {
    setColumns([
      ...columns,
      { id: nextColumnId, title: `Coluna ${nextColumnId}`, color: "linear-gradient(45deg, #f3f4f6, #e5e7eb, #f3f4f6)" }, // Gradiente inicial
    ]);
    setNextColumnId(nextColumnId + 1);
  };

  const deleteColumn = (columnId) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja deletar esta coluna?"
    );
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

  const addCard = (columnId) => {
    const newCard = {
      id: nextCardId,
      column: columnId,
      content: {
        ID: "200000",
        paciente: "Nome do paciente",
        procedimento: "Procedimento (Como é visto na tabela de procedimentos)",
        etapas: [
          { etapa: "Etapa 1 [30min]", concluida: false },
          { etapa: "Etapa 2 [45min]", concluida: false },
        ],
        agendamento: {
          agendar: "Agendar",
          proximoAgendado: "20/01/25",
        },
        saldo: "R$ 2000/3000",
        status: "verde",
      },
    };

    setCards([...cards, newCard]);
    setNextCardId(nextCardId + 1);
  };

  const deleteCard = (cardId) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja deletar este card?"
    );
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
                  index === etapaIndex
                    ? { ...etapa, concluida: !etapa.concluida }
                    : etapa
                ),
              },
            }
          : card
      )
    );
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const card = cards.find((card) => card.id.toString() === draggableId);
    const newCards = cards.filter((card) => card.id.toString() !== draggableId);

    const updatedCard = { ...card, column: parseInt(destination.droppableId) };
    newCards.splice(destination.index, 0, updatedCard);

    setCards(newCards);
  };

  const ColorModal = ({ isOpen, onClose, onSelectColor }) => {
    if (!isOpen) return null;

    const colors = [
      "linear-gradient(45deg, #4CAF50, #A5D6A7, #4CAF50)", // Verde Metálico
      "linear-gradient(45deg, #FF5252, #FF8A80, #FF5252)", // Vermelho Metálico
      "linear-gradient(45deg, #2196F3, #90CAF9, #2196F3)", // Azul Metálico
      "linear-gradient(45deg, #FFFFFF, #E0E0E0, #FFFFFF)", // Branco Metálico
      "linear-gradient(45deg, #000000, #424242, #000000)", // Preto Metálico
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
        onAddCard={() => addCard(columns[0].id)}
      />

      <div className={styles.content}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={styles.columnsContainer}>
            <div className={styles.columns}>
              {columns.map((column) => (
                <Droppable key={column.id} droppableId={column.id.toString()}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={styles.column}
                      style={{ background: column.color }} // Aplica o gradiente
                    >
                      <div className={styles.columnHeader}>
                        <input
                          type="text"
                          value={column.title}
                          onChange={(e) => editColumnTitle(column.id, e.target.value)}
                          className={`${styles.columnTitleInput} ${
                            column.color.includes("#000000") ? styles.whiteText : ""
                          }`} // Condicional para texto branco
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
                          .map((card, index) => (
                            <Draggable
                              key={card.id}
                              draggableId={card.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Card className={styles.card}>
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
                                        <strong>Paciente:</strong>{" "}
                                        {card.content.paciente}
                                      </p>
                                      <p>
                                        <strong>Procedimento:</strong>{" "}
                                        {card.content.procedimento}
                                      </p>
                                      <div className={styles.etapas}>
                                        <strong>Etapas:</strong>
                                        {card.content.etapas.map(
                                          (etapa, index) => (
                                            <div key={index}>
                                              <input
                                                type="checkbox"
                                                checked={etapa.concluida}
                                                onChange={() =>
                                                  toggleEtapa(card.id, index)
                                                }
                                              />
                                              {etapa.etapa}
                                            </div>
                                          )
                                        )}
                                      </div>
                                      <p>
                                        <strong>Agendamento:</strong>{" "}
                                        {card.content.agendamento.agendar}
                                      </p>
                                      <p>
                                        <strong>Próximo agendado:</strong>{" "}
                                        {
                                          card.content.agendamento
                                            .proximoAgendado
                                        }
                                      </p>
                                      <p>
                                        <strong>Saldo:</strong>{" "}
                                        {card.content.saldo}
                                      </p>
                                      <p
                                        className={`${styles.status} ${card.content.status}`}
                                      >
                                        Status: {card.content.status}
                                      </p>
                                    </Card.Body>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
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
        </DragDropContext>
      </div>

      <ColorModal
        isOpen={isColorModalOpen}
        onClose={closeColorModal}
        onSelectColor={handleColorSelect}
      />
    </div>
  );
};

export default Home;