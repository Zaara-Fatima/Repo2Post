import app from "./app.js";
import dotenv from "dotenv"
import connectdb from "./config/db.js";

dotenv.config()

await connectdb()
const PORT = process.env.PORT || 5000

app.listen(PORT, "0.0.0.0", ()=>{
    console.log(`Server running on port ${PORT}`)
})