import {useEffect, useState} from 'react';
import './App.css';
import { ethers } from 'ethers';
import ERC20 from './abi/ERC20.json';
import Form from 'react-bootstrap/Form'

function App() {
  const [currentAccount, setCurrentAccount] = useState();
  const [name, setName] = useState();
  const [symbol, setSymbol] = useState();
  const [totalSupply, setTotalSupply] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(result => {
        setCurrentAccount(result[0]);
    }, [])
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const address = e.target.address.value;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const erc20 = new ethers.Contract(address, ERC20, provider);

    const name = await erc20.name();
    setName(name);
  
    const symbol = await erc20.symbol();
    setSymbol(symbol);

    const totalSupply = await erc20.totalSupply();
    setTotalSupply(totalSupply);

    const balance = await erc20.balanceOf(signer.getAddress());
    setBalance(balance);
  }; 

  return (
    <div className="App">
     <div className="read-data">
        <h1>
          Read data from ERC20 contract
        </h1>
        <form onSubmit={handleSubmit}>
          <input placeholder="contract address" name="address" id="address" />
          <button>Read</button>
        </form>
        <p>
          Name: <span>{name}</span>
        </p>
        <p>
          Symbol: <span>{symbol}</span>
        </p>
        <p>
          Total supply: <span>{parseInt(totalSupply)}</span>
        </p>
        <p>
          My balance: <span>{parseInt(balance)}</span>
        </p>
     </div>
    </div>
  );
}

export default App;
