import React from 'react'
import styles from './Orders.module.scss'
import useFetchCollection from '../../../customHooks/useFetchCollection'
import { useDispatch, useSelector } from 'react-redux';
import { STORE_ORDERS, selectOrderHistory } from '../../../redux/slice/orderSlice';
import { useNavigate } from 'react-router-dom';
import Loader from '../../loader/Loader';
import { useEffect } from 'react';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading } = useFetchCollection("orders");
  const orders = useSelector(selectOrderHistory);


  useEffect(() => {
    dispatch(STORE_ORDERS(data))
  }, [data, dispatch])

  const handleClick = (id) => {
    navigate(`/admin/order-details/${id}`)
  };

  return (
    <>
      <div className={styles.order}>
        <h2>Your Order History</h2>
        <p>
          Open an order to <b>Change order status</b>
        </p>
        <br />
        <>
          {isLoading && <Loader />}
          <div className={styles.table}>
            {orders.length === 0 ? (
              <p>No order found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Order Emal</th>
                    <th>Order Amount</th>
                    <th>Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => {
                    const { id, orderDate, orderTime, orderAmount, orderStatus, userEmail } = order;
                    return (
                      <tr key={id} onClick={() => handleClick(id)}>
                        <td>{index + 1}</td>
                        <td>{orderDate} at {orderTime}</td>
                        <td>{id}</td>
                        <td>{userEmail}</td>
                        <td>{`$${orderAmount}`}</td>
                        <td>
                          <p className={orderStatus !== "Delivered" ? `${styles.pending}` : `${styles.delivered}`}>
                            {orderStatus}
                          </p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      </div >
    </>
  )
}

export default Orders