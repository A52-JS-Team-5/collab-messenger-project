import { useEffect, useState } from 'react';
import { editUserProfile, getUserByHandle } from '../../services/users.services';
import ChangePassword from '../../components/ChangePassword/ChangePassword';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '../../common/constants';
import ChangeProfilePicture from '../../components/ChangeProfilePicture/ChangeProfilePicture';
import { useContext } from 'react';
import AppContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isPhoneNumberValid } from '../../common/helpers';

export default function EditUserProfile() {
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const user = useContext(AppContext);
  const [activeTab, setActiveTab] = useState(0); // 0 for Basic Details, 1 for Profile Picture, 2 for Password Update
  const [formErrorMsg, setFormErrorMsg] = useState({});
  useEffect(() => {
    if (user?.userData?.handle) {
      getUserByHandle(user.userData.handle)
        .then((snapshot) => {
          setCurrentUser(snapshot);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Error fetching user data: ', error);
          toast('An error occurred. Please try again later.');
        });
    }
  }, [user?.userData?.handle]);

  const [form, setForm] = useState({
    name: '',
    surname: '',
    bio: null,
    phoneNumber: null,
  });

  const updateForm = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
    setIsUpdated(true);
  };

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name,
        surname: currentUser.surname,
        bio: (currentUser.bio ? currentUser.bio : null),
        phoneNumber: (currentUser.phoneNumber ? currentUser.phoneNumber : null),
      })
    }
  }, [currentUser]);

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

    if (!values.phoneNumber) {
      errors.phoneNumber = 'Phone number is required.'
    } else if (!isPhoneNumberValid(values.phoneNumber) || values['phoneNumber'].length < 10) {
      errors.phoneNumber = 'Phone number must only contain digits and be 10 characters long.'
    }

    setFormErrorMsg(errors);
    return errors;
  }

  const onEdit = (event) => {
    event.preventDefault();

    const validationResult = validateFormInput(form);

    if (Object.keys(validationResult).length !== 0) {
      return;
    }

    editUserProfile(currentUser.handle, form)
      .then((result) => {
        if (result === 'Successful update') {
          toast('Profile details updated successfully.');
        }
      })
      .catch((error) => {
        console.log(`Error updating details: ${error.message}`);
        toast('An error occurred while updating profile details.');
      });
  };

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className='flex flex-row gap-4 h-[87vh] w-full mt-4 max-lg:flex-col'>
      <div role="tablist" className="tabs tabs-bordered flex flex-col gap-4 basis-1/5 rounded-md bg-pureWhite p-8 h-full">
        <a role="tab" className={`tab w-full ${activeTab === 0 && 'tab-active'}`} onClick={() => handleTabClick(0)}>Basic Details</a>
        <a role="tab" className={`tab w-full ${activeTab === 1 && 'tab-active'}`} onClick={() => handleTabClick(1)}>Profile Picture</a>
        <a role="tab" className={`tab w-full ${activeTab === 2 && 'tab-active'}`} onClick={() => handleTabClick(2)}>Change Password</a>
      </div>
      {!loading && activeTab === 0 && (
        <div className="flex flex-col gap-2 basis-4/5 rounded-md bg-pureWhite p-4 h-full overflow-y-auto [&::-webkit-scrollbar]:[width:8px]
        [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md">
          <div className='flex flex-row justify-between rounded-md border-lightBlue border-2 p-8 w-full gap-2'>
            <div className='flex flex-col items-start gap-2 w-full'>
              <div className='flex flex-col items-start'>
                <h3 className='font-bold text-lg text-left'>Basic Details</h3>
                <p className="text-left">Info about you across the app.</p>
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <div className='name-details'>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Your Name</span>
                    </label>
                    <input type="text" className="input input-bordered w-full bg-white" defaultValue={currentUser.name} onChange={updateForm('name')} />

                    {formErrorMsg.name && <span className="err-message text-red">{formErrorMsg.name}</span>}
                  </div>
                </div>
                <div className='surname-details'>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Your Surname</span>
                    </label>
                    <input type="text" className="input input-bordered w-full bg-white" defaultValue={currentUser.surname} onChange={updateForm('surname')} />
                    {formErrorMsg.surname && <span className="err-message text-red">{formErrorMsg.surname}</span>}
                  </div>
                </div>
                <div className='email-details'>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Your Email</span>
                    </label>
                    <input type="text" className="input input-bordered w-full disabled:bg-lightBlue border-none disabled:text-black" defaultValue={currentUser.email} disabled />
                  </div>
                </div>
                <div className='username-details'>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Your Username</span>
                    </label>
                    <input type="text" className="input input-bordered w-full disabled:bg-lightBlue border-none disabled:text-black" defaultValue={currentUser.handle} disabled />
                  </div>
                </div>
                <div className='phone-details'>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Your Phone Number</span>
                    </label>
                    <input type="tel" className="input input-bordered w-full bg-white" placeholder="+359 00 000 0000" defaultValue={currentUser.phoneNumber} onChange={updateForm('phoneNumber')} />
                    {formErrorMsg.phoneNumber && <span className="err-message text-red">{formErrorMsg.phoneNumber}</span>}
                  </div>
                </div>
                <div className='user-description'>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Your Bio</span>
                    </label>
                    <textarea className="textarea textarea-bordered h-24 textarea-md w-full bg-white" placeholder="Bio" defaultValue={currentUser.bio} onChange={updateForm('bio')}></textarea>
                  </div>
                </div>
                <div className='flex flex-row justify-end'>
                  {isUpdated && form.name && form.surname && <button className="btn bg-pink text-white border-none mt-1" onClick={onEdit}>Save Updates</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!loading && activeTab === 1 && <ChangeProfilePicture handle={currentUser.handle} />}
      {!loading && activeTab === 2 && <ChangePassword />}
    </div>
  )
}