import React, { useState, useRef } from "react";
import { Button } from "react-bootstrap";
import styles from "./Home.module.css";
import Topbar from "../components/Topbar/Topbar";
import useProcedimentos from "../hooks/useProcedimentos";
import Column from "../components/Column/Column";
import ModalAddCard from "../components/ModalAddCard/ModalAddCard";

import ColorModal from "../components/ColorModal/ColorModal";

const Home = () => {
  const [state, handlers] = useProcedimentos(); // hook com lógica de estado e eventos
  const containerRef = useRef(null);

  return (
    <div className={styles.container}>
      <Topbar
        selectedDate={state.selectedDate}
        setSelectedDate={handlers.setSelectedDate}
        fromDate={state.fromDate}
        setFromDate={handlers.setFromDate}
        toDate={state.toDate}
        setToDate={handlers.setToDate}
        balanceData={state.balanceData}
        onAddCard={handlers.openAddCardModal}
      />

      <div className={styles.content}>
        <div className={styles.columnsContainer} ref={containerRef}>
          {/* SVG das conexões entre cards */}
          {/* ... */}

          <div className={styles.columns}>
            {state.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                cards={state.cards}
                cardRefs={state.cardRefs}
                columns={state.columns}    
                handleColumnChange={handlers.handleColumnChange} 
                deleteColumn={handlers.deleteColumn}
                editColumnTitle={handlers.editColumnTitle}
                openColorModal={handlers.openColorModal}
                deleteCard={handlers.deleteCard}
                toggleEtapa={handlers.toggleEtapa}
                handleAgendar={handlers.handleAgendar}
              />

            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className={styles.addColumnButton}
            onClick={handlers.addColumn}
          >
            +
          </Button>
        </div>
      </div>

      <ColorModal
        isOpen={state.isColorModalOpen}
        onClose={handlers.closeColorModal}
        onSelectColor={handlers.handleColorSelect}
      />

      <ModalAddCard
        {...state}
        {...handlers}
        columns={state.columns} // ✅ adiciona isso explicitamente
      />

    </div>
  );
};

export default Home;
