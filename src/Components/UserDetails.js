import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addCustomer, updateCustomer } from "../Store/customerSlice";
import { CircularProgress } from "@mui/material";

const UserDetails = ({ initialValues, isEdit, setEditing }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [values, setValues] = useState({ ...initialValues, mobile: "+91" });
  const [errors, setErrors] = useState({});

  const validatePan = (pan) => {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panPattern.test(pan) && pan.length === 10;
  };

  const validateMobile = (mobile) => {
    const mobilePattern = /^\+91[0-9]{10}$/;
    return mobilePattern.test(mobile);
  };

  const validatePostcode = (postcode) => {
    const postcodePattern = /^[0-9]{6}$/;
    return postcodePattern.test(postcode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "pan") {
      newValue = value.toUpperCase();
    }

    if (name === "mobile") {
      if (!newValue.startsWith("+91")) {
        newValue = "+91" + newValue.replace(/^(\+91)?/, "");
      }
    }

    setValues({ ...values, [name]: newValue });
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (name === "pan" && validatePan(value)) {
      await verifyPAN(value);
    } else if (name === "postcode" && validatePostcode(value)) {
      await getPostcodeDetails(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!validatePan(values.pan)) validationErrors.pan = "Invalid PAN format";
    if (!values.fullName || values.fullName.length > 140)
      validationErrors.fullName = "Full Name is required";
    if (!validateMobile(values.mobile))
      validationErrors.mobile = "Invalid Mobile Number";
    if (!values.addressLine1)
      validationErrors.addressLine1 = "Address Line 1 is required";
    if (!validatePostcode(values.postcode))
      validationErrors.postcode = "Invalid Postcode format";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isEdit) {
      dispatch(updateCustomer(values));
      setEditing(false);
    } else {
      dispatch(addCustomer(values));
    }
    setValues(initialValues);
  };

  const verifyPAN = async (pan) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://lab.pixel6.co/api/verify-pan.php",
        { panNumber: pan }
      );
      if (response.data.isValid) {
        setValues((prevValues) => ({
          ...prevValues,
          fullName: response.data.fullName,
        }));
      }
    } catch (error) {
      console.error("Error verifying PAN", error);
    }
    setLoading(false);
  };

  const getPostcodeDetails = async (postcode) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://lab.pixel6.co/api/get-postcode-details.php",
        { postcode }
      );
      if (response.data.status === "Success") {
        setValues((prevValues) => ({
          ...prevValues,
          state: response.data.state[0].name,
          city: response.data.city[0].name,
        }));
        setStates(response.data.state);
        setCities(response.data.city);
      }
    } catch (error) {
      console.error("Error fetching postcode details", error);
    }
    setLoading(false);
  };

  return (
    <div className="m-Container">
      <span className="heading-Text">Enter User Details</span>
      <form onSubmit={handleSubmit} className="form-Section">
        <div className="input-Containers">
          <label className="input-Filed">
            Pan
            <input
              name="pan"
              type="text"
              value={values.pan}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={10}
            />
            {loading && <CircularProgress size={20} />}
            {errors.pan && <span className="Error-Warning">{errors.pan}</span>}
          </label>
        </div>
        <div className="input-Containers">
          <label className="input-Filed">
            Full Name
            <input
              name="fullName"
              type="text"
              value={values.fullName}
              onChange={handleChange}
              maxLength={140}
            />
            {errors.fullName && (
              <span className="Error-Warning">{errors.fullName}</span>
            )}
          </label>
        </div>
        <div className="input-Containers">
          <label className="input-Filed">
            Email
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              maxLength={255}
            />
          </label>
        </div>
        <div className="input-Containers">
          <label className="input-Filed">
            Mobile Number
            <div className="mobile-Input-Container">
              <input
                name="mobile"
                type="text"
                value={values.mobile}
                onChange={handleChange}
                placeholder="Mobile Number"
                maxLength={13}
              />
            </div>
            {errors.mobile && (
              <span className="Error-Warning">{errors.mobile}</span>
            )}
          </label>
        </div>
        <div className="input-Containers">
          <label className="input-Filed">
            Address Line 1
            <input
              name="addressLine1"
              type="text"
              value={values.addressLine1}
              onChange={handleChange}
            />
            {errors.addressLine1 && (
              <span className="Error-Warning">{errors.addressLine1}</span>
            )}
          </label>
        </div>
        <div className="input-Containers">
          <label className="input-Filed">
            Address Line 2
            <input
              name="addressLine2"
              type="text"
              value={values.addressLine2}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="input-Containers">
          <label className="input-Filed">
            Postcode
            <input
              name="postcode"
              type="text"
              value={values.postcode}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={6}
            />
            {loading && <CircularProgress size={20} />}
          </label>
        </div>
        <div className="Options-Containers">
          <label>State</label>
          <select name="state" value={values.state} onChange={handleChange}>
            <option>Select State</option>
            {states.map((state) => (
              <option key={state.id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <div className="Options-Containers">
          <label>City</label>
          <select name="city" value={values.city} onChange={handleChange}>
            <option>Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="Button-Container">
          <button type="submit" className="Submit-button">
            {isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetails;
