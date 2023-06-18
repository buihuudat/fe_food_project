import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import AuthLayout from "./components/layout/AuthLayout";
import AppLayout from "./components/layout/AppLayout";

import Home from "./components/pages/Home";
import AdminLayout from "./components/layout/AdminLayout";
import Admin from "./components/pages/Admin";
import Products from "./components/pages/Admin/Products";
import Orders from "./components/pages/Admin/Orders";
import Users from "./components/pages/Admin/Users";
import Vouchers from "./components/pages/Admin/Voucher";
import Profile from "./components/pages/Profile";
import Bill from "./components/pages/Bill";
import Bought from "./components/pages/Bought";
import Feedback from "./components/pages/Admin/Feedback";

const App = () => {
  const darkmode = 0;
  const theme = createTheme({
    palette: {
      mode: darkmode ? "dark" : "light",
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="/" index element={<Home />} />
            <Route path="/bills" index element={<Bill />} />
            <Route path="/bought" index element={<Bought />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/" element={<AdminLayout />}>
            <Route path="/admin" index element={<Admin />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/vouchers" element={<Vouchers />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/feedback" element={<Feedback />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
