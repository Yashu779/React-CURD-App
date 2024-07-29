import React, { useState } from "react";
import CustomerList from "./Components/CustomerList ";

import UserDetails from "./Components/UserDetails";
import "./App.css";

const App = () => {
  const [currentCustomer, setCurrentCustomer] = useState("");

  const initialValues = {
    pan: "",
    fullName: "",
    email: "",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    state: "",
    city: "",
  };

  const editCustomer = (customer) => {
    setCurrentCustomer(customer);
  };

  const setEditing = (value) => {
    setCurrentCustomer(value ? initialValues : null);
  };

  return (
    <div>
      <UserDetails
        initialValues={currentCustomer || initialValues}
        isEdit={Boolean(currentCustomer)}
        setEditing={setEditing}
      />
      <CustomerList editCustomer={editCustomer} />
    </div>
  );
};

export default App;
