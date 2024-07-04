import React, { useContext, useEffect, useState } from "react";
import styles from "./Board.module.css";
import StatusBoard from "../Status/Status";
import { getUserInfo, getCurrentDate } from "../../utils/helper";
import MyContext from "../ContextApi/Context"; 
import ActionModal from "../ActionModal/ActionModal";

const TaskBoard = () => {
  const [pageInfo, setPageInfo] = useState({
    username: "",
    date: "",
  });
  
  const {
    tasks,
    fetchTasks,
    selectedOption,
    setSelectedOption,
    isDeleteModalOpen,
    handleCloseDeleteModal,
    handleDeleteTask,
  } = useContext(MyContext);

  useEffect(() => {
    const userInfo = getUserInfo();
    const todayDate = getCurrentDate();
    setPageInfo({ username: userInfo, date: todayDate });
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [selectedOption]);

  return (
    <div className={styles.boardContainer}>
      <header className={styles.header}>
        <p className={styles.welcomeMessage}>Welcome! {pageInfo.username}</p>
        <p className={styles.currentDate}>{pageInfo.date}</p>
      </header>
      
      <section className={styles.filterSection}>
        <h1 className={styles.boardTitle}>Board</h1>
        <select
          value={selectedOption}
          className={styles.filterDropdown}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="thisWeek">This week</option>
          <option value="thisMonth">This month</option>
        </select>
      </section>
      
      <div className={styles.taskColumns}>
        {["backlog", "todo", "progress", "done"].map((status) => (
          <StatusBoard
            key={status}
            status={status}
            heading={status.charAt(0).toUpperCase() + status.slice(1)}
            plusBtn={status === "todo"}
            tasks={tasks?.filter((task) => task.status === status)}
          />
        ))}
      </div>
      
      <ActionModal
        name="Delete"
        handleAction={handleDeleteTask}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
      />
    </div>
  );
};

export default TaskBoard;
