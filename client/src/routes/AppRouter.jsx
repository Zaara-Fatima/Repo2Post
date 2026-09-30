import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { ProtectedRuoter } from "./ProtectedRuoter";
import { Dashboard } from "../pages/Dashboard";
import { Home } from "../pages/Home";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route element={<ProtectedRuoter/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;