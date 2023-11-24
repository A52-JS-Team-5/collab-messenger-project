import { useContext, useState } from "react";
import AppContext from "../../context/AuthContext.js";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { loginUser } from "../../services/auth.services.js";
import { getUserByHandle } from "../../services/users.services.js";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [formErrorMsg, setFormErrorMsg] = useState({});
  const { setContext } = useContext(AppContext);
  const navigate = useNavigate();
  const updateForm = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  }

  const validateFormInput = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = 'Email is required';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }

    setFormErrorMsg(errors);
    return errors;
  }

  const onLogin = (event) => {

    event.preventDefault();
    const validationResult = validateFormInput(form);

    if (Object.keys(validationResult).length !== 0) {
      return;
    }

    getUserByHandle(form.username)
      .then(snapshot => {
        if (!snapshot.exists()) {
          throw new Error(`Wrong username and/or password.`);
        }

        const userData = snapshot.val();

        loginUser(userData.email, form.password)
          .then(credential => {
            setContext({
              user: credential.user,
            }); 
          })
          .then(() => navigate('/'))
          .catch(e => {
            console.log(e.message);
            toast("Wrong email and/or password. Please try again.");
          });
      })
      .catch(e => {
        toast("Wrong email and/or password. Please try again.");
        console.log('Error getting user data:', e.message)
      })
  };

  return (
    <div className="hero min-h-[90vh] px-40 max-2xl:px-2">
      <div className="hero-content flex-col lg:flex-row-reverse pt-20 pb-20 gap-16 max-2xl:gap-8">
        <div className='card rounded border-2 border-black rounded-3xl bg-beige shadow-xl min-w-[50%]'>
          <div className='form-control flex flex-wrap flex-auto'>
            <h3 className="text-3xl self-center text-black pb-8 font-bold">Sign In</h3>
            <label className="label" htmlFor='username'>
              <span className="label-text text-black pl-3">Username</span>
            </label>
            <input type='text' id='username' placeholder="Type your username" className="input input-bordered w-full bg-white" value={form.username} onChange={updateForm('username')} />
            <span className="err-message text-red">{formErrorMsg.username}</span>
            <label className="label" htmlFor='password'>
              <span className="label-text text-black pl-3">Password</span>
            </label>
            <input type='password' id='password' placeholder="Type your password" className="input input-bordered w-full bg-white" value={form.password} onChange={updateForm('password')} />
            <span className="err-message text-red">{formErrorMsg.password}</span>
            <br />
            <div className="text-left pb-6 pl-3 flex space-x-24">
              <p>New to Chatter?</p>
              <Link to='/login'>Create an account</Link>
            </div>
            <button className="btn bg-black self-center text-white w-full" onClick={onLogin}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
