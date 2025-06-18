import React, { useEffect, useState } from "react";
import styles from "./SidebarPlanejamento.module.css";

const SidebarPlanejamento = ({ paciente, cardsSidebar, setCardsSidebar }) => {
  const [procedimentos, setProcedimentos] = useState([]);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState("");

  useEffect(() => {
    const fetchProcedimentos = async () => {
      try {
        const response = await fetch("http://localhost:8000/procedimentos");
        const data = await response.json();

        if (data && typeof data === 'object') {
          const todosProcedimentos = Object.values(data).flat();
          setProcedimentos(todosProcedimentos);
        } else {
          console.error("Formato inesperado:", data);
          setProcedimentos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar procedimentos:", error);
        setProcedimentos([]);
      }
    };

    fetchProcedimentos();
  }, []);

  const handleAdicionarProcedimento = () => {
    if (!procedimentoSelecionado || !paciente) return;

    const novoCard = {
      id: Date.now(),
      content: {
        pacienteId: paciente.PatientId,
        paciente: paciente.Name,
        procedimento: procedimentoSelecionado,
        etapas: [],
        agendamento: { status: "" },
        saldo: 0,
        status: ""
      },
      column: ""
    };

    setCardsSidebar(prev => [...prev, novoCard]);
    setProcedimentoSelecionado("");
  };

  return (
    <div className={styles.sidebar}>
      <h4>Procedimentos</h4>
      <select
        className={styles.select}
        value={procedimentoSelecionado}
        onChange={(e) => setProcedimentoSelecionado(e.target.value)}
      >
        <option value="">Selecione um procedimento</option>
        {procedimentos.map((proc) => (
          <option key={proc.id} value={proc.ProcedureName}>
            {proc.ProcedureName}
          </option>
        ))}
      </select>

      <button
        className={styles.addButton}
        onClick={handleAdicionarProcedimento}
        disabled={!procedimentoSelecionado}
      >
        Adicionar procedimento
      </button>

      <div className={styles.cardsArea}>
        {cardsSidebar.map(card => (
          <div
            key={card.id}
            className={styles.cardSidebar}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", JSON.stringify(card));
            }}
          >
            <p><strong>Paciente:</strong> {card.content.paciente}</p>
            <p><strong>Procedimento:</strong> {card.content.procedimento}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarPlanejamento;
