import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Carousel } from 'react-bootstrap';
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Footer from './Footer';
import { ImCart } from "react-icons/im";
import { FaStar } from 'react-icons/fa';
import Header from './Header';

export default function Car() {
    const [cars, setCars] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [formData, setFormData] = useState({
        search: '',
        brand: [],
        price: 'all',
    });
    const [paging, setPaging] = useState([]); // page 1, 2, 3, ...
    const [pagingCar, setPagingCar] = useState([]); // cars in a page
    const [currentPage, setCurrentPage] = useState(1);
    const [quantity, setQuantity] = useState(0);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:9999/cars')
            .then(res => {
                setCars(res.data);
                setFilteredCars(res.data);
            })
            .catch(err => {
                console.log(err);
            });
        axios.get('http://localhost:9999/brands')
            .then(res => {
                setBrands(res.data);
            })
            .catch(err => {
                console.log(err);
            });
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartData);
    }, []);

    useEffect(() => {
        filterCars();
    }, [formData]);

    useEffect(() => {
        updatePaging();
    }, [filteredCars, currentPage]);

    const updatePaging = () => {
        const startIndex = (currentPage - 1) * 6;
        const endIndex = startIndex + 6;
        setPagingCar(filteredCars.slice(startIndex, endIndex));

        const pages = [];
        const num = Math.ceil(filteredCars.length / 6);
        for (let i = 1; i <= num; i++) {
            pages.push(i);
        }
        setPaging(pages);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPages = () => {
        return paging.map((page) => (
            <button key={page}
                onClick={() => handlePageChange(page)}
                className={page === currentPage ? 'btn btn-dark' : 'btn btn-light'}
                style={{ margin: '0px 5px 20px 5px' }}
            >{page}
            </button>
        ));
    };

    const renderCars = () => {
        return pagingCar.map(car => (
            <div className="card col-md-4 col-sm-6 col-xs-12 border-0 mb-3" key={car.id}>
                <img className="card-img-top img-fluid w3-animate-right" src={`/assets/${car.image[0]?.name}`} alt={car.name} />
                <div className="card-body">
                    <h4 className="card-title">{car.name}</h4>
                    <p className="card-text">PRICE: {car.price.toLocaleString()} VND</p>
                    <div className='align-item-center' onClick={() => handleShowModal(car)}>
                        <TbPlayerTrackNextFilled color={'blue'} size={25} /> <Link to="#">Show more</Link>
                    </div>
                </div>
            </div>
        ));
    };

    const renderBrands = () => {
        return brands.map(brand => (
            <Form.Check
                key={brand.id}
                type="checkbox"
                label={brand.brandName}
                name='brand'
                value={brand.id}
                onChange={handleChange}
                className="mb-2"
            />
        ));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            let updatedBrands = [...formData.brand];
            if (checked) {
                updatedBrands.push(parseInt(value));
            } else {
                updatedBrands = updatedBrands.filter(brandId => brandId !== parseInt(value));
            }
            setFormData({
                ...formData,
                brand: updatedBrands
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSearch = (e) => {
        setFormData({
            ...formData,
            search: e.target.value
        });
    };

    const filterCars = () => {
        let tempCars = [...cars];

        if (formData.search) {
            tempCars = tempCars.filter(car => car.name.toLowerCase().includes(formData.search.toLowerCase()));
        }

        if (formData.brand.length > 0) {
            tempCars = tempCars.filter(car => formData.brand.includes(car.brand));
        }

        if (formData.price !== 'all') {
            const priceLimit = parseInt(formData.price);
            tempCars = tempCars.filter(car => car.price < priceLimit);
        }

        setFilteredCars(tempCars);
        setCurrentPage(1); // Reset to the first page when filters change
    };

    const handleShowModal = (car) => {
        setSelectedCar(car);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCar(null);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((star, index) => (
            <FaStar key={index} color={index < rating ? "gold" : "lightgray"} />
        ));
    };

    const addToCart = (product) => {
        if (product.available === 0) {
            alert('The product is out of stock')
            return;
        }
        let newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image[0].name,
            quantity: 1,
            total: 0
        }
        let coppyCart = [...cart]
        let index = coppyCart.findIndex(item => item.id === product.id)
        if (index !== -1) {
            coppyCart[index].quantity += 1
        } else {
            coppyCart = [...coppyCart, newItem]
        }
        setCart(coppyCart)
        localStorage.setItem('cart', JSON.stringify(coppyCart))
        alert('Your product has been added to the cart')
    }
    useEffect(() => {
        const updateQuantity = cart.reduce((total) => total + 1, 0)
        setQuantity(updateQuantity)
    }, [cart])

    return (
        <div>
            <Header className="mb-3" quantity={quantity} />
            <div className='background mb-5'>
                <img style={{ width: '100%' }} src='/assets/bg.jpg' alt='background' />
                <div className='container mt-5'>
                    <div className='row'>
                        <div className='col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4'>
                            <Form className='mb-3'>
                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                    onChange={handleSearch}
                                    value={formData.search}
                                />
                            </Form>
                            <div className='mb-4'>
                                <h6>Brands:</h6>
                                {renderBrands()}
                            </div>
                            <div>
                                <h6>Price:</h6>
                                <Form.Check
                                    type="radio"
                                    label="All price"
                                    name='price'
                                    value='all'
                                    onChange={handleChange}
                                    checked={formData.price === 'all'}
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="radio"
                                    label="< 1.000.000.000 đ"
                                    name='price'
                                    value='1000000000'
                                    onChange={handleChange}
                                    checked={formData.price === '1000000000'}
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="radio"
                                    label="< 2.500.000.000 đ"
                                    name='price'
                                    value='2500000000'
                                    onChange={handleChange}
                                    checked={formData.price === '2500000000'}
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="radio"
                                    label="< 4.000.000.000 đ"
                                    name='price'
                                    value='4000000000'
                                    onChange={handleChange}
                                    checked={formData.price === '4000000000'}
                                    className="mb-2"
                                />
                            </div>
                        </div>
                        <div className='col-lg-9 col-md-8 col-sm-6 col-xs-12'>
                            <div className='d-flex justify-content-between mb-3'>
                                <h3>Products</h3>
                            </div>
                            <div className='row'>
                                {renderCars()}
                            </div>
                            <div className='d-flex justify-content-center'>
                                {renderPages()}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
            {/* Car Details Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>Car Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCar && (
                        <div>
                            <Carousel className='mb-3'>
                                {selectedCar.image.map((img, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100"
                                            src={`/assets/${img.name}`}
                                            alt={`Slide ${index}`}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                            <h1>{selectedCar.name}</h1>
                            <p><span className='font-weight-bold'>Price:</span> {selectedCar.price.toLocaleString()} VND</p>
                            <p><span className='font-weight-bold'>Year:</span> {selectedCar.year}</p>
                            <p className={selectedCar.available > 0 ? 'text-success' : 'text-danger'}>
                                <span className='font-weight-bold'>Available:</span> {selectedCar.available > 0 ? 'In stock' : 'Out of stock'}
                            </p>
                            <p><span className='font-weight-bold'>Description:</span> {selectedCar.description}</p>
                            <p><span className='font-weight-bold'>Rating: </span>{renderStars(selectedCar.rating)}</p><br />
                            <button onClick={() => addToCart(selectedCar)} className='btn btn-outline-warning text-end'>Add to cart now <ImCart /></button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
