import React, { useState } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = ({ cards }) => {
    const [abaSelecionada, setAbaSelecionada] = useState("agendado");

    const handleClick = (aba) => {
        setAbaSelecionada(aba);
    };

    // Filtrar os cards de acordo com o status da aba
    const pacientesFiltrados = cards.filter(
        (card) => card.content.agendamento?.status === abaSelecionada
    );

    return (
        <div className={styles.sidebar}>
            <div className={styles.abasContainer}>
                <button
                    className={`${styles.aba} ${abaSelecionada === "agendado" ? styles.ativa : ""}`}
                    onClick={() => handleClick("agendado")}
                >
                    Agendado
                </button>
                <button
                    className={`${styles.aba} ${abaSelecionada === "agendar" ? styles.ativa : ""}`}
                    onClick={() => handleClick("agendar")}
                >
                    Agendar
                </button>
            </div>

            <div className={styles.listaPacientes}>
                {pacientesFiltrados.length === 0 ? (
                    <p className={styles.vazio}>Nenhum paciente</p>
                ) : (
                    pacientesFiltrados.map((card) => (
                        <div key={card.id} className={styles.paciente}>
                            {card.content.paciente || "Paciente sem nome"}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Sidebar;
