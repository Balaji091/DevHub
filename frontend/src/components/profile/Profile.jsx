import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Briefcase, Github, Linkedin, Plus, X, Save } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ALLOWED_FIELDS = [
  'age', 'gender', 'about', 'skills', 'photoUrl',
  'company', 'location', 'jobTitle', 'firstName',
  'lastName', 'githubUrl', 'linkedInUrl'
];

const EMPTY_PROFILE = {
  age: '',
  gender: '',
  about: '',
  skills: [],
  photoUrl: '',
  company: '',
  location: '',
  jobTitle: '',
  firstName: '',
  lastName: '',
  githubUrl: '',
  linkedInUrl: ''
};

const Profile = () => {
  const [user, setUser] = useState(EMPTY_PROFILE);
  const [formData, setFormData] = useState(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState(null); // <-- hold the picked file
  const [previewUrl, setPreviewUrl] = useState(''); // <-- show preview immediately

  // Fetch profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('http://localhost:3001/profile', {
          method: 'GET',
          credentials: 'include'
        });
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const data = await res.json();

        const sanitized = {
          ...EMPTY_PROFILE,
          ...data,
          skills: Array.isArray(data.skills) ? data.skills : []
        };

        setUser(sanitized);

        const initial = { ...EMPTY_PROFILE };
        ALLOWED_FIELDS.forEach(key => {
          initial[key] = key === 'skills'
            ? (Array.isArray(sanitized[key]) ? sanitized[key] : [])
            : (sanitized[key] ?? '');
        });
        setFormData(initial);
        setIsEditing(true);
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (!ALLOWED_FIELDS.includes(name)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill) return;
    const current = Array.isArray(formData.skills) ? formData.skills : [];
    if (!current.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...current, skill] }));
    }
    setNewSkill('');
  };

  const removeSkill = skillToRemove => {
    const current = Array.isArray(formData.skills) ? formData.skills : [];
    setFormData(prev => ({
      ...prev,
      skills: current.filter(s => s !== skillToRemove)
    }));
  };

  // Always send multipart/form-data (simplest)
  const handleSave = async () => {
    try {
      const fd = new FormData();

      // append allowed fields
      ALLOWED_FIELDS.forEach(key => {
        const val = formData[key];
        if (key === 'skills') {
          fd.append('skills', JSON.stringify(Array.isArray(val) ? val : []));
        } else {
          fd.append(key, val ?? '');
        }
      });

      // photo if selected
      if (photoFile) {
        fd.append('photo', photoFile);
      }

      const res = await fetch('http://localhost:3001/profile', {
        method: 'PATCH',
        credentials: 'include',
        body: fd
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Save error: ${res.status}`);
      }

      const { profile, message } = await res.json();

      const sanitized = {
        ...EMPTY_PROFILE,
        ...profile,
        skills: Array.isArray(profile.skills) ? profile.skills : []
      };

      setUser(sanitized);
      setFormData(sanitized);
      setPhotoFile(null);
      setPreviewUrl('');

      toast.success(message || 'Profile updated successfully');
      setIsEditing(true); // keep editing; set false to go to preview
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error(error.message || 'Failed to save profile');
    }
  };

  const handlePhotoUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const local = URL.createObjectURL(file);
    setPreviewUrl(local);
    // just for immediate visual feedback; actual save happens on Save button
    setFormData(prev => ({ ...prev, photoUrl: local }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-600"></div>
      </div>
    );
  }

  const safeUserSkills = Array.isArray(user.skills) ? user.skills : [];
  const safeFormSkills = Array.isArray(formData.skills) ? formData.skills : [];

  const displayPhoto = previewUrl || formData.photoUrl || user.photoUrl;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen w-full overflow-y-auto">
      <Toaster position="top-right" />
      <div className="w-full px-4 py-6 max-w-5xl mx-auto pb-24">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="relative h-32 sm:h-48 bg-gradient-to-r from-primary-500 to-primary-700">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-end space-x-4">
              <div className="relative">
                <img
                  src={displayPhoto}
                  alt="avatar"
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/20"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-2 cursor-pointer hover:bg-primary-600 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white">
                  {(formData.firstName || '').toUpperCase()} {(formData.lastName || '').toUpperCase()}
                </h1>
                <p className="text-blue-200">{(formData.jobTitle || user.jobTitle) || ''}</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-2 sm:px-4 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm sm:text-base font-semibold hover:bg-white/30 transition-colors"
              >
                {isEditing ? 'Preview' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6">
          {isEditing ? (
            <div className="space-y-6">
              {/* First/Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Age / Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-blue-200 mb-2">Age</label>
                  <input
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  />
                </div>
             <div>
  <label className="block text-sm text-blue-200 mb-2">Gender</label>
  <select
    name="gender"
    value={formData.gender}
    onChange={handleInputChange}
    className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
  >
    <option value="" className="bg-gray-800 text-white">Select Gender</option>
    <option value="male" className="bg-gray-800 text-white">Male</option>
    <option value="female" className="bg-gray-800 text-white">Female</option>
    <option value="other" className="bg-gray-800 text-white">Other</option>
  </select>
</div>

              </div>

              {/* Job / Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-blue-200 mb-2">Job Title</label>
                  <input name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm text-blue-200 mb-2">Company</label>
                  <input name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white" />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm text-blue-200 mb-2">Location</label>
                <input name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white" />
              </div>

              {/* About */}
              <div>
                <label className="block text-sm text-blue-200 mb-2">About</label>
                <textarea name="about" value={formData.about} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white" />
              </div>

              {/* Skills */}
              <div className="flex space-x-2 items-center">
                <input
                  name="newSkill"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="Add skill"
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button onClick={addSkill} className="bg-primary-500 p-2 rounded-full hover:bg-primary-600 transition-colors">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {safeFormSkills.map((s, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-1 bg-primary-500 text-white rounded-full">
                    {s}
                    <X onClick={() => removeSkill(s)} className="ml-1 w-3 h-3 cursor-pointer text-white" />
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-blue-200 mb-2">GitHub URL</label>
                  <input name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm text-blue-200 mb-2">LinkedIn URL</label>
                  <input name="linkedInUrl" value={formData.linkedInUrl} onChange={handleInputChange} className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white" />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex my-8">
                <button
                  onClick={handleSave}
                  className="fixed bottom-4 right-4 sm:static flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg"
                >
                  <Save className="w-4 h-4" /><span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : (
            // Preview mode
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(user.jobTitle || user.company) && (
                  <div className="flex items-center space-x-3 text-blue-200">
                    <Briefcase className="w-5 h-5" />
                    <p>
                      {(user.jobTitle || '')}
                      {user.company ? ` @ ${user.company}` : ''}
                    </p>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center space-x-3 text-blue-200">
                    <MapPin className="w-5 h-5" />
                    <p>{user.location}</p>
                  </div>
                )}
              </div>

              {user.age || user.gender ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-blue-200">
                  {user.age && <p><span className="text-white font-semibold">Age:</span> {user.age}</p>}
                  {user.gender && <p><span className="text-white font-semibold">Gender:</span> {user.gender}</p>}
                </div>
              ) : null}

              {user.about && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                  <p className="text-blue-200">{user.about}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {safeUserSkills.length
                    ? safeUserSkills.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-primary-500 text-white rounded-full text-sm font-medium">
                          {s.toUpperCase()}
                        </span>
                      ))
                    : <span className="text-blue-200 text-sm">No skills added yet.</span>
                  }
                </div>
              </div>

              {(user.githubUrl || user.linkedInUrl) && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Links</h3>
                  <div className="flex space-x-4">
                    {user.githubUrl && (
                      <a
                        href={user.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Github className="w-4 h-4" /><span>GitHub</span>
                      </a>
                    )}
                    {user.linkedInUrl && (
                      <a
                        href={user.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" /><span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
