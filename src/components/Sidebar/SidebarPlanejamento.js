import React, { useEffect } from "react";
import styles from "./SidebarPlanejamento.module.css";

const SidebarPlanejamento = ({ paciente, cardsSidebar, setCardsSidebar }) => {
  useEffect(() => {
    const fetchOrcamentos = async () => {
      if (!paciente) return;

      try {
        // ✅ Intervalo de hoje até 30 dias à frente
        // const hoje = new Date();
        // const trintaDiasDepois = new Date();
        // trintaDiasDepois.setDate(hoje.getDate() + 30);

        // const from = hoje.toISOString().split("T")[0];
        // const to = trintaDiasDepois.toISOString().split("T")[0];

        // ✅ Datas fixas
        const from = "2025-07-01";
        const to = "2025-07-30";

        // ✅ Busca orçamentos
        const response = await fetch(
          `http://localhost:8000/orcamentos?from=${from}&to=${to}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const orcamentosPaciente = data.filter(
            (item) => item.PatientId === paciente.PatientId
          );

          // ✅ Agora cria um card para cada procedimento (não apenas o primeiro)
          const cardsPromises = orcamentosPaciente.flatMap(async (orc) => {
            const detalhesResp = await fetch(
              `http://localhost:8000/orcamento_detalhe?treatment_id=${orc.TreatmentId}`
            );
            const detalhes = await detalhesResp.json();

            if (Array.isArray(detalhes.ProcedureList)) {
              return detalhes.ProcedureList
                .filter((proc) => {
                  const dataProc = new Date(proc.CreateDate);
                  return dataProc >= new Date(from) && dataProc <= new Date(to);
                })
                .map((proc) => ({
                  id: proc.id,
                  content: {
                    pacienteId: paciente.PatientId,
                    paciente: paciente.Name,
                    procedimento: `${proc.OperationDescription} ${proc.Tooth ? `(Dente ${proc.Tooth})` : ""}`,
                    etapas: [],
                    agendamento: { status: "" },
                    saldo: 0,
                    status: "",
                  },
                  connections: [],
                  column: "",
                }));
            }
            return [];
          });

          const nestedCards = await Promise.all(cardsPromises);
          const novosCards = nestedCards.flat();  // Achata o array
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
