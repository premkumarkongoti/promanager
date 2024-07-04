import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import MyContext from "./Context";
import MessageComponent from "../Message/Message";
import { getTasks, deleteTask, getTaskDescription } from "../../apis/task";
import { copyToClipboard } from "../../utils/helper";
import TaskEditModal from "../EditTask/EditTask";
import LoadingMessage from "../LoadingMessage/LoadingMessage";

function Provider({ children }) {
  const [selectedOption, setSelectedOption] = useState("thisWeek");
  const [tasks, setTasks] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletableTaskId, setDeletableTaskId] = useState("");
  const [message, setMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState({});
  const [checklist, setChecklist] = useState([]);
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
    fetchTaskDetailsById();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const fetchTasks = () => {
    setIsLoading(true);
    getTasks(selectedOption)
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchTaskDetailsById = async () => {
    const taskId = deletableTaskId;

    if (!taskId) return;

    try {
      const response = await getTaskDescription(taskId);
      setTitle(response?.title);
      setPriority(response?.priority);
      setChecklist(response?.checklist);
      setStatus(response?.status);
      setDueDate(response?.dueDate);
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const deleteTaskToast = () => {
    toast.success("Task deleted successfully", {
      duration: 1000,
      position: "top-center",
    });
  };

  const errorDeleteTaskToast = () => {
    toast.error("Internal Server Error", {
      duration: 2000,
      position: "top-center",
    });
  };

  const handleDeleteTask = async () => {
    const response = await deleteTask(deletableTaskId);
    if (response?.success === true) {
      deleteTaskToast();
    } else {
      errorDeleteTaskToast();
    }
    handleCloseDeleteModal();
    fetchTasks();
  };

  const handleClickOnShare = async () => {
    const url = window.location.href;
    try {
      await copyToClipboard(url, deletableTaskId);
      setMessage("Link Copied");
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <MyContext.Provider
      value={{
        tasks,
        fetchTasks,
        selectedOption,
        setSelectedOption,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        handleOpenDeleteModal,
        handleCloseDeleteModal,
        handleDeleteTask,
        deletableTaskId,
        setDeletableTaskId,
        handleClickOnShare,
        handleOpenEditModal,
        title,
        setTitle,
        priority,
        setPriority,
        checklist,
        setChecklist,
        status,
        dueDate,
        setDueDate,
      }}
    >
      {children}
      {message && <MessageComponent message={message} />}
      {isLoading && <LoadingMessage />}
      {isEditModalOpen && (
        <TaskEditModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} />
      )}
    </MyContext.Provider>
  );
}

export default Provider;
