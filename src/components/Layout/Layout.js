// src/components/Layout.js
import React from "react";
import Topbar from "../Topbar/Topbar";
import Sidebar from "../Sidebar/Sidebar"; // ou SidebarPlanejamento se preferir
import styles from "./Layout.module.css";
import { Outlet } from "react-router-dom";
import { subDays, addDays } from "date-fns";

const Layout = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [fromDate, setFromDate] = React.useState(subDays(new Date(), 14));
  const [toDate, setToDate] = React.useState(addDays(new Date(), 14));

  const balanceData = {
    total: 0,
    entradas: 0,
    programado: 0,
    entregue: 0,
  };

  const onAddCard = () => {}; // pode ser sobrescrito individualmente por página se necessário

  return (
    <div className={styles.layoutContainer}>
      <Topbar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        balanceData={balanceData}
        onAddCard={onAddCard}
      />
      <div className={styles.body}>
        <Sidebar />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
