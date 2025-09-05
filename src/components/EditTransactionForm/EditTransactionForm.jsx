import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";

import FormButton from "../common/FormButton/FormButton";
import styles from "./EditTransactionForm.module.css";
import { Calendar } from "lucide-react";

//Yup schema
const schema = Yup.object().shape({
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  transactionDate: Yup.date().required("Date is required"),
  comment: Yup.string().max(50, "Comment can be max 50 characters"),
});
const EditTransactionForm = ({ onClose, transaction }) => {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: transaction.amount,
      transactionDate: transaction.transactionDate
        ? new Date(transaction.transactionDate)
        : new Date(), // eğer boşsa bugünün tarihi
      comment: transaction.comment || "",
    },
  });
  //custom submit, yup validate kullanıyor
  const customSubmit = async (data) => {
    try {
      await schema.validate(data, { abortEarly: false });
      onSubmit(data); // valid data ile callback
    } catch (validationErrors) {
      // Yup hatalarını react-hook-form’a aktar
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
          <div className={styles.inputRow}>
            <input type="text" placeholder="Amount" {...register("amount")} />
            {errors.amount && (
              <p className={styles.error}>{errors.amount.message}</p>
            )}

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
            {errors.transactionDate && (
              <p className={styles.error}>{errors.transactionDate.message}</p>
            )}
          </div>

          <div className={styles.inputRow}>
            <input type="text" placeholder="Comment" {...register("comment")} />
            {errors.comment && (
              <p className={styles.error}>{errors.comment.message}</p>
            )}
          </div>

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
