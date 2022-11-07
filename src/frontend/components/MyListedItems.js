import { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import './mylist.css';

const MyListedCertificates = ({ account, nft }) => {
  const [loading, setLoading] = useState(true);
  const [searchedItem, setSearchedItem] = useState(null);
  const [indx, setIndx] = useState(null);
  const [serial, setSerial] = useState("");

  function compare(year1, mon1, day1, year2, mon2, day2) {
    if (year1 > year2) {
      return true;
    } else if (year1 < year2) {
      return false;
    }

    // year1 ==  year2
    else {
      if (mon1 == mon2) {
        if (day1 == day2) {
          return true;
        } else if (day1 > day2) {
          return true;
        } else {
          return false;
        }
      } else if (mon1 > mon2) {
        return true;
      } else {
        return false;
      }
    }
  }

  const searchMarketplaceItems = async () => {
    var curr_date = new Date().toISOString().slice(0, 10);
    var curr_year = curr_date.slice(0, 4);
    var curr_month = curr_date.slice(5, 7);
    var curr_day = curr_date.slice(8, 10);

    let iCday = parseInt(curr_day, 10);
    let iCmonth = parseInt(curr_month, 10);
    let iCyear = parseInt(curr_year, 10);

    // Load all unsold items
    setIndx(null);
    const itemCount = await nft.itemCount();

    for (let i = 1; i <= itemCount; i++) {
      const item = await nft.items(i);
      if (
        item.serial === serial &&
        item.owner.toLowerCase() === account.toLowerCase()
      ) {
        setIndx(i);
        // get uri url from nft contract
        const uri = item.tokenUri;
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        
        const owner = item.owner;

        let expirable = metadata.expirable;
        let expiry_status = false;

        if(expirable === 'True'){
            var e_year = metadata.expiry.slice(0, 4);
            var e_month = metadata.expiry.slice(5, 7);
            var e_day = metadata.expiry.slice(8, 10);

            let eCday = parseInt(e_day, 10);
            let eCmonth = parseInt(e_month, 10);
            let eCyear = parseInt(e_year, 10);

            expiry_status = !compare(
            eCyear,
            eCmonth,
            eCday,
            iCyear,
            iCmonth,
            iCday
            );
        }
        else{
            expiry_status = false
        }

        if (metadata.serial === serial) {
          let item = {};
          console.log(metadata.phone)
          item = {
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
          };
          
          if (expiry_status === false) {
            setSearchedItem(item);
            setLoading(false);
            return;
          }
        }
      }
    }
    setLoading(false);
    setSearchedItem(null);
  };

  useEffect(() => {
    // loadMarketplaceItems()
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <div className="App">
          <div class="container h-100">
            <div class="row h-100 justify-content-center align-items-center"></div>
            <InputGroup className="col66">
              <FormControl
                onChange={(e) => setSerial(e.target.value)}
                placeholder="Certificate ID"
                aria-label="Search"
                aria-describedby="basic-addon2"
              />
              <Button
                onClick={() => {
                  searchMarketplaceItems();
                }}
                variant="outline-dark"
                id="button-addon2"
              >
                Search
              </Button>
            </InputGroup>
          </div>
        </div>
      </main>
    );
  return (
    <div className="flex justify-center">
      {searchedItem !== null ? (
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
                </Card>
            </Col>
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No Certificate Issued</h2>
        </main>
      )}
    </div>
  );
};
export default MyListedCertificates;
