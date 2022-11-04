import { useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import ReactWhatsapp from 'react-whatsapp';
import './Create.css';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Create = ({ nft }) => {
  const [image, setImage] = useState('')
  const [serial, setSerial] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [expiry, setExpiry] = useState('')
  const [wallet, setWallet] = useState('')
  const [phone, setPhone] = useState('')

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }

  const createNFT = async () => {
    if (!image || !serial || !name || !description || !expiry || !wallet) return
    try{
      let owners = [wallet]
    
      var purchaseDate = new Date().toISOString().slice(0, 10);

      const result = await client.add(JSON.stringify({image, serial, name, description, expiry, purchaseDate, owners}))
      const uri = `https://ipfs.infura.io/ipfs/${result.path}`
      // mint nft 
      // await(await nft.mint(uri)).wait()
      // get tokenId of new nft 
      // const id = await nft.tokenCount()
      await(await nft.makeItem(serial, uri, wallet)).wait()
    } 
    catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  // const mintThenList = async (result) => {
  //   const uri = `https://ipfs.infura.io/ipfs/${result.path}`
  //   // mint nft 
  //   await(await nft.mint(uri)).wait()
  //   // get tokenId of new nft 
  //   const id = await nft.tokenCount()
  //   // approve marketplace to spend nft
  //   // await(await nft.setApprovalForAll(marketplace.address, true)).wait()
  //   // add nft to marketplace
  //   // const listingPrice = ethers.utils.parseEther(price.toString())
  //   // await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  // }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setWallet(e.target.value)} size="lg" required type="text" placeholder="Customer Wallet ID" />
              <Form.Control onChange={(e) => setSerial(e.target.value)} size="lg" required type="text" placeholder="Item Serial Number" />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Item Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Item Description" />
              <Form.Control onChange={(e) => setPhone(e.target.value)} size="lg" required type="text" placeholder="Customer Phone Number" />
              <Form.Control onChange={(e) => setExpiry(e.target.value)} required type="date" name="dob" placeholder="Expiry Date" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create NFT Warranty For The Item
                </Button>
                <ReactWhatsapp variant="primary" size="lg" className="whatsapp" number={phone} message={serial}>Send Serial Number to Customer</ReactWhatsapp>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create