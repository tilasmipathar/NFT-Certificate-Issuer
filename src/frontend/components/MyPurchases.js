import { useState, useEffect } from 'react'
import { Row, Col, Card, Form, Button} from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

function compare(year1, mon1, day1, year2, mon2, day2) {
  if(year1 > year2)
  {
      return true
  }

  else if (year1 < year2)
  {
      return false
  }

  // year1 ==  year2
  else
  {
      if (mon1 ==  mon2)
      {
          if (day1 ==  day2)
          {
              return true;
          }

          else if(day1 > day2)
          {
              return true
          }

          else
          {
              return false
          }
      }

      else if (mon1 > mon2)
      {
          return true
      }

      else 
      {
          return false
      }
  }

}

export default function MyPurchases({ nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const [newWallet, setNewWallet] = useState('')
  
  const loadPurchasedItems = async () => {
    const itemCount = await nft.itemCount()
    let purchasedItems = []

    var curr_date = new Date().toISOString().slice(0, 10);
    var curr_year = curr_date.slice(0, 4);
    var curr_month = curr_date.slice(5, 7);
    var curr_day = curr_date.slice(8, 10);

    let iCday = parseInt(curr_day, 10);
    let iCmonth = parseInt(curr_month, 10);
    let iCyear = parseInt(curr_year, 10);
    
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await nft.items(indx)
      if (i.current_owner.toLowerCase() === account && i.current_owner !== i.owner) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()

        var e_year = metadata.expiry.slice(0, 4);
        var e_month = metadata.expiry.slice(5, 7);
        var e_day = metadata.expiry.slice(8, 10);

        let eCday = parseInt(e_day, 10);
        let eCmonth = parseInt(e_month, 10);
        let eCyear = parseInt(e_year, 10);
        
        let expiry_status = !compare(eCyear, eCmonth, eCday, iCyear, iCmonth, iCday);
        
        // define listed item object
        
        let item = {
          serial: metadata.serial,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          expiry: metadata.expiry,
          owner: i.owner,
          purchaseDate: metadata.purchaseDate,
          expired: expiry_status,
          expirable: metadata.expirable,
          website: metadata.website,
          phone: metadata.phone
        }
        purchasedItems.push(item)        
      }
    }
    setLoading(false)
    setPurchases(purchasedItems)
  }

  const burn = async (serial) => {
    const itemCount = await nft.itemCount()
    
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await nft.items(indx)
      if (i.serial === serial) {
          try{
            const tokenId = i.tokenId
            await(await nft.completeBurn(tokenId, indx)).wait()
            setLoading(false)
            
            const uri = i.tokenUri;
            const response = await fetch(uri)
            const metadata = await response.json()
            
            window.location.href = metadata.website;

            return
          }    
          catch(error) {
            console.log("ipfs uri upload error: ", error)
          }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>
                      {item.description}
                    </Card.Title>
                    <Card.Text>
                      ID : {item.serial}
                    </Card.Text>
                    <Card.Text>
                      Name : {item.name}
                    </Card.Text>
                    <Card.Text>
                     Issue Date : {item.purchaseDate}
                    </Card.Text>
                    <Card.Text>
                     Expiry Date : {item.expiry}
                    </Card.Text>
                    <Card.Text>
                     Contact Number : {item.phone}
                    </Card.Text>
                    <Card.Text>
                     Issuer ID : {item.owner}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                    {!item.expired || item.expirable==='False' ? (
                      console.log()
                    ) : (
                      <Button onClick={() => burn(item.serial)} variant="primary" size="lg">
                        Burn Certificate (Certificate Expired)
                      </Button>
                    )}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No Certificates</h2>
          </main>
        )}
    </div>
  );
}