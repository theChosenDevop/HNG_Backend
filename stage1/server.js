import express from "express";
import cors from "cors";
import axios from "axios";
import compression from "compression";

const app = express();

app.use(cors());
app.use(compression());

const cache = new Map();

app.get("/api/classify-number", async (req, res) => {
  const start = Date.now();

  const validateNumber = (num) => {
    if (num === undefined || num.trim() === "" || num === null) return false;
    if (!/^-?\d+$/.test(num.trim())) return false;
    return true;
  }
const num = req.query.number;
 
  if (!validateNumber(num)) {
    return res.status(400).json({
      number: num,
      error: true,
    });
  }
  // convert the query parameter to an integer
  const number = Number(num);

  // const isPerfect = (number) => {
  //   let sum = 0;
  //   for (let i = 1; i <= number/2; i++) {
  //     if (number % i === 0) sum += i;
  //   }
  //   return sum === number
  // }

  const isPerfect = (number) => {
    if (number < 2) return false;
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(number); i++) {
      if (number % i === 0) {
        sum += i;
        if (i !== number / i) sum += number / i;
      }
    }
    return sum === number;
  }

  // const isPrime = (number) => {
  //   if (number <= 1) return false;
  //   for (let i = 2; i < Math.sqrt(number); i++) {
  //     if (number % i === 0) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  const isPrime = (number) => {
    if (number <= 1) return false;
    if (number === 2) return true;
    if (number % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(number); i += 2) {
      if (number % i === 0) return false;
    }
    return true;
  }

  // // split the number into an array of digits
  // let numArr = [...number.toString()];
  // //   sum up the digits
  // const sum = numArr.reduce((acc, cur) => acc + parseInt(cur), 0);
  // //   console.log(sum);

  // let sum = number
  //   .toString()
  //   .split("")
  //   .reduce((acc, cur) => acc + Number(cur), 0);
  const sumOfDigits = (number) => {
    let sum = 0;
    number = Math.abs(number);
    while (number > 0) {
      sum += number % 10;
      number = Math.floor(number / 10);
    }
    return sum;
  }

  // const funFact = await axios
  // .get(`http://numbersapi.com/${number}/math`)
  // .then((res) => res.data)
  // .catch((error) => console.log(error));

  const getFunFact = async (number) => {
    if (cache.has(number)) return cache.get(number);
    try {
      const num = Math.abs(number);
      const response = await axios.get(`http://numbersapi.com/${num}/math`);
      cache.set(number, response.data);
      return response.data;
    } catch (error) {
     console.log(error);
      
    }
  }
  const funFact = await getFunFact(number);

  const armstrongNumbers = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 153, 370, 371, 407, 1634, 8208, 9474, 54748, 92727, 93084, 548834,
  ];

  // const armstrongNumBool = armstrongNumbers.some((n) => n === number);
  const armstrongNumBool = armstrongNumbers.includes(Math.abs(number));

  //   parity check for even or odd
  const parity = number % 2 === 0 ? "even" : "odd";

  res.status(200).json({
    number: number,
    is_prime: isPrime(number),
    is_perfect: isPerfect(number),
    properties: [...(armstrongNumBool ? ["armstrong"] : []), parity],
    digit_sum: sumOfDigits(number), // sum of its digits
    fun_fact: funFact, //gotten from the numbers API
  });
  res.on("finish", () => {
    console.log(`API Response Time: ${Date.now() - start} ms`);
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
