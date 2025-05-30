// src/components/ModalAddCard.js
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

const ModalAddCard = ({
  isAddCardModalOpen,
  closeAddCardModal,
  newCardData,
  setNewCardData,
  procedimentosDisponiveis,
  filtroProcedimento,
  setFiltroProcedimento,
  updateProcedimento,
  removeProcedimento,
  addNewProcedimento,
  handleAddCard,
  columns,
}) => {
  return (
    <Modal show={isAddCardModalOpen} onHide={closeAddCardModal} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Novos Cards</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPaciente">
            <Form.Label>Paciente</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nome do paciente"
              value={newCardData.paciente}
              onChange={(e) =>
                setNewCardData({ ...newCardData, paciente: e.target.value })
              }
            />
          </Form.Group>

          <h5 className="mt-3">Procedimentos</h5>
          {newCardData.procedimentos.map((proc, index) => (
            <div key={index} className="mb-3 d-flex align-items-end">
              <div className="mb-3 d-flex flex-wrap align-items-end gap-3">
                <Form.Group controlId={`formProcedimento-${index}`} style={{ flex: 2, minWidth: "300px" }}>
                  <Form.Label>Procedimento {index + 1}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Buscar procedimento..."
                    value={filtroProcedimento}
                    onChange={(e) => setFiltroProcedimento(e.target.value)}
                  />
                  <Form.Select
                    value={proc.procedimento}
                    onChange={(e) => updateProcedimento(index, "procedimento", e.target.value)}
                    className="mt-2"
                  >
                    {procedimentosDisponiveis
                      .filter((p) =>
                        p.ProcedureName &&
                        p.ProcedureName.toLowerCase().includes(filtroProcedimento.toLowerCase())
                      )
                      .map((p) => (
                        <option key={p.id} value={p.ProcedureName}>
                          {p.ProcedureName}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId={`formColuna-${index}`} style={{ flex: 1, minWidth: "200px" }}>
                  <Form.Label>Coluna</Form.Label>
                  <Form.Control
                    as="select"
                    value={proc.columnId}
                    onChange={(e) =>
                      updateProcedimento(index, "columnId", parseInt(e.target.value))
                    }
                  >
                    {columns.map((column) => (
                      <option key={column.id} value={column.id}>
                        {column.title}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
              {newCardData.procedimentos.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeProcedimento(index)}
                  className="mt-2"
                >
                  <Trash size={16} />
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="outline-primary"
            size="sm"
            onClick={addNewProcedimento}
            className="mt-2"
          >
            Adicionar outro procedimento
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeAddCardModal}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handleAddCard}>
          Adicionar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddCard;
