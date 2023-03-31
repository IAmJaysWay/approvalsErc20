import "./App.css";
import { useState } from "react";
import logo from "./moralisLogo.svg";
import { Table, Input, Select, Spin, message } from "antd";
import axios from "axios";
import Web3 from "web3";

const { Search } = Input;


function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [walletAddress, setWalletAddress] = useState(null);
  const [searching, setSearching] = useState(false);
  const [chain, setChain] = useState("eth");
  const [dataSource, setDataSource] = useState(null);
  const [revoke, setRevoke] = useState(false);

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  let approveAbi = [
    {
      "constant": false,
      "inputs": [
          {
              "name": "_spender",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  //web3.eth.getAccounts().then(console.log);

  const columns = [
    {
      title: "Tx Hash",
      dataIndex: "transaction_hash",
      key: "transaction_hash",
      render: (text) =><a href={
        `https://${chains.find(e=>e.value === chain).explorer}/tx/${text}`
      
      } target="_blank" rel="noreferrer">{text.slice(0,4)}...{text.slice(-4)}</a>
    },
    {
      title: "Updated",
      dataIndex: "block_timestamp",
      key: "block_timestamp",
      render: (text) =><div>{text.slice(0,10)}</div>
    },
    {
      title: "Asset",
      dataIndex: "contract_address",
      key: "contract_address",
      render: (text) =><a href={`https://${chains.find(e=>e.value === chain).explorer}/address/${text}`} target="_blank" rel="noreferrer">{text.slice(0,4)}...{text.slice(-4)}</a>
    },
    {
      title: "Approved Spender",
      dataIndex: "to_wallet",
      key: "to_wallet",
      render: (text) =><a href={`https://${chains.find(e=>e.value === chain).explorer}/address/${text}`} target="_blank" rel="noreferrer">{text.slice(0,4)}...{text.slice(-4)}</a>
    },
    {
      title: "Allowance",
      dataIndex: "value",
      key: "value",
      render: (text) => <>
        {text.length > 24 ? <div>Infinite</div>:<div>{Number(text)/1e18}</div>}</>
      
    },
    {
      title: "Revoke",
      dataIndex: "contract_address",
      key: "contract_address",
      render: (text, record) => <>
      <button onClick={ () => handleRevoke(text, record.to_wallet)} disabled={!revoke}>Revoke</button>
      </>
    }
  ];

  const chains = [
    {
      value: "eth",
      label: "Ethereum",
      explorer: "etherscan.io"
    },
    {
      value: "polygon",
      label: "Polygon",
      explorer: "polygonscan.com",
    },
    {
      value: "goerli",
      label: "Goerli",
      explorer: "goerli.etherscan.io",
    },
    {
      value: "sepolia",
      label: "Sepolia",
      explorer: "sepolia.etherscan.io"
    },
    {
      value: "mumbai",
      label: "Mumbai",
      explorer: "mumbai.polygonscan.com"
    },
    {
      value: "bsc",
      label: "Bsc",
      explorer: "bscscan.com"
    },
    {
      value: "bsc testnet",
      label: "Bsc Testnet",
      explorer: "testnet.bscscan.com",
    },
    {
      value: "avalanche",
      label: "Avalanche",
      explorer: "snowtrace.io"
    },
    {
      value: "avalanche testnet",
      label: "Avalanche Testnet",
      explorer: "testnet.snowtrace.io"
    },
    {
      value: "fantom",
      label: "Fantom",
      explorer: "ftmscan.com"
    },
    {
      value: "palm",
      label: "Palm",
      explorer: "explorer.palm.io"
    },
    {
      value: "cronos",
      label: "Cronos",
      explorer: "cronoscan.com"
    },
    {
      value: "cronos testnet",
      label: "Cronos Testnet",
      explorer: "testnet.cronoscan.com"
    },
    {
      value: "arbitrum",
      label: "Arbitrum",
      explorer: "arbiscan.io"
    },
  ];

  async function handleRevoke(contract_address, spender_address){
    let accounts = await web3.eth.requestAccounts()
    let contract = new web3.eth.Contract(approveAbi, contract_address);
    contract.methods.approve(spender_address, 0).send({from: accounts[0]})
    .on('receipt', function(){
        console.log("done");
    });
  }

  async function onSearch() {
    setSearching(true);

    let res;
    try{
    res = await axios.get(`http://localhost:3001/approvals`, {
      params: { chain: chain, wallet: walletAddress },
    });
    }catch(error){
      messageApi.open({
        type: 'warning',
        content: 'Unsupported request...',
      });
      setSearching(false);
      return
    }

    setDataSource(res.data);
    let accounts = await web3.eth.requestAccounts();

    if(accounts[0].toLowerCase() === walletAddress.toLowerCase()){
      setRevoke(true);
    }
    setSearching(false);
  }

  return (
    <>
    {contextHolder}
    <div className="App">
      <img src={logo} alt={"moralis"} width={100} />
      <h1>ERC-20 Token Approvals (Demo)</h1>

      <div className="resolutions">
        <div className="searchOptions">
          {chains && (
            <Select
              defaultValue="eth"
              options={chains}
              onChange={(val) => {
                setChain(val);
                setDataSource(null);
                setRevoke(false);
              }}
            />
          )}
          <Search
            className="search"
            value={walletAddress}
            onChange={(e) => {
              setWalletAddress(e.target.value);
              setDataSource(null);
              setRevoke(false);
            }}
            placeholder="Wallet Address..."
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
        </div>
        {dataSource && !searching && (
          <Table className="table" dataSource={dataSource} columns={columns} />
        )}
        {searching && 
        <Spin />
        }
      </div>
    </div>
    </>
  );
}

export default App;
