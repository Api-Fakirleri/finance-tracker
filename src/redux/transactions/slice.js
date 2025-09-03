import { createSlice } from "@reduxjs/toolkit";
import {
  getTransactions,
  deleteTransaction,
  addTransaction,
  updateTransaction,
  getCategories,
} from "./operations";

const initialState = {
  items: [],
  categories: [],
  loading: false,
  error: null,
  deletingIds: [], // Silinmekte olan transaction ID'leri
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic delete - hemen UI'dan kaldır
    optimisticDelete: (state, action) => {
      const id = action.payload;
      state.deletingIds.push(id);
      state.items = state.items.filter((item) => item.id !== id);
    },
    // Delete başarısızsa geri ekle
    revertDelete: (state, action) => {
      const { id, transaction } = action.payload;
      state.deletingIds = state.deletingIds.filter((delId) => delId !== id);
      if (transaction) {
        state.items.push(transaction);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Transactions
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch transactions";
      })
      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to fetch categories";
      })
      // Add Transaction
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add transaction";
      })
      // Update Transaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update transaction";
      })
      // Delete Transaction (optimistic, burada sadece cleanup)
      .addCase(deleteTransaction.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        const id = action.payload.id;
        state.deletingIds = state.deletingIds.filter((delId) => delId !== id);
        state.error = null;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete transaction";
        // revertDelete action'ı component tarafından dispatch edilecek
      });
  },
});

export const { clearError, optimisticDelete, revertDelete } =
  transactionsSlice.actions;
export const transactionsReducer = transactionsSlice.reducer;
