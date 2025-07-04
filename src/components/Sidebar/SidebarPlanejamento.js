import React, { useEffect } from "react";
import styles from "./SidebarPlanejamento.module.css";

const SidebarPlanejamento = ({ paciente, cardsSidebar, setCardsSidebar }) => {
  useEffect(() => {
    const fetchOrcamentos = async () => {
      if (!paciente) return;

      try {
        // ✅ Intervalo de 30 dias
        const hoje = new Date();
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(hoje.getDate() - 30);

        const from = trintaDiasAtras.toISOString().split("T")[0];
        const to = hoje.toISOString().split("T")[0];

        // ✅ Busca orçamentos
        const response = await fetch(
          `http://localhost:8000/orcamentos?from=${from}&to=${to}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const orcamentosPaciente = data.filter(
            (item) => item.PatientId === paciente.PatientId
          );

          const cardsPromises = orcamentosPaciente.map(async (orc) => {
            const detalhesResp = await fetch(
              `http://localhost:8000/orcamento_detalhe?treatment_id=${orc.TreatmentId}`
            );
            const detalhes = await detalhesResp.json();

            const procedimentoPrincipal =
              detalhes.ProcedureList && detalhes.ProcedureList.length > 0
                ? detalhes.ProcedureList[0].OperationDescription || "Procedimento não informado"
                : "Sem procedimentos";

            return {
              id: orc.id,
              content: {
                pacienteId: paciente.PatientId,
                paciente: paciente.Name,
                procedimento: procedimentoPrincipal,
                etapas: [],                  // <-- aqui
                agendamento: { status: "" }, // <-- aqui
                saldo: 0,                    // <-- aqui
                status: "",
              },
              connections: [],
              column: "",
            };
          });

          const novosCards = await Promise.all(cardsPromises);
          setCardsSidebar(novosCards);
        } else {
          console.error("Formato inesperado:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar orçamentos:", error);
      }
    };

    fetchOrcamentos();
  }, [paciente]);

  return (
    <div className={styles.sidebar}>
      <h4>Orçamento:</h4>

      <div className={styles.cardsArea}>
        {cardsSidebar.map((card) => (
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
