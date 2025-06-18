// src/components/Topbar/TopbarPlanejamento.js
import React from "react";
import styles from "./TopbarPlanejamento.module.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TopbarPlanejamento = ({ paciente }) => {
    const navigate = useNavigate();

    const handleSalvar = () => {
        // Placeholder: lógica de salvar planejamento aqui
        console.log("Planejamento salvo!");
        navigate("/");
    };

    return (
        <div className={styles.topbar}>
            <div className={styles.spacer} /> {/* Espaço esquerdo vazio para centralizar */}
            <div className={styles.centerText}>
                <div>
                    <h5 className={styles.title}>Planejamento</h5>
                    {paciente && <h4 className={styles.nome}>Paciente: {paciente.Name}</h4>}
                </div>
            </div>
            <div className={styles.rightButton}>
                <Button variant="success" onClick={handleSalvar}>
                    Salvar
                </Button>
            </div>
        </div>
    );
};

export default TopbarPlanejamento;
