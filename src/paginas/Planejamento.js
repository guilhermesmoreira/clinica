import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Planejamento.module.css";
import SidebarPlanejamento from "../components/SidebarPlanejamento/SidebarPlanejamento";
import Column from "../components/Column/Column";
import Topbar from "../components/Topbar/Topbar";
import ModalAddCard from "../components/ModalAddCard/ModalAddCard";
import { subDays, addDays } from "date-fns";
import axios from "axios";
import useProcedimentos from "../hooks/useProcedimentos";

const colunasFixas = [
  { id: "col1", title: "Etapa 1", color: "#f5f5f5" },
  { id: "col2", title: "Etapa 2", color: "#e0e0e0" },
  { id: "col3", title: "Etapa 3", color: "#d0d0d0" },
  { id: "col4", title: "Etapa 4", color: "#bfbfbf" },
  { id: "col5", title: "Etapa 5", color: "#afafaf" },
];

const Planejamento = () => {
  const [state, handlers] = useProcedimentos();
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [cardsDistribuidos, setCardsDistribuidos] = useState({});
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pacienteId = params.get("pacienteId");
    if (pacienteId) {
      // Como não há GET /pacientes/{id}, buscamos por nome ou usamos estado
      axios
        .get(`http://localhost:8000/pacientes`, {
          params: { nome: "" }, // Nome vazio para buscar todos ou ajustar com outro critério
        })
        .then((response) => {
          const paciente = response.data.find((p) => p.PatientId === pacienteId);
          if (paciente) {
            setPacienteSelecionado(paciente);
            handlers.setNewCardData({
              ...state.newCardData,
              paciente: paciente.Name,
              pacienteId: paciente.PatientId,
            });
          } else {
            alert("Paciente não encontrado.");
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar paciente:", err);
          alert("Erro ao carregar dados do paciente.");
        });
    }
  }, [location, handlers, state.newCardData]);

  const handleSalvar = async () => {
    const todosCards = Object.entries(cardsDistribuidos).flatMap(([colunaId, cards]) => {
      return cards.map((card) => ({ ...card, columnId: colunaId }));
    });

    // Salvamento local, já que não há POST /planejamento
    handlers.setCards([...state.cards, ...todosCards]);
    alert("Planejamento salvo localmente!");
  };

  return (
    <div className={styles.planejamentoContainer}>
      <Topbar
        selectedDate={state.selectedDate}
        setSelectedDate={state.setSelectedDate}
        fromDate={state.fromDate}
        setFromDate={state.setFromDate}
        toDate={state.toDate}
        setToDate={state.setToDate}
        balanceData={state.balanceData}
        onAddCard={handlers.openAddCardModal}
      />

      <div className={styles.planejamentoContent}>
        <SidebarPlanejamento
          cards={state.cards}
          cardsDistribuidos={cardsDistribuidos}
          setCardsDistribuidos={setCardsDistribuidos}
          setPacienteSelecionado={setPacienteSelecionado}
        />

        <div className={styles.colunasArea}>
          {colunasFixas.map((col) => (
            <Column
              key={col.id}
              column={col}
              cards={cardsDistribuidos[col.id] || []}
              setCardsDistribuidos={setCardsDistribuidos}
              allCards={state.cards}
              columnId={col.id}
              isPlanejamento
              {...handlers}
            />
          ))}
          <button className={styles.salvarButton} onClick={handleSalvar}>
            Salvar Planejamento
          </button>
        </div>
      </div>

      <ModalAddCard
        {...state}
        {...handlers}
        columns={colunasFixas}
      />
    </div>
  );
};

export default Planejamento;