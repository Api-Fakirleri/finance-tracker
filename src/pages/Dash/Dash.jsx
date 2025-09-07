/* filepath: /home/ohhamamcioglu/finance-tracker/src/pages/Dash/Dash.jsx */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TransactionsList from "../../components/TransactionsList/TransactionsList.jsx";
import DashboardPage from "../../components/DashboardPage/DashboardPage.jsx";
import RuleBotWidget from "../../components/RuleBot/RuleBotWidget.jsx";
import Header from "../../components/Header/Header.jsx";
import { getTransactions } from "../../redux/transactions/operations.js";
import { selectTransactionsLoading, selectTransactionsError } from "../../redux/transactions/selectors.js";
// Auth selectors'ları import et (auth slice'ından)
import { selectIsLoggedIn, selectToken } from "../../redux/auth/selectors.js";
import Loader from "../../components/Loader/Loader.jsx";
import styles from "./Dash.module.css";

export default function DashboardHome() {
const[ totalBalance,setTotalBalance] = useState(0)


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectTransactionsLoading);
  const error = useSelector(selectTransactionsError);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector(selectToken);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      navigate("/login");
      return;
    }
    document.title = "Dashboard";
    dispatch(getTransactions());
  }, [dispatch, isLoggedIn, token, navigate]);

  if (!isLoggedIn || !token) {
    return (
      <div className={styles.wrapper}>
        <Loader /> {/* ✅ Authentication sırasında Loader */}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.content}>
        <DashboardPage totalBalance={totalBalance} /* setBalance={(balance)=>setTotalBalance(balance)} *//>
        <div className={styles.transactionsContainer}>
          {isLoading && <Loader />}
          {error && <div className={styles.error}>Error: {error}</div>}
          {!isLoading && !error && <TransactionsList  setBalance={(a)=>setTotalBalance(a)} />}
        </div>
      </div>
      <RuleBotWidget />
    </div>
  );
}
