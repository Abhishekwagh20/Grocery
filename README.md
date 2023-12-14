# Grocery


## 1. Code Statistics

**Total Lines of Code:** 4,694

- **Backend:** 2,200
- **Frontend:** 2,494

## 2. Implemented Features

### 2.1 User Profile Creation

User profile information is stored in the MongoDB database, including:
- First name
- Last name
- Email
- Password
- Image

### 2.2 Transaction Management

Transaction details are stored in the MongoDB database, capturing:
- Customer information: name, email, phone, address
- Payment details: card number, expiration date, CVV
- Order timestamp
- Array of bought products, each containing:
  - Product ID
  - Name
  - Price
  - Category
  - Image
  - Quantity
  - Total

### 2.3 Analytics & Visual Reports

Admin has access to an analytics dashboard featuring:
- Graphical representation of user orders
- Details on purchased products, quantity, total price, and user information
- Bar graphs showcasing the most sold products, filterable by time (e.g., last 24 hours)
- Graphical representation of most sold products location-wise

### 2.4 Reviews

Customers can view and write reviews, including product ratings, stored in the MongoDB database.

### 2.5 Trending Products

Customers can explore trending products by category based on the most purchased items in the last 7 days.

### 2.6 Auto-Complete Search Feature

Implemented auto-complete search to enhance user experience by providing suggestions during product searches.

### 2.7 Google Maps - Near ME Search Feature

Once a user selects a product for purchase, they can choose in-store pickup or home delivery. If in-store pickup is selected, the user can view a Google Map displaying the 10 nearest grocery store locations based on their current location.

## 3. Future Plans

### 3.1 Features Not Yet Implemented

- Twitter match
- Knowledge graph search

### 3.2 Features Attempted but Currently Non-Functional

- AI Recommender


### 4. Output

- (https://github.com/Abhishekwagh20/Grocery/blob/main/Screenshots.pdf)


## How to Run the Application

1. Unzip the file.
2. Navigate to the backend folder and execute the following commands:
	- npm install
	- node index.js
3. Navigate to the frontend folder and execute the following commands:
	- npm install
	- npm start
