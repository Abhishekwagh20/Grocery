const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

const userModel = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/signup", async (req, res) => {
    try {
      const { email } = req.body;
  
      const result = await userModel.findOne({ email: email });
  
      if (result) {
        res.json({ message: "Email id is already registered", alert: false });
      } else {
        const userData = new userModel(req.body);
        const savedData = await userData.save();
        res.json({ message: "Successfully signed up", alert: true });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error", alert: false });
    }
  });
  app.post("/login", async(req, res) => {
    
    const email = req.body.email;
    const password=req.body.password
    console.log(req.body.password);
    const result=await userModel.findOne({ email: email ,password:password});
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({
        message: "Login is Successful",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({
        message: "Email is not available, please sign up",
        alert: false,
      });
    }
  });
  
  const schemaProduct = mongoose.Schema({
    name: String,
    category:String,
    image: String,
    price: String,
    description: String,
  });

  const productModel = mongoose.model("product",schemaProduct)

  app.post("/uploadProduct",async(req,res)=>{
    //console.log(req.body)
    const data = await productModel(req.body)
    const datasave = await data.save()
    res.send({message : "Upload successfully"})
})


app.listen(PORT, () => console.log("Server is running at port: " + PORT));