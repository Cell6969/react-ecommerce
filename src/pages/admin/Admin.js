import React from 'react'
import styles from './Admin.module.scss';
import Navbar from '../../components/admin/navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from '../../components/admin/Home/Home';
import ViewProducts from '../../components/admin/ViewProducts/ViewProducts';
import AddProducts from '../../components/admin/AddProducts/AddProducts';
import Orders from '../../components/admin/Orders/Orders';
import OrderDetails from '../../components/admin/orderDetails/OrderDetails';

const Admin = () => {
  return (
    <div className={styles.admin}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path='home' element={<Home />} />
          <Route path='all-products' element={<ViewProducts />} />
          <Route path='add-products' element={<AddProducts />} />
          <Route path='add-products/:id' element={<AddProducts />} />
          <Route path='orders' element={<Orders />} />
          <Route path='order-details/:id' element={<OrderDetails />} />
        </Routes>
      </div>
    </div>
  )
}

export default Admin