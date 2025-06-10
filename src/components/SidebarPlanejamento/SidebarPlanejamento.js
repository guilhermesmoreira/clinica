import React, { useState } from "react";
import styles from "./SidebarPlanejamento.module.css";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

const SidebarPlanejamento = ({ cards = [], cardsDistribuidos, setCardsDistribuidos, setPacienteSelecionado }) => {
  const [nomeBusca, setNomeBusca] = useState("");
  const [paciente, setPaciente] = useState(null);

  const cardsDistribuidosIds = Object.values(cardsDistribuidos || {})
    .flat()
    .map((c) => c.id);

  const cardsDisponiveis = cards.filter((card) => !cardsDistribuidosIds.includes(card.id));

  const handleSearchPaciente = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/pacientes`, {
        params: { nome: nomeBusca },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        const paciente = response.data[0];
        setPaciente({
          Name: paciente.Name,
          PatientId: paciente.PatientId,
        });
        setPacienteSelecionado(paciente);
      } else {
        alert("Paciente não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar paciente:", err);
      alert("Erro ao buscar paciente.");
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.abasContainer}>
        <button className={`${styles.aba} ${styles.ativa}`}>
          Planejamento
        </button>
      </div>
      <div className={styles.listaPacientes}>
        <Form.Group controlId="formPacienteSearch">
          <Form.Label>Buscar Paciente</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Digite o nome do paciente"
              value={nomeBusca}
              onChange={(e) => setNomeBusca(e.target.value)}
            />
            <Button variant="secondary" onClick={handleSearchPaciente}>
              Buscar
            </Button>
          </div>
          {paciente && (
            <div className="mt-2">
              <strong>Nome:</strong> {paciente.Name} <br />
              <strong>ID:</strong> {paciente.PatientId}
            </div>
          )}
        </Form.Group>
        <h3 className="mt-3">Procedimentos Disponíveis</h3>
        {cardsDisponiveis.length === 0 ? (
          <p className={styles.vazio}>Nenhum procedimento disponível</p>
        ) : (
          cardsDisponiveis.map((card) => (
            <div key={card.id} className={styles.paciente}>
              <strong>{card.content.procedimento}</strong>
              <p>{card.content.paciente}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SidebarPlanejamento;