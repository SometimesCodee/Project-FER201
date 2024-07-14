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
import { toast } from 'react-toastify';

export default function Car() {
    const [cars, setCars] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [models, setModels] = useState([]);
    const [formData, setFormData] = useState({
        search: '',
        brand: '',
        price: 'all',
        model: []
    });
    const [paging, setPaging] = useState([]); // page 1, 2, 3, ...
    const [pagingCar, setPagingCar] = useState([]); // cars in a page
    const [currentPage, setCurrentPage] = useState(1);
    const [quantity, setQuantity] = useState(0);
    const [cart, setCart] = useState([]);

    console.log(formData);

    useEffect(() => {
        axios.get('http://localhost:9999/cars')
            .then(res => {
                setCars(res.data);
                setFilteredCars(res.data);
                setModels([...new Set(res.data.map(car => car.model))]);
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
        console.log('filter')
    }, [formData]);

    useEffect(() => {
        updatePaging();
    }, [filteredCars, currentPage]);

    const renderBrands = () => {
        return brands.map((brand, index) => (
            <div key={index} className="col-md-2" style={{ cursor: "pointer" }} onClick={() => handleBrandClick(brand.id)}>
                <img style={{ width: "50%" }} src={brand.image} alt=''></img>
            </div>
        ));
    };
    const handleBrandClick = (brandId) => {
        setFormData({
            ...formData,
            brand: brandId
        });
    };

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
                <img className="card-img-top img-fluid w3-animate-right" src={`${car.image[0]?.name}`} alt={car.name} />
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

    const renderModel = () => {
        return models.map((model, index) => (
            <Form.Check
                key={index}
                type="checkbox"
                label={model}
                name='model'
                value={model}
                onChange={handleChange}
                className="mb-2"
            />
        ));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            let updatedModels = [...formData.model];
            if (checked) {
                updatedModels.push(value);
            } else {
                updatedModels = updatedModels.filter(model => model !== value);
            }
            setFormData({
                ...formData,
                model: updatedModels
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

        if (formData.brand) {
            tempCars = tempCars.filter(car => Number(car.brand) === Number(formData.brand));
        }

        if (formData.search) {
            tempCars = tempCars.filter(car => car.name.toLowerCase().includes(formData.search.toLowerCase()));
        }

        if (formData.model.length > 0) {
            tempCars = tempCars.filter(car => formData.model.includes(car.model));
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
        if (product.available === false) {
            // alert('The product is out of stock')
            toast.error('The product is out of stock')
            return;
        }
        let newItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image[0].name,
            quantity: 1
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
        toast.success('Product has been added to the cart ')
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
                <h2 className='text-center mb-5 mt-5'>BRAND</h2>
                <div className='row brands justify-content-center mb-5'>
                    {renderBrands()}
                </div>
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
                                <h6>Model:</h6>
                                {renderModel()}
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
                                            src={`${img.name}`}
                                            alt={`Slide ${index}`}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                            <h1>{selectedCar.name}</h1>
                            <p><strong>Price:</strong> {selectedCar.price.toLocaleString()} VND</p>
                            <p><strong >Year:</strong> {selectedCar.year}</p>
                            <p className={selectedCar.available > 0 ? 'text-success' : 'text-danger'}>
                                <strong>Available:</strong> {selectedCar.available ? 'In stock' : 'Out of stock'}
                            </p>
                            <p><strong>Description:</strong> {selectedCar.description}</p>
                            <p><strong>Rating: </strong>{renderStars(selectedCar.rating)}</p><br />
                            <button onClick={() => addToCart(selectedCar)} className={`btn btn-outline-warning text-end ${selectedCar.available ? '' : 'disabled'}`}>{selectedCar.available ? 'Add to cart' : 'Out of stock'} <ImCart /></button>
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
