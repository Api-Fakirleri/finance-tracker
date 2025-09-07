import { useSelector, useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import styles from "./TransactionsList.module.css";
import TransactionsItem from "../TransactionsItem/TransactionsItem.jsx";
import ButtonAddTransactions from "../ButtonAddTransactions/ButtonAddTransactions.jsx";
import emptyTransaction from "../../images/emptytransaction.webp";
import {
  selectTransactions,
  selectCategories,
  selectTransactionsLoading,
} from "../../redux/transactions/selectors.js";
import {
  deleteTransaction,
  getCategories,
} from "../../redux/transactions/operations.js";
import {
  optimisticDelete,
  revertDelete,
} from "../../redux/transactions/slice.js";
import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";
import AddTransactionModal from "../AddTransactionModal/AddTransactionModal.jsx";
import ModalEditTransaction from "../ModalEditTransaction/ModalEditTransaction.jsx";
import Loader from "../Loader/Loader";

const TransactionsList = ({ setBalance }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectTransactionsLoading);
  const transactions = useSelector(selectTransactions);
  const categories = useSelector(selectCategories);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isEmpty = !transactions || transactions.length === 0;
  const [showTransaction, setShowTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Component mount olduğunda categories'leri yükle
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Categories'leri ID'ye göre map'e çevir
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {});

  // Transactions'ları category name ile birleştir
  const transactionsWithCategories =
    transactions?.map((transaction) => ({
      ...transaction,
      categoryName: categoryMap[transaction.categoryId] || "Unknown Category",
    })) || [];

  useEffect(() => {
    if (!transactions) return;

    const total = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
    setBalance(total);
  }, [transactions, setBalance]);
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleDelete = async (id) => {
    const transactionToDelete = transactions.find((t) => t.id === id);
    if (!transactionToDelete) return;

    dispatch(optimisticDelete(id));

    try {
      await dispatch(deleteTransaction(id)).unwrap();
      iziToast.success({
        title: "Başarılı ✅",
        message: "İşlem silindi",
        position: "topRight",
        timeout: 2000,
        class: "custom-success-toast",
        theme: "dark",
      });
    } catch (error) {
      dispatch(revertDelete({ id, transaction: transactionToDelete }));
      iziToast.error({
        title: "Hata ❌",
        message: error.message || "İşlem silinemedi",
        position: "topRight",
        timeout: 3000,
        class: "custom-error-toast",
        theme: "dark",
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      ) : isMobile ? (
        <div className={styles.mobileContainer}>
          {isEmpty ? (
            <div className={styles.empty}>
              <img src={emptyTransaction} alt="page-not-found" width="240" />
              <p className={styles.emptyTitle}>No transactions yet</p>
              <p className={styles.emptyText}>
                Start by adding your first record.
              </p>
            </div>
          ) : (
            transactionsWithCategories.map((t) => (
              <TransactionsItem
                key={t.id}
                transaction={t}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Comment</th>
                <th>Sum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isEmpty ? (
                <tr>
                  <td colSpan="6">
                    <div className={styles.empty}>
                      <img
                        src={emptyTransaction}
                        alt="page-not-found"
                        width="240"
                      />
                      <p className={styles.emptyTitle}>No transactions yet</p>
                      <p className={styles.emptyText}>
                        Start by adding your first record.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactionsWithCategories.map((t) => (
                  <TransactionsItem
                    key={t.id}
                    transaction={t}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ModalEditTransaction
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
      <ButtonAddTransactions onClick={() => setShowTransaction(true)} />

      {showTransaction && (
        <AddTransactionModal onClose={() => setShowTransaction(false)} />
      )}
    </div>
  );
};

export default TransactionsList;
