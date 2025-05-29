// src/components/ColorModal.js
import React from "react";
import styles from "../../paginas/Home.module.css";

const ColorModal = ({ isOpen, onClose, onSelectColor }) => {
  if (!isOpen) return null;

  const colors = [
    "linear-gradient(45deg, #4CAF50, #A5D6A7, #4CAF50)",
    "linear-gradient(45deg, #FF5252, #FF8A80, #FF5252)",
    "linear-gradient(45deg, #2196F3, #90CAF9, #2196F3)",
    "linear-gradient(45deg, #FFFFFF, #E0E0E0, #FFFFFF)",
    "linear-gradient(45deg, #000000, #424242, #000000)",
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Escolha uma cor</h3>
        <div className={styles.colorOptions}>
          {colors.map((color, index) => (
            <button
              key={index}
              className={styles.colorButton}
              style={{ background: color }}
              onClick={() => onSelectColor(color)}
            />
          ))}
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ColorModal;
