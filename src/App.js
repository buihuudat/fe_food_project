import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import AuthLayout from "./components/layout/AuthLayout";
import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/layout/AdminLayout";

const Home = lazy(() => import("./pages/Home"));
const Bill = lazy(() => import("./pages/Bill"));
const Bought = lazy(() => import("./pages/Bought"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const Products = lazy(() => import("./pages/Admin/Products"));
const Orders = lazy(() => import("./pages/Admin/Orders"));
const Vouchers = lazy(() => import("./pages/Admin/Vouchers"));
const Users = lazy(() => import("./pages/Admin/Users"));
const Feedback = lazy(() => import("./pages/Admin/Feedback"));

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
