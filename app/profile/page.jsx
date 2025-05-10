"use client"
import Header from "@/components/header/Header"
import { BsPerson, BsGear } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import backendUrl from 'environment';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const userId = localStorage.getItem('userId');
        const response = await fetch(`${backendUrl}/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router]);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`${backendUrl}/api/users/${userId}/email`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (response.ok) {
        setUser({ ...user, email: newEmail });
        setShowEmailPrompt(false);
        setNewEmail('');
      } else {
        setError('Failed to update email');
      }
    } catch (error) {
      setError('An error occurred', error);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`${backendUrl}/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        }),
      });

      if (response.ok) {
        setShowPasswordPrompt(false);
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setError('Failed to update password');
      }
    } catch (error) {
      setError('An error occurred', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`${backendUrl}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.clear();
        router.push('/login');
      } else {
        setError('Failed to delete account');
      }
    } catch (error) {
      setError('An error occurred', error);
    }
  };

  return (
    <main className="min-h-screen">
      <Header/>
      <div className="px-4 sm:px-8 py-8 max-w-7xl mx-auto">
        <section className="text-center mb-16 bg-ice-blue p-8 sm:p-12 rounded">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-petrol-blue flex items-center justify-center">
            <span className="text-5xl text-white">
              {user?.name?.[0] || 'U'}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-petrol-blue mb-4">
            {user?.name || 'User Profile'}
          </h1>
          <p className="text-xl text-gray-700">{user?.email}</p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded shadow-md text-center">
            <BsPerson className="text-5xl text-petrol-blue mx-auto mb-4" />
            <h2 className="text-3xl text-gray-800 mb-4">Personal Info</h2>
            <p className="text-gray-600 text-2xl leading-relaxed">
              Name: <b>{user?.name}</b><br/>
              Email: <b>{user?.email}</b><br/>
              Member since: <b>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</b>
            </p>
          </div>

          <div className="bg-white p-8 rounded shadow-md text-center">
            <BsGear className="text-5xl text-petrol-blue mx-auto mb-4" />
            <h2 className="text-3xl text-gray-800 mb-4">Account Settings</h2>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowEmailPrompt(true)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-all"
              >
                Change Email
              </button>
              <button 
                type="button"
                onClick={() => setShowPasswordPrompt(true)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-all"
              >
                Change Password
              </button>
              <button 
                type="button"
                onClick={() => setShowDeletePrompt(true)}
                className="bg-gray-200 text-red-700 px-4 py-2 rounded hover:bg-gray-300 transition-all"
              >
                DELETE ACCOUNT
              </button>
            </div>
          </div>
        </section>
      </div>

      {showEmailPrompt && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl mb-4">Change Email</h3>
            <form onSubmit={handleEmailUpdate}>
              {error && <p className="text-red-500 mb-2">{error}</p>}
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="New Email"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmailPrompt(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-petrol-blue text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <form onSubmit={handlePasswordUpdate}>
              {error && <p className="text-red-500 mb-2">{error}</p>}
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full p-2 border rounded mb-4"
                placeholder="Current Password"
                required
              />
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="w-full p-2 border rounded mb-4"
                placeholder="New Password"
                required
              />
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full p-2 border rounded mb-4"
                placeholder="Confirm New Password"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordPrompt(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-petrol-blue text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeletePrompt && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl mb-4 text-red-600">Delete Account</h3>
            <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeletePrompt(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}