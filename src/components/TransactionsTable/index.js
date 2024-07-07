import { useState } from "react";
import React from "react";
import { Radio, Select, Table } from "antd";
// import { Input} from "antd";
// const { Search } = Input;
import searchImg from "../../assets/search.svg";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";
// import "./style.css";
const { Option } = Select;

function TransactionsTable({
  transactions,
  addTransaction,
  fetchTransactions,
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [sortKey, setSortKey] = useState();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let filteredTransactions = transactions
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        item.type.includes(typeFilter) &&
        item.mode.includes(modeFilter)
    )
    .map((item, index) => ({
      ...item,
      key: item.id || index, // Ensure each transaction has a unique key
    }));

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else if (sortKey === "mode") {
      return a.mode.localeCompare(b.mode);
    } else {
      return 0;
    }
  });

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          // console.log("Results>>>", results);
          // Now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            // Write each transaction to Firebase, you can use the addTransaction function here
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      // toast.error(e.message);
    }
  }

  function exportToCsv() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag", "mode"],
      data: transactions,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return (
    <div
      style={{
        width: "92%",
        // padding:"0rem 2rem"
        padding: "0rem 2rem",
        boxShadow: "1px 1px 15px 2px #33FF33",
        borderRadius: "0.5rem",
        margin: "2rem",
        flex: "1",
        backgroundColor: "#e0ffcd",

        // box-shadow: var(--shadow);
        // min-width: 350px;
        // border-radius: 0.5rem;
        // margin: 1rem,
        // /* font-family: "Montserrat", sans-serif; */
        // flex: 1
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
          width: "100%",
        }}
      >
        <div className="input-flex" style={{ marginTop: "2rem" }}>
          <img src={searchImg} width="16" alt="oops" />
          <input
            // value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            style={{ backgroundColor: "#e0ffcd" }}
          />
        </div>
        <Select
          className="select-input"
          style={{ marginTop: "2rem" }}
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="All"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions </h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <label htmlFor="modePay">Mode of Payment: </label>
          <Select
            className="select-input-pay"
            style={{ width: "20%" }}
            onChange={(value) => setModeFilter(value)}
            value={modeFilter}
            placeholder="Sort By Mode of Payment"
            allowClear
          >
            <Option value="">All</Option>
            <Option value="cash">Cash</Option>
            <Option value="upi">UPI</Option>
            <Option value="debit-card">Debit Card</Option>
            <Option value="credit-card">Credit Card</Option>
            <Option value="rtgs-neft">RTGS/NEFT</Option>
            <Option value="internet-banking">Internet Banking</Option>
          </Select>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={exportToCsv}>
              Export to CSV
            </button>
            <label htmlFor="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              id="file-csv"
              type="file"
              accept=".csv"
              required
              onChange={importFromCsv}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <Table
          className="table-content"
          dataSource={filteredTransactions}
          columns={columns}
        />
      </div>
    </div>
  );
}
export default TransactionsTable;

// import { useState } from "react";
// import React from "react";
// import { Radio, Select, Table } from "antd";
// import searchImg from "../../assets/search.svg";
// import { parse, unparse } from "papaparse";
// import { toast } from "react-toastify";

// const { Option } = Select;

// function TransactionsTable({
//   transactions,
//   addTransaction,
//   fetchTransactions,
//   paymentModesOrder, // Receive payment modes order as prop
// }) {
//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState("");
//   const [sortKey, setSortKey] = useState("");
//   const [modeOfPayFilter, setModeOfPayFilter] = useState("");

//   const columns = [
//     { title: "Name", dataIndex: "name", key: "name" },
//     { title: "Type", dataIndex: "type", key: "type" },
//     { title: "Mode", dataIndex: "modeOfPay", key: "modeOfPay" },
//     { title: "Tag", dataIndex: "tag", key: "tag" },
//     { title: "Amount", dataIndex: "amount", key: "amount" },
//     { title: "Date", dataIndex: "date", key: "date" },
//   ];

//   let filteredTransactions = transactions
//   ? transactions
//       .filter(
//         (item) =>
//           item.name.toLowerCase().includes(search.toLowerCase()) &&
//           (typeFilter === "" || item.type.includes(typeFilter)) &&
//           (modeOfPayFilter === "" || item.modeOfPay === modeOfPayFilter)
//       )
//       .map((item, index) => ({
//         ...item,
//         key: item.id || index, // Ensure each transaction has a unique key
//       }))
//   : [];

//   let sortedTransactions = filteredTransactions.sort((a, b) => {
//     if (sortKey === "date") {
//       return new Date(a.date) - new Date(b.date);
//     } else if (sortKey === "amount") {
//       return a.amount - b.amount;
//     } else if (sortKey === "modeOfPay") {
//       const indexA = paymentModesOrder.indexOf(a.modeOfPay);
//       const indexB = paymentModesOrder.indexOf(b.modeOfPay);
//       return indexA - indexB;
//     } else {
//       return 0;
//     }
//   });

//   function importFromCsv(event) {
//     event.preventDefault();
//     try {
//       parse(event.target.files[0], {
//         header: true,
//         complete: async function (results) {
//           for (const transaction of results.data) {
//             const newTransaction = {
//               ...transaction,
//               amount: parseFloat(transaction.amount),
//             };
//             await addTransaction(newTransaction, true);
//           }
//         },
//       });
//       toast.success("All Transactions Added");
//       fetchTransactions();
//       event.target.files = null;
//     } catch (e) {
//       toast.error("Error importing transactions");
//     }
//   }

//   function exportToCsv() {
//     const csv = unparse(transactions, {
//       fields: ["name", "type", "date", "amount", "tag", "modeOfPay"],
//       data: transactions,
//     });
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "transactions.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }

//   return (
//     <div style={{ width: "92%", padding: "0rem 2rem", boxShadow: "var(--shadow)", borderRadius: "0.5rem", margin: "2rem", flex: "1", backgroundColor: "#e0ffcd" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", marginBottom: "1rem", width: "100%" }}>
//         <div className="input-flex" style={{ marginTop: "2rem" }}>
//           <img src={searchImg} width="16" alt="oops" />
//           <input onChange={(e) => setSearch(e.target.value)} placeholder="Search by name" style={{ backgroundColor: "#e0ffcd" }} />
//         </div>
//         <Select className="select-input" style={{ marginTop: "2rem" }} onChange={(value) => setTypeFilter(value)} value={typeFilter} placeholder="All" allowClear>
//           <Option value="All">All</Option>
//           <Option value="income">Income</Option>
//           <Option value="expense">Expense</Option>
//         </Select>
//       </div>

//       <div className="my-table">
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: "1rem" }}>
//           <h2>My Transactions</h2>
//           <Radio.Group className="input-radio" onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
//             <Radio.Button value="">No Sort</Radio.Button>
//             <Radio.Button value="date">Sort by Date</Radio.Button>
//             <Radio.Button value="amount">Sort by Amount</Radio.Button>
//             <Radio.Button value="modeOfPay">Sort by Mode of Payment</Radio.Button>
//           </Radio.Group>
//           <Select className="select-input-pay" style={{ width: "20%" }} onChange={(value) => setModeOfPayFilter(value)} value={modeOfPayFilter} placeholder="All" allowClear>
//             <Option value="All">All</Option>
//             {paymentModesOrder.map((mode) => (
//               <Option key={mode} value={mode}>
//                 {mode}
//               </Option>
//             ))}
//           </Select>
//           <div style={{ display: "flex", justifyContent: "center", gap: "1rem", width: "400px" }}>
//             <button className="btn" onClick={exportToCsv}>
//               Export to CSV
//             </button>
//             <label htmlFor="file-csv" className="btn btn-blue">
//               Import from CSV
//             </label>
//             <input id="file-csv" type="file" accept=".csv" required onChange={importFromCsv} style={{ display: "none" }} />
//           </div>
//         </div>
//         <Table className="table-content" dataSource={filteredTransactions} columns={columns} />
//       </div>
//     </div>
//   );
// }

// export default TransactionsTable;
