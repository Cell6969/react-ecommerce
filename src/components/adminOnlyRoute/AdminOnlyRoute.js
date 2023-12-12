import React from 'react'
import { useSelector } from 'react-redux'
import { selectEmail } from '../../redux/slice/authSlice'
import { Link } from 'react-router-dom'

export const AdminOnlyRoute = ({ children }) => {
    const userEmail = useSelector(selectEmail)
    // const navigate = useNavigate()
    // if (!userEmail) {
    //     navigate('/login')
    //     return null;
    // }
    if (userEmail === 'ahmad.fauzan.9922@gmail.com') {
        return children
    }
    // else {
    //     navigate('/')
    //     return null;
    // }
    return (
        <section>
            <div className='container'>
                <h2>Permission Denied</h2>
                <p>This page only can be seen by Admin only.</p>
                <Link to='/'>
                    <button className='--btn'>&larr; Back to Home</button>
                </Link>
            </div>
        </section>
    )

}

export const AdminOnlyLink = ({ children }) => {
    const userEmail = useSelector(selectEmail)
    if (userEmail === 'ahmad.fauzan.9922@gmail.com') {
        return children
    }
    return null;

}

