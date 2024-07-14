import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { FaCar, FaEnvelope, FaInfoCircle, FaStar, FaTools } from 'react-icons/fa';
import { GrLinkNext } from "react-icons/gr";
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Footer from './Footer';
import Header from './Header';

export default function Home() {
    const [cars, setCars] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [models, setModels] = useState([]);

    const [formData, setFormData] = useState({
        search: '',
        brand: '',
        price: 'all',
        model: ''
    });

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
    }, []);

    useEffect(() => {
        filterCars();
    }, [formData]);

    const renderStars = (rating) => {
        return [...Array(5)].map((star, index) => (
            <FaStar key={index} color={index < rating ? "gold" : "lightgray"} />
        ));
    };

    const renderCars = () => {
        return filteredCars.slice(0, 6).map(car => (
            <div className="card col-md-4 col-sm-6 col-xs-12 border-0 mb-3" key={car.id}>
                <img className="card-img-top img-fluid w3-animate-right" src={`${car.image[0].name}`} alt='' />
                <div className="card-body">
                    <h4 className="card-title">{car.name}</h4>
                    <p className="card-text">PRICE: {car.price.toLocaleString()} VND</p>
                    <p><strong>Rating:</strong> {renderStars(car.rating)}</p>
                    {/* <div className='align-item-center'>
                        <TbPlayerTrackNextFilled color={'blue'} size={25} /> <Link to={`/car/${car.id}`}>Show more</Link>
                    </div> */}
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

    const renderBrands = () => {
        return brands.map((brand, index) => (
            <div key={index} className="col-md-2" style={{ cursor: "pointer" }} onClick={() => handleBrandClick(brand.id)}>
                <img style={{ width: "70%" }} src={brand.image} alt=''></img>
            </div>
        ));
    };

    const handleBrandClick = (brandId) => {
        setFormData({
            ...formData,
            brand: brandId
        });
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
    };

    return (
        <div>
            <Header className="mb-3"></Header>
            <div className='background mb-5'>
                <video style={{ width: '100%' }} autoPlay muted loop>
                    <source src="/assets/Bugatti Tourbillon - Eu Sento Gabu - 4K.mp4" type="video/mp4" />
                </video>
                <div className='container mt-5'>
                    <h1 className='text-center mb-5'>BRAND</h1>
                    <div className='row brands justify-content-center mb-5'>
                        {renderBrands()}
                    </div>
                    <div className='row'>
                        <div className='col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4'>
                            <Form className='mb-3'>
                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                    onChange={handleSearch}
                                    value={formData.search}
                                />
                                <button className='btn btn-dark mt-2'><IoIosSearch /></button>
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
                                <h3>Popular products</h3>
                            </div>
                            <div className='row'>
                                {renderCars()}
                            </div>
                            <div className='d-flex justify-content-center'>
                                <Link to={'/cars'}><button className='btn btn-outline-dark p-3' style={{ margin: '0 auto', borderRadius: '30px', color: 'black' }}>View More <GrLinkNext /></button></Link>
                            </div>
                        </div>

                    </div>
                </div>
                <Container>
                    <Row className='mt-5 gap-5'>
                        <Col sm={3} className="text-center p-3" style={{ backgroundColor: '#F0F0F0' }}>
                            <Link className='text-decoration-none'>
                                <FaInfoCircle size={40} color='black' />
                                <p className='text-secondary' style={{ fontWeight: 'bold' }}>Request for Information</p>
                            </Link>
                        </Col>
                        <Col sm={3} className="text-center p-3" style={{ backgroundColor: '#F0F0F0' }}>
                            <Link className='text-decoration-none'>
                                <FaTools size={40} color='black' />
                                <p className='text-secondary' style={{ fontWeight: 'bold' }} >Request for Service</p>
                            </Link>

                        </Col>
                        <Col sm={3} className="text-center p-3" style={{ backgroundColor: '#F0F0F0' }} >
                            <Link className='text-decoration-none'>
                                <FaCar size={40} color='black' />
                                <p className='text-secondary' style={{ fontWeight: 'bold' }}>Request for Test Drive</p>
                            </Link>

                        </Col>
                        <Col sm={3} className="text-center p-3" style={{ backgroundColor: '#F0F0F0' }} >
                            <Link className='text-decoration-none'>
                                <FaEnvelope size={40} color='black' />
                                <p className='text-secondary' style={{ fontWeight: 'bold' }}>Contact Us</p>
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />

        </div>
    )
}
