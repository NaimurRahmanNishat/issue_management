// src/components/pages/dashboard/shared/ProfileSetting.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
import { User, Mail, Phone, CreditCard, MapPin, Briefcase, Shield, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import { motion } from 'framer-motion';
import { useGetProfileByIdQuery } from '@/redux/features/users/userApi';


const ProfileSettings = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetProfileByIdQuery();
  const user = data?.data;

  if (isLoading) return <Loading/>;
  if (error) return <div className="text-center py-10 text-red-500">Something went wrong!</div>;

  const handleEditProfile = () => {
    navigate('/dashboard/update-profile');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="py-12">
      <div className="">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-48 bg-linear-to-r from-blue-500 via-blue-600 to-cyan-500">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-16 left-8 sm:left-12">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-cyan-500">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleEditProfile}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-110"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 sm:px-12 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">{user?.name}</h1>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{user?.role}</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleEditProfile}
                className="mt-4 cursor-pointer sm:mt-0 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-500 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors duration-300">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-slate-800 truncate">{user?.name || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0 group-hover:bg-cyan-200 transition-colors duration-300">
                    <Mail className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Email Address</p>
                    <p className="text-lg font-semibold text-slate-800 truncate">{user?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors duration-300">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Phone Number</p>
                    <p className="text-lg font-semibold text-slate-800">{user?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 group-hover:bg-orange-200 transition-colors duration-300">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Zip Code</p>
                    <p className="text-lg font-semibold text-slate-800">{user?.zipCode || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors duration-300">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Profession</p>
                    <p className="text-lg font-semibold text-slate-800">{user?.profession || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-200 transition-colors duration-300">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-500 mb-1">Division</p>
                    <p className="text-lg font-semibold text-slate-800">{user?.division || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-linear-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 md:col-span-2">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 group-hover:bg-rose-200 transition-colors duration-300">
                    <CreditCard className="w-6 h-6 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500 mb-3">National ID Cards</p>
                    {user?.nidPic && user.nidPic.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.nidPic.map((nid: any, index: number) => (
                          <div key={index} className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                            <img
                              src={nid.url}
                              alt={`NID ${index === 0 ? 'Front' : 'Back'} Side`}
                              className="w-full h-64 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3">
                              <p className="text-white text-sm font-medium">
                                {index === 0 ? 'Front Side' : 'Back Side'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-600">No NID uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/forgot-password" className="flex-1 px-6 text-center py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 font-medium">
                  Change Password 
                </Link>
                <button className="flex-1 px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Copyright © {new Date().getFullYear()}: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;