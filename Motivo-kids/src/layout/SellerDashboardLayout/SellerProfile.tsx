import React, { useEffect, useState } from "react";
import { api } from "../../api"; // Axios instance with auth token
import defaultAvatar from "../../assets/default-avatar.png"; // Default profile image

interface SellerProfile {
  id: number;
  user: {
    username?: string;
    email?: string;
  };
  shop_name?: string;
  phone_number?: string;
  address?: string;
  website?: string;
  bio?: string;
  profile_image?: string | null;
  created_at?: string;
  updated_at?: string;
}

const SellerProfile: React.FC = () => {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [shopName, setShopName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/sellers/profile/");
        const data = res.data;
        if (data.profile_image) {
          data.profile_image = `http://127.0.0.1:8000${data.profile_image}`;
        }
        setProfile(data);
        setShopName(data.shop_name || "");
        setPhoneNumber(data.phone_number || "");
        setAddress(data.address || "");
        setWebsite(data.website || "");
        setBio(data.bio || "");
        setPreviewImage(data.profile_image || null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append("shop_name", shopName || "");
      data.append("phone_number", phoneNumber || "");
      data.append("address", address || "");
      data.append("website", website || "");
      data.append("bio", bio || "");
      if (profileImage) data.append("profile_image", profileImage);

      const res = await api.patch("/sellers/profile/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedProfile = res.data;
      if (updatedProfile.profile_image) {
        updatedProfile.profile_image = `http://127.0.0.1:8000${updatedProfile.profile_image}`;
      }

      setProfile(updatedProfile);
      setPreviewImage(updatedProfile.profile_image || null);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Failed to update profile:", err.response || err.message);
      alert("Failed to update profile. Check all fields.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Seller Profile
      </h2>

     <div className="mb-4 flex items-center gap-4">
  <img
    src={previewImage || defaultAvatar}
    alt="Profile"
    className="w-20 h-20 rounded-full object-cover border"
  />
  <div>
    <p className="text-gray-600 dark:text-gray-300">
      <strong>Username:</strong> {profile?.shop_name || "-"}
    </p>
    <p className="text-gray-600 dark:text-gray-300">
      <strong>Email:</strong> {profile?.user?.email || "-"}
    </p>
  </div>
</div>

<div className="flex flex-col gap-4">
  {/* Shop Name */}
  <div className="flex items-center gap-4">
    <label className="w-32 text-gray-700 dark:text-gray-300 font-semibold">Shop Name:</label>
    <input
      type="text"
      value={shopName}
      onChange={(e) => setShopName(e.target.value)}
      disabled={!editMode}
      className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Phone Number */}
  <div className="flex items-center gap-4">
    <label className="w-32 text-gray-700 dark:text-gray-300 font-semibold">Phone Number:</label>
    <input
      type="text"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      disabled={!editMode}
      className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Address */}
  <div className="flex items-center gap-4">
    <label className="w-32 text-gray-700 dark:text-gray-300 font-semibold">Address:</label>
    <input
      type="text"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      disabled={!editMode}
      className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Website */}
  <div className="flex items-center gap-4">
    <label className="w-32 text-gray-700 dark:text-gray-300 font-semibold">Website:</label>
    <input
      type="url"
      value={website}
      onChange={(e) => setWebsite(e.target.value)}
      disabled={!editMode}
      className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Bio */}
  <div className="flex items-start gap-4">
    <label className="w-32 text-gray-700 dark:text-gray-300 font-semibold">Bio:</label>
    <textarea
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      disabled={!editMode}
      className="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Profile Image */}
  {editMode && (
    <div className="flex items-center gap-4">
      <label className="w-32 text-gray-700 dark:text-gray-300 font-semibold">Profile Image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  )}
</div>


      <div className="mt-4 flex gap-4">
        {editMode ? (
          <>
            <button
              onClick={handleUpdate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white p-3 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
