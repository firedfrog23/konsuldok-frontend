// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import appointmentService from '../services/appointment.service.js';
import {
    CalendarDaysIcon,
    ChatBubbleLeftEllipsisIcon,
    DocumentTextIcon,
    PlusCircleIcon,
    UserCircleIcon,
    SparklesIcon,
    ChartBarIcon,
    ArrowRightIcon,
    NewspaperIcon,
    BeakerIcon,
    FlagIcon,
    LinkIcon,
    PhoneIcon,
    HeartIcon,
    AdjustmentsHorizontalIcon,
    ClipboardDocumentListIcon,
    UserGroupIcon // --- ADDED UserGroupIcon to imports ---
} from '@heroicons/react/24/outline';
// Removed PillIcon from solid as we are using outline consistently now
import { useNotification } from '../contexts/NotificationContext.jsx';

/**
 * DashboardPage for authenticated users, specifically tailored for Patients.
 * Displays a comprehensive summary of relevant information and quick actions.
 */
function DashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { addNotification } = useNotification();
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
    const [appointmentError, setAppointmentsError] = useState(null);

    // Placeholder data
    const recentMessages = [
        { id: 1, from: 'Dr. Anisa Putri', preview: 'Your recent test results are available for review. Please log in to view them.', unread: true, time: '1h ago', link: '/messages/1' },
        { id: 2, from: 'KonsulDok Admin', preview: 'Important: System maintenance scheduled for Sunday at 2 AM - 4 AM WIB.', unread: false, time: 'Yesterday', link: '/messages/2' },
        { id: 3, from: 'Pharmacy Bot', preview: 'Your prescription for Amoxicillin is ready for pickup at Apotek Sehat.', unread: true, time: '3h ago', link: '/messages/3' },
        { id: 4, from: 'Dr. Budi Santoso', preview: 'Follow-up regarding your consultation last week. Please call the clinic if you have questions.', unread: false, time: '2 days ago', link: '/messages/4' },
    ];

    const healthTips = [
        { id: 1, tip: "Stay hydrated! Aim for 8-10 glasses of water a day for optimal organ function and energy.", icon: SparklesIcon },
        { id: 2, tip: "Incorporate at least 30 minutes of moderate exercise, like brisk walking or cycling, into your daily routine.", icon: HeartIcon },
        { id: 3, tip: "Prioritize 7-9 hours of quality sleep each night. Consistent sleep patterns aid physical and mental restoration.", icon: SparklesIcon },
        { id: 4, tip: "Don't skip your regular health check-ups. Early detection of potential issues significantly improves treatment outcomes!", icon: HeartIcon },
        { id: 5, tip: "Practice mindfulness or meditation for 10-15 minutes daily to reduce stress, improve focus, and enhance overall well-being.", icon: SparklesIcon }
    ];

    const healthNews = [
        { id: 1, title: "New Study Highlights Benefits of Mediterranean Diet for Heart Health", source: "Global Health Journal", date: "May 8, 2025", excerpt: "A recent extensive study underscores the significant cardiovascular benefits associated with long-term adherence to a Mediterranean diet, rich in fruits, vegetables, and healthy fats.", link: "#" },
        { id: 2, title: "Understanding Seasonal Allergies in Indonesia: Tips for Relief", source: "KonsulDok Health Blog", date: "May 5, 2025", excerpt: "As seasons change, many experience heightened allergic reactions. Our latest blog post discusses common triggers in Indonesia and effective strategies for managing symptoms.", link: "#" },
        { id: 3, title: "The Importance of Mental Wellness in a Fast-Paced World", source: "Wellness Today Magazine", date: "May 1, 2025", excerpt: "Mental health experts emphasize the growing need for proactive mental wellness practices, including stress management and seeking support when needed.", link: "#" },
        { id: 4, title: "Advances in Telemedicine: Bringing Healthcare Closer to You", source: "Tech Health News", date: "April 28, 2025", excerpt: "Telemedicine platforms like KonsulDok are revolutionizing access to healthcare, offering convenient consultations and remote monitoring for various conditions.", link: "#" }
    ];

    const recentLabResults = [
        { id: 'lab1', name: 'Complete Blood Count (CBC)', date: 'May 1, 2025', status: 'Results Available', summary: 'All values within normal range.', link: '/medical-records/lab1' },
        { id: 'lab2', name: 'Lipid Panel', date: 'May 1, 2025', status: 'Action Required', summary: 'Elevated LDL cholesterol. Follow-up recommended.', link: '/medical-records/lab2' },
        { id: 'lab3', name: 'Thyroid Function Test (TSH)', date: 'April 15, 2025', status: 'Pending', summary: 'Awaiting results from the lab.', link: '#' },
    ];

    const medicationReminders = [
        { id: 'med1', name: 'Metformin 500mg', dosage: '1 tablet twice daily with meals', nextDue: 'Today, 6:00 PM', instructions: 'Take with food to reduce stomach upset.' },
        { id: 'med2', name: 'Lisinopril 10mg', dosage: '1 tablet once daily (morning)', nextDue: 'Tomorrow, 8:00 AM', instructions: 'Monitor blood pressure regularly.' },
        { id: 'med3', name: 'Vitamin D3 1000IU', dosage: '1 capsule daily', nextDue: 'Today, 9:00 AM', instructions: 'Best taken with a meal containing fat.' },
    ];

    const healthGoals = [
        { id: 'goal1', name: 'Daily Steps', description: 'Walk 10,000 steps daily', progress: 75, status: 'In Progress', target: '10,000 steps' },
        { id: 'goal2', name: 'Hydration', description: 'Drink 8 glasses of water', progress: 100, status: 'Achieved Today', target: '8 glasses' },
        { id: 'goal3', name: 'Mindfulness', description: 'Meditate for 15 minutes', progress: 30, status: 'Needs Attention', target: '15 minutes' },
    ];

    const quickLinks = [
        { id: 'ql1', name: 'Find a Doctor', href: '/find-doctor', icon: UserGroupIcon },
        { id: 'ql2', name: 'My Medications', href: '/medications', icon: ClipboardDocumentListIcon },
        { id: 'ql3', name: 'Health Library', href: '/health-library', icon: NewspaperIcon },
        { id: 'ql4', name: 'Support & FAQ', href: '/support', icon: ChatBubbleLeftEllipsisIcon },
    ];

    const fetchUpcomingAppointments = useCallback(async () => {
        if (!user) return;
        setIsLoadingAppointments(true);
        setAppointmentsError(null);
        try {
            const filters = { status: ['Confirmed', 'Requested'], sortBy: 'appointmentTime', order: 'asc', limit: 5 };
            const data = await appointmentService.getMyAppointments(filters);
            setUpcomingAppointments(data.appointments || []);
        } catch (err) {
            setAppointmentsError(err.message || 'Could not load upcoming appointments.');
            addNotification(err.message || 'Could not load upcoming appointments.', 'error');
        } finally {
            setIsLoadingAppointments(false);
        }
    }, [user, addNotification]);

    useEffect(() => {
        fetchUpcomingAppointments();
    }, [fetchUpcomingAppointments]);

    useEffect(() => {
        if (healthTips.length === 0) return;
        const tipInterval = setInterval(() => {
            setCurrentTipIndex(prevIndex => (prevIndex + 1) % healthTips.length);
        }, 10000);
        return () => clearInterval(tipInterval);
    }, [healthTips.length]);

    const pageIsLoading = isAuthLoading || (isLoadingAppointments && upcomingAppointments.length === 0 && !appointmentError);

    if (pageIsLoading) {
        return ( <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> <span className="loading loading-spinner loading-lg text-primary"></span> </div> );
    }
    if (!user) {
        return <p className="text-center text-error p-10">User data not found. Please log in.</p>;
    }

    const currentHealthTip = healthTips.length > 0 ? healthTips[currentTipIndex] : { tip: "Stay healthy!", icon: SparklesIcon };
    const CurrentTipIcon = currentHealthTip.icon;

    return (
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 pb-12">
            <header className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-primary"> Welcome back, {user.firstName}! </h1>
                <p className="mt-2 text-lg text-base-content/80"> Here's your personalized health dashboard. </p>
            </header>

            {/* Quick Stats / Summary Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="card bg-base-200 shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow"> <div className="card-body"> <div className="flex items-center space-x-3 mb-3"> <CalendarDaysIcon className="w-7 h-7 text-primary" /> <h2 className="card-title text-lg text-primary">Upcoming Appointments</h2> </div> {isLoadingAppointments ? <span className="loading loading-dots loading-sm text-primary"></span> : appointmentError ? <p className="text-error text-sm">{appointmentError.slice(0,30)}...</p> : upcomingAppointments.length > 0 ? ( <p className="text-3xl font-bold text-base-content">{upcomingAppointments.length}</p> ) : ( <p className="text-base-content/70">No upcoming appointments.</p> )} <div className="card-actions justify-end mt-2"> <Link to="/appointments" className="btn btn-xs btn-outline btn-primary">View All</Link> </div> </div> </div>
                 <div className="card bg-base-200 shadow-md border-l-4 border-secondary hover:shadow-lg transition-shadow"> <div className="card-body"> <div className="flex items-center space-x-3 mb-3"> <ChatBubbleLeftEllipsisIcon className="w-7 h-7 text-secondary" /> <h2 className="card-title text-lg text-secondary">Recent Messages</h2> </div> {recentMessages.filter(m => m.unread).length > 0 ? ( <p className="text-3xl font-bold text-base-content"> {recentMessages.filter(m => m.unread).length} <span className="text-sm font-normal">New</span> </p> ) : ( <p className="text-base-content/70">No new messages.</p> )} <div className="card-actions justify-end mt-2"> <Link to="/messages" className="btn btn-xs btn-outline btn-secondary">View Messages</Link> </div> </div> </div>
                 <div className="card bg-neutral text-neutral-content shadow-md border-l-4 border-neutral-focus hover:shadow-lg transition-shadow"> <div className="card-body"> <div className="flex items-center space-x-3 mb-3"> <DocumentTextIcon className="w-7 h-7 text-neutral-content" /> <h2 className="card-title text-lg text-neutral-content">Medical Records</h2> </div> <p className="text-sm text-neutral-content/80">Access your lab results, notes, and documents.</p> <div className="card-actions justify-end mt-4"> <Link to="/medical-records" className="btn btn-xs btn-outline border-neutral-content text-neutral-content hover:bg-neutral-content hover:text-neutral">View Records</Link> </div> </div> </div>
            </section>

            <section className="py-6">
                 <div className="flex flex-col sm:flex-row sm:justify-center gap-4"> <Link to="/book-appointment" className="btn btn-primary btn-wide shadow hover:shadow-md"> <PlusCircleIcon className="w-5 h-5 mr-2" /> Book New Appointment </Link> <Link to="/profile" className="btn btn-secondary btn-outline btn-wide shadow hover:shadow-md"> <UserCircleIcon className="w-5 h-5 mr-2" /> View/Edit Profile </Link> </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-primary mb-4">Your Next Appointments</h2>
                    {isLoadingAppointments ? ( <div className="text-center py-10 bg-base-200 rounded-lg shadow"> <span className="loading loading-dots loading-lg text-primary"></span> <p className="mt-2 text-base-content/70">Loading appointments...</p> </div>
                    ) : appointmentError ? ( <div role="alert" className="alert alert-warning shadow-md bg-secondary/10 border-secondary/30"> <SparklesIcon className="stroke-current shrink-0 h-6 w-6 text-secondary"/> <div> <h3 className="font-bold text-secondary">Could not load appointments</h3> <div className="text-xs text-base-content/80">{appointmentError}</div> </div> </div>
                    ) : upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingAppointments.slice(0, 3).map(appt => (
                                <div key={appt._id} className="card card-compact bg-base-200 shadow border border-black/10 hover:border-primary/30 transition-all">
                                    <div className="card-body flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div className="flex items-center space-x-3">
                                            <CalendarDaysIcon className="w-6 h-6 text-primary opacity-70 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-semibold text-base-content">{appt.type || 'Consultation'} with {appt.doctor?.userAccount?.fullName || 'Doctor'}</h3>
                                                <p className="text-sm text-secondary">{appt.doctor?.specialty || 'N/A'}</p>
                                                <p className="text-xs text-base-content/70 mt-1"> {appt.appointmentTime ? new Date(appt.appointmentTime).toLocaleString('en-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }) : 'N/A'} </p>
                                            </div>
                                        </div>
                                        <Link to={`/appointments/${appt._id}`} className="btn btn-xs btn-outline btn-primary mt-2 sm:mt-0 self-end sm:self-center"> Details <ArrowRightIcon className="w-3 h-3 ml-1"/> </Link>
                                    </div>
                                </div>
                            ))}
                            {upcomingAppointments.length > 3 && ( <div className="text-right mt-4"> <Link to="/appointments" className="link link-primary text-sm font-medium">View all appointments &rarr;</Link> </div> )}
                        </div>
                    ) : ( <div className="text-center py-10 bg-base-200 rounded-lg shadow"> <CalendarDaysIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" /> <p className="text-base-content/70 mb-4">You have no upcoming appointments scheduled.</p> <Link to="/book-appointment" className="btn btn-sm btn-secondary">Book Now</Link> </div> )}
                </div>
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-semibold text-secondary mb-4">Health Tip</h2>
                    <div className="card bg-secondary/10 text-base-content shadow border border-secondary/20 h-full flex flex-col">
                        <div className="card-body flex-grow flex flex-col items-center text-center justify-center">
                            <CurrentTipIcon className="w-10 h-10 text-secondary mb-3" />
                            {healthTips.length > 0 && ( <AnimatePresence mode="wait"> <motion.p key={currentTipIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="text-sm sm:text-base leading-relaxed" > {currentHealthTip.tip} </motion.p> </AnimatePresence> )}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center"> <BeakerIcon className="w-6 h-6 mr-2 text-primary opacity-80"/> Recent Lab Results</h2>
                <div className="bg-base-200 shadow-md rounded-lg p-6 border border-black/10">
                    {recentLabResults.length > 0 ? ( <ul className="divide-y divide-base-300"> {recentLabResults.map(result => ( <li key={result.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center"> <div className="mb-2 sm:mb-0"> <p className="font-medium text-base-content">{result.name}</p> <p className="text-xs text-base-content/70">Date: {result.date} - <span className={result.status === 'Action Required' ? 'text-secondary font-semibold' : 'text-base-content/80'}>{result.status}</span></p> <p className="text-xs text-base-content/70 italic mt-0.5">{result.summary}</p> </div> <Link to={result.link} className={`btn btn-xs ${result.status === 'Results Available' || result.status === 'Action Required' ? 'btn-outline btn-primary' : 'btn-ghost text-base-content/60 cursor-not-allowed'}`}> {result.status === 'Pending' ? 'Pending' : 'View Results'} </Link> </li> ))} </ul>
                    ) : ( <div className="text-center py-6"> <BeakerIcon className="w-12 h-12 mx-auto text-base-content/30 mb-2" /> <p className="text-base-content/70">No recent lab results found.</p> </div> )}
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div>
                    <h2 className="text-2xl font-semibold text-secondary mb-4 flex items-center"><ClipboardDocumentListIcon className="w-6 h-6 mr-2 text-secondary opacity-80"/>Medication Reminders</h2>
                    <div className="bg-base-200 shadow-md rounded-lg p-6 border border-black/10 space-y-3">
                        {medicationReminders.length > 0 ? ( medicationReminders.map(med => ( <div key={med.id} className="p-3 rounded-md bg-base-100 border border-secondary/20"> <div className="flex justify-between items-center"> <p className="font-medium text-secondary">{med.name}</p> <span className="badge badge-sm badge-outline badge-secondary">{med.nextDue}</span> </div> <p className="text-xs text-base-content/70">{med.dosage}</p> <p className="text-xs text-base-content/60 italic mt-0.5">{med.instructions}</p> </div> )) ) : ( <div className="text-center py-6"> <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-base-content/30 mb-2" /> <p className="text-base-content/70">No active medication reminders.</p> </div> )}
                        <div className="card-actions justify-end mt-4"> <Link to="/medications" className="btn btn-xs btn-outline btn-secondary">Manage Medications</Link> </div>
                    </div>
                </div>
                <div>
                     <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center"><FlagIcon className="w-6 h-6 mr-2 text-primary opacity-80"/>Your Health Goals</h2> <div className="bg-base-200 shadow-md rounded-lg p-6 border border-black/10 space-y-3"> {healthGoals.length > 0 ? ( healthGoals.map(goal => ( <div key={goal.id} className="p-3 rounded-md bg-base-100 border border-primary/20"> <div className="flex justify-between items-center mb-1"> <div><p className="text-sm font-medium text-base-content">{goal.name}</p><p className="text-xs text-base-content/70">{goal.description}</p></div> <span className={`badge badge-sm ${ goal.status === 'Achieved Today' ? 'badge-success' : goal.status === 'In Progress' ? 'badge-info' : 'badge-warning' }`}>{goal.status}</span> </div> <progress className={`progress ${ goal.status === 'Achieved Today' ? 'progress-success' : goal.status === 'In Progress' ? 'progress-info' : 'progress-warning' } w-full`} value={goal.progress} max="100"></progress> <p className="text-xs text-right text-base-content/60 mt-0.5">{goal.progress}% - Target: {goal.target}</p></div> )) ) : ( <div className="text-center py-6"> <FlagIcon className="w-12 h-12 mx-auto text-base-content/30 mb-2" /> <p className="text-base-content/70">No health goals set yet.</p> </div> )} <div className="card-actions justify-end mt-4"> <Link to="/health-goals" className="btn btn-xs btn-outline btn-primary">Set/View Goals</Link> </div> </div>
                </div>
            </section>

            <section className="mt-8 md:mt-12">
                 <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center"><NewspaperIcon className="w-6 h-6 mr-2 text-primary opacity-80"/>Health News & Updates</h2> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {healthNews.slice(0,3).map(newsItem => ( <div key={newsItem.id} className="card bg-base-200 shadow border border-black/10 hover:shadow-lg transition-shadow h-full flex flex-col"> <div className="card-body flex flex-col justify-between"> <div> <h3 className="card-title text-md font-semibold text-base-content leading-tight hover:text-primary transition-colors"><a href={newsItem.link} target="_blank" rel="noopener noreferrer">{newsItem.title}</a></h3> <p className="text-xs text-base-content/60 mt-1">{newsItem.source} - {newsItem.date}</p> <p className="text-sm text-base-content/80 mt-2 leading-relaxed line-clamp-3">{newsItem.excerpt}</p> </div> <div className="card-actions justify-end mt-4"> <a href={newsItem.link} target="_blank" rel="noopener noreferrer" className="btn btn-xs btn-outline btn-secondary"> Read More <ArrowRightIcon className="w-3 h-3 ml-1"/> </a> </div> </div> </div> ))} </div> {healthNews.length > 3 && ( <div className="text-center mt-6"> <Link to="/health-news" className="btn btn-primary btn-outline">View All News</Link> </div> )}
            </section>

            <section className="mt-8 md:mt-12">
                 <h2 className="text-2xl font-semibold text-secondary mb-4 flex items-center"><LinkIcon className="w-6 h-6 mr-2 text-secondary opacity-80"/>Quick Resources</h2> <div className="grid grid-cols-2 sm:grid-cols-4 gap-4"> {quickLinks.map(link => { const LinkIconComponent = link.icon; return ( <Link key={link.id} to={link.href} className="card bg-base-200 shadow hover:shadow-md border border-black/10 p-4 flex flex-col items-center text-center transition-all hover:border-secondary/50 hover:bg-base-300"> <LinkIconComponent className="w-7 h-7 text-secondary mb-2" /> <p className="text-sm font-medium text-base-content hover:text-secondary transition-colors">{link.name}</p> </Link> ); })} </div>
            </section>

            <section className="mt-8 md:mt-12">
                 <h2 className="text-2xl font-semibold text-primary mb-4">Your Health Trends (Placeholder)</h2> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div className="card bg-base-200 shadow border border-black/10"> <div className="card-body"> <h3 className="card-title text-sm text-primary">Blood Pressure Trend</h3> <div className="flex justify-center items-center h-40 bg-base-100 rounded-md mt-2"> <ChartBarIcon className="w-16 h-16 text-primary/30" /> <p className="text-base-content/50 ml-2">Chart Data Unavailable</p> </div> </div> </div> <div className="card bg-base-200 shadow border border-black/10"> <div className="card-body"> <h3 className="card-title text-sm text-secondary">Activity Levels</h3> <div className="flex justify-center items-center h-40 bg-base-100 rounded-md mt-2"> <ChartBarIcon className="w-16 h-16 text-secondary/30" /> <p className="text-base-content/50 ml-2">Chart Data Unavailable</p> </div> </div> </div> </div>
            </section>
        </div>
    );
}

export default DashboardPage;
