import express from "express";
import cors from "cors";
import axios from "axios";

const start = Date.now();  

const app = express();

app.use(cors());



app.get("/api/classify-number", async (req, res) => {
  const number = parseInt(req.query.number);

//   fetch data from numbers API
  const fetchApi = async () => {
    try {
      const response = await axios.get(`http://numbersapi.com/${number}/math`);
      const data = response.data;
    //   console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

//  check if the number is not a number
  if (isNaN(number)) {
    return res.status(400).json({
      number: "alphabet",
      error: true,
    });
  }
// split the number into an array of digits
  let numArr = [...number.toString()];
//   sum up the digits
  const sum = numArr.reduce((acc, cur) => acc + parseInt(cur), 0);
//   console.log(sum);

  const armstrongNumbers = [
    153, 370, 371, 407, 1634, 8208, 9474, 54748, 92727, 93084, 548834,
  ];
  
  const armstrongNumBool = armstrongNumbers.some((n) => n === number);

//   parity check for even or odd
  const parity = number % 2 === 0 ? "even" : "odd";

  const funFact = await fetchApi();

  return res.status(200).json({
    number: number,
    is_prime: false,
    is_perfect: false,
    properties: [...(armstrongNumBool ? ["armstrong"] : []), parity],
    digit_sum: sum, // sum of its digits
    fun_fact: funFact, //gotten from the numbers API
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
console.log(`API Response Time: ${Date.now() - start} ms`);


