import { useContext, useState } from "react";
import AppContext from "../../context/AuthContext.js";
import { checkEmailExists, createUserHandle, getUserByHandle } from "../../services/users.services.js";
import { registerUser } from "../../services/auth.services.js";
import { useNavigate } from 'react-router-dom';
import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGHT, MAX_USERNAME_LENGTH, MIN_NAME_LENGTH, MAX_NAME_LENGTH } from "../../common/constants.js";
import { isEmailValid, isPhoneNumberValid } from "../../common/helpers.js";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [form, setForm] = useState({
    handle: '',
    email: '',
    name: '',
    surname: '',
    phoneNumber: '',
    password: ''
  });
  const updateForm = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  }
  const [formErrorMsg, setFormErrorMsg] = useState({});
  const { setContext } = useContext(AppContext);
  const navigate = useNavigate();

  const validateFormInput = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = 'Name is required.';
    } else if (values.name.length < MIN_NAME_LENGTH || values.name.length > MAX_NAME_LENGTH) {
      errors.name = `First name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} symbols.`;
    }

    if (!values.surname) {
      errors.surname = 'Surname is required.';
    } else if (values.surname.length < MIN_NAME_LENGTH || values.surname.length > MAX_NAME_LENGTH) {
      errors.surname = `Last name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} symbols.`;
    }

    if (!values.email) {
      errors.email = 'Email is required.';
    } else if (!isEmailValid(values.email)) {
      errors.email = 'Email must be a valid email address.';
    }

    if (!values.handle) {
      errors.handle = 'Username is required.';
    } else if (values.handle.length < MIN_USERNAME_LENGHT || values.handle.length > MAX_USERNAME_LENGTH) {
      errors.handle = `Username must be between ${MIN_USERNAME_LENGHT} and ${MAX_USERNAME_LENGTH} symbols.`;
    }

    if (!values.password || values.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password is required and must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
    }

    if (!values.phoneNumber) {
      errors.phoneNumber = 'Phone number is required.'
    } else if (!isPhoneNumberValid(values.phoneNumber) || values['phoneNumber'].length < 10) {
      errors.phoneNumber = 'Phone number must only contain digits and be 10 characters long.'
    } 

    setFormErrorMsg(errors);
    return errors;
  }

  const onRegister = (event) => {

    event.preventDefault();
    const validationResult = validateFormInput(form);

    if (Object.keys(validationResult).length !== 0) {
      return;
    }

    // Check if a user with the handle exists
    getUserByHandle(form.handle)
      .then(snapshot => {
        if (snapshot.exists()) {
          toast(`Username @${form.handle} has already been taken!`)
          throw new Error(`Username @${form.handle} has already been taken!`);
        }
        return checkEmailExists(form.email)
      })
      .then((emailExists) => {
        if (emailExists) {
          toast(`Email ${form.email} is already in use!`);
          throw new Error(`Email ${form.email} is already in use!`);
        }

        return registerUser(form.email, form.password);
      })
      .then(credential => {
      // The handle is unique, so create a user record in the database
        return createUserHandle(form.handle, credential.user.uid, credential.user.email, form.name, form.surname, form.phoneNumber)
          .then(() => {
            toast('Profile created successfully!');
            setContext({
              user: credential.user,
            });
            });
          })
          .then(() => navigate('/'))
          .catch(e => console.log(e.message))
      .catch(e => console.log(e.message))
  };

  return (
    <>
      <div className="hero min-h-[90vh] px-40 max-2xl:px-6">
        <div className="hero-content flex-col lg:flex-row pt-10 gap-16 max-2xl:gap-8">
          <div className='signup-wrapper min-w-[50%] card rounded border-2 border-black rounded-3xl bg-beige shadow-xl'>
            <h2 className="self-center text-3xl text-black pb-8">Sign Up</h2>
            <div className='form-control flex flex-wrap flex-auto'>
              <label className="label" htmlFor='name'>
                <span className="label-text text-black pl-3">Name</span>
              </label>
              <input type='text' id="name" placeholder="Enter your first name" className="input input-bordered w-full bg-white" value={form.name} onChange={updateForm('name')} autoComplete='name' />
              <span className="err-message text-red">{formErrorMsg.name}</span>
              <label className="label" htmlFor='surname'>
                <span className="label-text text-black pl-3">Surname</span>
              </label>
              <input type='text' id="surname" placeholder="Enter your surname" className="input input-bordered w-full bg-white" value={form.surname} onChange={updateForm('surname')} autoComplete='surname' />
              <span className="err-message text-red">{formErrorMsg.surname}</span>
              <label className="label" htmlFor='email'>
                <span className="label-text text-black pl-3" >Email</span>
              </label>
              <input type='email' id="email" placeholder="Enter your email" className="input input-bordered w-full bg-white" value={form.email} onChange={updateForm('email')} autoComplete='email' />
              <span className="err-message text-red">{formErrorMsg.email}</span>
              <label className="label" htmlFor='handle'>
                <span className="label-text text-black pl-3">Username</span>
              </label>
              <input type='text' id="handle" placeholder="Enter your username" className="input input-bordered w-full bg-white" value={form.handle} onChange={updateForm('handle')} />
              <span className="err-message text-red">{formErrorMsg.handle}</span>
              <label className="label" htmlFor='password'>
                <span className="label-text text-black pl-3">Password</span>
              </label>
              <input type='password' id="password" placeholder="Enter your password" className="input input-bordered w-full bg-white" value={form.password} onChange={updateForm('password')} />
              <span className="err-message text-red">{formErrorMsg.password}</span>
              <label className="label" htmlFor='tel-number'>
                <span className="label-text text-black pl-3">Phone Number</span>
              </label>
              <input type='text' id="tel-number" placeholder="Enter your telephone number" className="input input-bordered w-full bg-white" value={form.phoneNumber} onChange={updateForm('phoneNumber')} />
              <span className="err-message text-red">{formErrorMsg.phoneNumber}</span>
              <br />
              <button className="btn bg-black text-white self-center w-full" onClick={onRegister}>Register</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
