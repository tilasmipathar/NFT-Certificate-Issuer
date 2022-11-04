import { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'

export default function MyListedItems({ nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  
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

  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await nft.itemCount()
    let _listedItems = []
    
    var curr_date = new Date().toISOString().slice(0, 10);
    var curr_year = curr_date.slice(0, 4);
    var curr_month = curr_date.slice(5, 7);
    var curr_day = curr_date.slice(8, 10);

    let iCday = parseInt(curr_day, 10);
    let iCmonth = parseInt(curr_month, 10);
    let iCyear = parseInt(curr_year, 10);

    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await nft.items(indx)
      if (i.owner.toLowerCase() === account.toLowerCase()) {
        // get uri url from nft contract
        const uri = i.tokenUri
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
        console.log(expiry_status)
        
        // define listed item object
        let item = {}
        console.log(i.redeemed)
        if(i.redeemed){
          item = {
            serial: metadata.serial,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            expiry: metadata.expiry,
            owners: metadata.owners,
            purchaseDate: metadata.purchaseDate,
            currentOwner: i.current_owner,
            redeemed: "Redeemed"
          }
        }
        else{
          item = {
            serial: metadata.serial,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            expiry: metadata.expiry,
            owners: metadata.owners,
            purchaseDate: metadata.purchaseDate,
            currentOwner: i.current_owner,
            redeemed: "Not Redeemed"
          }
        }
        if(expiry_status === false)
        {
         _listedItems.push(item)
        }
      }
    }
    setListedItems(_listedItems)
    setLoading(false)
  }
  useEffect(() => {
    loadListedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Title>
                      {item.name}
                    </Card.Title>
                    <Card.Text>
                     Description : {item.description}
                    </Card.Text>
                    <Card.Text>
                     Sell Date : {item.purchaseDate}
                    </Card.Text>
                    <Card.Text>
                     Expiry Date : {item.expiry}
                    </Card.Text>
                    <Card.Text>
                      Resell Count : {(item.owners.length) - 1}
                    </Card.Text>
                    <Card.Text>
                      Current Owner Wallet ID : {item.currentOwner}
                    </Card.Text>
                    <Card.Text>
                      Status : {item.redeemed}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
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