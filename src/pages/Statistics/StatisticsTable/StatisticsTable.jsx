import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./StatisticsTable.module.css";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const defaultColors = [
  "#FF5733","#33FF57","#FF8C33","#FF33A1",
  "#3357FF","#33FFF6","#F3FF33","#FF33EC",
  "#8C33FF","#33FF8C"
];

const StatisticsTable = ({
  filteredList,
  categories,
  selectYear,
  setSelectYear,
  selectMonth,
  setSelectMonth
}) => {
  const totalIncome = filteredList.filter(i => i.type === "INCOME").reduce((acc,i)=> acc+Number(i.amount),0);
  const chartDataItems = filteredList.filter(i => i.type === "EXPENSE");
  const totalExpense = chartDataItems.reduce((acc,i)=> acc+Math.abs(Number(i.amount)),0);

  const labels = [...new Set(chartDataItems.map(item=>item.categoryName))];
  const colors = labels.map((_, idx) => defaultColors[idx % defaultColors.length]);

  return (
    <div className={styles.rightSide}>
      <div className={styles.filterContainer}>
        <div className={styles.selectWrapper}>
          <select
            value={selectMonth}
            onChange={(e) => setSelectMonth(e.target.value)}
            className={styles.selectDark}
          >
            <option value="">Month</option>
            {monthNames.map((month, idx)=><option key={idx} value={idx}>{month}</option>)}
          </select>
          <ChevronDown className={styles.selectIcon} />
        </div>

        <div className={styles.selectWrapper}>
          <select
            value={selectYear}
            onChange={(e) => setSelectYear(e.target.value)}
            className={styles.selectDark}
          >
            <option value="">Year</option>
            {Array.from({ length: 6 }, (_, i) => 2020 + i).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <ChevronDown className={styles.selectIcon} />
        </div>
      </div>

      <div className={styles.transactionList}>
        <div className={styles.categDiv}>
          <h3 className={styles.categ}>
            Category <span className={styles.sum}>Sum</span>
          </h3>
        </div>
        {filteredList.length === 0 ? (
          <div>Transactions not found</div>
        ) : (
          filteredList.map((item, idx) => (
            <div key={idx} className={styles.transactionItem}>
              <div className={styles.transactionInfo}>
                <div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
                  <div className={styles.colorBox} style={{ backgroundColor: item.type==="EXPENSE"? colors[labels.indexOf(item.categoryName)]:defaultColors[idx%defaultColors.length] }}/>
                  <span>{item.categoryName}</span>
                </div>
                <span>{item.amount} ₺</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.summary}>
        <div className={styles.transactionInfos}>
          <span>Expense:</span>
          <span style={{ color: "#FF868D", fontWeight: 700 }}>{Math.abs(totalExpense)} ₺</span>
        </div>
        <div className={styles.transactionInfos}>
          <span>Income:</span>
          <span style={{ color: "#FFB627", fontWeight: 700 }}>{Math.abs(totalIncome)} ₺</span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsTable;
