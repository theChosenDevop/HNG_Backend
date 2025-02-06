import express from "express";
import cors from "cors";
import axios from "axios";
import compression from "compression";
import {LRUCache} from "lru-cache";

const app = express();

app.use(cors());
app.use(compression());

const funFactCache = new LRUCache({
  max: 500,
  maxAge: 60 * 60 * 1000
})
const primeCache = new Set();
const cacheExpiryTime = 60 * 60 * 1000; // 1 hour cache expiry time

const validateNumber = (num) => {
  return num && /^-?\d+$/.test(num.trim());
};

const isPrime = (num) => {
  if (primeCache.has(num)) return true;
  if (num <= 1) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;

  for (let i = 3; i * i <= num; i += 2) {
    if (num % i === 0) return false;
  }
  primeCache.add(num);
  return true;
};

const isPerfect = (num) => {
  if (num < 2) return false;
  let sum = 1;
  let sqrt = Math.sqrt(num);
  for (let i = 2; i <= sqrt; i++) {
    if (num % i === 0) {
      sum += i + (i !== num / i ? num / i : 0);
    }
  }
  return sum === num;
};

const sumOfDigits = (num) => {
  return [...Math.abs(num).toString()].reduce((acc, cur) => acc + +cur, 0);
}

const getFunFact = async (num) => {
 if (funFactCache.has(num)) return funFactCache.get(num);

  try {
    const {data} = await axios.get(`http://numbersapi.com/${num}/math`);
    funFactCache.set(num, data);
    return data;
  } catch (error) {
    console.log("NumbersAPI Error:", error.message);
  }
};

const armstrongNumbers = new Set([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 153, 370, 371, 407, 1634, 8208, 9474, 54748,
  92727, 93084, 548834,
]);

app.get("/api/classify-number", async (req, res) => {
  console.time("API Response Time");

  const num = req.query.number;
  if (!validateNumber(num)) {
    return res.status(400).json({
      number: num,
      error: true,
    });
  }

  const number = Number(num);
  const parity = number % 2 === 0 ? "even" : "odd";

  const funFactPromise = getFunFact(number);
  const [prime, perfect, digitSum, armstrong] = await Promise.all([
    isPrime(number),
    isPerfect(number),
    sumOfDigits(number),
    armstrongNumbers.has(Math.abs(number)),
  ])

  const funFact = await funFactPromise;

  res.status(200).json({
    number: number,
    is_prime: prime,
    is_perfect: perfect,
    properties: [...(armstrong ? ["armstrong"] : []), parity],
    digit_sum: digitSum, // sum of its digits
    fun_fact: funFact, //gotten from the numbers API
  });
console.timeEnd("API Response Time");

});

app.listen(3000, () => console.log("Server is running on port 3000"));
