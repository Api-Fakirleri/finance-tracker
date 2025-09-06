import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";

import FormButton from "../common/FormButton/FormButton";
import styles from "./EditTransactionForm.module.css";
import { Calendar } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateTransaction } from "../../redux/transactions/operations";
import iziToast from "izitoast";

//Yup schema
const schema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  transactionDate: Yup.date().required("Date is required"),
  comment: Yup.string().max(50, "Comment can be max 50 characters"),
});
const EditTransactionForm = ({ onClose, transaction }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: Math.abs(transaction.amount),
      transactionDate: transaction.transactionDate
        ? new Date(transaction.transactionDate)
        : new Date(), // eğer boşsa bugünün tarihi
      comment: transaction.comment || "",
    },
  });
  //custom submit, yup validate kullanıyor
  const customSubmit = async (data) => {
    data.amount = transaction.type === "INCOME" ? data.amount : 0 - data.amount;
    try {
      await schema.validate(data, { abortEarly: false });
      // dispatch ile API'ye gönder
      dispatch(updateTransaction({ id: transaction.id, data }))
        .unwrap()
        .then(() => {
          // Başarılı toast mesajı
          iziToast.success({
            title: "Başarılı ✅",
            message: "Kaydedildi",
            position: "topRight",
            timeout: 2000,
            class: "custom-success-toast",
            theme: "dark",
          });
          onClose(); // modal kapat
        })
        .catch((err) => {
          // Hata toast mesajı
          iziToast.error({
            title: "Hata ❌",
            message: error.message || "Kayıt başarısız",
            position: "topRight",
            timeout: 3000,
            class: "custom-error-toast",
            theme: "dark",
          });
          console.error("Update failed", err);
        });
    } catch (validationErrors) {
      // Yup hatalarını react-hook-form'a aktar
      validationErrors.inner.forEach((err) => {
        setError(err.path, { type: "manual", message: err.message });
      });
    }
  };

  return (
    <div className={styles.editForm}>
      <div className={styles.modal}>
        <h2>Edit transaction</h2>

        {/* Type Tabs */}
        <div className={styles.tabs}>
          <span
            className={
              transaction.type === "INCOME" ? styles.typeactive : styles.type
            }
          >
            Income
          </span>{" "}
          /
          <span
            className={
              transaction.type === "EXPENSE" ? styles.typeactive : styles.type
            }
          >
            Expense
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(customSubmit)}>
          {transaction.type === "EXPENSE" && (
            <div className={styles.inputRow}>
              <label className={styles.input}>{transaction.categoryName}</label>
            </div>
          )}
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="number"
              placeholder="00.0"
              step="0.01"
              min="0"
              {...register("amount", { valueAsNumber: true })}
            />

            <Controller
              control={control}
              name="transactionDate"
              render={({ field }) => (
                <DatePicker
                  className={styles.date}
                  value={
                    field.value instanceof Date
                      ? field.value
                      : new Date(field.value)
                  }
                  onChange={(date) => field.onChange(date)}
                  dateFormat="yyyy-MM-dd"
                  clearIcon={null}
                  calendarIcon={<Calendar className={styles.calendarIcon} />}
                />
              )}
            />
          </div>
          {errors.amount && (
            <div className={styles.error}>
              <p>{errors.amount.message}</p>
            </div>
          )}
          {errors.transactionDate && (
            <div className={styles.error}>
              <p>{errors.transactionDate.message}</p>
            </div>
          )}

          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="text"
              placeholder="Comment"
              {...register("comment")}
            />
          </div>
          {errors.comment && (
            <div className={styles.error}>
              <p>{errors.comment.message}</p>
            </div>
          )}
          <div className={styles.buttonsWrapper}>
            <FormButton type="submit" text="Save" variant="multiColorButton" />
            <FormButton
              type="button"
              text="Cancel"
              variant="whiteButton"
              handlerFunction={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditTransactionForm;
