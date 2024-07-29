import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [],
  currentCustomer: null,
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(
        (customer) => customer.pan === action.payload.pan
      );
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(
        (customer) => customer.pan !== action.payload
      );
    },
    setCurrentCustomer: (state, action) => {
      state.currentCustomer = action.payload;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
  },
});

export const {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setCurrentCustomer,
  clearCurrentCustomer,
} = customerSlice.actions;

export default customerSlice.reducer;
