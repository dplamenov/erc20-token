import {useEffect, useState} from 'react';
import './App.css';
import { ethers } from 'ethers';
import ERC20 from './abi/ERC20.json';

function App() {
  const [currentAccount, setCurrentAccount] = useState();
  const [name, setName] = useState();
  const [symbol, setSymbol] = useState();
  const [totalSupply, setTotalSupply] = useState(0);
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState();
  const [transaction, setTransaction] = useState([]);

  useEffect(() => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(result => {
        setCurrentAccount(result[0]);
    }, [])
  });

  useEffect(() => {
    if(contract) {
      contract.on('Transfer', function (from, to, amount) {
        setTransaction(t => [...t, {from, to, amount}]);
      });
    }
  }, [contract]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const address = e.target.address.value;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const erc20 = new ethers.Contract(address, ERC20, signer);
    setContract(erc20);

    const name = await erc20.name();
    setName(name);
  
    const symbol = await erc20.symbol();
    setSymbol(symbol);

    const totalSupply = await erc20.totalSupply();
    setTotalSupply(totalSupply);

    const balance = await erc20.balanceOf(signer.getAddress());
    setBalance(balance);

    // const tx = signer.sendTransaction({
    //   to: "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc",
    //   value: ethers.utils.parseEther("1.0")
    // });
  }; 

  const transferHandler = (e) => {
    e.preventDefault();
    const recipient = e.target.recipient.value;
    const amount = e.target.amount.value;

    contract.transfer(recipient, amount).then(() => {
      console.log(amount);
    });
  };

  return (
    <div className="App">
     <div className="content read-data">
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
          Total supply: <span>{totalSupply.toString()}</span>
        </p>
        <p>
          My balance: <span>{balance.toString()}</span>
        </p>
     </div>
     <div className="content write-to-contract">
       <h1>Write to contract (transfer)</h1>
       <form onSubmit={transferHandler}>
          <input placeholder='Recipient' name='recipient' id='recipient'/>
          <input placeholder='Amount' name='amount' id='amount'/>
          <button>Send</button>
       </form>
     </div>
     <h2>
        Transactions
     </h2>
     <table>
       <thead>
         <tr>
            <th>from</th>
            <th>to</th>
            <th>amount</th>
         </tr>
       </thead>
       <tbody>
       {transaction.map((t, index) => {
         return (<tr key={index}>
           <td>{t.from}</td>
           <td>{t.to}</td>
           <td>{t.amount.toString()}</td>
         </tr>);
       })}
      </tbody>
     </table>
    </div>
  );
}

export default App;
