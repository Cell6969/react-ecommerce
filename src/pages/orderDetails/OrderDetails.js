import React, { useEffect, useState } from 'react'
import styles from './OrderDetails.module.scss'
import { Link, useParams } from 'react-router-dom'
import useFetchDocument from '../../customHooks/useFetchDocument'
import spinnerImg from '../../assets/loader.gif'

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const { document } = useFetchDocument("orders", id)

    useEffect(() => {
        setOrder(document)
    }, [document])

    return (
        <section>
            <div className={`container ${styles.table}`}>
                <h2>Order Details</h2>
                <div>
                    <Link to="/order-history">&larr; Back to Orders</Link>
                </div>
                <br />
                {order === null ? (
                    <img 
                    src={spinnerImg} 
                    alt='loading...' 
                    style={{ width: '50px' }} 
                        className='--center --center-all'
                    />
                ) : (
                    <>
                        <p>
                            <b>Order ID</b> {order.id}
                        </p>
                        <p>
                            <b>Order Amount</b> {order.orderAmount}
                        </p>
                        <p>
                            <b>Order Status</b> {order.orderStatus}
                        </p>
                        <br />
                        <table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.cartItems.map((cart, index) => {
                                    const { id, name, price, imageURL, cartQuantity } = cart;
                                    return (
                                        <tr key={id}>
                                            <td>
                                                <b>{index + 1}</b>
                                            </td>
                                            <td>
                                                <p>
                                                    <b>{name}</b>
                                                </p>
                                                <img src={imageURL} alt={name} style={{ width: '100px' }} />
                                            </td>
                                            <td>{`$${price}`}</td>
                                            <td>{cartQuantity}</td>
                                            <td>
                                                {`$${(price * cartQuantity).toFixed(2)}`}
                                            </td>
                                            <td className={styles.icons}>
                                                <Link to={`/review-products/${id}`}>
                                                    <button className='--btn --btn-primary'>
                                                        Review Product
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </section>
    )
}

export default OrderDetails