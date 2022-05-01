import {useEffect, useState} from 'react';
import './App.css';
import { ethers } from 'ethers';
import ERC20 from './abi/ERC20.json';

function App() {
  const [currentAccount, setCurrentAccount] = useState();

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
    const erc20 = new ethers.Contract(address, ERC20, provider);

    const name = await erc20.name();
    console.log(name);
  }; 

  return (
    <div className="App">
      <h1>
        Read data from ERC20 contract
      </h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="contract address" name="address" id="address"/>
        <button>Read</button>
      </form>
      <p>
        Name: <span>name</span>
      </p>
      <p>
        Symbol: <span>symbol</span>
      </p>
      <p>
        Total supply: <span>totalSupply</span>
      </p>
    </div>
  );
}

export default App;
