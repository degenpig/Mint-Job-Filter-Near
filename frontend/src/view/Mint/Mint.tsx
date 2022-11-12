import React, { useState, useEffect } from "react";
import Image from "next/image";

import { transactions } from "near-api-js";
import { login, logout } from "near/utils";

import { useSupplyContext } from "context/SupplyContext";
import { FileUploader } from "react-drag-drop-files";
import { NFTStorage, File, Blob } from 'nft.storage'
const BN = require("bn.js");
// ----------------------------------------------------------
const fileTypes = ["JPG", "PNG", "GIF"];
export default function Mint() {
  
    const { totalSupply } = useSupplyContext();
    const [mintable, setMintable] = useState(5777);
    
    const [file, setFile] = useState(null);
    const [newBlob, setNewBlob] = useState<any>(undefined);

    let num:any = 0;
    let nft:any;
    let role:any;
    let mrole:any;
    let nftUrl:any;
    useEffect(() => {
        setMintable(5777 - totalSupply);
    }, [totalSupply]);

    async function dataURItoBlob(dataURI: any) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);
      
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
      
        // create a view into the buffer
        var ia = new Uint8Array(ab);
      
        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
      
        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;
    }

    const handleChange = (file: any) => {
        setFile(file);
        nft = file;
        console.log("nft", nft);
        var reader = new FileReader();
        reader.onload = async () => {
            setNewBlob(await dataURItoBlob(reader.result));
        };
        reader.readAsDataURL(file);
    };

    const getRole = (e: any) => {
        role = e.target.value;
        if (e.key === "Enter"){
            mrole = role;
        } else {
            mrole = "";
        }
    }

    async function mintNFT() {
        const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ5NWZmODcwNGQ4QThkMmEyNkViQ0JkQzU5ZEY4QTkxNjg4MjlEM2MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NzU1MjA5Nzc0OSwibmFtZSI6ImRlZ2VucGlnIn0.W0q6lIgDEhrwH3TaB32-SJx_8h2dsxKoLJD4PB6PfHw';
        const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
        console.log("sdfsdfs", newBlob);
        const cid = await client.storeBlob(newBlob);
        
        nftUrl = "https://" + String(cid) + ".ipfs.nftstorage.link";

        let status = window?.walletConnection?.isSignedIn();
        console.log(nftUrl);
        console.log(mrole);
        if (status == true){
          if (mrole == ""){
            alert("Please Enter Correct Skills");
          } else {            
            let content = [];
            for (let i = 0; i < 1; i++){
              content[i] = transactions.functionCall(
                "nft_mint",
                Buffer.from(JSON.stringify({role:mrole, image:nftUrl})),
                3000000000000,
                new BN("4000000000000000000000000")
              );
            }
            await window.contract.account.signAndSendTransaction({
              receiverId: window.contract.contractId,
              actions: content,
            });
          }
        } else {
          alert("Please connect Wallet");
        }
    }

    
    return (
        <div>
            <div className="row header" style={{textAlign:"center", marginBottom:"100px", marginTop:"20px"}}>
            <div className="col-lg-5"></div>
            <div className="col-lg-1">
                {/* <h2><a href="/">MINT</a></h2> */}
            </div>
            <div className="col-lg-1">
                {/* <h2><a href="/Job">JOBS</a></h2> */}
            </div>
            <div className="col-lg-5">
                <div style={{textAlign:"center", marginTop:"20px"}}>
                <button style={{width:"200px", height:"50px", borderRadius:"10px", cursor:"pointer"}} onClick={window?.walletConnection?.isSignedIn() ? logout : login}>
                    {window?.walletConnection?.isSignedIn()
                    ? window.accountId.substr(0, 5) +
                        "..." +
                        window.accountId.substr(
                        window.accountId.length - 4,
                        window.accountId.length
                        )
                    : "Wallet Connect"}
                </button>
                </div>
            </div>
            </div>
            <div className="row" style={{marginBottom:"100px"}}>
                <div className="col-lg-2"></div>
                <div className="col-lg-2">
                    <h3>Upload Badge Art</h3>
                </div>
                <div className="col-lg-8">
                    <h4>Upload image that shows as your badge art for your students</h4>
                </div>
            </div>
            <div className="row" id="imageUpload" style={{textAlign:"center", marginBottom:"100px"}}>
                <div className="col-lg-5"></div>
                <div className="col-lg-7">
                    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-2"></div>
                <div className="col-lg-2">
                    <h3>Hard skills</h3>
                </div>
                <div className="col-lg-8">
                    <h4>Type in skills associated with this class and hit enter to save below</h4>
                </div>
            </div>
            <div className="row" style={{ marginBottom:"100px", marginTop:"30px"}}>
                <div className="col-lg-2"></div>
                <div className="col-lg-5">
                    <input type="text" onKeyDown={getRole} id="skills" style={{ width:"400px", height:"50px", borderRadius:"10px"}} />
                </div>
                <div className="col-lg-5">
                    
                </div>
            </div>
            <div className="mint" style={{textAlign:"center"}}>
                <button style={{width:"200px", height:"50px", borderRadius:"10px", cursor:"pointer"}} onClick={mintNFT}>MINT</button>
            </div>
        </div>
    );
}
