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
      return res.json({ message: "Email id is already registered", alert: false });
    } else {
      const userData = new userModel(req.body);
      const savedData = await userData.save();
      return res.json({ message: "Successfully signed up", alert: true });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error", alert: false });
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const result = await userModel.findOne({ email: email, password: password });

    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };

      console.log(dataSend);
      return res.json({
        message: "Login is Successful",
        alert: true,
        data: dataSend,
      });
    } else {
      return res.json({
        message: "Email is not available, please sign up",
        alert: false,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error", alert: false });
  }
});

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
  reviews: [
    {
      user: String,
      rating: Number,
      comment: String,
    },
  ],
});

const productModel = mongoose.model("product", productSchema);

app.post("/uploadProduct", async (req, res) => {
  try {
    const data = await productModel(req.body);
    const datasave = await data.save();
    res.send({ message: "Upload successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", alert: false });
  }
});

app.get("/product", async (req, res) => {
  try {
    const data = await productModel.find({});
    res.send(JSON.stringify(data));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", alert: false });
  }
});

const paymentSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  cardNumber: String,
  expirationDate: String,
  cvv: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  products: Array,
});

const paymentModel = mongoose.model("payment", paymentSchema);

app.post("/submit-payment", async (req, res) => {
  try {
    const { name, email, phone, address, cardNumber, expirationDate, cvv, products } = req.body;

    const payment = new paymentModel({
      name,
      email,
      phone,
      address,
      cardNumber,
      expirationDate,
      cvv,
      products,
      timestamp: Date.now(),
    });

    await payment.save();

    res.status(201).json({ message: 'Payment information saved successfully' });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", alert: false });
  }
});

const contactSchema = mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const contactModel = mongoose.model("contact", contactSchema);

app.post("/submit-contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = new contactModel({
      name,
      email,
      message,
    });
    await contact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", alert: false });
  }
});

app.get("/payment-detailed-analytics", async (req, res) => {
  try {
    const payments = await paymentModel.find();

    const detailedAnalytics = payments.map((payment) => {
      return {
        userName: payment.name,
        userEmail: payment.email,
        userAddress: payment.address,
        cardNumber: payment.cardNumber,
        itemsBought: payment.products.map((product) => ({
          itemName: product.name,
          itemPrice: product.price,
        })),
        totalCost: calculateTotalPaymentAmount(payment),
      };
    });

    res.json(detailedAnalytics);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", alert: false });
  }
});

const calculateTotalPaymentAmount = (payment) => {
  return payment.products.reduce((sum, product) => sum + parseFloat(product.total), 0);
};

app.get("/popular-items", async (req, res) => {
  try {
    const timeFilter = req.query.time || '1hr';
    const timeThreshold = calculateTimeThreshold(timeFilter);

    const payments = await paymentModel.find({ timestamp: { $gte: timeThreshold } });
    const popularItems = calculatePopularItems(payments);

    res.json(popularItems);
  } catch (error) {
    console.error("Error fetching popular items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/deleteProductByName/:productName", async (req, res) => {
try {
  const productName = req.params.productName;

  // Check if the product name is provided
  if (!productName) {
    return res.status(400).json({ message: "Product name is required", alert: false });
  }

  // Find and delete the product
  const result = await productModel.findOneAndDelete({ name: productName });

  // Check if the product was found and deleted
  if (!result) {
    return res.status(404).json({ message: "Product not found", alert: false });
  }

  res.json({ message: "Product deleted successfully", alert: true });
} catch (error) {
  console.error("Error deleting product:", error);
  res.status(500).json({ message: `Internal server error: ${error.message}`, alert: false });
}
});

app.get("/users", async (req, res) => {
try {
  const users = await userModel.find({}, '-password -confirmPassword');
  res.json(users);
} catch (error) {
  console.error("Error fetching users:", error);
  res.status(500).json({ message: "Internal server error" });
}
});

// Edit user information
app.put("/edit-user/:userId", async (req, res) => {
try {
  const userId = req.params.userId;
  const updatedUserData = req.body;

  const updatedUser = await userModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
  
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found", alert: false });
  }

  res.json({ message: "User information updated successfully", alert: true });
} catch (error) {
  console.error("Error updating user:", error);
  res.status(500).json({ message: "Internal server error" });
}
});

// Add a new user
app.post("/add-user", async (req, res) => {
try {
  const userData = new userModel(req.body);
  const savedData = await userData.save();
  res.json({ message: "User added successfully", alert: true });
} catch (error) {
  console.error("Error adding user:", error);
  res.status(500).json({ message: "Internal server error" });
}
});

// Delete a user
app.delete("/delete-user/:userId", async (req, res) => {
try {
  const userId = req.params.userId;

  const result = await userModel.findByIdAndDelete(userId);

  if (!result) {
    return res.status(404).json({ message: "User not found", alert: false });
  }

  res.json({ message: "User deleted successfully", alert: true });
} catch (error) {
  console.error("Error deleting user:", error);
  res.status(500).json({ message: "Internal server error" });
}
});

app.post("/submit-review/:productId", async (req, res) => {
try {
  const productId = req.params.productId;
  const { user, rating, comment } = req.body;

  const product = await productModel.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found", alert: false });
  }

  product.reviews.push({ user, rating, comment });
  await product.save();

  res.status(201).json({ message: 'Review submitted successfully', alert: true });
} catch (error) {
  console.error("Error submitting review:", error);
  res.status(500).json({ message: 'Internal server error' });
}
});


const locationSchema = new mongoose.Schema({
  name: String,
  coordinates: {
    type: [Number],
    index: '2dsphere', // Enables geospatial indexing
  },
});

const Location = mongoose.model('Location', locationSchema);
const coordinates=[
  {"latitude":41.881832,"longitude":-87.633728},
  {"latitude":41.920298,"longitude":-87.636193},
  {"latitude":41.882411,"longitude":-87.623177},
  {"latitude":41.788604,"longitude":-87.579536},
  {"latitude":41.948588,"longitude":-87.656123},
  {"latitude":41.8404671,"longitude":-87.6268868},
  {"latitude":41.8406285,"longitude":-87.6169006},
  {"latitude":41.8401707,"longitude":-87.6167338},
  {"latitude":41.8452012,"longitude":-87.6168476},
  {"latitude":41.8351980,"longitude":-87.6168476},
]
// let id=1;
// for(coordinate of coordinates){
//   const location=new Location({"name":"Shop "+id,coordinates: [coordinate.latitude, coordinate.longitude],})
//   location.save()
//   id=id+1;
// }

app.post('/api/locations/nearme', async (req, res) => {
  const { longitude, latitude, radius } = req.body;

  try {
    const locations = await Location.find({
      coordinates: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(latitude), parseFloat(longitude)],
          },
          $maxDistance: parseInt(radius),
        },
      },
    });
      console.log(locations)
    res.send(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log("Server is running at port: " + PORT));