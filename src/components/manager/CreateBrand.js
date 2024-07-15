import axios from "axios";
import React, { useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  Row
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { addBrand } from '../../redux/AdminAction';
import './CreateBrand.css';

const CreateBrand = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const brandName = useRef();
  const imageURL = useRef();
  const [previewImage, setPreviewImage] = useState('');

  // Tạo ID ngẫu nhiên cho brand mới
  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000).toString();
  };

  const handleCreate = async () => {
    if (brandName.current.value === "" || imageURL.current.value === "") {
      toast.error("Please fill in all fields!")
    } else {
      try {
        const newBrand = {
          id: generateRandomId(),
          brandName: brandName.current.value,
          image: imageURL.current.value,
        };
        axios.post("http://localhost:9999/brands", newBrand)
          .then((res) => {
            if (res.status === 201) {
              dispatch(addBrand(res.data))
              toast.success("Created successfully")
              navigate("/admin");
            }
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleImageURLChange = () => {
    const url = imageURL.current.value;
    setPreviewImage(url);
  };

  return (
    <Container className="create-brand-container">
      <Button className="back-button" style={{marginTop : '30px', width : '15%'}}>
        <Link to="/admin" style={{color : 'black'}}>Back to Home</Link>
      </Button>
      <Row className="d-flex flex-column">
        <h1 className="create-brand-title">Create Brand</h1>
        <FormGroup as={Row}>
          <FormLabel column sm={2}>Brand Name:</FormLabel>
          <Col sm={10}>
            <FormControl type="text" ref={brandName} />
          </Col>
        </FormGroup>
        <FormGroup as={Row} className="form-group-spacing">
          <FormLabel column sm={2}>Image URL:</FormLabel>
          <Col sm={10}>
            <FormControl type="text" ref={imageURL} placeholder="Enter image URL" onChange={handleImageURLChange} />
            {previewImage && (
              <div className="image-preview-container mt-2">
                <img src={previewImage} alt="Preview" className="image-thumbnail" />
              </div>
            )}
          </Col>
        </FormGroup>
        <Button className="mt-2" onClick={handleCreate} variant="warning">
          Create
        </Button>
      </Row>
    </Container>
  );
};

export default CreateBrand;
