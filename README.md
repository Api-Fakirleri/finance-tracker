# Money Guard 💻💸

**8 developers blending finance and software 🚀**

## Team

- **Team Lead:** @Furkan Çetin  
- **Scrum Master:** Deniz  
- **Developers:**  
  - @gul-hilal  
  - @yasinbesni  
  - @bilisimfatihi  
  - @ohhamamcioglu
  - @gorkemcanaldi
  - @gozdearici

Money Guard is a comprehensive finance tracking web application built with **React**. It allows users to register, log in, manage income & expenses, view statistics, and monitor currency rates.

---

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Components & Pages](#components--pages)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Team](#team)

---

## Features

- User registration and login with **react-hook-form + Yup** validation  
- Private and public routes with token-based authentication  
- Add, edit, delete transactions with real-time updates  
- View total balance and transaction statistics  
- Currency exchange rates via **Monobank API**  
- Responsive design for mobile, tablet, and desktop  
- Notifications for errors and successful operations  

---

## Technologies

- **React** – Frontend  
- **Redux + Redux-Persist** – State management  
- **react-router-dom** – Routing  
- **react-hook-form + Yup** – Form handling and validation  
- **react-loader-spinner** – Loading indicators  
- **react-chartjs-2** – Statistics charts  
- **LocalStorage** – Token and data persistence  
- **Click library** – Modal & UI interactions  
- **Monobank API** – Currency rates  

---

## Components & Pages Overview

### App
- Handles private/public routes and fetches current user data.

### RegistrationPage & RegistrationForm
- Mobile, tablet, and desktop layout  
- Form validation: Email, Password (6-12 chars), Confirm Password  
- ProgressBar reflects password strength & confirm password match  
- On successful registration → auto-login & redirect to DashboardPage  

### LoginPage & LoginForm
- Email & Password validation  
- On successful login → redirect to DashboardPage  

### DashboardPage
- Shows user transactions, balance, statistics, and currency rates  

### Header
- Displays logo, username (from email), Exit button  
- Logout triggers confirmation modal and clears Redux + localStorage  

### Navigation
- NavLink routes: `/home`, `/statistics`, `/currency` (mobile)  

### Currency & CurrencyTab
- Fetches current exchange rates from Monobank API  
- Caches results in localStorage for 1 hour  

### Balance
- Subscribes to `finance.totalBalance` in Redux store  

### Loader
- Centered loading spinner during async operations  

### HomeTab & TransactionsList / TransactionsItem
- Displays all transactions with scroll support  
- Supports editing & deleting transactions via modal  

### ButtonAddTransactions & ModalAddTransaction / AddTransactionForm
- Floating button opens modal for adding transactions  
- Form validation: Sum, Date, Category, Comment  

### ModalEditTransaction / EditTransactionForm
- Edit existing transactions with validation and modal UI  

### StatisticsTab / Chart / StatisticsDashboard / StatisticsTable
- Displays charts & tables for user transaction statistics  
- Month/year selection triggers backend fetch  

---

## Installation

```bash
git clone https://github.com/api-fakirleri/finance-tracker.git
cd finance-tracker
npm install
npm start
=======
# React + Vite
