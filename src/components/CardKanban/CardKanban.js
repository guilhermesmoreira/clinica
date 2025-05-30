import React, { useState, forwardRef } from "react";
import { Card } from "react-bootstrap";
import CardDetalhadoModal from "../CardDetalhadoModal/CardDetalhadoModal";
import styles from "../../paginas/Home.module.css";

const CardKanban = forwardRef(({
    card,
    columns,
    setSelectedCard,
    setShowConnectionsModal,
    ...handlers
}, ref) => {
    const [showModal, setShowModal] = useState(false);

    const status = card.content.agendamento?.status;

    const getStatusConfig = () => {
        switch (status) {
            case "agendar":
                return { color: "danger", icon: "❗" };
            case "agendado":
                return { color: "success", icon: "✅" };
            case "realizado":
                return { color: "secondary", icon: "✔️" }; // ⬅️ Novo ícone
            default:
                return { color: "secondary", icon: "❔" };
        }
    };

    const { icon } = getStatusConfig();

    return (
        <>
            <Card
                ref={ref}
                className={`${styles.cardCompact} ${card.connections?.length > 0 ? styles['card-connected'] : ''
                    } ${styles['card-has-connections']}`}
                onClick={() => setShowModal(true)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedCard(card);
                    setShowConnectionsModal(true);
                }}
                style={{ cursor: "pointer", position: "relative" }}
            >
                <Card.Body>
                    <p><strong>Paciente:</strong> {card.content.paciente}</p>
                    <p><strong>Procedimento:</strong> {card.content.procedimento}</p>

                    {/* Botão de status flutuante */}
                    <div
                        className={`${styles.statusBadge} ${status === "agendar"
                                ? styles.statusAgendar
                                : status === "agendado"
                                    ? styles.statusAgendado
                                    : status === "realizado"
                                        ? styles.statusRealizado
                                        : ""
                            }`}
                    >
                        {icon}
                    </div>

                </Card.Body>
            </Card>

            {showModal && (
                <CardDetalhadoModal
                    card={card}
                    columns={columns}
                    onClose={() => setShowModal(false)}
                    {...handlers}
                />
            )}
        </>
    );
});

export default CardKanban;
