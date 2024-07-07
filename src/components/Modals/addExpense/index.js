import React, { useState } from "react";
import "./style.css";

function AddExpenses({ isExpenseVisible, handleExpenseCancel, onFinish }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [tag, setTag] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = { name, amount, date, tag };
    onFinish(values, "expense");
    // Reset fields
    setName("");
    setAmount("");
    setDate("");
    setTag("");
  };

  if (!isExpenseVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add Expense</h2>
        <form className="expense-form" onSubmit={handleSubmit}>
          <div className="form-item">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-item">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-item">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-item">
            <label className="form-label">Tag</label>
            <select
              className="form-input"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
            >
              <option value="">Select a tag</option>
              <option value="food">Food</option>
              <option value="education">Education</option>
              <option value="office">Office</option>
              {/* Add more tags here */}
            </select>
          </div>
          <div className="form-item">
            <button type="submit" className="form-button">
              Add Expense
            </button>
          </div>
        </form>
        <button className="modal-close-button" onClick={handleExpenseCancel}>
          Close
        </button>
      </div>
    </div>
  );
}

export default AddExpenses;
