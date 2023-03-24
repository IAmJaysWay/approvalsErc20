/* const Moralis = require("moralis").default; */
const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/approvals", async (req, res) => {
  const { chain, wallet } = req.query;

  const options = {
    method: "GET",
    headers: {
      "accept": "application/json",
      "X-API-Key": process.env.MORALIS_KEY,
    }
  }
  const walletAddresses = [wallet];

  const response = await fetch(
    `https://deep-index.moralis.io/api/v2/erc20/approvals?chain=${chain}&wallet_addresses=${walletAddresses}`,
    options
  );

  if (response.ok){
    const data = await response.json();

    data.result.forEach((e,i)=>{
      e["key"] = i +1;
    })

    return res.status(200).json(data.result);
  }else {
    return res.status(400).json();
  }


  
});



  app.listen(port, () => {
    console.log(`Listening to API Calls`);
  });
