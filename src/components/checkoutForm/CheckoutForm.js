import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import styles from './CheckoutForm.module.scss'
import Card from '../../components/card/Card'
import CheckoutSummary from '../checkoutSummary/CheckoutSummary'
import spinnerImg from '../../assets/loader.gif'
import { toast } from 'react-toastify'
import { Timestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectEmail, selectUserID } from '../../redux/slice/authSlice'
import { CLEAR_CART, selectCartItems, selectCartTotalAmount } from '../../redux/slice/cartSlice'
import { selectShippingAddress } from '../../redux/slice/checkoutSlice'

const CheckoutForm = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const stripe = useStripe();
   const elements = useElements();


   // Redux order
   const userID = useSelector(selectUserID);
   const userEmail = useSelector(selectEmail);
   const cartItems = useSelector(selectCartItems);
   const cartTotalAmount = useSelector(selectCartTotalAmount);
   const shippingAddress = useSelector(selectShippingAddress);


   const [message, setMessage] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      if (!stripe) {
         return;
      }
      const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

      if (!clientSecret) {
         return;
      }
   }, [stripe])

   const saveOrder = () => {
      const dateNow = new Date();
      const date = dateNow.toDateString();
      const time = dateNow.toLocaleTimeString();
      const orderConfig = {
         userID,
         userEmail,
         orderDate: date,
         orderTime: time,
         orderAmount: cartTotalAmount,
         orderStatus: "Order Placed...",
         cartItems,
         shippingAddress,
         createdAt: Timestamp.now().toDate()
      }

      try {
         addDoc(collection(db, "orders"), orderConfig)
         dispatch(CLEAR_CART());
         toast.success('Order saved');
         navigate('/checkout-success');
      } catch (error) {
         toast.error(error.message);
      }
   }

   const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage(null);

      if (!stripe || !elements) {
         // Stripe.js hasn't yet loaded.
         // Make sure to disable form submission until Stripe.js has loaded.
         return;
      }

      setIsLoading(true);

      await stripe
         .confirmPayment({
            elements,
            confirmParams: {
               // Make sure to change this to your payment completion page
               return_url: "http://localhost:3005/checkout-success",
            },
            redirect: "if_required"
         })
         .then((result) => {
            if (result.error) {
               toast.error(result.error.message);
               setMessage(result.error.message);
               return;
            }

            if (result.paymentIntent) {
               if (result.paymentIntent.status === "succeeded") {
                  setIsLoading(false)
                  toast.success("Payment Successfully")
                  saveOrder()
               }
            }
         })

      setIsLoading(false);
   }

   return (
      <section>
         <div className={`container ${styles.checkout}`}>
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
               <div>
                  <Card cardClass={styles.card}>
                     <CheckoutSummary />
                  </Card>
               </div>
               <div>
                  <Card cardClass={`${styles.card} ${styles.pay}`}>
                     <h3>Stripe Checkout</h3>
                     <PaymentElement id={styles["payment-element"]} />
                     <button
                        disabled={isLoading || !stripe || !elements}
                        id="submit"
                        className={styles.button}>
                        <span id="button-text">
                           {isLoading ? <img src={spinnerImg} alt='Loading...' style={{ width: "20px" }} /> : "Pay now"}
                        </span>
                     </button>
                     {/* Show any error or success messages */}
                     {message && <div id={styles["payment-message"]}>{message}</div>}
                  </Card>
               </div>
            </form>
         </div>
      </section>
   );
}



export default CheckoutForm