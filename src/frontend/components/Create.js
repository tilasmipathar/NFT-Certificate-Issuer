import { useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'
import { Buffer } from 'buffer';
import ReactWhatsapp from 'react-whatsapp';
import './Create.css';
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const ipfsClient = require('ipfs-http-client');
const projectId = '2HBTchdwUIabdBalfLRosIxUhsu';
const projectSecret = '42902f37e37179e13982be14aea7c107';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
    authorization: auth,
    },
});

client.pin.add('QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn').then((res) => {
  console.log(res);
});

const Create = ({ nft }) => {
  const [image, setImage] = useState('')
  const [serial, setSerial] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [expiry, setExpiry] = useState('NA')
  const [wallet, setWallet] = useState('')
  const [phone, setPhone] = useState('')
  const [expirable, setExpirable] = useState('True')
  const [website, setWebsite] = useState('')

  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        setImage(`https://dclocker.infura-ipfs.io/ipfs/${result.path}`)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }

  const createNFT = async () => {
    if ( (expirable==='True' && (!image || !serial || !name || !description || !expiry || !wallet || !website || !phone)) ) {return}
    if ( (expirable==='False' && (!image || !serial || !name || !description || !wallet || !website || !phone)) ) {return}
    try{
      let owners = [wallet]
    
      var purchaseDate = new Date().toISOString().slice(0, 10);

      const result = await client.add(JSON.stringify({image, serial, name, description, expiry, website, expirable, phone, purchaseDate, owners}))
      const uri = `https://dclocker.infura-ipfs.io/ipfs/${result.path}`
     
      await(await nft.makeItem(serial, uri, wallet)).wait()
    } 
    catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
        <div class="d-flex">Upload Certificate Photo</div>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setWallet(e.target.value)} size="lg" required type="text" placeholder="Wallet ID of Certificate Holder" />
              <Form.Control onChange={(e) => setSerial(e.target.value)} size="lg" required type="text" placeholder="Certificate ID" />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name Of Certificate Holder" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required type="text" placeholder="Certificate Name" />
              <Form.Control onChange={(e) => setWebsite(e.target.value)} size="lg" required type="text" placeholder="Certificate Issuer Website" />
              <Form.Control onChange={(e) => setPhone(e.target.value)} size="lg" required type="text" placeholder="Phone Number Of Certificate Holder" />
              <Form.Check onChange={(e) => {if (e.target.checked) setExpirable('False'); else setExpirable('True');}} type="switch" id="custom-switch" className='cbox' label="Check this Switch if Certificate is Non-Expirable."/>
              <div class="d-flex">Expiry Date</div>
              <Form.Control onChange={(e) => setExpiry(e.target.value)} required type="date" name="dob" placeholder="Expiry Date" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Issue Certificate
                </Button>
                <ReactWhatsapp variant="primary" size="lg" className="whatsapp" number={phone} message={serial}>Send Certificate ID to Certificate Holder</ReactWhatsapp>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create