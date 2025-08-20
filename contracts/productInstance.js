import web3 from '../web3';
import ProductContract from './contracts/ProductContract.json'; // or whatever your contract name is

const contractAddress = 'PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE';

const instance = new web3.eth.Contract(
  ProductContract.abi,
  contractAddress
);

export default instance;
