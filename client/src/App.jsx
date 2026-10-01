import { useDispatch } from "react-redux";
import AppRouter from "./routes/AppRouter";
import { useEffect } from "react";
import { fetchProfileThunk, finishAuthCheck } from "./store/authSlice";
import { refreshAccessToken, setAccessToken } from "./api/apiInstance";

function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
     console.log("🔥 APP AUTH EFFECT RUNNING");
    const  intializeAuth = async()=>{
      console.log("🔥 INITIALIZE AUTH RUNNING");
      try {
        const token = await refreshAccessToken()
        console.log("🔥 REFRESH SUCCESS");
        setAccessToken(token)
        await dispatch(fetchProfileThunk()).unwrap();
        
      } catch (error) {
        dispatch(finishAuthCheck())
        dispatch(finishAuthCheck());
      }
    }
    intializeAuth()
  },[dispatch])
  return <AppRouter />;
}

export default App;