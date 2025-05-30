import React, { useState } from "react";
import axios from "axios";
import styles from "./BuscaPaciente.module.css"; // você pode personalizar o CSS

const BuscaPaciente = ({ onPacienteSelecionado }) => {
  const [nome, setNome] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [erro, setErro] = useState("");

  const buscarPaciente = async () => {
    try {
      const response = await axios.get(
        `https://api.clinicorp.com/rest/v1/patient/get`,
        {
          params: {
            subscriber_id: "teharicr",
            Name: nome,
          },
        }
      );

      if (response.data.length > 0) {
        const pacienteEncontrado = response.data[0];
        setPaciente(pacienteEncontrado);
        onPacienteSelecionado(pacienteEncontrado); // envia dados para o componente pai
        setErro("");
      } else {
        setPaciente(null);
        setErro("Paciente não encontrado.");
      }
    } catch (error) {
      setErro("Erro ao buscar paciente.");
      setPaciente(null);
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Digite o nome do paciente"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className={styles.input}
      />
      <button onClick={buscarPaciente} className={styles.botao}>
        Buscar
      </button>

      {paciente && (
        <div className={styles.resultado}>
          <p><strong>ID:</strong> {paciente.PatientId}</p>
          <p><strong>Nome:</strong> {paciente.Name}</p>
        </div>
      )}

      {erro && <p className={styles.erro}>{erro}</p>}
    </div>
  );
};

export default BuscaPaciente;
