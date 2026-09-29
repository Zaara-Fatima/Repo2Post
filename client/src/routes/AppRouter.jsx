import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { ProtectedRuoter } from "./ProtectedRuoter";
import { Dashboard } from "../pages/Dashboard";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="flex min-h-screen items-center justify-center bg-gray-950 text-4xl font-bold tracking-tight text-indigo-400">Repo2Post</div>} />
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