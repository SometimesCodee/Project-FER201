import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  Row
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { addCar, fetchBrands } from '../../redux/AdminAction';
import './CreateCar.css';

const CreateCar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const name = useRef();
  const price = useRef();
  const year = useRef();
  // const available = useRef();
  const description = useRef();
  const model = useRef()
  const rating = useRef()
  const imageURL = useRef();
  const brandSelect = useRef();
  const brands = useSelector(state => state.admin.brand || []);
  const [carId, setCarId] = useState('');

  useEffect(() => {
    axios.get('http://localhost:9999/brands')
      .then(response => {
        dispatch(fetchBrands(response.data));
      })
      .catch(error => {
        console.error('Error fetching brands:', error);
      });

    axios.get('http://localhost:9999/cars')
      .then(res => {
        setCarId((Number(res.data[res.data.length - 1].id) + 1).toString());
      })
      .catch(error => {
        console.error('Error fetching cars:', error);
      });
  }, [dispatch]);

  const handleCreate = async () => {
    if (
      name.current.value === "" ||
      brandSelect.current.value === "" ||
      price.current.value === "" ||
      year.current.value === "" ||
      model.current.value === "" ||
      rating.current.value === "" ||
      // available.current.value === "" ||
      description.current.value === "" ||
      images.length === 0
    ) {
      toast.error("Please fill in all fields!")
    } else {
      try {
        const newCar = {
          id: carId,
          name: name.current.value,
          brand: parseInt(brandSelect.current.value),
          price: price.current.value,
          model : model.current.value,
          rating : rating.current.value,
          year: year.current.value,
          available: true,
          description: description.current.value,
          image: images,
        };
        axios.post("http://localhost:9999/cars", newCar)
          .then((res) => {
            if (res.status === 201) {
              dispatch(addCar(res.data))
              toast.success("Created successfully")
              navigate("/admin");
            }
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const addImage = () => {
    if (imageURL.current.value === "") {
      toast.error("Please enter an image URL!")
    } else {
      const newImage = {
        id: generateRandomId(),
        name: imageURL.current.value,
      };
      setImages([...images, newImage]);
      imageURL.current.value = "";
    }
  };

  const removeImage = (id) => {
    setImages(images.filter(image => image.id !== id));
  };

  return (
    <Container className="create-car-container">
      <Button className="back-button" style={{marginTop : '30px', width : '15%'}}>
        <Link to="/admin" style={{color : 'black'}}>Back to Home</Link>
      </Button>
      <Row className="d-flex flex-column">
        <h1 className="create-car-title">Create Car</h1>
        <FormGroup as={Row}>
          <FormLabel column sm={2}>Brand:</FormLabel>
          <Col sm={10}>
            <FormSelect ref={brandSelect}>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.brandName}</option>
              ))}
            </FormSelect>
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="form-group-spacing">
          <FormLabel column sm={2}>Name:</FormLabel>
          <Col sm={10}>
            <FormControl type="text" ref={name} />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="form-group-spacing">
          <FormLabel column sm={2}>Price:</FormLabel>
          <Col sm={10}>
            <FormControl type="number" ref={price} />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="form-group-spacing">
          <FormLabel column sm={2}>Year:</FormLabel>
          <Col sm={10}>
            <FormControl type="date" ref={year} />
          </Col>
        </FormGroup>
        {/* <FormGroup as={Row} className="form-group-spacing">
          <FormLabel column sm={2}>Available:</FormLabel>
          <Col sm={10}>
            <FormControl type="number" ref={available} />
          </Col>
        </FormGroup> */}
        <FormGroup as={Row} className="form-group-spacing">
          <FormLabel column sm={2}>Description:</FormLabel>
          <Col sm={10}>
            <FormControl as="textarea" rows={3} ref={description} />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="form-group-spacing">
          <FormLabel column sm={2}>Model:</FormLabel>
          <Col sm={10}>
            <FormControl as="textarea" rows={3} ref={model} />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="form-group-spacing">
          <FormLabel column sm={2}>Rating:</FormLabel>
          <Col sm={10}>
            <FormControl as="textarea" rows={3} ref={rating} />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="form-group-spacing">
          <FormLabel column sm={2}>Image URL:</FormLabel>
          <Col sm={10}>
            <FormControl type="text" ref={imageURL} placeholder="Enter image URL" />
            <Button onClick={addImage} className="mt-2" variant="dark">Add Image</Button>
          </Col>
        </FormGroup>
        <div className="image-preview-container">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image.name} alt={`img-${index}`} className="image-thumbnail" />
              <span>ID: {image.id}</span>
              <Button variant="danger" onClick={() => removeImage(image.id)} className="ml-2">Remove</Button>
            </div>
          ))}
        </div>
        <Button className="mt-2" onClick={handleCreate} variant="warning">
          Create
        </Button>
      </Row>
    </Container>
  );
};

export default CreateCar;
