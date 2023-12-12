import React, { useEffect, useState } from 'react'
import styles from './ReviewProducts.module.scss'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUserID, selectUserName } from '../../redux/slice/authSlice';
import Card from '../card/Card';
import StarsRating from 'react-star-rate';
import useFetchDocument from '../../customHooks/useFetchDocument';
import spinnerImg from '../../assets/loader.gif'
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';

const ReviewProducts = () => {
  const { id } = useParams();

  const [rate, setRate] = useState(0)
  const [review, setReview] = useState('')

  const { document } = useFetchDocument("products", id);
  const [product, setProduct] = useState(null)

  useEffect(() => {
    setProduct(document)
  }, [document])

  // Redux Selector
  const userID = useSelector(selectUserID);
  const username = useSelector(selectUserName);

  const submitReview = (e) => {
    e.preventDefault();
    const dateNow = new Date();
    const date = dateNow.toDateString();
    const reviewConfig = {
      userID,
      username,
      productID: product.id,
      rate,
      review,
      reviewDate: date,
      createdAt: Timestamp.now().toDate()
    }
    try {
      addDoc(collection(db, "reviews"), reviewConfig);
      toast.success("Review Submitted");
      setRate(0);
      setReview("")
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <section>
      <div className={`container ${styles.review}`}>
        <h2>Review Products</h2>
        {product === null ? (
          <img
            src={spinnerImg}
            alt='Loading...'
            style={{ width: '50px' }}
            className='--center-all'
          />
        ) : (
          <>
            <p>
              <b>Product name:</b> {product.name}
            </p>
            <img src={product.imageURL} alt={product.name} style={{ width: "100px" }} />
            <Card cardClass={styles.card}>
              <form onSubmit={(e) => submitReview(e)}>
                <label>Rating:</label>
                <StarsRating
                  value={rate}
                  onChange={rate => {
                    setRate(rate)
                  }}
                />
                <label>Review:</label>
                <textarea value={review} cols="30" rows="10" onChange={(e) => setReview(e.target.value)}>
                </textarea>
                <button type='submit' className='--btn --btn-primary'>Submit Rating</button>
              </form>
            </Card>
          </>
        )}
      </div>
    </section>
  )
}

export default ReviewProducts