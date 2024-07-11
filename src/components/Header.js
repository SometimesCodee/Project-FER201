import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        navigate("/home");
    };

    return (
        <div >
            <Navbar style={{ position: 'fixed', width: '100%', paddingLeft: '5%', paddingRight: '5%', height: '99px', backgroundColor: '#0B0E15' }} expand="lg" className="shadow-sm" >
                <Navbar.Brand href="#home">
                    <img
                        src={'/assets/OIG3.jpg'}
                        className="d-inline-block align-top mr-5"
                        alt="Vinfast logo"
                        width={100}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#models" className="text-light" style={{ fontWeight: 'bold' }}>Home</Nav.Link>
                        <Nav.Link href="#service" className="text-light" style={{ fontWeight: 'bold' }}>Car</Nav.Link>
                        <Nav.Link href="#store-locator" className="text-light" style={{ fontWeight: 'bold' }}>About</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        {loggedInUser ? (
                            <>
                                <Nav.Link href="#profile" className="text-light" style={{ fontWeight: 'bold' }}>
                                    {loggedInUser.userName}
                                </Nav.Link>
                                <Nav.Link onClick={handleLogout} className="btn btn-danger text-light">
                                    Log Out
                                </Nav.Link>
                            </>
                        ) : (
                            <Nav.Link href="/login" className="btn btn-primary text-light">
                                Sign In
                            </Nav.Link>
                        )}
                    </Nav>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}