import { useContext, useState } from "react";
import AppContext from "../../context/AuthContext.js";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { loginUser } from "../../services/auth.services.js";
import { changeStatus, getUserByHandle } from "../../services/users.services.js";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImg from '/src/assets/backgrounds/login-bg.svg';

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

  const handleLogin = (event) => {

    event.preventDefault();
    const validationResult = validateFormInput(form);

    if (Object.keys(validationResult).length !== 0) {
      return;
    }

    getUserByHandle(form.username)
      .then(userData => {
        loginUser(userData.email, form.password)
          .then(credential => {
            setContext({
              user: credential.user,
            });
          })
          .then(() => navigate('/app'))
          .then(() => changeStatus(userData.handle, "Online"))
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
    <div className="flex px-40 max-2xl:px-2 max-2xl:py-2 items-center justify-center min-w-fit min-h-[88vh] rounded-3xl mt-2" style={{ backgroundImage: `url(${loginImg})`, objectFit: 'cover', backgroundPosition: 'center' }}>
      <div className="flex flex-col lg:flex-row gap-16 max-2xl:gap-8 items-center justify-center min-w-fit min-h-[88vh]">
        <div className='card rounded rounded-3xl bg-pureWhite shadow-2xl dark:bg-darkFront dark:text-darkText min-w-[90vw] md:min-w-[50vw] xl:min-w-[30vw] max-w-[30vw]'>
          <h3 className="text-3xl self-center text-black pb-8 font-bold dark:text-darkText">Sign In</h3>
          <label className="label" htmlFor='username'>
            <span className="label-text text-black pl-3 dark:text-darkText">Username</span>
          </label>
          <input type='text' id='username' placeholder="Type your username" className="input input-bordered w-full bg-pureWhite dark:bg-darkInput" value={form.username} onChange={updateForm('username')} />
          <span className="err-message text-red">{formErrorMsg.username}</span>
          <label className="label" htmlFor='password'>
            <span className="label-text text-black pl-3 dark:text-darkText">Password</span>
          </label>
          <input type='password' id='password' placeholder="Type your password" className="input input-bordered w-full bg-pureWhite dark:bg-darkInput" value={form.password} onChange={updateForm('password')} />
          <span className="err-message text-red">{formErrorMsg.password}</span>
          <br />
          <div className="pb-6 flex justify-between">
            <p className='text-left'>New to Chatter?</p>
            <Link to='/register' className='text-right dark:text-yellow'>Create an account</Link>
          </div>
          <button className="btn bg-pink self-center border-none text-pureWhite w-1/2" onClick={handleLogin}>Sign In</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
