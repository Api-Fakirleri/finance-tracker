/* filepath: /home/ohhamamcioglu/finance-tracker/src/pages/Dash/Dash.jsx */
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TransactionsList from "../../components/Transactions/TransactionsList.jsx";
import DashboardPage from "../../components/DashboardPage/DashboardPage.jsx"

import Header from "../../components/Header/Header.jsx";
import { getTransactions } from "../../redux/transactions/operations.js";
import { 
  selectTransactionsLoading, 
  selectTransactionsError 
} from "../../redux/transactions/selectors.js";
// Auth selectors'ları import et (auth slice'ından)
import { selectIsLoggedIn, selectToken } from "../../redux/auth/selectors.js";
import styles from "./Dash.module.css";

export default function DashboardHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const loading = useSelector(selectTransactionsLoading);
  const error = useSelector(selectTransactionsError);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector(selectToken);

  useEffect(() => {
    // Eğer kullanıcı giriş yapmamışsa login'e yönlendir
    if (!isLoggedIn || !token) {
      navigate('/login');
      return;
    }
    document.title = "Dashboard";
    // Giriş yapmışsa API isteklerini yap
    dispatch(getTransactions());
  }, [dispatch, isLoggedIn, token, navigate]);

  // Eğer henüz auth kontrolü devam ediyorsa loading göster
  if (!isLoggedIn || !token) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>Authenticating...</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Header />
      
      <div className={styles.content}>
        {/* <div className={styles.sidebar}>
          <div className={styles.navigation}>
            yönlendirme Alanı
          </div>
          <div className={styles.balance}>
            Balance
          </div>
          <div className={styles.currencyChart}>
            parite grafik alanı
          </div>
        </div> */}
         <DashboardPage/>
        <div className={styles.transactionsContainer}>
          {loading && <div className={styles.loading}>Loading...</div>}
          {error && <div className={styles.error}>Error: {error}</div>}
          {!loading && !error && <TransactionsList />}
        </div>
      </div>
    </div>
  );
}