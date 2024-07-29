import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCustomer } from "../Store/customerSlice";

const CustomerList = ({ editCustomer }) => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.customers);

  const handleDelete = (pan) => {
    dispatch(deleteCustomer(pan));
  };

  return (
    <div className={`List-Container ${customers.length === 0 ? "empty" : ""}`}>
      {customers.length > 0 && (
        <span className="heading-Text">Customer List</span>
      )}
      <div className="customer-list-container">
        {customers.length > 0 && (
          <div className="User-Labels">
            <span className="List-Labels">User Name</span>
            <span className="List-Labels">User Pan</span>
            <span className="List-Labels">User Email</span>
            <span className="List-Labels">User Mobile Number</span>
          </div>
        )}
        {customers.map((customer) => (
          <div key={customer.pan} className="User-Details-Data">
            <div className="User-Labels">
              <span className="List-Labels">{customer.fullName}</span>
              <span className="List-Labels">{customer.pan}</span>
              <span className="List-Labels">{customer.email}</span>
              <span className="List-Labels">{customer.mobile}</span>

              <button
                onClick={() => editCustomer(customer)}
                className="Buttons"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(customer.pan)}
                className="Buttons"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;
