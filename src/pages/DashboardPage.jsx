// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
// --- ADDED: Import motion and AnimatePresence from framer-motion ---
import { motion, AnimatePresence } from 'framer-motion';
// --- END ADDED ---
import {
    CalendarDaysIcon,
    ChatBubbleLeftEllipsisIcon,
    DocumentTextIcon,
    PlusCircleIcon,
    UserCircleIcon,
    SparklesIcon, // For health tips or insights
    ChartBarIcon, // For placeholder charts
    ArrowRightIcon,
    NewspaperIcon // For News section
} from '@heroicons/react/24/outline';

/**
 * DashboardPage for authenticated users, specifically tailored for Patients.
 * Displays a summary of relevant information, health tips, and news.
 */
function DashboardPage() {
    const { user, isLoading } = useAuth();
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0); // This state is not used for cycling news in the current display logic, but kept if needed later

    // Placeholder data - In a real app, this would come from API calls
    const upcomingAppointments = [
        { id: 1, doctor: 'Dr. Anisa Putri', specialty: 'Cardiology', time: 'Tomorrow, 10:00 AM', type: 'Virtual Consultation' },
        { id: 2, doctor: 'Dr. Budi Santoso', specialty: 'General Checkup', time: 'May 15, 2025, 02:30 PM', type: 'In-Clinic Visit' },
        { id: 3, doctor: 'Dr. Citra Lestari', specialty: 'Dermatology', time: 'May 18, 2025, 09:00 AM', type: 'Follow-up' },
    ];

    const recentMessages = [
        { id: 1, from: 'Dr. Anisa Putri', preview: 'Your recent test results are available for review.', unread: true, time: '1h ago' },
        { id: 2, from: 'KonsulDok Admin', preview: 'System maintenance scheduled for Sunday at 2 AM.', unread: false, time: 'Yesterday' },
        { id: 3, from: 'Pharmacy Bot', preview: 'Your prescription refill is ready for pickup.', unread: true, time: '3h ago' },
    ];

    const healthTips = [
        { id: 1, tip: "Stay hydrated! Aim for 8 glasses of water a day for optimal organ function and energy levels." },
        { id: 2, tip: "Incorporate at least 30 minutes of moderate exercise, like brisk walking, into your daily routine." },
        { id: 3, tip: "Ensure you get 7-9 hours of quality sleep each night for physical and mental restoration." },
        { id: 4, tip: "Don't forget your regular health check-ups. Early detection significantly improves treatment outcomes!" },
        { id: 5, tip: "Practice mindfulness or meditation for 10-15 minutes daily to reduce stress and improve focus." }
    ];

    const healthNews = [
        {
            id: 1,
            title: "New Study Highlights Benefits of Mediterranean Diet for Heart Health",
            source: "Global Health Journal",
            date: "May 8, 2025",
            excerpt: "A recent extensive study published in the Global Health Journal underscores the significant cardiovascular benefits associated with long-term adherence to a Mediterranean diet...",
            link: "#" // Placeholder link
        },
        {
            id: 2,
            title: "Understanding Seasonal Allergies in Indonesia: Tips for Relief",
            source: "KonsulDok Health Blog",
            date: "May 5, 2025",
            excerpt: "As seasons change, many experience heightened allergic reactions. Our latest blog post discusses common triggers in Indonesia and effective strategies for managing symptoms...",
            link: "#"
        },
        {
            id: 3,
            title: "The Importance of Mental Wellness in a Fast-Paced World",
            source: "Wellness Today Magazine",
            date: "May 1, 2025",
            excerpt: "Mental health experts emphasize the growing need for proactive mental wellness practices, including stress management and seeking support when needed...",
            link: "#"
        },
         {
            id: 4,
            title: "Advances in Telemedicine: Bringing Healthcare Closer to You",
            source: "Tech Health News",
            date: "April 28, 2025",
            excerpt: "Telemedicine platforms like KonsulDok are revolutionizing access to healthcare, offering convenient consultations and remote monitoring for various conditions...",
            link: "#"
        }
    ];

    // Cycle through health tips
    useEffect(() => {
        if (healthTips.length === 0) return; // Guard against empty array
        const tipInterval = setInterval(() => {
            setCurrentTipIndex(prevIndex => (prevIndex + 1) % healthTips.length);
        }, 10000); // Change tip every 10 seconds
        return () => clearInterval(tipInterval);
    }, [healthTips.length]);

    // Note: news cycling useEffect was removed as it wasn't directly used for display logic
    // If you want to cycle the *displayed* news, that logic would need to be added to the news rendering section.

    if (isLoading && !user) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) {
        return <p className="text-center text-error p-10">User data not found. Please log in.</p>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
            {/* Header Section */}
            <header className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                    Welcome back, {user.firstName}!
                </h1>
                <p className="mt-2 text-lg text-base-content/80">
                    Here's your personalized health dashboard.
                </p>
            </header>

            {/* Quick Stats / Summary Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Upcoming Appointments Card */}
                <div className="card bg-base-200 shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow">
                    <div className="card-body">
                        <div className="flex items-center space-x-3 mb-3">
                            <CalendarDaysIcon className="w-8 h-8 text-primary" />
                            <h2 className="card-title text-lg text-primary">Upcoming Appointments</h2>
                        </div>
                        {upcomingAppointments.length > 0 ? (
                            <p className="text-3xl font-bold text-base-content">{upcomingAppointments.length}</p>
                        ) : (
                            <p className="text-base-content/70">No upcoming appointments.</p>
                        )}
                        <div className="card-actions justify-end mt-2">
                            <Link to="/appointments" className="btn btn-xs btn-outline btn-primary">View All</Link>
                        </div>
                    </div>
                </div>

                {/* Recent Messages Card */}
                <div className="card bg-base-200 shadow-md border-l-4 border-secondary hover:shadow-lg transition-shadow">
                    <div className="card-body">
                         <div className="flex items-center space-x-3 mb-3">
                            <ChatBubbleLeftEllipsisIcon className="w-8 h-8 text-secondary" />
                            <h2 className="card-title text-lg text-secondary">Recent Messages</h2>
                        </div>
                        {recentMessages.filter(m => m.unread).length > 0 ? (
                             <p className="text-3xl font-bold text-base-content">
                                {recentMessages.filter(m => m.unread).length} <span className="text-sm font-normal">New</span>
                             </p>
                        ) : (
                            <p className="text-base-content/70">No new messages.</p>
                        )}
                        <div className="card-actions justify-end mt-2">
                            <Link to="/messages" className="btn btn-xs btn-outline btn-secondary">View Messages</Link>
                        </div>
                    </div>
                </div>

                {/* Quick Access to Medical Records */}
                 <div className="card bg-neutral text-neutral-content shadow-md border-l-4 border-neutral-focus hover:shadow-lg transition-shadow">
                    <div className="card-body">
                         <div className="flex items-center space-x-3 mb-3">
                            <DocumentTextIcon className="w-8 h-8 text-neutral-content" />
                            <h2 className="card-title text-lg text-neutral-content">Medical Records</h2>
                        </div>
                        <p className="text-sm text-neutral-content/80">Access your lab results, consultation notes, and uploaded documents.</p>
                        <div className="card-actions justify-end mt-4">
                            <Link to="/medical-records" className="btn btn-xs btn-outline border-neutral-content text-neutral-content hover:bg-neutral-content hover:text-neutral">View Records</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Action Buttons */}
            <section className="py-6">
                <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
                    <Link to="/book-appointment" className="btn btn-primary btn-wide shadow hover:shadow-md">
                        <PlusCircleIcon className="w-5 h-5 mr-2" /> Book New Appointment
                    </Link>
                    <Link to="/profile" className="btn btn-secondary btn-outline btn-wide shadow hover:shadow-md">
                        <UserCircleIcon className="w-5 h-5 mr-2" /> View/Edit Profile
                    </Link>
                </div>
            </section>

            {/* Combined Section for Next Appointments and Health Tip */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Next Appointments List (takes more space) */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-primary mb-4">Your Next Appointments</h2>
                    {upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingAppointments.slice(0, 3).map(appt => ( // Show first 3 for brevity
                                <div key={appt.id} className="card card-compact bg-base-200 shadow border border-black/10 hover:border-primary/30 transition-all">
                                    <div className="card-body flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div>
                                            <h3 className="font-semibold text-base-content">{appt.type} with {appt.doctor}</h3>
                                            <p className="text-sm text-secondary">{appt.specialty}</p>
                                            <p className="text-xs text-base-content/70 mt-1">{appt.time}</p>
                                        </div>
                                        <Link to={`/appointments/${appt.id}`} className="btn btn-xs btn-outline btn-primary mt-2 sm:mt-0">
                                            Details <ArrowRightIcon className="w-3 h-3 ml-1"/>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {upcomingAppointments.length > 3 && (
                                <div className="text-right mt-4">
                                     <Link to="/appointments" className="link link-primary text-sm font-medium">View all appointments &rarr;</Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-base-200 rounded-lg shadow">
                            <CalendarDaysIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" />
                            <p className="text-base-content/70 mb-4">You have no upcoming appointments scheduled.</p>
                            <Link to="/book-appointment" className="btn btn-sm btn-secondary">Book Now</Link>
                        </div>
                    )}
                </div>

                {/* Health Tip of the Day (takes less space) */}
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-semibold text-secondary mb-4">Health Tip</h2>
                    <div className="card bg-secondary/10 text-base-content shadow border border-secondary/20 h-full flex flex-col"> {/* Subtle Orange BG */}
                        <div className="card-body flex-grow flex flex-col items-center text-center justify-center">
                            <SparklesIcon className="w-12 h-12 text-secondary mb-3" />
                            {/* Ensure healthTips has items before trying to access */}
                            {healthTips.length > 0 && (
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={currentTipIndex} // This key change triggers the animation
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-sm sm:text-base leading-relaxed"
                                    >
                                        {healthTips[currentTipIndex].tip}
                                    </motion.p>
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Health News & Updates Section */}
            <section className="mt-8 md:mt-12">
                 <h2 className="text-2xl font-semibold text-primary mb-4">Health News & Updates</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {healthNews.slice(0,3).map(newsItem => ( // Show first 3 news items
                        <div key={newsItem.id} className="card bg-base-200 shadow border border-black/10 hover:shadow-lg transition-shadow">
                            <div className="card-body">
                                <h3 className="card-title text-md font-semibold text-base-content leading-tight">{newsItem.title}</h3>
                                <p className="text-xs text-base-content/60 mt-1">{newsItem.source} - {newsItem.date}</p>
                                <p className="text-sm text-base-content/80 mt-2 leading-relaxed line-clamp-3">{newsItem.excerpt}</p>
                                <div className="card-actions justify-end mt-4">
                                    <a href={newsItem.link} target="_blank" rel="noopener noreferrer" className="btn btn-xs btn-outline btn-secondary">
                                        Read More <ArrowRightIcon className="w-3 h-3 ml-1"/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
                 {healthNews.length > 3 && (
                    <div className="text-center mt-6">
                        <Link to="/health-news" className="btn btn-primary btn-outline">View All News</Link>
                    </div>
                 )}
            </section>


            {/* Placeholder for Charts/Graphs */}
            <section className="mt-8 md:mt-12">
                <h2 className="text-2xl font-semibold text-primary mb-4">Your Health Trends (Placeholder)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-base-200 shadow border border-black/10"> <div className="card-body"> <h3 className="card-title text-sm text-primary">Blood Pressure Trend</h3> <div className="flex justify-center items-center h-40 bg-base-100 rounded-md mt-2"> <ChartBarIcon className="w-16 h-16 text-primary/30" /> <p className="text-base-content/50 ml-2">Chart Data Unavailable</p> </div> </div> </div>
                    <div className="card bg-base-200 shadow border border-black/10"> <div className="card-body"> <h3 className="card-title text-sm text-secondary">Activity Levels</h3> <div className="flex justify-center items-center h-40 bg-base-100 rounded-md mt-2"> <ChartBarIcon className="w-16 h-16 text-secondary/30" /> <p className="text-base-content/50 ml-2">Chart Data Unavailable</p> </div> </div> </div>
                </div>
            </section>
        </div>
    );
}

export default DashboardPage;
