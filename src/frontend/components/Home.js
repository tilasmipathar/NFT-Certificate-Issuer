import { useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

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
        console.log(item.valid_owner)
        if (item.serial === serial && account !== item.current_owner.toLowerCase() && account === item.valid_owner.toLowerCase()) {
          setIndx(i)
          // get uri url from nft contract
          const uri = item.tokenUri;
          // use uri to fetch the nft metadata stored on ipfs 
          const response = await fetch(uri)
          const metadata = await response.json()
         
          if(metadata.serial === serial){
            let _searchedItem = {
              tokenUri: uri,
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
              expiry: metadata.expiry,
              owners: metadata.owners
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
        <InputGroup className="col-6">
          <FormControl
            onChange={(e) => setSerial(e.target.value)}
            placeholder="Search"
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
                      {searchedItem.name}
                    </Card.Title>
                    <Card.Text>
                     Description : {searchedItem.description}
                    </Card.Text>
                    <Card.Text>
                     Expiry Date : {searchedItem.expiry}
                    </Card.Text>
                    <Card.Text>
                      Resell Count : {(searchedItem.owners.length) - 1}
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
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
export default Home