import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form } from "react-bootstrap";
import { Gear, Plus } from "react-bootstrap-icons";
import { subDays, addDays, format } from "date-fns";
import styles from "./Topbar.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Topbar = ({
  selectedDate,
  setSelectedDate,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  balanceData,
  onAddCard,
}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [nomeBusca, setNomeBusca] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const navigate = useNavigate();

  const handleDateChange = (e) => {
    const dateString = e.target.value;
    const localDate = new Date(dateString + "T00:00:00");
    setSelectedDate(localDate);
    setFromDate(subDays(localDate, 14));
    setToDate(addDays(localDate, 14));
  };

  const handleSearchPaciente = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/pacientes`, {
        params: { nome: nomeBusca },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        const paciente = response.data[0];
        setPacienteSelecionado({
          Name: paciente.Name,
          PatientId: paciente.PatientId,
        });
      } else {
        alert("Paciente não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar paciente:", err);
      alert("Erro ao buscar paciente.");
    }
  };

  const handleConfirmPaciente = () => {
    if (pacienteSelecionado) {
      navigate(`/planejamento?pacienteId=${pacienteSelecionado.PatientId}`);
      setIsSearchModalOpen(false);
      setNomeBusca("");
      setPacienteSelecionado(null);
    }
  };

  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.dateRange}>
          <h3>Período Selecionado:</h3>
          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className={styles.dateInput}
          />
          <div className={styles.dates}>
            <span>{format(fromDate, "dd/MM/yy")}</span>
            <span className={styles.selectedDate}>{format(selectedDate, "dd/MM/yy")}</span>
            <span>{format(toDate, "dd/MM/yy")}</span>
          </div>
        </div>

        <div className={styles.balance}>
          <h3>Saldo:</h3>
          <div className={styles.balanceValues}>
            <p style={{ color: "black" }}>Total: R$ {balanceData.total.toLocaleString()}</p>
            <p style={{ color: "orange" }}>Entradas: R$ {balanceData.entradas.toLocaleString()}</p>
            <p style={{ color: "red" }}>Programado: R$ {balanceData.programado.toLocaleString()}</p>
            <p style={{ color: "blue" }}>Entregue: R$ {balanceData.entregue.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            className={styles.iconButton}
            onClick={() => setIsSearchModalOpen(true)}
          >
            <Plus size={20} />
          </Button>
          <Button variant="secondary" className={styles.iconButton}>
            <Gear size={20} />
          </Button>
        </div>
      </div>

      <Modal
        show={isSearchModalOpen}
        onHide={() => setIsSearchModalOpen(false)}
        dialogClassName={styles.modalOverlay}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Buscar Paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPacienteSearch">
              <Form.Label>Nome do Paciente</Form.Label>
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
              {pacienteSelecionado && (
                <div className="mt-2">
                  <strong>Nome:</strong> {pacienteSelecionado.Name} <br />
                  <strong>ID:</strong> {pacienteSelecionado.PatientId}
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsSearchModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmPaciente}
            disabled={!pacienteSelecionado}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

Topbar.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  setSelectedDate: PropTypes.func.isRequired,
  fromDate: PropTypes.instanceOf(Date).isRequired,
  setFromDate: PropTypes.func.isRequired,
  toDate: PropTypes.instanceOf(Date).isRequired,
  setToDate: PropTypes.func.isRequired,
  balanceData: PropTypes.shape({
    total: PropTypes.number.isRequired,
    entradas: PropTypes.number.isRequired,
    programado: PropTypes.number.isRequired,
    entregue: PropTypes.number.isRequired,
  }).isRequired,
  onAddCard: PropTypes.func.isRequired,
};

export default Topbar;