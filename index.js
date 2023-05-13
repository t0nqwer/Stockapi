import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import stockRoutes from "./routes/stock.js";
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", stockRoutes);
const port = parseInt(process.env.PORT) || 8585;
app.listen(port, () => {
  console.log(`helloworld: listening on http://localhost:${port}`);
});
