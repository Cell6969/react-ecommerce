import React, { useState } from 'react'
import styles from './auth.module.scss'
import registerImg from '../../assets/register.png'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/card/Card'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from '../../components/loader/Loader'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/config'

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [cPassword, setCPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	// Submit Register
	const registerUser = async (e) => {
		e.preventDefault();
		if (password !== cPassword) {
			toast.error("Password do not match")
			return;
		}
		setIsLoading(true);
		try {
			await createUserWithEmailAndPassword(auth, email, password)
			setIsLoading(false);
			toast.success('Registration Success')
			navigate('/login')
		} catch (error) {
			toast.error(error.message)
			setIsLoading(false);
		}
	}
	return (
		<>
			{isLoading && <Loader />}
			<section className={`container ${styles.auth}`}>
				<Card>
					<div className={styles.form}>
						<h2>Registration</h2>
						<form onSubmit={registerUser}>
							<input
								type='text'
								placeholder='Email'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<input
								type='password'
								placeholder='Password'
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<input
								type='password'
								placeholder='Confirm Password'
								required
								value={cPassword}
								onChange={(e) => setCPassword(e.target.value)}
							/>
							<button className='--btn --btn-primary --btn-block'>Register</button>
						</form>
						<span className={styles.register}>
							<p>Already have an Account?</p>
							<Link to="/login">Login Here</Link>
						</span>
					</div>
				</Card>
				<div className={styles.img}>
					<img src={registerImg} alt='register-img' width="400" />
				</div>
			</section>
		</>

	)
}

export default Register