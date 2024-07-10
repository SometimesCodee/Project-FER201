import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  FormControl,
  FormGroup,
  FormSelect,
  Row
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addCar, fetchBrands } from '../../redux/AdminAction';

const CreateCar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const name = useRef();
  const price = useRef();
  const year = useRef();
  const available = useRef();
  const description = useRef();
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
      available.current.value === "" ||
      description.current.value === ""
    ) {
      alert("Please fill in all fields!");
    } else {
      try {
        const newCar = {
          id: carId,
          name: name.current.value,
          brand: parseInt(brandSelect.current.value),
          price: price.current.value,
          year: year.current.value,
          available: available.current.value,
          description: description.current.value,
          image: images,
        };
        axios.post("http://localhost:9999/cars", newCar)
          .then((res) => {
            if (res.status === 201) {
              dispatch(addCar(res.data))
              alert("Created successfully");
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
      alert("Please enter an image URL!");
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
    <Container>
      <Button style={{backgroundColor : 'orange', marginTop : '30px'}}>
        <Link to="/admin" style={{color : 'black'}}>Back to Home</Link>
      </Button>
      <Row className="d-flex flex-column">
        <h1 style={{fontWeight : 'bold'}}>Create Car</h1>
        <FormGroup>
          <label>Brand:</label>
          <FormSelect ref={brandSelect}>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.brandName}</option>
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup>
          <label>Name:</label>
          <FormControl type="text" ref={name} />
        </FormGroup>
        <FormGroup>
          <label>Price:</label>
          <FormControl type="number" ref={price} />
        </FormGroup>
        <FormGroup>
          <label>Year:</label>
          <FormControl type="date" ref={year} />
        </FormGroup>
        <FormGroup>
          <label>Available:</label>
          <FormControl type="number" ref={available} />
        </FormGroup>
        <FormGroup>
          <label>Description:</label>
          <FormControl as="textarea" rows={3} ref={description} />
        </FormGroup>
        <FormGroup>
          <label>Image URL:</label>
          <FormControl type="text" ref={imageURL} placeholder="Enter image URL" />
          <Button onClick={addImage} style={{ marginTop: "10px" }} variant="dark">Add Image</Button>
        </FormGroup>
        <div>
          {images.map((image, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img src={image.name} alt={`img-${index}`} style={{ width: 100, height: 100, marginRight: 10 }} />
              <span>ID: {image.id}</span>
              <Button variant="danger" onClick={() => removeImage(image.id)} style={{ marginLeft: '10px' }}>Remove</Button>
            </div>
          ))}
        </div>
        <Button style={{ marginTop: "10px" }} onClick={handleCreate} variant="warning">
          Create
        </Button>
      </Row>
    </Container>
  );
};

export default CreateCar;
