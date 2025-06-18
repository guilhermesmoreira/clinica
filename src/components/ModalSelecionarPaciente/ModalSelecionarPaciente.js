// src/components/ModalSelecionarPaciente/ModalSelecionarPaciente.js
import React, { useState } from "react";
import { Modal, Button, Form, ListGroup, Spinner } from "react-bootstrap";

const ModalSelecionarPaciente = ({ show, onHide, onConfirm }) => {
  const [termoBusca, setTermoBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const buscarPacientes = async () => {
    if (!termoBusca.trim()) return;
    setCarregando(true);
    try {
      const res = await fetch(`http://localhost:8000/pacientes?nome=${encodeURIComponent(termoBusca)}`);
      const data = await res.json();
      setResultados(data || []);
    } catch (err) {
      console.error("Erro ao buscar pacientes:", err);
      setResultados([]);
    } finally {
      setCarregando(false);
    }
  };

  const confirmarSelecao = () => {
    if (selecionado) {
      onConfirm(selecionado); // Pai cuida do redirecionamento     
      localStorage.setItem("pacienteSelecionado", JSON.stringify(selecionado)); 
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Selecionar Paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="buscaPaciente">
          <Form.Control
            type="text"
            placeholder="Digite o nome do paciente"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarPacientes()}
          />
        </Form.Group>
        <Button variant="primary" className="mt-2 mb-3" onClick={buscarPacientes}>
          Buscar
        </Button>

        {carregando && <Spinner animation="border" />}

        <ListGroup>
          {resultados.length === 0 && <div className="text-muted">Nenhum paciente encontrado</div>}
          {resultados.map((paciente) => (
            <ListGroup.Item
              key={paciente.PatientId}
              action
              active={selecionado?.PatientId === paciente.PatientId}
              onClick={() => setSelecionado(paciente)}
            >
              {paciente.Name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="success" onClick={confirmarSelecao} disabled={!selecionado}>
          Adicionar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSelecionarPaciente;
