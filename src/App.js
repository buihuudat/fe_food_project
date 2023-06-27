import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, LinearProgress } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import AuthLayout from "./components/layout/AuthLayout";
import AppLayout from "./components/layout/AppLayout";

const Home = lazy(() => import("./components/pages/Home"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));
const Admin = lazy(() => import("./components/pages/Admin"));
const Products = lazy(() => import("./components/pages/Admin/Products"));
const Orders = lazy(() => import("./components/pages/Admin/Orders"));
const Users = lazy(() => import("./components/pages/Admin/Users"));
const Vouchers = lazy(() => import("./components/pages/Admin/Voucher"));
const Profile = lazy(() => import("./components/pages/Profile"));
const Bill = lazy(() => import("./components/pages/Bill"));
const Bought = lazy(() => import("./components/pages/Bought"));
const Feedback = lazy(() => import("./components/pages/Admin/Feedback"));

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
        <Suspense fallback={<LinearProgress />}>
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
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
