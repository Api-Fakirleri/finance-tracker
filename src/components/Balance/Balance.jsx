import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { selectUserBalance } from "../../redux/auth/selectors";
import { selectCurrencyData } from "../../redux/currency/selectors";
import { getBalanceThunk } from "../../redux/auth/operations";
import useMedia from "../../hooks/useMedia";
import clsx from "clsx";
import s from "./Balance.module.css";
import { getCurrency } from "../../redux/currency/operations";

const Balance = () => {
  const dispatch = useDispatch();
  const balance = useSelector(selectUserBalance) ?? 0;
  const currencyData = useSelector(selectCurrencyData);
  const { isMobile } = useMedia();

  const usdRateBuy = currencyData?.usd?.buy;
  const euroRateBuy = currencyData?.euro?.buy;

  const [selectedCurrency, setSelectedCurrency] = useState("UAH");

  useEffect(() => {
		dispatch(getBalanceThunk());
		
		if (!currencyData?.usd || !currencyData?.euro) {
      dispatch(getCurrency());
    }
  }, [dispatch]);




  const formattedUAH = balance.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const balanceInUSD =
    typeof usdRateBuy === "number" && usdRateBuy > 0
      ? (balance / usdRateBuy).toFixed(2)
      : "0.00";

  const balanceInEUR =
    typeof euroRateBuy === "number" && euroRateBuy > 0
      ? (balance / euroRateBuy).toFixed(2)
      : "0.00";

  const getDisplayedBalance = () => {
    if (selectedCurrency === "UAH") return `₴ ${formattedUAH}`;
    if (selectedCurrency === "USD") return `$ ${balanceInUSD}`;
    if (selectedCurrency === "EUR") return `€ ${balanceInEUR}`;
    return "₴ 0.00";
  };

  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchEndX < touchStartX - 50) {
      if (selectedCurrency === "UAH") setSelectedCurrency("USD");
      else if (selectedCurrency === "USD") setSelectedCurrency("EUR");
      else if (selectedCurrency === "EUR") setSelectedCurrency("UAH");
    }
    if (touchEndX > touchStartX + 50) {
      if (selectedCurrency === "UAH") setSelectedCurrency("EUR");
      else if (selectedCurrency === "EUR") setSelectedCurrency("USD");
      else if (selectedCurrency === "USD") setSelectedCurrency("UAH");
    }
  };

  return (
    <div
      className={s.container}
      onTouchStart={isMobile ? handleTouchStart : null}
      onTouchEnd={isMobile ? handleTouchEnd : null}
    >
      <div className={s.content}>
        <p className={s.title}>Your Balance</p>
        <p className={s.balance}>{getDisplayedBalance()}</p>
      </div>

      {!isMobile && (
        <div className={s.buttons}>
          <button
            className={clsx(s.button, selectedCurrency === "UAH" && s.active)}
            onClick={() => setSelectedCurrency("UAH")}
          >
            ₴ UAH
          </button>
          <button
            className={clsx(s.button, selectedCurrency === "USD" && s.active)}
            onClick={() => setSelectedCurrency("USD")}
          >
            $ USD
          </button>
          <button
            className={clsx(s.button, selectedCurrency === "EUR" && s.active)}
            onClick={() => setSelectedCurrency("EUR")}
          >
            € EUR
          </button>
        </div>
      )}
      {isMobile && <p className={s.swipeHint}>Swipe to change currency</p>}
    </div>
  );
};

export default Balance;