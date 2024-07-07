import React from "react";
import { Bar, Line, Pie } from "@ant-design/charts";
import "./style.css";

function ChartComponent({ sortedTransactions }) {
  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  });

  const spendingData = sortedTransactions.filter((transaction) => {
    if (transaction.type === "expense") {
      return {
        tag: transaction.tag,
        amount: transaction.amount,
      };
    }
  });
  const config = {
    data: data,
    width: 1200,
    autofit: true,
    xField: "date",
    yField: "amount",
  };
  const spendingconfig = {
    data: Object.values(spendingData),
    width: 400,
    angleField: "amount",
    colorField: "tag",
  };

  const modeOfPaymentData = sortedTransactions.reduce((acc, curr) => {
    if (curr.type === "expense" || curr.type === "income") {
      const existing = acc.find((item) => item.mode === curr.mode);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({
          mode: curr.mode,
          amount: curr.amount,
        });
      }
    }
    return acc;
  }, []);

  const barConfig = {
    data: modeOfPaymentData,
    xField: "mode",
    yField: "amount",
    width: 500,
    colorField: "mode",

  };
  let chart;
  let pieChart;
  let barChart;

  return (
    <div className="charts-wrapper">
      <div className="childs-line">
        <div className="text-block">
          <h2 className="chart-heading">Your Financial Balance Report</h2>
        </div>
        <Line
          {...config}
          onReady={(ChartInstance) => (chart = ChartInstance)}
        />
      </div>
      <div className="expense-chart">
        <div className="childs">
          <div className="text-block">
            <h2 className="chart-heading">Your Expenses</h2>
          </div>
          {spendingData.length > 0 ? (
            <Pie
              {...spendingconfig}
              onReady={(ChartInstance) => (pieChart = ChartInstance)}
            />
          ) : (
            <p>No Expense Till Now</p>
          )}
        </div>
        <div className="childs-bar">
          <div className="text-block">
            <h2 className="chart-heading">Your Transaction Accross Various Modes</h2>
          </div>
          {spendingData.length > 0 ? (
            <Bar
              {...barConfig}
              onReady={(ChartInstance) => (barChart = ChartComponent)}
            /> 
          ):(
            <p>No Expense Till Now</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChartComponent;
