import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  FormGroup,
  FormSelect,
  Row,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import './ManagerCar.css';
function EditCar() {
  const navigate = useNavigate();
  const defaultProduct = {
    id: 0,
    name: "",
    price: "",
    year: "",
    available: "",
    description: "",
    image: [],
    brand: "",
  };
  const { ProductID } = useParams();
  const [Product, setProduct] = useState(defaultProduct);
  const [Brands, setBrands] = useState([]);
  const name = useRef();
  const price = useRef();
  const year = useRef();
  // const available = useRef();
  const model = useRef();
  const rating = useRef();
  const description = useRef();
  const brand = useRef();
  const imageURL = useRef();

  useEffect(() => {
    axios.get(`http://localhost:9999/cars/${ProductID}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });

    axios.get("http://localhost:9999/brands")
      .then((res) => {
        setBrands(res.data);
      })
      .catch((error) => {
        console.error('Error fetching brands:', error);
      });
  }, [ProductID]);

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const addImage = () => {
    if (imageURL.current.value === "") {
      toast.error('Please enter an image URL!')
    } else {
      const newImage = {
        id: generateRandomId(),
        name: imageURL.current.value,
      };
      setProduct(prevProduct => ({
        ...prevProduct,
        image: [...prevProduct.image, newImage],
      }));
      imageURL.current.value = "";
    }
  };

  const deleteImage = (imageId) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      image: prevProduct.image.filter(image => image.id !== imageId),
    }));
  };

  const handleProduct = () => {
    const updatedProduct = {
      id: ProductID,
      name: name.current.value,
      price: price.current.value,
      year: year.current.value,
      model: model.current.value,
      rating: rating.current.value,
      available: true,
      description: description.current.value,
      image: Product.image,
      brand: brand.current.value,
    };

    axios.put(`http://localhost:9999/cars/${ProductID}`, updatedProduct)
      .then(() => {
        toast.success('Update success')
        navigate("/admin");
      })
      .catch((error) => {
        console.error('Error updating product:', error);
      });
  };

  return (
    <Container>
      <Button style={{ backgroundColor: 'orange' }}>
        <Link to="/admin" style={{ color: 'black' }}>Back to Home</Link>
      </Button>
      <Row>
        <Col md={10} style={{ padding: 10 }}>
          <h1>Edit Product</h1>
          <FormGroup>
            <label>ID:</label>
            <FormControl
              type="text"
              id="ID"
              value={Product.id}
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <label>Name:</label>
            <FormControl
              type="text"
              id="name"
              defaultValue={Product.name}
              ref={name}
            />
          </FormGroup>
          <FormGroup>
            <label>Price:</label>
            <FormControl
              type="number"
              id="price"
              defaultValue={Product.price}
              ref={price}
            />
          </FormGroup>
          <FormGroup>
            <label>Model:</label>
            <FormControl
              type="text"
              id="model"
              defaultValue={Product.model}
              ref={model}
            />
          </FormGroup>
          <FormGroup>
            <label>Rating:</label>
            <FormControl
              type="number"
              id="rating"
              defaultValue={Product.rating}
              ref={rating}
            />
          </FormGroup>
          <FormGroup>
            <label>Year:</label>
            <FormControl
              type="date"
              id="year"
              defaultValue={Product.year}
              ref={year}
            />
          </FormGroup>
          {/* <FormGroup>
            <label>Available:</label>
            <FormControl
              type="number"
              id="available"
              defaultValue={Product.available}
              ref={available}
            />
          </FormGroup> */}
          <FormGroup>
            <label>Description:</label>
            <FormControl
              as="textarea"
              id="description"
              defaultValue={Product.description}
              ref={description}
            />
          </FormGroup>
          <FormGroup>
            <label>Brand:</label>
            <FormSelect
              id="brand"
              ref={brand}
            >
              {Brands.map((b) => (
                <option key={b.id}
                  selected={b.id === Product.brand}
                  value={b.id}>
                  {b.brandName}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup>
            <label>Image URL:</label>
            <FormControl type="text" ref={imageURL} placeholder="Enter image URL" />
            <Button onClick={addImage} style={{ marginTop: "10px" }}>Add Image</Button>
          </FormGroup>
          <div>
            {Product.image.map((image, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img src={image.name} alt={`img-${index}`} style={{ width: 100, height: 100, marginRight: 10 }} />
                <span>ID: {image.id}</span>
                <Button variant="danger" onClick={() => deleteImage(image.id)} style={{ marginLeft: '10px' }}>Remove</Button>
              </div>
            ))}
          </div>
          <Button
            variant="success"
            style={{ width: 150, marginTop: 20 }}
            onClick={handleProduct}
          >
            Save
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default EditCar;
