/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux';
import { User, Camera, X, ArrowLeft } from 'lucide-react';
import type { RootState } from '@/redux/store';
import { useMemo, useState } from 'react';
import type { Division } from '@/types/authType';
import { toast } from 'react-toastify';
import { setUser } from '@/redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useEditProfileByIdMutation } from '@/redux/features/users/userApi';

interface IFormData {
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  profession: string;
  division: Division | "";
  nidFrontFile?: File; 
  nidBackFile?: File;  
  avatarFile?: File;  
}

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [editProfile, { isLoading }] = useEditProfileByIdMutation();

  // Preview URLs
  const [nidFrontPreview, setNidFrontPreview] = useState<string>(user?.nidPic?.[0]?.url || "");
  const [nidBackPreview, setNidBackPreview] = useState<string>(user?.nidPic?.[1]?.url || "");
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar?.url || "");

  const initialFormData = useMemo<IFormData>(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    zipCode: user?.zipCode || "",
    profession: user?.profession || "",
    division: user?.division || "",
  }), [user]);

  const [formData, setFormData] = useState<IFormData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Handle NID front side
  const handleNidFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("NID image size should be less than 5MB");
        return;
      }
      // Store File object
      setFormData(prev => ({ ...prev, nidFrontFile: file }));
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setNidFrontPreview(previewUrl);
    }
  };

  // ✅ Handle NID back side
  const handleNidBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("NID image size should be less than 5MB");
        return;
      }
      setFormData(prev => ({ ...prev, nidBackFile: file }));
      const previewUrl = URL.createObjectURL(file);
      setNidBackPreview(previewUrl);
    }
  };

  // ✅ Handle avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Avatar size should be less than 5MB");
        return;
      }
      setFormData(prev => ({ ...prev, avatarFile: file }));
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };


 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("zipCode", formData.zipCode);
      formDataToSend.append("profession", formData.profession);
      formDataToSend.append("division", formData.division as string);

      // Backend expects: uploadImages.fields([{ name: "avatar", maxCount: 1 }, { name: "nidPic", maxCount: 3 }])
      
      if (formData.avatarFile) {
        formDataToSend.append("avatar", formData.avatarFile);
      }
      if (formData.nidFrontFile) {
        formDataToSend.append("nidPic", formData.nidFrontFile);
      }
      if (formData.nidBackFile) {
        formDataToSend.append("nidPic", formData.nidBackFile);
      }

      const response = await editProfile({id: user?._id || "",formData: formDataToSend}).unwrap();
      // Update Redux state
      dispatch(setUser(response?.data));
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(response?.data));
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        window.dispatchEvent(new Event('storage'));
        navigate('/dashboard/profile-settings');
      }, 100);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/profile-settings');
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="py-12 min-h-screen bg-gray-50">
      <div className="">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-500 via-blue-600 to-cyan-500 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-10 h-10 cursor-pointer bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-white">Update Profile</h2>
                  <p className="text-blue-100 text-sm">Edit your personal information</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleCancel}
                className="w-10 h-10 bg-white/20 cursor-pointer hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Avatar Upload Section */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden bg-white shadow-lg">
                    {(avatarPreview || user?.avatar?.url) ? (
                      <img 
                        src={avatarPreview || user?.avatar?.url} 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-cyan-500">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="avatarInput"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('avatarInput')?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-all duration-200"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => document.getElementById('avatarInput')?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm"
                  >
                    Choose Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: Square image, at least 400x400px (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="py-3 px-4 border border-gray-300 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="py-3 px-4 border border-gray-300 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input 
                    type="text" 
                    name="phone" 
                    id="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="01712345678"
                    className="py-3 px-4 border border-gray-300 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input 
                    type="text" 
                    name="zipCode" 
                    id="zipCode" 
                    value={formData.zipCode} 
                    onChange={handleChange} 
                    className="py-3 px-4 border border-gray-300 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                    Profession
                  </label>
                  <input 
                    type="text" 
                    name="profession" 
                    id="profession" 
                    value={formData.profession} 
                    onChange={handleChange} 
                    className="py-3 px-4 border border-gray-300 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-2">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="division" 
                    id="division" 
                    value={formData.division} 
                    onChange={handleChange} 
                    required
                    className="py-3 px-4 border border-gray-300 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select Division</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>
              </div>
            </div>

            {/* NID Upload Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">National ID Card</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front Side */}
                <div>
                  <label htmlFor="nidFront" className="block text-sm font-medium text-gray-700 mb-2">
                    NID Front Side
                  </label>
                  <input 
                    type="file" 
                    name="nidFront" 
                    id="nidFront"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleNidFrontChange}
                    className="py-3 px-4 border border-gray-300 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {(nidFrontPreview || user?.nidPic?.[0]?.url) && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img 
                        src={nidFrontPreview || user?.nidPic?.[0]?.url} 
                        alt="NID Front Preview" 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Back Side */}
                <div>
                  <label htmlFor="nidBack" className="block text-sm font-medium text-gray-700 mb-2">
                    NID Back Side
                  </label>
                  <input 
                    type="file" 
                    name="nidBack" 
                    id="nidBack"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleNidBackChange}
                    className="py-3 px-4 border border-gray-300 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {(nidBackPreview || user?.nidPic?.[1]?.url) && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img 
                        src={nidBackPreview || user?.nidPic?.[1]?.url} 
                        alt="NID Back Preview" 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Maximum file size: 10MB per image. Accepted formats: JPEG, PNG, WebP
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
              <button 
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 cursor-pointer bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;