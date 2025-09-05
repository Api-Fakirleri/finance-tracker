import PropTypes from "prop-types";
import styles from "./ModalEditTransaction.module.css";
import EditTransactionForm from "../EditTransactionForm/EditTransactionForm";
import { useEffect } from "react";

const ModalEditTransaction = ({ isOpen, onClose, transaction }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen || !transaction) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeBtn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path d="M1 1L17 17" stroke="#FBFBFB" />
            <path d="M1 17L17 0.999999" stroke="#FBFBFB" />
          </svg>
        </button>

        <EditTransactionForm
          onClose={onClose}
          transaction={transaction}
        ></EditTransactionForm>
      </div>
    </div>
  );
};
ModalEditTransaction.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  transaction: PropTypes.object.isRequired,
};

export default ModalEditTransaction;
