import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Plus, Trash } from "react-bootstrap-icons"; // Importando ícones do Bootstrap
import { addDays, subDays } from "date-fns";
import styles from "./Home.module.css";
import Topbar from "../components/Topbar/Topbar";

const Home = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fromDate, setFromDate] = useState(subDays(new Date(), 14));
    const [toDate, setToDate] = useState(addDays(new Date(), 14));
    
    const [balanceData, setBalanceData] = useState({
      total: 15000,
      entradas: 8000,
      programado: 12000,
      entregue: 5000,
    });
  
    const [columns, setColumns] = useState([{ id: 1, cards: [] }]);
    const [cards, setCards] = useState([]);
    const [nextCardId, setNextCardId] = useState(1);
    const [nextColumnId, setNextColumnId] = useState(2);
  
    const addColumn = () => {
      setColumns([...columns, { id: nextColumnId, cards: [] }]);
      setNextColumnId(nextColumnId + 1);
    };
  
    const deleteColumn = (columnId) => {
      if (columns.length > 1) { // Impede a deleção da última coluna
        setColumns(columns.filter((column) => column.id !== columnId));
      }
    };
  
    return (
      <div className={styles.container}>
        <Topbar 
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          balanceData={balanceData}
        />
        
        <div className={styles.content}>
          <div className={styles.columnsContainer}>
            <div className={styles.columns}>
              {columns.map((column) => (
                <div key={column.id} className={styles.column}>
                  <div className={styles.columnHeader}>
                    <h3>Coluna {column.id}</h3>
                    {columns.length > 1 && ( // Só exibe o botão de deletar se houver mais de uma coluna
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteColumn(column.id)}
                        className={styles.deleteButton}
                      >
                        <Trash size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className={styles.cards}>
                    {cards.filter((card) => card.column === column.id).map((card) => (
                      <Card key={card.id} className={styles.card}>
                        <Card.Body>
                          <p>{card.content}</p>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className={styles.addColumnButton}
              onClick={addColumn}
            >
              <Plus size={20} />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Home;