import React, { useState } from "react";
import "./AddIncome.css";

function AddIncomes({ isIncomeVisible, handleIncomeCancel, onFinish }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [tag, setTag] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = { name, amount, date, tag };
    onFinish(values, "income");
    // Reset fields
    setName("");
    setAmount("");
    setDate("");
    setTag("");
  };

  if (!isIncomeVisible) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add Income</h2>
        <form className="income-form" onSubmit={handleSubmit}>
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
              <option value="salary">Salary</option>
              <option value="freelance">Freelance</option>
              <option value="investment">Investment</option>
              {/* Add more tags here */}
            </select>
          </div>
          <div className="form-item">
            <button type="submit" className="form-button">
              Add Income
            </button>
          </div>
        </form>
        <button className="modal-close-button" onClick={handleIncomeCancel}>
          Close
        </button>
      </div>
    </div>
  );
}

export default AddIncomes;
