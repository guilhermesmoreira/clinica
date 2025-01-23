import { useState } from "react";
import DesignLogo from "../components/DesignClinica/DesignLogo";
import DesignClinica from "../components/DesignClinica/DesignClinica";
import style from './_clinica.module.css';

const Clinica = () => {
    // Lista de procedimentos disponíveis
    const [procedimentosDisponiveis] = useState([
        "Procedimento 01", 
        "Procedimento 02", 
        "Procedimento 03", 
        "Procedimento A", 
        "Procedimento B",
        "Procedimento C"
    ]);
    
    // Estado para armazenar os procedimentos selecionados nos cards
    const [procedimentosList, setProcedimentosList] = useState([]);
    
    // Estado para armazenar o procedimento selecionado
    const [selectedProcedimento, setSelectedProcedimento] = useState("");
    
    const [pacientesDisponiveis] = useState([
        "Carlos Magno",
        "Napoleão",
        "César",
        "Alexandre",
        "Henrique VIII"
    ]);
    
    // Estado para armazenar os pacientes selecionados nos cards
    const [pacientesList, setPacientesList] = useState([]);

    // Estado para armazenar o paciente selecionado
    const [selectedPaciente, setSelectedPaciente] = useState("");

    // Estado para armazenar os termos de busca
    const [searchPaciente, setSearchPaciente] = useState('');
    const [searchProcedimento, setSearchProcedimento] = useState('');

    // Função para adicionar um novo card
    const addNewCard = () => {
        if (selectedProcedimento && selectedPaciente) {
            // Adiciona o card com paciente e procedimento
            setProcedimentosList([...procedimentosList, selectedProcedimento]);
            setPacientesList([...pacientesList, selectedPaciente]);
        }
    };

    // Função para remover o último card
    const removeLastCard = () => {
        if (procedimentosList.length > 0 && pacientesList.length > 0) {
            setProcedimentosList(procedimentosList.slice(0, -1));
            setPacientesList(pacientesList.slice(0, -1));
        }
    };

    const removeCard = (index) => {
        const newProcedimentosList = [...procedimentosList];
        const newPacientesList = [...pacientesList];

        newProcedimentosList.splice(index, 1);
        newPacientesList.splice(index, 1);

        setProcedimentosList(newProcedimentosList);
        setPacientesList(newPacientesList);
    };

    // Filtra os pacientes com base no termo de busca
    const pacientesFiltrados = pacientesDisponiveis.filter(paciente =>
        paciente.toLowerCase().includes(searchPaciente.toLowerCase())
    );

    // Filtra os procedimentos com base no termo de busca
    const procedimentosFiltrados = procedimentosDisponiveis.filter(procedimento =>
        procedimento.toLowerCase().includes(searchProcedimento.toLowerCase())
    );

    const clearAllSearches = () => {
        setSearchPaciente('');
        setSearchProcedimento('');        
    };

    return (
        <>
            <DesignLogo />
            <div className={style.container}>
                <div className={style.leftColumn}>
                    <a href="/">Home</a>

                    {/* Barra de busca para selecionar o paciente */}
                    <input 
                        type="text" 
                        placeholder="Buscar paciente..." 
                        value={searchPaciente} 
                        onChange={(e) => setSearchPaciente(e.target.value)}
                        className={style.searchInput}
                    />
                    {/* Dropdown para selecionar o paciente */}
                    <select 
                        className={style.selectedPaciente} 
                        value={selectedPaciente} 
                        onChange={(e) => setSelectedPaciente(e.target.value)}
                    >
                        <option value="">Selecione um paciente</option>
                        {pacientesFiltrados.map((paciente, index) => (
                            <option key={index} value={paciente}>
                                {paciente}
                            </option>
                        ))}
                    </select>
                    
                    {/* Barra de busca para selecionar o procedimento */}
                    <input 
                        type="text" 
                        placeholder="Buscar procedimento..." 
                        value={searchProcedimento} 
                        onChange={(e) => setSearchProcedimento(e.target.value)}
                        className={style.searchInput}
                    />
                    {/* Dropdown para selecionar o procedimento */}
                    <select 
                        className={style.selectProcedimento} 
                        value={selectedProcedimento} 
                        onChange={(e) => setSelectedProcedimento(e.target.value)}
                    >
                        <option value="">Selecione um procedimento</option>
                        {procedimentosFiltrados.map((procedimento, index) => (
                            <option key={index} value={procedimento}>
                                {procedimento}
                            </option>
                        ))}
                    </select>

                    {/* Botão para limpar as duas buscas */}
                    <button className={style.clearAllButton} onClick={clearAllSearches}>
                        Limpar Buscas
                    </button>

                    {/* Botões de adicionar e remover card */}
                    <button className={style.addButton} onClick={addNewCard}>
                        Adicionar Card
                    </button>
                    <button className={style.removeButton} onClick={removeLastCard}>
                        Remover Card
                    </button>
                </div>

                <div className={style.rightColumn}>
                    {/* Exibe os cards de pacientes e procedimentos */}
                    {pacientesList.map((paciente, index) => (
                        <DesignClinica 
                            key={index} 
                            paciente={paciente} 
                            procedimento={procedimentosList[index]} // Passando o procedimento correspondente
                            onRemoveCard={() => removeCard(index)} // Passando a função de remoção
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Clinica;
