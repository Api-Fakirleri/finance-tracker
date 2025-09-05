import React from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from "react-responsive";
import styles from "./TransactionsItem.module.css";
import EditIcon from "../../images/edit-02.svg";
const TransactionsItem = ({ transaction, onEdit, onDelete }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isIncome = transaction.type === "INCOME";
  const borderClass = isIncome ? styles.incomeBorder : styles.expenseBorder;

  const formatDate = (iso) => {
    const d = new Date(iso);
    // DD.MM.YY
    return d
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
      .replace(/\//g, ".");
  };

  if (isMobile) {
    return (
      <div className={`${styles.mobileCard} ${borderClass}`}>
        <div className={styles.row}>
          <p className={styles.label}>Date</p>
          <div className={styles.value}>
            {formatDate(transaction.transactionDate)}
          </div>
        </div>
        <div className={styles.row}>
          <p className={styles.label}>Type</p>
          <div className={styles.value}>{isIncome ? "+" : "-"}</div>
        </div>
        <div className={styles.row}>
          <p className={styles.label}>Category</p>
          <div className={styles.value}>{transaction.categoryName}</div>
        </div>
        <div className={styles.row}>
          <p className={styles.label}>Comment</p>
          <div className={styles.value}>{transaction.comment || "—"}</div>
        </div>
        <div className={styles.row}>
          <p className={styles.label}>Sum</p>
          <div
            className={`${styles.sum} ${
              isIncome ? styles.income : styles.expense
            }`}
          >
            {Number(transaction.amount).toLocaleString()} ₺
          </div>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.editIcon}
            onClick={() => onEdit?.(transaction)}
            aria-label="Edit"
            title="Edit"
          >
            <img src={EditIcon} alt="Edit" width="14" height="14" />
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => onDelete?.(transaction.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <tr>
      <td>{formatDate(transaction.transactionDate)}</td>
      <td>{isIncome ? "+" : "-"}</td>
      <td>{transaction.categoryName}</td>
      <td>{transaction.comment || "—"}</td>
      <td className={isIncome ? styles.income : styles.expense}>
        {Number(transaction.amount).toLocaleString()} ₺
      </td>
      <td className={styles.tableActions}>
        <button
          type="button"
          className={styles.editIcon}
          onClick={() => onEdit?.(transaction)}
          aria-label="Edit"
          title="Edit"
        >
          ✎
        </button>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={() => onDelete?.(transaction.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

TransactionsItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    transactionDate: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["INCOME", "EXPENSE"]).isRequired,
    categoryName: PropTypes.string.isRequired,
    comment: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default TransactionsItem;
