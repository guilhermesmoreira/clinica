import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { addDays, subDays, format } from "date-fns";

export default function useProcedimentos() {
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
      color: "linear-gradient(45deg, #000000, #424242, #000000)", // preto por padrão
    },
  ]);

  const [cards, setCards] = useState([]);
  const [nextCardId, setNextCardId] = useState(1);
  const [nextColumnId, setNextColumnId] = useState(2);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState(null);
  const [procedimentosDisponiveis, setProcedimentosDisponiveis] = useState([]);
  const [filtroProcedimento, setFiltroProcedimento] = useState("");
  const [newCardData, setNewCardData] = useState({
    paciente: "",
    procedimentos: [{ procedimento: "", columnId: 1 }],
  });
  const [nextBatchId, setNextBatchId] = useState(1);
  const [cardPositions, setCardPositions] = useState({});
  const cardRefs = useRef({});

  // Fetch procedimentos
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

  const addColumn = () => {
    setColumns([
      ...columns,
      {
        id: nextColumnId,
        title: `Etapa ${nextColumnId}`,
        color: "linear-gradient(45deg, #000000, #424242, #000000)", // preto padrão
      },
    ]);
    setNextColumnId(nextColumnId + 1);
  };

  const deleteColumn = (columnId) => {
    if (columns.length > 1) {
      setColumns(columns.filter((col) => col.id !== columnId));
      setCards(cards.filter((card) => card.column !== columnId));
    }
  };

  const editColumnTitle = (columnId, newTitle) => {
    setColumns(columns.map((c) => (c.id === columnId ? { ...c, title: newTitle } : c)));
  };

  const changeColumnColor = (columnId, newColor) => {
    setColumns(columns.map((c) => (c.id === columnId ? { ...c, color: newColor } : c)));
  };

  const openColorModal = (columnId) => {
    setCurrentColumnId(columnId);
    setIsColorModalOpen(true);
  };

  const closeColorModal = () => {
    setCurrentColumnId(null);
    setIsColorModalOpen(false);
  };

  const handleColorSelect = (color) => {
    if (currentColumnId) {
      changeColumnColor(currentColumnId, color);
    }
    closeColorModal();
  };

  const openAddCardModal = () => setIsAddCardModalOpen(true);
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
      procedimentos: [...newCardData.procedimentos, { procedimento: "", columnId: columns[0].id }],
    });
  };

  const updateProcedimento = (index, field, value) => {
    const novos = newCardData.procedimentos.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setNewCardData({ ...newCardData, procedimentos: novos });
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
    if (!newCardData.paciente || newCardData.procedimentos.some((p) => !p.procedimento)) {
      alert("Preencha todos os dados.");
      return;
    }
    const currentBatchId = nextBatchId;
    const novosCards = newCardData.procedimentos.map((proc, index) => ({
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

    setCards([...cards, ...novosCards]);
    setNextCardId(nextCardId + novosCards.length);
    setNextBatchId(nextBatchId + 1);
    closeAddCardModal();
  };

  const deleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const toggleEtapa = (cardId, etapaIndex) => {
    setCards(
      cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              content: {
                ...card.content,
                etapas: card.content.etapas.map((etapa, i) =>
                  i === etapaIndex ? { ...etapa, concluida: !etapa.concluida } : etapa
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
  };

  return [
    {
      selectedDate,
      fromDate,
      toDate,
      balanceData,
      columns,
      cards,
      isColorModalOpen,
      isAddCardModalOpen,
      currentColumnId,
      cardRefs,
      cardPositions,
      newCardData,
      procedimentosDisponiveis,
      filtroProcedimento,
    },
    {
      setSelectedDate,
      setFromDate,
      setToDate,
      addColumn,
      deleteColumn,
      editColumnTitle,
      changeColumnColor,
      openColorModal,
      closeColorModal,
      handleColorSelect,
      openAddCardModal,
      closeAddCardModal,
      updateProcedimento,
      removeProcedimento,
      addNewProcedimento,
      handleAddCard,
      deleteCard,
      toggleEtapa,
      handleAgendar,
      handleColumnChange,
      setFiltroProcedimento,
      setCardPositions,
      setNewCardData,
      setCards,
      setCardPositions,
    },
  ];
}
