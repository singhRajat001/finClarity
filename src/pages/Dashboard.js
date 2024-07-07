import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import AddExpense from "../components/Modals/addExpense";
import AddIncome from "../components/Modals/addIncome";
import { toast } from "react-toastify";
import { addDoc, collection, query, getDocs, deleteDoc } from "firebase/firestore";
// import { db } from "../firebase";
import { db, auth } from "../firebase";
// import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionsTable from "../components/TransactionsTable";
import NoTransactions from "../components/noTransactions";
import ChartComponent from "../components/Charts";
// import { setLogLevel } from "firebase/app";
// import AddExpenses from "../components/Modals/addExpense";
// import AddIncomes from "../components/Modals/addIncome";
function Dashboard() {
  const [user] = useAuthState(auth);
  const [isExpenseVisible, setIsExpenseVisible] = useState(false);
  const [isIncomeVisible, setIsIncomeVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const showExpense = () => {
    setIsExpenseVisible(true);
  };

  const showIncome = () => {
    setIsIncomeVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeVisible(false);
  };

  const onFinish = (values, type) => {
    console.log("On Finish", values, type);
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      // date: new Date(values.date).toISOString().split("T")[0],
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
      mode: values.mode,
    };
    // setTransactions([...transactions, newTransaction]);
    // setIsExpenseVisible(false);
    // setIsIncomeVisible(false);
    addTransaction(newTransaction);
    // calculateBalance();
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    fetchTrasactions();
  }, [user]);

  async function fetchTrasactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
      console.log("Transaction Array: ", transactionArray);
      toast.success("Transaction Fetched");
    }
    setLoading(false);
  }

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((Transaction) => {
      if (Transaction.type === "income") {
        incomeTotal += Transaction.amount;
      } else {
        expensesTotal += Transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const sortedTransactions = transactions.sort((a, b) => {
      return (new Date(a.date) - new Date(b.date));
  });

  async function handleDeleteAll() {
    if (user) {
      setLoading(true);
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);

        // Delete each document
        const batch = [];
        querySnapshot.forEach((doc) => {
          batch.push(deleteDoc(doc.ref));
        });

        // Await all deletions
        await Promise.all(batch);

        // Update local state
        setTransactions([]);
        setIncome(0);
        setExpense(0);
        setCurrentBalance(0);

        toast.success("All transactions deleted successfully!");
      } catch (e) {
        toast.error("Error deleting transactions: " + e.message);
      } finally {
        setLoading(false);
      }
    }
  }
  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading....</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            currentBalance={currentBalance}
            showExpense={showExpense}
            showIncome={showIncome}
            handleDeleteAll={handleDeleteAll}
          />
          {transactions && transactions.length !== 0 ? <ChartComponent sortedTransactions={sortedTransactions} /> : <NoTransactions />}
          <AddExpense
            isExpenseVisible={isExpenseVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncome
            isIncomeVisible={isIncomeVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTrasactions}
          />
        </>
      )}
    </div>
    // <div className="dashboard-container">
    //   <Header />
    //   <Cards showExpense={showExpense} showIncome={showIncome} />

    //   {isExpenseVisible && (
    //     <AddExpenses
    //       isExpenseVisible={isExpenseVisible}
    //       handleExpenseCancel={handleExpenseCancel}
    //       onFinish={onFinish}
    //     />
    //   )}

    //   {isIncomeVisible && (
    //     <AddIncomes
    //       isIncomeVisible={isIncomeVisible}
    //       handleIncomeCancel={handleIncomeCancel}
    //       onFinish={onFinish}
    //     />
    //   )}
    // </div>
  );
}

export default Dashboard;
