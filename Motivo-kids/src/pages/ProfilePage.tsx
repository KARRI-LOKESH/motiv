// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Edit2, Save, X, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchCurrentUserProfile, updateUserProfile } from '../api';
import { useTheme } from '../contexts/ThemeContext';

const ProfilePage: React.FC = () => {
  const { user, refreshUser, setUser } = useAuth();
  const { theme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    profile_image: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('/default-avatar.png');

  // Update preview when AuthContext user changes
  useEffect(() => {
    setPreview(user?.profile_pic || '/default-avatar.png');
  }, [user]);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchCurrentUserProfile();
        if (profile) {
          setProfileId(profile.id);
          setFormData({
            fname: profile.fname || '',
            lname: profile.lname || '',
            email: profile.email || '',
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
            zipCode: profile.zip_code || '',
            profile_image: profile.profile_image || '',
          });

          setUser({
            name: profile.fname + ' ' + profile.lname,
            email: profile.email,
            profile_pic: profile.profile_image || '/default-avatar.png',
          });
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    loadProfile();
  }, [setUser]);

  const handleSave = async () => {
    if (!profileId) return;

    setLoading(true);
    try {
      const updated = await updateUserProfile(
        profileId,
        {
          fname: formData.fname,
          lname: formData.lname,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip_code: formData.zipCode,
        },
        profileImage
      );

      setFormData(prev => ({
        ...prev,
        ...updated,
        profile_image: updated.profile_image || prev.profile_image,
      }));

      if (profileImage) {
        const previewUrl = URL.createObjectURL(profileImage);
        setPreview(previewUrl);
        setUser(prev => prev ? { ...prev, profile_pic: previewUrl } : prev);
      }

      setProfileImage(null);
      setIsEditing(false);

      // Refresh AuthContext user info from backend
      await refreshUser?.();
    } catch (err: any) {
      console.error('Failed to save profile:', err?.response?.data || err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsEditing(false);
    if (profileId) {
      const profile = await fetchCurrentUserProfile();
      if (profile) {
        setFormData({
          fname: profile.fname || '',
          lname: profile.lname || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          zipCode: profile.zip_code || '',
          profile_image: profile.profile_image || '',
        });
        setPreview(profile.profile_image || '/default-avatar.png');
        setUser({
          name: profile.fname + ' ' + profile.lname,
          email: profile.email,
          profile_pic: profile.profile_image || '/default-avatar.png',
        });
      }
    }
    setProfileImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setPreview(previewUrl);
      setUser(prev => prev ? { ...prev, profile_pic: previewUrl } : prev);
    }
  };

  // Theme classes
  const pageBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-50 text-gray-800';

  return (
    <div className={`min-h-screen ${pageBg} py-8`}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`${cardBg} rounded-2xl shadow-lg overflow-hidden`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
            <div className="flex items-center space-x-6 relative">
              <div className="relative w-24 h-24">
                <img
                  src={preview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-white"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700">
                  <Plus className="w-4 h-4 text-white" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{formData.fname} {formData.lname}</h1>
                <p className="text-blue-100 mt-2">
                  Member since {new Date(user?.createdAt || '').getFullYear() || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl font-bold ${textPrimary}`}>Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className={`${textSecondary}`}>First Name</label>
                {isEditing ? (
                  <input
                    value={formData.fname}
                    onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                    className={`w-full px-4 py-3 border rounded ${inputBg} ${borderColor}`}
                  />
                ) : (
                  <div className={`p-3 rounded ${inputBg}`}>{formData.fname}</div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className={`${textSecondary}`}>Last Name</label>
                {isEditing ? (
                  <input
                    value={formData.lname}
                    onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                    className={`w-full px-4 py-3 border rounded ${inputBg} ${borderColor}`}
                  />
                ) : (
                  <div className={`p-3 rounded ${inputBg}`}>{formData.lname}</div>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className={`${textSecondary}`}>Email</label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    value={formData.email}
                    disabled
                    className={`flex-1 px-4 py-3 border rounded ${inputBg} ${borderColor}`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={`${textSecondary}`}>Phone</label>
                {isEditing ? (
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 border rounded ${inputBg} ${borderColor}`}
                  />
                ) : (
                  <div className={`p-3 rounded ${inputBg}`}>{formData.phone || 'Not provided'}</div>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className={`${textSecondary}`}>Address</label>
                {isEditing ? (
                  <input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-3 border rounded ${inputBg} ${borderColor}`}
                  />
                ) : (
                  <div className={`p-3 rounded ${inputBg}`}>{formData.address || 'Not provided'}</div>
                )}
              </div>

              {/* City */}
              <div>
                <label className={`${textSecondary}`}>City</label>
                {isEditing ? (
                  <input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-4 py-3 border rounded ${inputBg} ${borderColor}`}
                  />
                ) : (
                  <div className={`p-3 rounded ${inputBg}`}>{formData.city || 'Not provided'}</div>
                )}
              </div>

              {/* ZIP Code */}
              <div>
                <label className={`${textSecondary}`}>ZIP Code</label>
                {isEditing ? (
                  <input
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className={`w-full px-4 py-3 border rounded ${inputBg} ${borderColor}`}
                  />
                ) : (
                  <div className={`p-3 rounded ${inputBg}`}>{formData.zipCode || 'Not provided'}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
