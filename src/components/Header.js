import React, { useEffect, useState } from 'react'
import { Navbar, Nav, NavDropdown, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ImCart } from "react-icons/im";
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [cart, setCart] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();
    console.log(cart.length)
    useEffect(() => {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            try {
                setCart(JSON.parse(cartData));
            } catch (e) {
                console.error('Error parsing cart data', e);
                setCart([]);
            }
        }

        const userData = localStorage.getItem('loggedInUser');
        if (userData) {
            try {
                setLoggedInUser(JSON.parse(userData));
            } catch (e) {
                console.error('Error parsing user data', e);
                setLoggedInUser(null);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
        navigate("/home");
    };

    return (
        <div style={{ position: 'fixed', zIndex: 100 }}>
            <Navbar style={{ position: 'fixed', width: '100%', paddingLeft: '5%', paddingRight: '5%', height: '90px', backgroundColor: '#0B0E15' }} expand="lg" className="shadow-sm" >
                <Navbar.Brand href="/">
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

                        {loggedInUser ? (
                            <>
                                <Nav.Link as={Link} to={`/customer/profile/${loggedInUser.id}`} className="text-light" style={{ fontWeight: 'bold' }}>
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
                    <Navbar.Toggle aria-controls="basic-navbar-nav " style={{ borderColor: 'white' }} className='mt-3' />
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}