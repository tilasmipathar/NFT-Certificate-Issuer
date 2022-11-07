import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import market from './market.png'
import { useNavigate } from "react-router-dom";

import './Nav.css';

const Navigation = ({ web3Handler, account }) => {

    let navigate = useNavigate();

    function changeLocation(placeToGo){
        navigate(placeToGo, { replace: true });
        window.location.reload();
    }

    return (
        <Navbar className = "navb" variant="dark">
            <Container>
                <Navbar.Brand href="" className = "logo">
                    <img src={market} width="280" height="210" className="" alt="" />
                    &nbsp; 
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link className="a" as={Link} to="/" >DASHBOARD</Nav.Link>
                        <Nav.Link className="a" as={Link} to="/create" >ISSUE</Nav.Link>
                        <Nav.Link className="a" as={Link} to="/my-listed-items" >ISSUED CERTIFICATES</Nav.Link>
                        <Nav.Link className="" as={Link} to="/my-purchases" >MY CERTIFICATES</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button className="button" onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;