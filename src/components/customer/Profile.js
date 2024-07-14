import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, FormControl, FormGroup, FormLabel, Modal, Form } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    address: yup.string().required('Address is required'),
    role: yup.string().oneOf(['user', 'admin'], 'Invalid role').required('Role is required')
});

export default function Profile() {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema) // Áp dụng yup schema cho react-hook-form
    });
    console.log(errors);

    // register: Hàm dùng để đăng ký các trường form cần xác thực.
    // handleSubmit: Hàm dùng để xử lý khi form được submit.
    // setValue: Hàm dùng để đặt giá trị cho các trường form.
    // errors: Đối tượng chứa các thông báo lỗi từ quá trình xác thực.

    useEffect(() => {
        axios.get(`http://localhost:9999/users/${id}`)
            .then(res => {
                setUser(res.data);
                setValue('userName', res.data.userName);
                // Đặt giá trị cho trường password
                setValue('password', res.data.password);
                setValue('email', res.data.email);
                setValue('phoneNumber', res.data.phoneNumber);
                setValue('address', res.data.address);
                setValue('role', res.data.role);
                console.log('setValue')
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('An error occurred while fetching user data.');
                setLoading(false);
            });
    }, [id, setValue]);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    //Trước khi gọi onSubmit, react-hook-form sẽ xác thực dữ liệu dựa trên schema yup đã được định nghĩa để đảm bảo các giá trị nhập vào là hợp lệ.
    //Nếu tất cả các trường đều hợp lệ, onSubmit sẽ được gọi và data sẽ chứa các giá trị đã được xác thực sẵn sàng để gửi lên server.

    const onSubmit = (data) => {
        //Trong ngữ cảnh của đoạn code React mà bạn đưa ra, data là một đối tượng chứa các giá trị của form sau khi người dùng đã điền và submit. 
        //Đối tượng data này được tự động tạo và tổng hợp bởi react-hook-form khi bạn gọi handleSubmit và truyền hàm onSubmit vào.
        axios.put(`http://localhost:9999/users/${id}`, data)
            .then(res => {
                setUser(res.data);
                toast.success('User information updated successfully!');
                setShowModal(false);
            })
            .catch(err => {
                console.error(err);
                setError('An error occurred while updating user data.');
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='container'>
            <div className="row">
                <div className="col">
                    <nav aria-label="breadcrumb" className="bg-body-tertiary rounded-3 p-3 mb-4">
                        <ol className="breadcrumb mb-0">
                            <li className='breadcrumb-item mr-3' aria-current='page'>
                                <Link to={`/`}>Home</Link>
                            </li>
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
            <div className='row'>
                <div className='col-4'>
                    <div className="card-body text-center">
                        <img src="https://100k-faces.glitch.me/random-image" alt="avatar" className="rounded-circle img-fluid" style={{ width: 150 }} />
                        <h5 className="my-3">{user.userName}</h5>
                        <p className="text-muted mb-3">{user.email}</p>
                    </div>
                </div>
                <div className='col-8'>
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">User Name</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{user.userName}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Password</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{user.password}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Email</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{user.email}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Phone</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{user.phoneNumber}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Address</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{user.address}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Role</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{user.role}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mb-2">
                                <button type="button" className="btn btn-primary" onClick={handleShowModal}>Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <FormLabel>Password</FormLabel>
                            <FormControl
                                type='text'
                                name='password'
                                {...register('password')}
                            />
                            {errors.password && <p className="text-danger">{errors.password.message}</p>}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Email</FormLabel>
                            <FormControl
                                type='text'
                                name='email'
                                {...register('email')}
                            />
                            {errors.email && <p className="text-danger">{errors.email.message}</p>}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Phone</FormLabel>
                            <FormControl
                                type='text'
                                name='phoneNumber'
                                {...register('phoneNumber')}
                            />
                            {errors.phoneNumber && <p className="text-danger">{errors.phoneNumber.message}</p>}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Address</FormLabel>
                            <FormControl
                                type='text'
                                name='address'
                                {...register('address')}
                            />
                            {errors.address && <p className="text-danger">{errors.address.message}</p>}
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Role</FormLabel>
                            <div>
                                <Form.Check
                                    type="radio"
                                    name="role"
                                    value="user"
                                    label="User"
                                    inline
                                    {...register('role')}
                                />
                                <Form.Check
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    label="Admin"
                                    inline
                                    {...register('role')}
                                //khi value của mỗi input radio bằng với giá trị mà register('role') quản lý, thì input đó sẽ được đánh dấu là checked
                                />
                                {errors.role && <p className="text-danger">{errors.role.message}</p>}
                            </div>
                        </FormGroup>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="success" type="submit">
                                Save changes
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
