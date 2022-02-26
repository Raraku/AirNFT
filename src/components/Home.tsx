import { ethers } from "ethers";
import WalletBalance from "./WalletBalance";
import { useEffect, useState } from "react";
import axios from "axios";

import TheRegister from "../artifacts/contracts/MyNFT.sol/TheRoster.json";

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const signer = provider.getSigner();

const availableImages = [
  "QmXWecYio8ttyW3itgmgN4R6Kb8MTTLMfVJ3tWmjxRwwsP",
  "QmTy45bYtZf1qoKJgFk1S2GUjrgUiboA4QcDsPCPT2SUKJ",
];

const contract = new ethers.Contract(contractAddress, TheRegister.abi, signer);
console.log(contract);

const Home = () => {
  const [totalMinted, setTotalMinted] = useState(0);

  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };
  return (
    <div>
      <WalletBalance />

      <h1>Fired Guys NFT Collections</h1>
      {availableImages.map((img, i) => (
        <div key={i}>
          <NFTImage tokenId={img} i={i} />
        </div>
      ))}
    </div>
  );
};

export default Home;

function NFTImage({ tokenId, i }) {
  const metadataURI = `${tokenId}`;
  // const imageURI = `img/${tokenId}.png`;
  const [imageURI, setImageURI] = useState("");

  // const imageURI = "https://gateway.pinata.cloud/ipfs/{tokenID}.json";

  const [isMinted, setIsMinted] = useState(false);

  useEffect(() => {
    axios.get(`https://cloudflare-ipfs.com/ipfs/${tokenId}`).then((res) => {
      setImageURI(
        `https://cloudflare-ipfs.com/ipfs/${res.data.image.slice(7)}`
      );
    });
  }, []);

  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);
  // console.log(metadataURI);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result);
    setIsMinted(result);
  };
  console.log(metadataURI);

  const mintToken = async () => {
    console.log("here");
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });
    await result.wait();
    getMintedStatus();
  };
  async function getURI() {
    console.log(i);
    const uri = await contract.tokenURI(i);
    console.log(uri);
  }
  return (
    <div>
      <img src={isMinted ? imageURI : "img/placeholder.jpg"}></img>
      <div>
        <h5>ID #{tokenId}</h5>
        {!isMinted ? (
          <button onClick={mintToken}>Mint</button>
        ) : (
          <button onClick={getURI}>Taken! Show URI</button>
        )}
      </div>
    </div>
  );
}

// const metadataURI = `${contentId}/${tokenId}.json`;
