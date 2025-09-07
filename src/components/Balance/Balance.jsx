import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { selectUserBalance } from "../../redux/auth/selectors";
import { selectCurrencyData } from "../../redux/currency/selectors";
import { getBalanceThunk } from "../../redux/auth/operations";
import { getCurrency } from "../../redux/currency/operations";
import useMedia from "../../hooks/useMedia";
import clsx from "clsx";
import s from "./Balance.module.css";

const Balance = ({totalBalance}) => {
  const dispatch = useDispatch();
  //const rawBalance = useSelector(selectUserBalance);
  const balance = Number(totalBalance ?? 0); // her zaman number
  const currencyData = useSelector(selectCurrencyData);
  const { isMobile } = useMedia();

  const usdRateBuy = Number(currencyData?.usd?.buy ?? 0);
  const euroRateBuy = Number(currencyData?.euro?.buy ?? 0);

  const [selectedCurrency, setSelectedCurrency] = useState("UAH");

  // İlk açılışta bakiye ve kur bilgilerini çek
  useEffect(() => {
    dispatch(getBalanceThunk());
    dispatch(getCurrency());
  }, [dispatch]);

  // UAH formatı (toLocaleString öncesi güvenlik)
  const formattedUAH = (Number.isFinite(balance) ? balance : 0).toLocaleString(
    "uk-UA",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  // USD/EUR dönüşümleri (NaN ve 0 bölmeye karşı güvenli)
  const balanceInUSD =
    usdRateBuy > 0 && Number.isFinite(balance)
      ? (balance / usdRateBuy).toFixed(2)
      : "0.00";

  const balanceInEUR =
    euroRateBuy > 0 && Number.isFinite(balance)
      ? (balance / euroRateBuy).toFixed(2)
      : "0.00";

  const getDisplayedBalance = () => {
    if (selectedCurrency === "UAH") return `₺  ${formattedUAH}`;
    if (selectedCurrency === "USD") return `$ ${balanceInUSD}`;
    if (selectedCurrency === "EUR") return `€ ${balanceInEUR}`;
    return "₴ 0.00";
  };

  // Mobil swipe
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
            ₺ TRY
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
