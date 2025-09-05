import Header from "../../components/Header/Header";

import Navigation from "../../components/Navigation/Navigation";
import { Outlet } from "react-router-dom";
import Balance from "../../components/Balance/Balance";
import Currency from "../../components/Currency/Currency";
import s from "./Dashboard.module.css";
import { useLocation } from "react-router-dom";
import useMedia from "../../hooks/useMedia";

const DashboardPage = () => {
 


	const { isTablet, isDesktop } = useMedia();
	
	const location = useLocation();
  const isHome = location.pathname === "/dashboard/home";
  const isCurrency = location.pathname === "/dashboard/currency";

  return (
    <div>
      <section className={s.main_container}>
        <div className={isTablet || isDesktop ? s.nav_container : undefined}>
          <div
            className={`${isHome ? s.navHome : ""} ${
              isCurrency ? s.navCurrency : ""
            }`}
          >
            <Navigation />
            {(isTablet || isDesktop) && <Balance />}
          </div>
          <div className={s.currency}>
            {(isTablet || isDesktop) && <Currency />}
          </div>
          
        </div>
        <div className={s.outlet_container}>
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
