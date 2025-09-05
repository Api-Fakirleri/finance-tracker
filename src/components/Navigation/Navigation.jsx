import s from "./Navigation.module.css";
import { IoMdHome } from "react-icons/io";
import { TbTimeline } from "react-icons/tb";
import { BsCurrencyDollar } from "react-icons/bs";
import { NavLink } from "react-router-dom";

const getNavLinkClass = ({ isActive }) =>
  isActive ? s.navLinkActive : s.navLink;


const Navigation = () => {
  return (
    <section className={s.navigation}>
      <div className="container">
        <nav className={s.navElements}>
          <NavLink to="/dashboard/home" className={getNavLinkClass}>
            <div className={s.transactions}>
              <IoMdHome className={s.homeIcon} />
            </div>
            <p className={s.linkText}>Home</p>
          </NavLink>
          <NavLink to="/dashboard/statistic" className={getNavLinkClass}>
            <div className={s.statistics}>
              <TbTimeline className={s.statsIcon} />
            </div>
            <p className={s.linkText}>Statistics</p>
          </NavLink>
          <NavLink to="/dashboard/currency" className={getNavLinkClass}>
            <div className={s.currency}>
              <BsCurrencyDollar className={s.currIcon} />
            </div>
          </NavLink>
        </nav>
      </div>
    </section>
  );
};

export default Navigation;
