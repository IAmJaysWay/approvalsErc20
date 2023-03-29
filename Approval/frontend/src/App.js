import "./App.css";
import { useState } from "react";
import logo from "./moralisLogo.svg";
import { Table, Input, Select, Spin, message } from "antd";
import axios from "axios";

const { Search } = Input;
function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [walletAddress, setWalletAddress] = useState(null);
  const [searching, setSearching] = useState(false);
  const [chain, setChain] = useState("eth");
  const [dataSource, setDataSource] = useState(null);

  const columns = [
    {
      title: "Tx Hash",
      dataIndex: "transaction_hash",
      key: "transaction_hash",
      render: (text) =><a href={`https://etherscan.io/tx/${text}`} target="_blank" rel="noreferrer">{text.slice(0,4)}...{text.slice(-4)}</a>
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
      render: (text) =><a href={`https://etherscan.io/address/${text}`} target="_blank" rel="noreferrer">{text.slice(0,4)}...{text.slice(-4)}</a>
    },
    {
      title: "Approved Spender",
      dataIndex: "to_wallet",
      key: "to_wallet",
      render: (text) =><a href={`https://etherscan.io/address/${text}`} target="_blank" rel="noreferrer">{text.slice(0,4)}...{text.slice(-4)}</a>
    },
    {
      title: "Allowance",
      dataIndex: "value",
      key: "value",
      render: (text) => <>
        {text.length > 24 ? <div>Infinite</div>:<div>{Number(text)/1e18}</div>}</>
      
    },
    {
      title: "Possible Spam",
      dataIndex: "possible_spam",
      key: "possible_spam",
      render: (text) => <>
      {text ? <div>!!</div> : <div>-</div>}
      </>
    }
  ];

  const chains = [
    {
      value: "eth",
      label: "Ethereum",
    },
    {
      value: "polygon",
      label: "Polygon",
    },
    {
      value: "goerli",
      label: "Goerli",
    },
    {
      value: "sepolia",
      label: "Sepolia",
    },
    {
      value: "mumbai",
      label: "Mumbai",
    },
    {
      value: "bsc testnet",
      label: "Bsc Testnet",
    },
    {
      value: "avalanche",
      label: "Avalanche",
    },
    {
      value: "avalanche testnet",
      label: "Avalanche Testnet",
    },
    {
      value: "fantom",
      label: "Fantom",
    },
    {
      value: "palm",
      label: "Palm",
    },
    {
      value: "cronos",
      label: "Cronos",
    },
    {
      value: "cronos testnet",
      label: "Cronos Testnet",
    },
    {
      value: "arbitrum",
      label: "Arbitrum",
    },
  ];

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
              }}
            />
          )}
          <Search
            className="search"
            value={walletAddress}
            onChange={(e) => {
              setWalletAddress(e.target.value);
              setDataSource(null);
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
