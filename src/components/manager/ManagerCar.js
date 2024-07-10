import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert, Button, Col,
    FormControl,
    FormSelect,
    Row, Table
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { deleteCar, fetchBrands, fetchCars } from '../../redux/AdminAction';
import './ManagerCar.css';

const ManagerCar = () => {
    const dispatch = useDispatch();
    const brands = useSelector(state => state.admin.brand || []);
    const cars = useSelector(state => state.admin.cars || []);
    const [searchedProduct, setSearchedProduct] = useState([]);
    const [paggingProducts, setPaggingProducts] = useState([]);
    const [pagging, setPagging] = useState([]);
    const search = useRef("");

    useEffect(() => {
        axios.get('http://localhost:9999/brands')
            .then(response => {
                dispatch(fetchBrands(response.data));
            })
            .catch(error => {
                console.error('Error fetching brands:', error);
            });

        fetchCarsData();
    }, [dispatch]);

    useEffect(() => {
        paginateProducts();
    }, [searchedProduct]);

    const fetchCarsData = () => {
        axios.get('http://localhost:9999/cars')
            .then(response => {
                dispatch(fetchCars(response.data));
                setSearchedProduct(response.data); 
            })
            .catch(error => {
                console.error('Error fetching cars:', error);
            });
    };

    const paginateProducts = () => {
        if (searchedProduct.length >= 10) {
            setPaggingProducts(searchedProduct.slice(0, 10));
        } else {
            setPaggingProducts(searchedProduct.slice(0, searchedProduct.length));
        }
        let pages = [];
        let nums = Math.ceil(searchedProduct.length / 10);
        for (let i = 1; i <= nums; i++) {
            pages = [...pages, i];
        }
        setPagging(pages);
    };

    const Pagging = (index) => {
        if (searchedProduct.length > index * 10) {
            setPaggingProducts(searchedProduct.slice((index - 1) * 10, index * 10));
        } else {
            setPaggingProducts(searchedProduct.slice((index - 1) * 10, searchedProduct.length));
        }
    };

    const filterByCategory = (e) => {
        if (e.target.value === "all") setSearchedProduct(cars);
        else {
            setSearchedProduct(cars.filter(p => Number(p.brand) === Number(e.target.value)));
        }
    };

    const SearchedList = () => {
        const key = search.current.value;
        const searchedList = cars.filter((p) => {
            return p.name.toLowerCase().includes(key.toLowerCase());
        });
        setSearchedProduct(searchedList);
    };

    const getBrandById = (brandId) => {
        const brand = brands.find(b => Number(b.id) === Number(brandId));
        return brand ? brand.brandName : "Unknown";
    };

    const deleteProduct = (id) => {
        const confirmDelete = window.confirm("Do you want to delete id= " + id + "?");
        if (confirmDelete) {
            axios.delete(`http://localhost:9999/cars/${id}`)
                .then(() => {
                    dispatch(deleteCar(id))
                    fetchCarsData(); 
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                });
        }
    };

    const formattedDate = (date) =>{
        const [year, day, month] = date.split('-');
        return `${day}/${month}/${year}`;
    }

    return (
        <>
            <Alert variant="success">
                <h1 style={{ textAlign: 'center' }}>Manager Car</h1>
            </Alert>
            <Row style={{ marginTop: 20, marginBottom: 20, marginLeft : 20 }}>
                <FormSelect onChange={(e) => filterByCategory(e)}>
                    <option value="all">--Filter By Brand--</option>
                    {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.brandName}
                        </option>
                    ))}
                </FormSelect>
                <Col md={4}>
                    <FormControl
                        type="text"
                        placeholder="Enter name to search"
                        ref={search}
                        style={{ fontSize: 20 }}
                        onChange={SearchedList}
                    />
                </Col>
                <Link to="/addCar">
                    <Button
                        style={{ width: "240px", fontSize: 20 }}
                        className="btn-dark"
                    >
                        Create a new product
                    </Button>
                </Link>
            </Row>
            <Row>
                <Col md={12}>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Year</th>
                                <th>Available</th>
                                <th>Description</th>
                                <td>Logo</td>
                                <th>Brand</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paggingProducts.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>
                                        <Link to={`/editCar/${p.id}`} title="edit">
                                            {p.name}
                                        </Link>
                                    </td>
                                    <td>{p.price}</td>
                                    <td>{formattedDate(p.year)}</td>
                                    <td>{p.available}</td>
                                    <td>{p.description}</td>
                                    <td><img src={`${p.image[0].name}`} alt={p.name} style={{ width: '50px', height: '50px' }} /></td>
                                    <td>{getBrandById(p.brand)}</td>
                                    <td>
                                        <Link onClick={() => deleteProduct(p.id)}>Delete</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div>
                        {pagging.map((p) => (
                            <button
                                key={p}
                                className="btn btn-dark"
                                style={{ marginLeft: "5px" }}
                                onClick={() => Pagging(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default ManagerCar;
