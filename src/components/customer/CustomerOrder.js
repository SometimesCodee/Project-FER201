import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

export default function CustomerOrder() {
    const [orders, setOrders] = useState([]);
    const [uerOrder, setUserOrder] = useState([]);
    const [user, setUser] = useState({})
    const { id } = useParams();
    useEffect(() => {
        axios.get('http://localhost:9999/orders')
            .then(res => {
                setOrders(res.data);
                setUserOrder(res.data.filter(order => order.loggedInUser.id === id));
            })
            .catch(err => {
                console.log(err);
            })
        axios.get(`http://localhost:9999/users/${id}`)
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [id])
    const renderOrders = () => {
        return uerOrder.map((order, index) => (
            <div className='card mb-3' key={index}>
                <strong className='ml-2'>Order ID: {order.id}</strong>
                {order.cart.map((cart, index) => (
                    <>

                        <div className='row'>
                            <div className='col-md-3'>
                                <img className='img-fluid' src={cart.image} alt=''></img>
                            </div>
                            <div className='col-md-9'>
                                <div className='card-body'>
                                    <h5 className='card-title'>{cart.name}</h5>
                                    <p className='card-text'>Quantity: {cart.quantity}</p>
                                    <strong className='card-text'>Price: {cart.price.toLocaleString()} VND</strong>
                                </div>
                            </div>
                        </div>
                    </>
                ))}
            </div>
        ))
    }
    return (
        <div className='container'>
            <div className="row">
                <div className="col">
                    <nav aria-label="breadcrumb" className="bg-body-tertiary rounded-3 p-3 mb-4">
                        <ol className="breadcrumb mb-0">
                            <li className='breadcrumb-item mr-3' aria-current='page'>
                                <Link to={`/customer/profile/${user.id}`}>User Profile</Link>
                            </li>
                            <li className='breadcrumb-item' aria-current='page'>
                                <Link to={`/customer/profile/${user.id}/orders`}>Orders</Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            <h1 className='text-center mt-3 mb-5'>Order History</h1>
            <div >
                {renderOrders()}
            </div>
        </div>
    )
}
