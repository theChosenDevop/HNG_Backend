#Backend Server
This is a backend service for HNG_12 project. It is built with **Node.js** and **Express**.

## 💥 Features
- REST API with Express
- CORS enabled
- Axios enabled
- Nodemon enabled
- Returns JavaScript Object Notation(JSON) response

---

## Prerequisites
Ensure you have the following on your local machione:
- [Node.js](https://nodejs.org/) (version 16+ recommended)
- [Git](https://git-scm.com/)

## ⚡ Setup & Installation

### 1️⃣ **Clone the Repository**
Open your terminal and run: ```git clone https://github.com/theChosenDevop/HNG_Backend.git```

### 2️⃣ **SubDirectory**
cd stage1

### 3️⃣ **Installation**
Install packages: ```npm install```

### 4️⃣ **Run Node Package Manager**
Run the server: ```npm start```

### 5️⃣ **Access endpoint**
```http://localhost:3000//api/classify-number?number=371"```

### 56️⃣ **Browser output**
- Status 200 OK
``{
    "number": 371,
    "is_prime": false,
    "is_perfect": false,
    "properties": ["armstrong", "odd"],
    "digit_sum": 11,  // sum of its digits
    "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371" //gotten from the numbers API
}``
- Status 400 Bad Request
``{
    "number": "alphabet",
    "error": true
}``