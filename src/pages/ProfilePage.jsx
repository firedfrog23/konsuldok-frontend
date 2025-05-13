// src/pages/ProfilePage.jsx
import {
    ArrowUpTrayIcon, CameraIcon,
    EnvelopeIcon,
    IdentificationIcon, PencilSquareIcon,
    PhoneIcon, ShieldCheckIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import ProfileUpdateForm from '../components/user/ProfileUpdateForm.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import userService from '../services/user.service.js';

/**
 * User Profile Page. Adheres to strict 3-color palette.
 * - Header: Title (Blue).
 * - Card (bg-base-200): White BG.
 * - Avatar: Initials (Blue on light Blue BG), Picture (if any). Ring (Blue).
 * - Change Picture Button (btn-secondary): Black BG.
 * - User Info Text: Black. Role (Blue).
 * - Edit Info Button (btn-secondary outline): Black outline/text.
 * - ProfileDataItem: Icons (Blue), Labels/Values (Black).
 * - ProfileUpdateForm is already themed.
 */
function ProfilePage() {
    const { user, isLoading, updateUserInContext } = useAuth();
    const { addNotification } = useNotification();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    if (isLoading && !user) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <span className="loading loading-spinner loading-lg text-primary"></span> {/* Spinner Blue */}
            </div>
        );
    }

    if (!user) {
        return <p className="text-center text-neutral p-10">User data not found. Please try logging in again.</p>; // Error text Black
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                addNotification('File is too large. Maximum size is 5MB.', 'error'); // Themed error
                return;
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                addNotification('Invalid file type. Only JPEG, PNG, GIF, WEBP allowed.', 'error');
                return;
            }
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUploadPicture = async () => {
        if (!selectedFile) {
            addNotification('Please select an image file first.', 'error');
            return;
        }
        setIsUploading(true);
        try {
            const updatedUser = await userService.uploadProfilePicture(selectedFile);
            updateUserInContext(updatedUser);
            addNotification('Profile picture updated successfully!', 'success'); // Themed success
            setSelectedFile(null);
            setPreviewImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error('Profile picture upload failed:', error);
            addNotification(`${error.message || 'Failed to upload picture.'}`, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const ProfileDataItem = ({ icon: IconComponent, label, value, isSensitive = false }) => (
        <div className="flex items-start py-3 sm:py-4">
            {/* Icon: text-primary is Blue */}
            {IconComponent && <IconComponent className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0 opacity-80" />}
            <div>
                {/* Label: text-base-content (Black) with opacity */}
                <p className="text-xs text-base-content/70 font-medium">{label}</p>
                {/* Value: text-base-content (Black) */}
                <p className={`text-base-content font-medium ${isSensitive ? 'italic text-base-content/60' : ''}`}>
                    {value || (isSensitive ? 'Not set for security' : '-')}
                </p>
            </div>
        </div>
    );

    const userInitials = user.firstName?.[0]?.toUpperCase() + (user.lastName?.[0]?.toUpperCase() || '');

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-0">
            {/* Header: Title text-primary (Blue) */}
            <header className="mb-8 md:mb-12 pb-4 border-b border-black/10">
                <h1 className="text-3xl md:text-4xl font-bold text-primary">Your Profile</h1>
                <p className="text-base-content/70 mt-1">Manage your personal information and account settings.</p>
            </header>

            {/* Card: bg-base-200 is White */}
            <div className="bg-base-200 shadow-xl rounded-lg p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8 mb-8 pb-6 border-b border-black/10">
                    <div className="relative group">
                        <div className="avatar placeholder">
                            {/* Avatar: bg-primary/10 (light Blue), text-primary (Blue) for initials. Ring is Blue. */}
                            <div className="bg-primary/10 text-primary rounded-full w-32 h-32 ring ring-primary ring-offset-base-200 ring-offset-2">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile preview" className="rounded-full object-cover w-full h-full" />
                                ) : user.profilePictureUrl ? (
                                    <img src={user.profilePictureUrl} alt={`${user.firstName}'s profile`} className="rounded-full object-cover w-full h-full" />
                                ) : (
                                    <span className="text-5xl font-semibold">{userInitials || 'U'}</span>
                                )}
                            </div>
                        </div>
                        <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        {/* Change Picture Button: btn-secondary maps to Black BG, White text */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 btn btn-circle btn-sm btn-secondary group-hover:opacity-100 opacity-0 md:opacity-100 transition-opacity duration-300"
                            aria-label="Change profile picture"
                        >
                            <CameraIcon className="w-4 h-4"/>
                        </button>
                    </div>

                    <div className="text-center sm:text-left flex-grow">
                        {/* User Name: text-base-content (Black) */}
                        <h2 className="text-2xl font-semibold text-base-content">{user.firstName} {user.lastName}</h2>
                        {/* Role: text-primary (Blue) */}
                        <p className="text-primary font-medium capitalize">{user.role}</p>
                        {/* Email: text-base-content (Black) with opacity */}
                        <p className="text-sm text-base-content/70">{user.email}</p>

                        {selectedFile && (
                            <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
                                {/* Upload Button: btn-primary (Blue BG) */}
                                <button onClick={handleUploadPicture} className="btn btn-sm btn-primary" disabled={isUploading}>
                                    {isUploading ? <span className="loading loading-spinner loading-xs"></span> : <ArrowUpTrayIcon className="w-4 h-4 mr-1" />}
                                    {isUploading ? 'Uploading...' : 'Upload Picture'}
                                </button>
                                {/* Cancel Upload Button: btn-ghost (Black text) */}
                                <button
                                    onClick={() => { setSelectedFile(null); setPreviewImage(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                                    className="btn btn-sm btn-ghost text-base-content"
                                    disabled={isUploading}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {!isEditing && !selectedFile && (
                            // Edit Info Button: btn-secondary btn-outline (Black outline/text)
                            <button onClick={() => setIsEditing(true)} className="btn btn-sm btn-secondary btn-outline mt-4">
                                <PencilSquareIcon className="w-4 h-4 mr-2" />
                                Edit Info
                            </button>
                        )}
                    </div>
                </div>

                {!isEditing ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                            <ProfileDataItem icon={UserCircleIcon} label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                            <ProfileDataItem icon={EnvelopeIcon} label="Email" value={user.email} />
                            <ProfileDataItem icon={PhoneIcon} label="Phone Number" value={user.phoneNumber || 'Not provided'} />
                            <ProfileDataItem icon={ShieldCheckIcon} label="Account Status" value={user.isActive ? 'Active' : 'Inactive'} />
                            {user.role === 'Patient' && user.patientProfile?._id && (
                                <ProfileDataItem icon={IdentificationIcon} label="Patient Profile ID" value={user.patientProfile._id.toString().slice(-8).toUpperCase()} />
                            )}
                            {user.role === 'Doctor' && user.doctorProfile?._id && (
                                <ProfileDataItem icon={IdentificationIcon} label="Doctor Profile ID" value={user.doctorProfile._id.toString().slice(-8).toUpperCase()} />
                            )}
                        </div>
                    </>
                ) : (
                    // ProfileUpdateForm is already themed
                    <ProfileUpdateForm
                        onUpdateSuccess={() => { setIsEditing(false); }}
                    />
                )}
            </div>

            {isEditing && (
                <div className="mt-6 text-right">
                    {/* Cancel Button: btn-ghost (Black text) */}
                    <button onClick={() => setIsEditing(false)} className="btn btn-ghost text-base-content mr-2"> Cancel </button>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
