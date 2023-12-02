import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useState } from 'react';
import { MIN_PASSWORD_LENGTH } from "../../common/constants";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('')

  const handlePasswordChange = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Create a credential with the user's current password
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    if (!currentPassword) {
      setError('Old password is required');
      return;
    }
    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
      setError('New password is required and must be at least 6 characters.');
      return;
    }

    // Re-authenticate the user with the credential
    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {
            toast('Password updated successfully.');
          })
          .catch(() => {
            toast(`Error updating password. Please try again later.`);
          });
      })
      .catch(() => {
        toast(`Error re-authenticating. Please try again later.`);
      });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='flex flex-col justify-between basis-4/5 rounded-md bg-pureWhite p-4 h-full gap-2'>
      <div className='flex flex-row justify-between rounded-md border-lightBlue border-2 p-8 w-full gap-4 max-lg:flex-col'>
        <div className='flex flex-col items-start'>
          <h3 className='font-bold text-lg text-left'>Password and Authentication</h3>
          <p className="text-left">A secure password helps protect your account.</p>
        </div>
        <button className="btn border-none bg-pink text-pureWhite" onClick={() => document.getElementById('password_modal').showModal()}>Change Password</button>
        <dialog id="password_modal" className="modal flex-col justify-center">
          <div className="modal-box flex flex-col gap-4 justify-center bg-pureWhite w-[60vw]">
            <form method="dialog">
              <button className="btn btn-sm btn-circle hover:bg-lightBlue border-none text-blue bg-pureWhite absolute right-2 top-2">✕</button>
            </form>
            <div className='flex flex-col'>
              <h3 className="font-bold text-lg text-left">Change Password</h3>
              <p className="text-left">Please, insert your new password below.</p>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Your Old Password</span>
              </label>
              <input type={
                showPassword ? "text" : "password"
              } className="input input-bordered w-full bg-pureWhite" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              {error && <span className="err-message text-red">{error}</span>}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Your New Password</span>
              </label>
              <input type={
                showPassword ? "text" : "password"
              } className="input input-bordered w-full bg-pureWhite" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              {error && <span className="err-message text-red">{error}</span>}
            </div>
            <div className="form-control">
              <label className="label cursor-pointer flex flex-row gap-2">
                <span className="label-text">Show Password</span>
                <input type="checkbox" className="checkbox" checked={showPassword} value={showPassword} onChange={() => setShowPassword((prev) => !prev)} />
              </label>
            </div>
            {currentPassword !== '' && newPassword !== '' && newPassword.length >= MIN_PASSWORD_LENGTH && (
              <form method="dialog" className="flex flex-row w-ful justify-end">
                <button className="btn bg-pink border-none text-white" onClick={handlePasswordChange}>Change Password</button>
              </form>
            )}
          </div>
        </dialog >
      </div >
    </div>
  )
}
