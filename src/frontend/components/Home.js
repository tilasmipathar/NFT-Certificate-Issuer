import { useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import './Home.css';

const Home = ({ account, nft }) => {
  const [loading, setLoading] = useState(true)
  const [searchedItem, setSearchedItem] = useState(null)
  const [indx, setIndx] = useState(null)
  const [serial, setSerial] = useState('')
  
  const searchMarketplaceItems = async () => {
      // Load all unsold items
      setIndx(null)
      const itemCount = await nft.itemCount()

      for (let i = 1; i <= itemCount; i++) {
        const item = await nft.items(i)
        if (item.serial === serial && account !== item.current_owner.toLowerCase() && account === item.valid_owner.toLowerCase()) {
          setIndx(i)
          // get uri url from nft contract
          const uri = item.tokenUri;
          // use uri to fetch the nft metadata stored on ipfs 
          const response = await fetch(uri)
          const metadata = await response.json()

          const owner = item.owner;
         
          if(metadata.serial === serial){
            let _searchedItem = {
              tokenUri: uri,
              serial: metadata.serial,
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
              expiry: metadata.expiry,
              owner: owner,
              purchaseDate: metadata.purchaseDate,
              currentOwner: i.current_owner,
              expirable: metadata.expirable,
              website: metadata.website,
              phone: metadata.phone
            }
            setLoading(false)
            setSearchedItem(_searchedItem)
            return;
          }
        }
      }
      setLoading(false)
      setSearchedItem(null)
    }

    const redeem = async () => {
      const itemCount = await nft.itemCount()

      for (let i = 1; i <= itemCount; i++) {
        const item = await nft.items(i)
        if (item.serial === serial && account === item.current_owner.toLowerCase() && account === item.valid_owner.toLowerCase() && item.redeemed) {
          await(await nft.completeBurn(item.tokenId, i)).wait()
        }
      }
      
      await(await nft.claimWarranty(indx, searchedItem.tokenUri)).wait()
    }
  // const loadMarketplaceItems = async () => {
  //   // Load all unsold items
  //   const itemCount = await marketplace.itemCount()
  //   let items = []
  //   for (let i = 1; i <= itemCount; i++) {
  //     const item = await marketplace.items(i)
  //     if (!item.sold) {
  //       // get uri url from nft contract
  //       const uri = await nft.tokenURI(item.tokenId)
  //       // use uri to fetch the nft metadata stored on ipfs 
  //       const response = await fetch(uri)
  //       const metadata = await response.json()
  //       // get total price of item (item price + fee)
  //       const totalPrice = await marketplace.getTotalPrice(item.itemId)
  //       // Add item to items array
  //       items.push({
  //         totalPrice,
  //         itemId: item.itemId,
  //         seller: item.seller,
  //         name: metadata.name,
  //         description: metadata.description,
  //         image: metadata.image
  //       })
  //     }
  //   }
  //   setLoading(false)
  //   setItems(items)
  // }

  useEffect(() => {
    // loadMarketplaceItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <div className="App">
        <div class="container h-100">
        <div class="row h-100 justify-content-center align-items-center"></div>
        <div id = "head" >Get Your Cetificate By Just Entering Your Certificate ID</div>
        <InputGroup className="col6">
          <FormControl
            onChange={(e) => setSerial(e.target.value)}
            placeholder="Certificate ID"
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <Button onClick={() => {searchMarketplaceItems()}} variant="outline-dark" id="button-addon2">
            Search
          </Button>
        </InputGroup>
        </div>
       </div>
    </main>
  )
  return (
    <div className="flex justify-center">
      {searchedItem !== null ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
              <Col className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={searchedItem.image} />
                  <Card.Body color="secondary">
                    <Card.Title>
                      {searchedItem.description}
                    </Card.Title>
                    <Card.Text>
                      ID : {searchedItem.serial}
                    </Card.Text>
                    <Card.Text>
                      Name : {searchedItem.name}
                    </Card.Text>
                    <Card.Text>
                     Issue Date : {searchedItem.purchaseDate}
                    </Card.Text>
                    <Card.Text>
                     Expiry Date : {searchedItem.expiry}
                    </Card.Text>
                    <Card.Text>
                     Contact Number : {searchedItem.phone}
                    </Card.Text>
                    <Card.Text>
                     Issuer ID : {searchedItem.owner}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      <Button onClick={() => redeem()} variant="primary" size="lg">
                        Reedem
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No Certificate Found</h2>
          </main>
        )}
    </div>
  );
}
export default Home