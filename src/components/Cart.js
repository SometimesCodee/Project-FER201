import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import { FaTrashAlt } from "react-icons/fa";
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    console.log(cart);
    const naviagte = useNavigate();

    useEffect(() => {
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartData);
    }, []);

    useEffect(() => {
        setTotal(cart.reduce((total, item) => total + (item.price * item.quantity), 0));
    }, [cart]);

    const handleClearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const handleQuantityChange = (id, quantity) => {
        const updatedCart = cart.map(item =>
            item.id === id ? { ...item, quantity: parseInt(quantity) } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const renderCart = () => {
        return cart.map((item) => (
            <tr>
                <td><img src={`/assets/${item.image}`} className="w-100" alt={item.name} /></td>
                <td><p><strong>{item.name}</strong></p></td>
                <td><p><strong>Quantity:</strong> {item.quantity}</p></td>
                <td><p className="text-start text-md-center"><strong>${(item.price * item.quantity).toLocaleString()}</strong></p></td>
                <td><button type="button" className="btn btn-danger btn-sm me-1 mb-2" onClick={() => handleRemoveItem(item.id)} title="Remove item">
                    <FaTrashAlt />
                </button>
                </td>
            </tr>
        ));
    };

    const checkOut = () => {
        setCart([]);
        localStorage.removeItem('cart');
        naviagte('/');
    }


    return (
        <div>
            <Header />
            <h1 className="text-center">Your Cart</h1>
            <section className="h-100">
                <div className="container py-5">
                    <div className="row d-flex justify-content-center my-4">
                        <div className="col-md-9">
                            <div className="card mb-4">
                                <div className="card-header py-3">
                                    <h5 className="mb-0">Cart - {cart.length} items</h5>
                                </div>
                                <div className="card-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderCart()}

                                        </tbody>
                                    </table>

                                    <hr className="my-4" />
                                    <button className="btn btn-danger" onClick={handleClearCart}>Clear Cart</button>
                                </div>
                            </div>
                            <div className="card mb-4 mb-lg-0">
                                <div className="card-body">
                                    <p><strong>We accept</strong></p>
                                    <img className="mr-2" width="45px" src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg" alt="Visa" />
                                    <img className="mr-2" width="45px" src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg" alt="American Express" />
                                    <img className="mr-2" width="45px" src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg" alt="Mastercard" />
                                    {/* <img className="me-2" width="45px" src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce/includes/gateways/paypal/assets/images/paypal.webp" alt="PayPal acceptance mark" /> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card mb-4">
                                <div className="card-header py-3">
                                    <h5 className="mb-0">Summary</h5>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                            <div>
                                                <strong>Total amount</strong>
                                            </div>
                                            <span><strong>{total.toLocaleString()} VND</strong></span>
                                        </li>
                                    </ul>

                                    <button type="button" className="btn btn-warning btn-lg btn-block" onClick={checkOut}>
                                        Checkout
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
