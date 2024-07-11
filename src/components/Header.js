import React, { useEffect, useState } from 'react'
import { Navbar, Nav, NavDropdown, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ImCart } from "react-icons/im";

export default function Header() {
    const [cart, setCart] = useState([]);
    useEffect(() => {
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartData);
    }, []);
    return (
        <div style={{ position: 'fixed', zIndex: 100 }}>
            <Navbar style={{ position: 'fixed', width: '100%', paddingLeft: '5%', paddingRight: '5%', height: '90px', backgroundColor: '#0B0E15' }} expand="lg" className="shadow-sm" >
                <Navbar.Brand href="#home">
                    <img
                        src={'/assets/OIG3.jpg'}
                        className="d-inline-block align-top mr-5"
                        alt="Vinfast logo"
                        height='70px'
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'white' }} />
                <Navbar.Collapse id="basic-navbar-nav" style={{ backgroundColor: '#0B0E15', opacity: '0.9' }} className='p-4'>
                    <Nav className="mr-auto">
                        <Nav.Link href='/' className="text-light" style={{ fontWeight: 'bold' }}>Home</Nav.Link>
                        <Nav.Link href="/cars" className="text-light" style={{ fontWeight: 'bold' }}>Car</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        <Nav.Link href="/cart" className="text-light mr-3" style={{ fontWeight: 'bold', color: 'orange' }}>Cart <ImCart /> <span style={{ color: '#2ECC71', fontWeight: 'bold' }}>({cart.length})</span></Nav.Link>
                        <Nav.Link href="#sign-in" className="btn btn-primary text-light">Sign In</Nav.Link>
                    </Nav>
                    <Navbar.Toggle aria-controls="basic-navbar-nav " style={{ borderColor: 'white' }} className='mt-3' />
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}
