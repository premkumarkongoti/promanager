import React, { useState } from "react";
import styles from "./addPeopleModal.module.css";
import { Modal } from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import newRequest from "../../utils/newRequest";
import { updateUser } from "../../redux/userSlice";

export const AddPeopleModal = ({
  openAddPeopleModal,
  setOpenAddPeopleModal,
  open,
  close,
  opened,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [compToShow, setCompToShow] = useState(0);
  const [updatedUser, setUpdatedUser] = useState();

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleAddPeople = async (e) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Email is required!");
      return;
    }

    if (email === currentUser.email) {
      setError("Yours and assignee email cannot be same!");
      return;
    }

    try {
      const res = await newRequest.put("user/assignee", { email });
      setUpdatedUser(res?.data);
      setCompToShow((prev) => 1);
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message);
    }
  };

  const handleCloseModal = () => {
    setEmail("");
    setError("");
    close();
    setCompToShow(0);
    dispatch(updateUser(updatedUser));
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      closeOnClickOutside={false}
      withCloseButton={false}
      centered
      padding={"2rem"}
    >
      {compToShow === 0 ? (
        <div className={styles.addPeopleContainer}>
          <p className={styles.heading}>Add people to the board</p>

          <form onSubmit={handleAddPeople}>
            <input
              type="email"
              placeholder="Enter email"
              className={styles.addEmailInput}
              onChange={(e) => setEmail(e.target.value)}
            />

            <p className={styles.error}>{error}</p>

            <div className={styles.btns}>
              <button
                onClick={close}
                type="button"
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={styles.addEmailBtn}>
                Add Email
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.addPeopleContainer}>
          <p className={styles.heading} style={{ textAlign: "center" }}>
            {email} added to board!
          </p>

          <div className={styles.btns}>
            <button onClick={handleCloseModal} className={styles.addEmailBtn}>
              Okay, Got it
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};