import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useState } from 'react';
import { MIN_PASSWORD_LENGTH } from "../../common/constants";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [failed, setFailed] = useState(false);

  const handlePasswordChange = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Create a credential with the user's current password
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    if (!currentPassword) {
      alert('Old password is required');
      return;
    }
    if (!newPassword || newPassword.length < MIN_PASSWORD_LENGTH) {
      alert('New password is required and must be at least 6 characters.');
      return;
    }

    // Re-authenticate the user with the credential
    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newPassword)
        .then(() => {
          setMessage('Password updated successfully.');
          setIsSuccessful(true);
        })
        .catch((error) => {
          setMessage(`Error updating password: ${error.message}`);
          setFailed(true);
        });
      })
      .catch((error) => {
        setMessage(`Error re-authenticating: ${error.message}`);
        setFailed(true);
      });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='change-password'>
      <div className='password-intro'>
        <h2>Password and Authentication</h2>
        <p>A secure password helps protect your account.</p>
      </div>
      <button className="btn btn-tertiary" onClick={() => document.getElementById('my_modal_3').showModal()}>Change Password</button>
      <dialog id="my_modal_3" className="modal flex-col justify-center">
        <div className="modal-box flex-col gap-2 justify-center bg-neutral-50">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Change Password</h3>
          <p className="py-4">Please, insert your new password below.</p>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Your Old Password</span>
            </label>
            <input type={
              showPassword ? "text" : "password"
            } className="input input-bordered w-full max-w-xs bg-neutral-50" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Your New Password</span>
            </label>
            <input type={
              showPassword ? "text" : "password"
            } className="input input-bordered w-full max-w-xs bg-neutral-50" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <div className="form-control">
              <label className="label cursor-pointer flex flex-row gap-2">
                <span className="label-text">Show Password</span>
                <input type="checkbox" className="checkbox" checked={showPassword} value={showPassword} onChange={() => setShowPassword((prev) => !prev)} />
              </label>
            </div>
          </div>
          {currentPassword !== '' && newPassword !== '' && newPassword.length >= MIN_PASSWORD_LENGTH && (
            <form method="dialog">
              <button className="btn btn-active text-white" onClick={handlePasswordChange}>Change Password</button>
            </form>
          )}
        </div>
      </dialog >
      {failed && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{message}</span>
        </div>
      )}
      {isSuccessful && (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{message}</span>
        </div>
      )}
    </div >
  )
}
