const app = require("./app");
const mongooes = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const port = 8080;
const DB = process.env.APPLICATIONDB;
const db = "mongodb://localhost:27017/local";
mongooes
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, () => {
      console.log(`Hey Server is listening on the ${port}`);
    })
  )
  .catch((err) => console.log(err));
