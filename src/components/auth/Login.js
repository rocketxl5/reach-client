import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useFormValidation from '../hooks/useFormValidation'
import inputValidation from '../utilities/validateLogin'
import baseURL from '../utilities/baseURL'
import { UserContext } from '../../contexts/UserContext'

function Login() {
    const navigate = useNavigate()
    const [input, setInput] = useState({})
    const [isValid, setIsValid] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { setUser } = useContext(UserContext)

    const logUser = (isValid) => {
        if (isValid) {
            const userInput = {
                email: input.email,
                password: input.password
            }

            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userInput),
            }
            try {
                fetch(`${baseURL()}/api/users/login`, options)
                    .then((res) => {
                        if (res.ok) {
                            return res.json()
                        }

                        return res.json().then((data) => {

                            throw new Error(JSON.stringify(data))
                        })
                    })
                    .then((data) => {
                        setUser(data)
                        navigate("/")
                    }) 
                    .catch(error => {
                        console.log(error)
                        setErrorMessage(error.message)
                        // clear input fields
                        setValues({
                            email: '',
                            password: ''
                        })
                        // invalid values
                        setIsValid(false)
                        // reset submit to false
                        // prevents error-message css class to be added to input fields on blur in useFormValidation
                        // setIsSubmit(false)
                    })

            } catch (error) {
                console.log(error)
            }
        }
    }

    const callback = (values) => {
        console.log('values', values)
        console.log('isValid', isValid)
        setInput(values)
        setIsValid(true)
    }

    const { handleChange, handleFocus, handleBlur, handleSubmit, setValues, values, errors } = useFormValidation(
        callback,
        inputValidation,
        {
            email: '',
            password: ''
        }
    )

    const handleClick = (e) => {
        // Prevents firing form
        e.preventDefault()
        !showPassword ? setShowPassword(true) : setShowPassword(false)
    }

    // Show/hide password
    useEffect(() => {
        document.querySelector('#password').type = showPassword ? 'text' : 'password'
    }, [showPassword])

    // Login 
    useEffect(() => {
        if (isValid) {
            logUser(isValid)
        }
    }, [isValid])

    // error message handler
    useEffect(() => {
        if (errorMessage) {
            document.querySelector('.show-error-message').innerHTML = errorMessage.replaceAll('"', '')
        }
    }, [errorMessage])

    return (
        <div className="container flex justify-center">
            <div className="form-content">
                <div className="form-logo">
                    <h1 className="center"><Link to="/">Reach</Link></h1>
                </div>
                <form className="form login-form" onSubmit={handleSubmit}>
                    <div className="form-title">
                        <h2>Log in to your account</h2>
                    </div>
                    <p className={errorMessage ? 'show-error-message' : 'hide'}></p>
                    <div className="form-element">
                        <label htmlFor="name">Email</label>
                        <input
                            className={errors.email && 'input-error'}
                            type="email"
                            name="email"
                            id="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            placeholder={errors.email ? errors.email : "Email"} />
                    </div>
                    <div className="form-element">
                        <label htmlFor="password">Password</label>
                        <div className={`login-password center content-height flex ${errors.password && 'input-error'}`}>
                            <input
                                className={errors.password && 'input-error'}
                                type="password"
                                name="password"
                                id="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={handleFocus}
                                placeholder={errors.password ? errors.password : "Password"}
                            />
                            <button className="password-btn flex align-center justify-center" onClick={handleClick}>
                                <i className={!showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                            </button>
                        </div>
                    </div>
                    <div className="form-element flex justify-end">
                        <Link className="reset-password center" to="/reset-password">Forgot password?</Link>
                    </div>
                    <div className="form-element">
                        <Link className="link" to="/signup">Create account</Link>
                        <button className="login-btn btn" type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;
