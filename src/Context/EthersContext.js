import { ethers } from "ethers";
import { createContext, useState, useEffect } from "react";
import { abi } from "../Utils/abi";

export const EthersContext = createContext(null);
const {ethereum} = window
export default function Ethers({children}){

  const contractAddress = "0x6a2677AC5AFEf933a8C27492cB493e4Ba959A0cf"
    const [currentAccount, setCurrentAccount] = useState(null);
    const [N, setN] = useState();

    const checkIfWalletIsConnect = async () => {
      try {
        if (!ethereum) return alert("Please install MetaMask.");
  
        const accounts = await ethereum.request({ method: "eth_accounts" });
  
        if (accounts.length) {
          setCurrentAccount(accounts[0]); 
        } else {
          alert("No accounts found");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const connectWallet = async () => {
      try {
        if (!ethereum) return alert("Please install MetaMask.");
  
        const accounts = await ethereum.request({ method: "eth_requestAccounts", });
  
        setCurrentAccount(accounts[0]);
        window.location.reload();
      } catch (error) {
        console.log(error);
        throw new Error("No ethereum object");   
      }
    };

    const createCase =async (name, creator ,description,type, uri)=>{
      try{
        
        const { ethereum } = window
        console.log(name, creator ,description,type, uri)
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
         const contract = new ethers.Contract(contractAddress, abi,signer)
        const accounts = await ethereum.request({method: "eth_accounts"})
        const account  = accounts[0]
        // const created = await contract.safeMint(account, name, creator ,description,type, uri )
        // const counter = await contract.counter()
         const z = await contract.safeMint(account,name,creator,description,type,uri)
         let x = await z.wait()
         console.log(z)
        const count = await contract.getCount()
        return count
        
       
      }catch(e){
         console.log(e)
      }
     
    }  


    const getUri =async (uri)=>{
      try{
        const { ethereum } = window
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
         const contract = new ethers.Contract(contractAddress, abi,signer)
         const URI =await contract.tokenUris(uri)
         return(URI)
        }
         catch(e){
         console.log(e)
         }
    }
  
      const getOwner = async(tokenId)=>{
        const { ethereum } = window
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
         const contract = new ethers.Contract(contractAddress, abi,signer)
         const ownerAddress = await contract.owner(tokenId)
         return ownerAddress
      }

      const transferOwner = async(tokenId, to)=>{
        const { ethereum } = window
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
         const contract = new ethers.Contract(contractAddress, abi,signer)
         const transfer = await contract.transfer(tokenId, to)
         return transfer
      }

      const getMyWorks = async()=>{
        try{

          const { ethereum } = window
          const provider = new ethers.providers.Web3Provider(ethereum)
          const signer = provider.getSigner()
          const contract = new ethers.Contract(contractAddress, abi,signer)
          const accounts = await ethereum.request({method: "eth_accounts"})
          const account  = accounts[0]
          const myIds = await contract.getTokens(account)
          const getNames= myIds.map(e=>{
          return parseInt(e._hex, 16)})
         return getNames
        }catch(e){
         console.log(e)
        }
       
      }

      // const changeNetwork = async () => {
      //   if (window.ethereum) {
      //     try {
      //       await window.ethereum.request({
      //       method: 'wallet_switchEthereumChain',
      //         params: [{ chainId: "0x89" }],
      //       });
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   }}
  //const contractAddress = "0x51383490f65E75d8A7ddFd3eb72eD1423241558D"

      const getN = async()=>{
        const chainId = 31415 

        if (window.ethereum.networkVersion !== chainId) {
              try {
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: "0x7AB7" }]
                });
              } catch (err) {
                  // This error code indicates that the chain has not been added to MetaMask
                if (err.code === 4902) {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainName: 'Filecoin — Wallaby testnet',
                        chainId: "0x7AB7" ,
                        nativeCurrency: { name: 'tFIL', decimals: 18, symbol: 'tFIL' },
                        rpcUrls: ['https://wallaby.node.glif.io/rpc/v0']
                      }
                    ]
                  });
                }
              }
            }
        
      }

    useEffect(() => {
      checkIfWalletIsConnect();
      // changeNetwork()
      getN()
    }, []);


    return(
        <EthersContext.Provider value={{connectWallet, currentAccount, checkIfWalletIsConnect , createCase,getUri, getOwner, transferOwner, getMyWorks }}>
          {children}
        </EthersContext.Provider>
    )
}
