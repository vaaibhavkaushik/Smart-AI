import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import chatRoutes from "./routes/chats.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
  connectDB();
});

const connectDB = async() => {
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
  } catch(err){
    console.log("Failed to connect to DB",err);
  }
}


// app.post("/test", async (req, res) => {
//   try {
//     const userMessage = req.body.message;

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: userMessage
//                 }
//               ]
//             }
//           ]
//         })
//       }
//     );

//     const data = await response.json();

//     const reply = data.candidates[0].content.parts[0].text;

//     res.send(reply);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Something went wrong with Gemini API");
//   }
// });