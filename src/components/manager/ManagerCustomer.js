import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, Table } from 'react-bootstrap'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
function ManagerCustomer() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5
  const [pagedUsers, setPagedUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    updatePaging()
  }, [users, currentPage, sortConfig, searchTerm])

  const fetchUsers = () => {
    axios.get('http://localhost:9999/users')
      .then(res => {
        setUsers(res.data.filter(user => user.status === 1))
      })
      .catch(e => {
        console.log(e)
      })
  }

  const updatePaging = () => {
    let filteredUsers = users.filter(user => 
      user.id.toString().includes(searchTerm) || 
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortConfig.key) {
      filteredUsers = [...filteredUsers].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
    setPagedUsers(filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage))
  }

  const handleSearch = event => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setShowConfirmModal(true)
  }

  const handleConfirmDelete = () => {
    if (userToDelete.role !== 'admin') {
      axios.put(`http://localhost:9999/users/${userToDelete.id}`, { ...userToDelete, status: 0 })
        .then(() => {
          fetchUsers()
        })
        .catch(e => {
          console.log(e)
        })
    }
    setShowConfirmModal(false)
    setUserToDelete(null)
  }

  const handleCancelDelete = () => {
    setShowConfirmModal(false)
    setUserToDelete(null)
  }

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex)
  }

  return (
    <div className='container'>
      <h1 style={{ textAlign: 'center' }}>ManagerCustomer</h1>
      <Button className="back-button" style={{marginTop : '30px', width : '15%'}}>
        <Link to="/admin" style={{color : 'black'}}>Back to Home</Link>
      </Button>
      <div>
        <label style={{fontWeight : 'bold'}}>Search By Id And Name</label>
      <Form.Control
        type="text"
        placeholder="Search by ID or Name"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '20px', width : '30%' }}
      />
      </div>
      
      <Table striped bordered>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>
              ID
              {sortConfig.key === 'id' ? (
                sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />
              ) : (
                <FaSort />
              )}
            </th>
            <th onClick={() => handleSort('userName')}>
              Name
              {sortConfig.key === 'userName' ? (
                sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />
              ) : (
                <FaSort />
              )}
            </th>
            <th onClick={() => handleSort('email')}>
              Email
              {sortConfig.key === 'email' ? (
                sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />
              ) : (
                <FaSort />
              )}
            </th>
            <th>Phone</th>
            <th>Address</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pagedUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td>
                <Button style={{backgroundColor : 'red', border : 'none'}} onClick={() => handleDeleteClick(user)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            style={{ marginLeft: 5 }}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? 'btn-dark' : 'btn-light'}
          >
            {page}
          </Button>
        ))}
      </div>

      <Modal show={showConfirmModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && userToDelete.role === 'admin' ? (
            <p>You cannot delete an admin user.</p>
          ) : (
            <p>Are you sure you want to delete this user?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>Cancel</Button>
          {userToDelete && userToDelete.role !== 'admin' && (
            <Button variant="danger" onClick={handleConfirmDelete}>Confirm</Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ManagerCustomer