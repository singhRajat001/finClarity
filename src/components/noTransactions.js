import React from "react";
import transactions from "../assets/transactions.svg";
// import { ColorFactory } from "antd/es/color-picker/color";

function NoTransactions() {
  return (
    <div
      style={{
        backgroundColor: "#e0ffcd",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "96%",
        flexDirection: "column",
        marginBottom: "2rem",
        marginLeft: "2rem",
        marginRight: "2rem",
        borderRadius: "1rem",
        boxShadow: "var(--shadow)",
      }}
    >
      <img src={transactions} style={{ width: "400px", margin: "4rem" }} alt="Oops" />
      <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
        You Have No Transactions Currently......
      </p>
    </div>
  );
}

export default NoTransactions;
