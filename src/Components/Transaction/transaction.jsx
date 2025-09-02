import { useState } from "react";
import { X, Calendar } from "lucide-react";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

export default function AddTransactionModal({ onClose }) {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { type, amount, date, comment };
    console.log("Transaction Added:", data);
    onClose();
  };

  return (
    <div className="bg-gradient-to-b from-indigo-900 to-purple-900 rounded-2xl w-[540px] h-[514px] shadow-2xl relative flex flex-col items-center justify-center p-6">
      
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-3 right-3 text-white">
        <X size={20} />
      </button>

      <h2 className="text-center text-xl font-normal text-white mb-6">
        Add transaction
      </h2>
       
      {/* Income / Expense Toggle */}
      <div className="relative w-[210px] h-12 bg-white/10 rounded-full mb-6 cursor-pointer flex items-center p-1" onClick={() => setType(type === "income" ? "expense" : "income")}>
        {/* Slider */}
        <div
          className={`absolute top-1 left-1 h-10 w-1/2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 shadow-lg transition-all duration-300 ${
            type === "expense" ? "translate-x-24" : "translate-x-0"
          }`}
        ></div>
        
        {/* Labels */}
        
        <span className="flex-1 text-center text-white font-semibold z-10">Income</span>
        <span className="flex-1 text-center text-white font-semibold z-10">Expense</span>
      </div>
      {type === "expense" && (
  <select name="category" id="category" className="bg-transparent border-b border-gray-500 text-white outline-none mb-4 w-48 text-center">
    <option disabled selected hidden>Select a category</option>
    <option value="food">Food</option>
    <option value="transport">Transport</option>
    <option value="entertainment">Entertainment</option>
  </select>
)}
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="flex gap-14 w-16 flex justify-center mx-auto">
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent border-b border-gray-500 text-white outline-none"
            required
          />

          <div className="flex items-center border-b border-gray-500 px-2">
            <DatePicker
              value={date}
              onChange={setDate}
              className="custom-datepicker"
              calendarClassName="bg-white text-black rounded-xl shadow-lg p-2"
              clearIcon={null}
              calendarIcon={<Calendar className="text-white" />}
            />
          </div>
        </div>

        <input
          type="text"
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-transparent border-b border-gray-500 text-white outline-none flex justify-center mx-auto w-[394px]"
        />

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-normal py-2 rounded-full flex justify-center w-64 mx-auto"
          >
            ADD
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-white text-gray-800 font-normal py-2 rounded-full flex justify-center w-64 mx-auto"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
