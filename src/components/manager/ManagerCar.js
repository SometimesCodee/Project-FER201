import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert, Button, Col,
    FormControl,
    FormSelect,
    Nav,
    Row, Table
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { deleteCar, fetchBrands, fetchCars } from '../../redux/AdminAction';
import './ManagerCar.css';

const ManagerCar = () => {

    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const handleLogout = () => {
        localStorage.removeItem("loggedInUser");
        navigate("/home");
    };

    const dispatch = useDispatch();
    const brands = useSelector(state => state.admin.brand || []);
    const cars = useSelector(state => state.admin.cars || []);
    const [searchedProduct, setSearchedProduct] = useState([]);
    const [paggingProducts, setPaggingProducts] = useState([]);
    const [pagging, setPagging] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
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
                    toast.success('succes full')
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

    const sortProducts = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        let sortedProducts = [...searchedProduct];
        sortedProducts.sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setSearchedProduct(sortedProducts);
    };

    return (
         <>
            <Alert variant="success" className='row'>
                <h1 className='col-md-12' style={{ textAlign: 'center' }}>Manager System</h1>
                <div className='col-md-9'>

                </div>
                <Nav className="ml-auto col-md-3">
                        {loggedInUser ? (
                            <>
                                <Nav.Link href="#profile" className="text-light" style={{ fontWeight: 'bold',color:"black"}}>
                                    <h5 style={{color:"black",fontWeight: 'bold'}}>{loggedInUser.userName}</h5>
                                </Nav.Link>
                                <Nav.Link onClick={handleLogout} className="btn btn-danger text-light">
                                    Log Out
                                </Nav.Link>
                            </>
                        ) : (
                            <Nav.Link href="/login" className="btn btn-primary text-light" style={{display : 'none'}}>
                                Sign In
                            </Nav.Link>
                        )}
                    </Nav>
            </Alert>
            <Row className="mb-3" style={{ marginLeft: 20 }}>
                <Col xs={12} md={4} className="mb-2">
                    <FormSelect onChange={(e) => filterByCategory(e)}>
                        <option value="all">--Filter By Brand--</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.brandName}
                            </option>
                        ))}
                    </FormSelect>
                    <Link to="/manaCustomer">
                        <Button style={{ width: "45%", fontSize: 15, marginLeft : '20px' }} className="btn-dark">
                            Manager Account Customer
                        </Button>
                    </Link>
                </Col>
                <Col xs={12} md={4} className="mb-2">
                    <FormControl
                        type="text"
                        placeholder="Enter name to search"
                        ref={search}
                        style={{ fontSize: 20 }}
                        onChange={SearchedList}
                    />
                </Col>
                <Col xs={12} md={4} className="text-md-end">
                    <Link to="/addCar">
                        <Button style={{ width: "50%", fontSize: 20 }} className="btn-warning">
                            Create a new product
                        </Button>
                    </Link>
                    <Link to="/addBrand">
                        <Button style={{ width: "45%", fontSize: 20, marginLeft : '20px' }} className="btn-warning">
                            Add new brand
                        </Button>
                    </Link>
                    
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Table striped bordered responsive>
                        <thead>
                            <tr>
                                <th onClick={() => sortProducts('id')}>ID</th>
                                <th onClick={() => sortProducts('name')}>Name</th>
                                <th onClick={() => sortProducts('price')}>Price</th>
                                <th onClick={() => sortProducts('year')}>Year</th>
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
                                    <td>{p.available ? "Còn Hàng" : "Hết Hàng"}</td>
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
                    <div className="d-flex justify-content-center">
                        {pagging.map((p) => (
                            <Button
                                key={p}
                                className="btn-dark mx-1"
                                onClick={() => Pagging(p)}
                            >
                                {p}
                            </Button>
                        ))}
                    </div>
                </Col>
            </Row>
        </>
    )
       
 };

export default ManagerCar;
