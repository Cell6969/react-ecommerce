import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styles from './ProductDetails.module.scss'
import spinnerImg from '../../../assets/loader.gif'
import { useDispatch, useSelector } from 'react-redux'
import { ADD_TO_CART, CALCULATE_TOTAL_QUANTITY, DECREASE_CART, selectCartItems } from '../../../redux/slice/cartSlice'
import useFetchDocument from '../../../customHooks/useFetchDocument'
import useFetchCollection from '../../../customHooks/useFetchCollection'
import Card from '../../card/Card'
import StarsRating from 'react-star-rate'

const ProductDetails = () => {
    const dispatch = useDispatch()
    const { id } = useParams()
    const [product, setProduct] = useState(null)

    const cartItems = useSelector(selectCartItems)
    const cart = cartItems.find((items) => items.id === id)
    const isCartAdded = cartItems.findIndex((cart) => {
        return cart.id === id;
    })

    // Use custom hook to fetch data specific product
    const { document } = useFetchDocument("products", id);
    // Get Product
    useEffect(() => {
        setProduct(document)
    }, [document])

    // Fetch comment
    const { data } = useFetchCollection("reviews");
    const filteredReviews = data.filter((review) => review.productID === id);


    // Add item to cart
    const addToCart = (product) => {
        dispatch(ADD_TO_CART(product))
        dispatch(CALCULATE_TOTAL_QUANTITY())
    }

    // Decrese Cart
    const decreaseCart = (product) => {
        dispatch(DECREASE_CART(product))
        dispatch(CALCULATE_TOTAL_QUANTITY())
    }

    return (
        <section>
            <div className={`container ${styles.product}`}>
                {/* Details Product */}
                <h2>Product Details</h2>
                <div>
                    <Link to='/#products'>&larr; Back to Products</Link>
                </div>
                {product === null ? (
                    <img
                        src={spinnerImg}
                        alt='Loading...'
                        style={{ width: '50px' }}
                        className='--center-all'
                    />
                ) : (
                    <>
                        <div className={styles.details}>
                            <div className={styles.img}>
                                <img src={product.imageURL} alt={product.name} />
                            </div>
                            <div className={styles.content}>
                                <h3>{product.name}</h3>
                                <p className={styles.price}>{`${product.price}$`}</p>
                                <p>{product.desc}</p>
                                <p>
                                    <b>SKU</b> {product.id}
                                </p>
                                <p>
                                    <b>Brand</b> {product.brand}
                                </p>
                                {isCartAdded < 0 ? null : (
                                    <>
                                        <div className={styles.count}>
                                            <button className='--btn' onClick={() => decreaseCart(product)}>-</button>
                                            <p>
                                                <b>{cart.cartQuantity}</b>
                                            </p>
                                            <button className='--btn' onClick={() => addToCart(product)}>+</button>
                                        </div>
                                    </>
                                )}
                                <button className='--btn --btn-danger' onClick={() => addToCart(product)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </>
                )}
                {/* Add Comment Section */}
                <Card cardClass={styles.card}>
                    <h3>Product Reviews</h3>
                    <div>
                        {filteredReviews.length === 0 ? (
                            <p>There are no reviews for this product yet.</p>
                        ) : (
                            <>
                                {filteredReviews.map((item) => {
                                    const { rate, review, reviewDate, username } = item;
                                    return (
                                        <div className={styles.review}>
                                            <StarsRating value={rate} />
                                            <p>{review}</p>
                                            <span>
                                                <b>{reviewDate}</b>
                                            </span>
                                            <br />
                                            <span>
                                                <b>by {username}</b>
                                            </span>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </section>
    )
}

export default ProductDetails