import React from "react";
import styles from "./ActionModal.module.css";

function ActionModal({ name, handleAction, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialogBackdrop}></div>
          <div className={styles.dialogContent}>
            <div className={styles.dialogBox}>
              <p>Are you sure you want to {name}?</p>
              <div className={styles.buttonContainer}>
                <button onClick={handleAction} className={styles.confirmButton}>
                  Yes, {name}
                </button>
                <button className={styles.cancelButton} onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ActionModal;

















