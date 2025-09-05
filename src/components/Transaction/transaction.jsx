import { useState, useEffect, useMemo } from "react";
import { X, Calendar } from "lucide-react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import styles from "./transaction.module.css";
import FormButton from "../common/FormButton/FormButton";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction, getCategories } from "../../redux/transactions/operations";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function AddTransactionModal({ onClose }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.transactions.categories) || [];

  const [type, setType] = useState("income"); // "income" | "expense"
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [comment, setComment] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Mount'ta bir kez kategorileri çek
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Gider listesi
  const expenseCategories = useMemo(() => {
    return categories.filter(
      (c) => String(c?.type || "").toUpperCase() === "EXPENSE"
    );
  }, [categories]);

  // Income için hazıra al (varsa)
  const incomeDefaultId = useMemo(() => {
    const income = categories.find(
      (c) => String(c?.type || "").toUpperCase() === "INCOME"
    );
    return income?.id || "";
  }, [categories]);

  async function ensureIncomeCategoryId() {
    // Önce eldeki listeyi dene
    if (incomeDefaultId && UUID_RE.test(incomeDefaultId)) return incomeDefaultId;

    // Değilse taze çek ve tekrar bul
    const action = await dispatch(getCategories());
    const fresh =
      action?.payload && Array.isArray(action.payload)
        ? action.payload
        : categories;

    const income = fresh.find(
      (c) => String(c?.type || "").toUpperCase() === "INCOME"
    );
    if (!income?.id || !UUID_RE.test(income.id)) {
      throw new Error(
        "Income kategorisi bulunamadı ya da geçersiz. Lütfen en az bir gelir kategorisi oluşturun."
      );
    }
    return income.id;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const raw = parseFloat(amount);
    if (!raw || raw <= 0) return;

    // YYYY-MM-DD formatı
    const transactionDate =
      date instanceof Date
        ? date.toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);

    // İşaret
    const signedAmount = type === "expense" ? -Math.abs(raw) : Math.abs(raw);

    try {
      setSubmitting(true);

      let categoryIdToSend;

      if (type === "expense") {
        if (!selectedCategoryId || !UUID_RE.test(selectedCategoryId)) {
          alert("Please select a valid expense category.");
          setSubmitting(false);
          return;
        }
        categoryIdToSend = selectedCategoryId;
      } else {
        // income → kategori zorunlu: ilk INCOME kategorisini garanti et
        categoryIdToSend = await ensureIncomeCategoryId();
      }

      const payload = {
        transactionDate,
        type: type === "income" ? "INCOME" : "EXPENSE",
        amount: signedAmount,
        comment: comment.trim() || undefined,
        categoryId: categoryIdToSend, // 👈 her iki tipte de UUID garanti
      };

      // Debug istersen:
      // console.log("Sending payload:", payload);

      await dispatch(addTransaction(payload));

      // Temizlik
      setAmount("");
      setComment("");
      setDate(new Date());
      setType("income");
      setSelectedCategoryId("");
      setSubmitting(false);

      onClose();
    } catch (err) {
      console.error(err);
      alert(
        err?.message ||
          "Transaction could not be added. Please check category and try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Close Button */}
        <button onClick={onClose} className={styles.closeBtn}>
          <X size={20} />
        </button>

        <h2 className={styles.title}>Add Transaction</h2>

        {/* Income / Expense Toggle */}
        <div
          className={styles.toggle}
          onClick={() => setType(type === "income" ? "expense" : "income")}
          role="button"
          aria-label="Toggle income / expense"
        >
          <div
            className={`${styles.slider} ${
              type === "expense" ? styles.expense : ""
            }`}
          ></div>
          <span className={styles.toggleLabel}>Income</span>
          <span className={styles.toggleLabel}>Expense</span>
        </div>

        {/* Expense Category Select */}
        {type === "expense" && (
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className={styles.select}
            required
          >
            <option value="" disabled hidden>
              Select a category
            </option>
            {expenseCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
              step="0.01"
              min="0"
              required
            />

            <div className={styles.dateWrapper}>
              <DatePicker
                value={date}
                onChange={setDate}
                className="custom-datepicker"
                calendarClassName={styles.calendar}
                clearIcon={null}
                calendarIcon={<Calendar className={styles.calendarIcon} />}
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.comment}
          />

          {/* Buttons */}
          <div className={styles.buttons}>
            <FormButton
              type="submit"
              text={submitting ? "Adding..." : "Add"}
              variant="multiColorButton"
              disabled={submitting}
            />
            <FormButton
              type="button"
              text="Cancel"
              variant="whiteButton"
              handlerFunction={onClose}
              disabled={submitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}