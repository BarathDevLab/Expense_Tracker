import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { TranscationItemsListLimited } from "./testing";
import axios from "axios";
import LoadingCircle from "./LoadingCircle";
import { aggregateTransactions } from "../utils/transactionChartUtils";

export const DashBoard = () => {
  

  
  const [TransactiomList, setTransactiomList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(1);
  const [groupBy, setGroupBy] = useState("daily");

  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/getTranscationList`)
      .then((res) => {
        setTransactiomList(res.data);
        console.log(res.data);
        setLoading(false);
      });
  }, []);
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const chartData = aggregateTransactions(TransactiomList, startDate, endDate, groupBy);
  console.log("chartData:", chartData);
  let Balance = 0;
  let Income = 0;
  let Expense = 0;
  console.log("Before calculation:", { Balance, Income, Expense });
  TransactiomList.map((list) => {
    console.log(list.type);
    if (list.type === "expense") {
      Balance -= list.amount;
      Expense += list.amount;

      console.log(list.amount);
    } else if (list.type === "income") {
      Balance += list.amount;
      Income += list.amount;
    }
  });
console.log("After calculation:", { Balance, Income, Expense });
  return (
    <>
      {loading ? (
        <LoadingCircle />
      ) : (
        <div className="main-section">
          <div className="title">
            <h1>Dashboard</h1>
          </div>

          <div className="dash-info">
            <div className="dash_box box1">
              <div className="dash_logo">
                <i className="fa-solid fa-money-check-dollar"></i>
              </div>
              <div className="dash_desc">
                <h1>Balance</h1>
                <p>${Number(Income) - Number(Expense)}</p>
              </div>
            </div>
            <div className="dash_box box2">
              <div className="dash_logo">
                <i className="fa-solid fa-money-check-dollar"></i>
              </div>
              <div className="dash_desc">
                <h1>Income</h1>
                <p>${Number(Income)}</p>
              </div>
            </div>
            <div className="dash_box box3">
              <div className="dash_logo">
                <i className="fa-solid fa-money-check-dollar"></i>
              </div>
              <div className="dash_desc">
                <h1>Expense</h1>
                <p>${Number(Expense)}</p>
              </div>
            </div>
          </div>
          <div className="dash-chart-1">
            <div className="chart-header">
              <h2>Income &amp; Expenses</h2>
              <div className="chart-selectors">
                <label className="chart-selector">
                  <span>Date range</span>
                  <select
                    value={months}
                    onChange={(event) => {
                      const range = Number(event.target.value);
                      setMonths(range);
                      setGroupBy(range === 1 ? "daily" : range === 12 ? "monthly" : "weekly");
                    }}
                  >
                    <option value={1}>1 month</option>
                    <option value={3}>3 months</option>
                    <option value={6}>6 months</option>
                    <option value={12}>1 year</option>
                  </select>
                </label>
                <label className="chart-selector">
                  <span>View</span>
                  <select value={groupBy} onChange={(event) => setGroupBy(event.target.value)}>
                    {(months === 1
                      ? ["daily", "weekly"]
                      : months === 12
                        ? ["weekly", "monthly"]
                        : ["daily", "weekly", "monthly"]
                    ).map((view) => (
                      <option key={view} value={view}>
                        {view[0].toUpperCase() + view.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#2563eb"
                  strokeWidth={2}
                  // dot={false}
                  activeDot={{ r: 8 }}
                  isAnimationActive={false}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                  animationBegin={0}
                  animationId={1}
                  animationTimingFunction="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expense"
                  stroke="red"
                  strokeWidth={4}
                  // dot={false}
                  activeDot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="dash-chart-2"></div>
          <div className="receent_traans">
            <h1>Recent Transcation</h1>
            <TranscationItemsListLimited />
          </div>
        </div>
      )}
    </>
  );
};
