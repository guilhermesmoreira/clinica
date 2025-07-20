import React, { useState, forwardRef } from "react";
import { Card } from "react-bootstrap";
import CardDetalhadoModal from "../CardDetalhadoModal/CardDetalhadoModal";
import styles from "../../paginas/Home.module.css";

const CardKanban = forwardRef(({
    card,
    columns,
    setSelectedCard,
    setShowConnectionsModal,
    onStartConnection,
    onEndConnection,
    isDragging,
    dragStartCard,
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

    const handleConnectionStart = (e, side) => {
        e.stopPropagation();
        onStartConnection(card.id, side);
    };

    const handleConnectionEnd = (e, side) => {
        e.stopPropagation();
        onEndConnection(card.id, side);
    };
    return (
        <>
            <Card
                ref={ref}
                className={`${styles.cardCompact} ${
                    card.connections?.length > 0 ? styles['card-connected'] : ''
                } ${styles['card-has-connections']} ${
                    isDragging && dragStartCard === card.id ? styles['card-dragging'] : ''
                }`}
                onClick={() => setShowModal(true)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedCard(card);
                    setShowConnectionsModal(true);
                }}
                style={{ cursor: "pointer", position: "relative" }}
            >
                {/* Bolinha de conexão esquerda */}
                <div
                    className={`${styles.connectionDot} ${styles.connectionDotLeft}`}
                    onMouseDown={(e) => handleConnectionStart(e, 'left')}
                    onMouseUp={(e) => handleConnectionEnd(e, 'left')}
                    title="Conectar entrada"
                />
                
                {/* Bolinha de conexão direita */}
                <div
                    className={`${styles.connectionDot} ${styles.connectionDotRight}`}
                    onMouseDown={(e) => handleConnectionStart(e, 'right')}
                    onMouseUp={(e) => handleConnectionEnd(e, 'right')}
                    title="Conectar saída"
                />
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
