// src/pages/DashboardPage.jsx
import {
    ArrowRightIcon,
    BeakerIcon,
    BriefcaseIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    ChatBubbleLeftEllipsisIcon,
    ClipboardDocumentListIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    FlagIcon,
    HeartIcon,
    InformationCircleIcon,
    LinkIcon,
    NewspaperIcon,
    PlusCircleIcon,
    SparklesIcon,
    UserCircleIcon,
    UserGroupIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import { format, isFuture, isToday, parseISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNotification } from '../contexts/NotificationContext.jsx';
import appointmentService from '../services/appointment.service.js';
import patientDataService from '../services/patient.service.js';
import { UserRoles } from '../utils/constants.js';

/**
 * Patient-specific dashboard content.
 * Adheres to strict 3-color palette and UI/UX standards.
 */
const PatientDashboardView = () => {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
    const [appointmentError, setAppointmentsError] = useState(null);

    const [recentLabResults, setRecentLabResults] = useState([]);
    const [isLoadingLabs, setIsLoadingLabs] = useState(true);
    const [labsError, setLabsError] = useState(null);

    const [medicationReminders, setMedicationReminders] = useState([]);
    const [isLoadingMeds, setIsLoadingMeds] = useState(true);
    const [medsError, setMedsError] = useState(null);

    const [healthGoals, setHealthGoals] = useState([]);
    const [isLoadingGoals, setIsLoadingGoals] = useState(true);
    const [goalsError, setGoalsError] = useState(null);

    const recentMessages = [
        { id: 1, from: 'Dr. Anisa Putri', preview: 'Your recent test results are available for review. Please log in to view them.', unread: true, time: '1h ago', link: '/messages/1' },
        { id: 2, from: 'KonsulDok Admin', preview: 'Important: System maintenance scheduled for Sunday at 2 AM - 4 AM WIB.', unread: false, time: 'Yesterday', link: '/messages/2' },
    ];
    const healthTips = [
        { id: 1, tip: "Stay hydrated! Aim for 8-10 glasses of water a day for optimal organ function and energy.", icon: SparklesIcon },
        { id: 2, tip: "Incorporate at least 30 minutes of moderate exercise, like brisk walking or cycling, into your daily routine.", icon: HeartIcon },
        { id: 3, tip: "Prioritize 7-9 hours of quality sleep each night. Consistent sleep patterns aid physical and mental restoration.", icon: SparklesIcon },
    ];
    const healthNews = [
        { id: 1, title: "New Study Highlights Benefits of Mediterranean Diet for Heart Health", source: "Global Health Journal", date: "May 12, 2025", excerpt: "A recent extensive study underscores the significant cardiovascular benefits of adhering to a Mediterranean-style diet, rich in fruits, vegetables, whole grains, and healthy fats.", link: "#" },
        { id: 2, title: "Understanding Seasonal Allergies in Indonesia: Tips for Relief", source: "KonsulDok Health Blog", date: "May 10, 2025", excerpt: "As seasons change, many experience heightened allergic reactions. Learn about common triggers and effective strategies to manage your symptoms and enjoy the outdoors.", link: "#" },
        { id: 3, title: "The Importance of Regular Health Check-ups", source: "Ministry of Health Insights", date: "May 8, 2025", excerpt: "Preventive care through regular health screenings can detect potential issues early, leading to better outcomes and a healthier life. Don't delay your check-up.", link: "#" },
    ];
    const quickLinks = [
        { id: 'ql1', name: 'Find a Doctor', href: '/find-doctor', icon: UserGroupIcon },
        { id: 'ql2', name: 'My Medications', href: '/medications', icon: ClipboardDocumentListIcon },
        { id: 'ql3', name: 'Health Library', href: '/health-library', icon: NewspaperIcon },
        { id: 'ql4', name: 'Support & FAQ', href: '/support', icon: ChatBubbleLeftEllipsisIcon },
    ];

    const fetchPatientDashboardData = useCallback(async () => {
        if (!user || user.role !== UserRoles.PATIENT) return;

        setIsLoadingAppointments(true); setAppointmentsError(null);
        setIsLoadingLabs(true); setLabsError(null);
        setIsLoadingMeds(true); setMedsError(null);
        setIsLoadingGoals(true); setGoalsError(null);

        try {
            const apptFilters = { status: ['Confirmed', 'Requested'], sortBy: 'appointmentTime', order: 'asc', limit: 3 };
            const [apptData, labData, medData, goalsData] = await Promise.all([
                appointmentService.getMyAppointments(apptFilters),
                patientDataService.getMyRecentLabResults({ limit: 3 }),
                patientDataService.getMyMedicationReminders({ limit: 3 }),
                patientDataService.getMyHealthGoals({ limit: 3 })
            ]);

            setUpcomingAppointments(apptData.appointments || []);
            setRecentLabResults(labData || []);
            setMedicationReminders(medData || []);
            setHealthGoals(goalsData || []);

        } catch (err) {
            console.error("Failed to fetch patient dashboard data:", err);
            const errorMsg = err.message || 'Could not load some dashboard data.';
            setAppointmentsError(errorMsg);
            setLabsError(errorMsg);
            setMedsError(errorMsg);
            setGoalsError(errorMsg);
            addNotification(errorMsg, 'error');
        } finally {
            setIsLoadingAppointments(false);
            setIsLoadingLabs(false);
            setIsLoadingMeds(false);
            setIsLoadingGoals(false);
        }
    }, [user, addNotification]);

    useEffect(() => {
        fetchPatientDashboardData();
    }, [fetchPatientDashboardData]);

    useEffect(() => {
        if (healthTips.length === 0) return;
        const tipInterval = setInterval(() => {
            setCurrentTipIndex(prevIndex => (prevIndex + 1) % healthTips.length);
        }, 10000);
        return () => clearInterval(tipInterval);
    }, [healthTips.length]);

    const currentHealthTip = healthTips.length > 0 ? healthTips[currentTipIndex] : { tip: "Stay healthy and informed!", icon: SparklesIcon };
    const CurrentTipIcon = currentHealthTip.icon;

    // Helper function for lab result link class name
    const getLabResultLinkClassName = (status) => {
        return `btn btn-xs ${status === 'Pending' ? 'btn-disabled text-base-content/50' : 'btn-outline btn-primary'}`;
    };

    // Helper function for health goal badge class name
    const getHealthGoalBadgeClassName = (status) => {
        return `badge badge-sm ${status === 'Achieved Today' || status === 'In Progress' ? 'badge-primary text-primary-content' : 'badge-neutral text-neutral-content'}`;
    };
     // Helper function for health goal progress bar class name
    const getHealthGoalProgressClassName = (status) => {
        return `progress ${status === 'Achieved Today' || status === 'In Progress' ? 'progress-primary' : 'progress-neutral'} w-full`;
    };


    return (
        <>
            <header className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-primary"> Welcome back, {user.firstName}! </h1>
                <p className="mt-2 text-lg text-base-content/80"> Here's your personalized health dashboard. </p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card bg-base-200 shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow">
                    <div className="card-body">
                        <div className="flex items-center space-x-3 mb-3">
                            <CalendarDaysIcon className="w-7 h-7 text-primary" />
                            <h2 className="card-title text-lg text-primary">Upcoming Appointments</h2>
                        </div>
                        {isLoadingAppointments ? <span className="loading loading-dots loading-sm text-primary"></span> : appointmentError ? <p className="text-base-content/70 text-xs">Error loading</p> : upcomingAppointments.length > 0 ? (
                            <p className="text-3xl font-bold text-base-content">{upcomingAppointments.length}</p>
                        ) : ( <p className="text-base-content/70">No upcoming.</p> )}
                        <div className="card-actions justify-end mt-2">
                            <Link to="/appointments" className="btn btn-xs btn-outline btn-primary">View All</Link>
                        </div>
                    </div>
                </div>
                <div className="card bg-base-200 shadow-md border-l-4 border-neutral hover:shadow-lg transition-shadow">
                    <div className="card-body">
                        <div className="flex items-center space-x-3 mb-3">
                            <ChatBubbleLeftEllipsisIcon className="w-7 h-7 text-neutral" />
                            <h2 className="card-title text-lg text-neutral">Recent Messages</h2>
                        </div>
                        {recentMessages.filter(m => m.unread).length > 0 ? (
                            <p className="text-3xl font-bold text-base-content"> {recentMessages.filter(m => m.unread).length} <span className="text-sm font-normal">New</span> </p>
                        ) : ( <p className="text-base-content/70">No new messages.</p> )}
                        <div className="card-actions justify-end mt-2">
                            <Link to="/messages" className="btn btn-xs btn-outline btn-neutral">View Messages</Link>
                        </div>
                    </div>
                </div>
                <div className="card bg-neutral text-neutral-content shadow-md border-l-4 border-black hover:shadow-lg transition-shadow">
                    <div className="card-body">
                        <div className="flex items-center space-x-3 mb-3">
                            <DocumentTextIcon className="w-7 h-7 text-neutral-content" />
                            <h2 className="card-title text-lg text-neutral-content">Medical Records</h2>
                        </div>
                        <p className="text-sm text-neutral-content/80">Access your lab results, notes, and documents.</p>
                        <div className="card-actions justify-end mt-4">
                            <Link to="/medical-records" className="btn btn-xs btn-outline border-neutral-content text-neutral-content hover:bg-neutral-content hover:text-neutral">View Records</Link>
                        </div>
                    </div>
                </div>
            </section>

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

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-primary mb-4">Your Next Appointments</h2>
                    {isLoadingAppointments ? (
                        <div className="text-center py-10 bg-base-200 rounded-lg shadow"> <span className="loading loading-dots loading-lg text-primary"></span> <p className="mt-2 text-base-content/70">Loading appointments...</p> </div>
                    ) : appointmentError ? (
                        <div role="alert" className="alert alert-neutral shadow-md">
                            <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6 text-neutral-content"/>
                            <div> <h3 className="font-bold text-neutral-content">Could not load appointments</h3> <div className="text-xs text-neutral-content/80">{appointmentError}</div> </div>
                        </div>
                    ) : upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingAppointments.map(appt => (
                                <div key={appt._id} className="card card-compact bg-base-200 shadow border border-black/10 hover:border-primary/30 transition-all">
                                    <div className="card-body flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div className="flex items-center space-x-3">
                                            <CalendarDaysIcon className="w-6 h-6 text-primary opacity-70 flex-shrink-0" />
                                            <div>
                                                <h3 className="font-semibold text-base-content">{appt.type || 'Consultation'} with {appt.doctor?.userAccount?.fullName || 'Doctor'}</h3>
                                                <p className="text-sm text-neutral">{appt.doctor?.specialty || 'N/A'}</p>
                                                <p className="text-xs text-base-content/70 mt-1"> {appt.appointmentTime ? new Date(appt.appointmentTime).toLocaleString('en-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }) : 'N/A'} </p>
                                            </div>
                                        </div>
                                        <Link to={`/appointments/${appt._id}`} className="btn btn-xs btn-outline btn-primary mt-2 sm:mt-0 self-end sm:self-center"> Details <ArrowRightIcon className="w-3 h-3 ml-1"/> </Link>
                                    </div>
                                </div>
                            ))}
                            {upcomingAppointments.length >= 3 && (
                                <div className="text-right mt-4"> <Link to="/appointments" className="link link-primary text-sm font-medium">View all appointments &rarr;</Link> </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-base-200 rounded-lg shadow"> <CalendarDaysIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" /> <p className="text-base-content/70 mb-4">You have no upcoming appointments scheduled.</p> <Link to="/book-appointment" className="btn btn-sm btn-secondary">Book Now</Link> </div>
                    )}
                </div>
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-semibold text-neutral mb-4">Health Tip</h2>
                    <div className="card bg-primary/10 text-base-content shadow border border-primary/20 h-full flex flex-col">
                        <div className="card-body flex-grow flex flex-col items-center text-center justify-center">
                            <CurrentTipIcon className="w-10 h-10 text-primary mb-3" />
                            {healthTips.length > 0 && (
                                <AnimatePresence mode="wait">
                                    <motion.p key={currentTipIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="text-sm sm:text-base leading-relaxed text-base-content">
                                        {currentHealthTip.tip}
                                    </motion.p>
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-8 md:mt-12">
                <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center"> <BeakerIcon className="w-6 h-6 mr-2 text-primary opacity-80"/> Recent Lab Results</h2>
                <div className="bg-base-200 shadow-md rounded-lg p-6 border border-black/10">
                    {isLoadingLabs ? (
                        <div className="text-center py-6"><span className="loading loading-dots loading-md text-primary"></span></div>
                    ) : labsError ? (
                        <p className="text-center py-6 text-neutral text-sm">{labsError}</p>
                    ) : recentLabResults.length > 0 ? (
                        <ul className="divide-y divide-black/10">
                            {recentLabResults.map(result => (
                                <li key={result._id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="mb-2 sm:mb-0">
                                        <p className="font-medium text-base-content">{result.name}</p>
                                        <p className="text-xs text-base-content/70">Date: {format(new Date(result.date), 'PPP')} - <span className={result.status === 'Action Required' ? 'text-neutral font-semibold' : 'text-primary'}>{result.status}</span></p>
                                        <p className="text-xs text-base-content/70 italic mt-0.5">{result.summary}</p>
                                    </div>
                                    <Link to={result.link || '/#'} className={getLabResultLinkClassName(result.status)}>
                                        {result.status === 'Pending' ? 'Pending' : 'View Results'}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-6"> <BeakerIcon className="w-12 h-12 mx-auto text-base-content/30 mb-2" /> <p className="text-base-content/70">No recent lab results found.</p> </div>
                    )}
                    <div className="text-right mt-4"> <Link to="/lab-results" className="link link-primary text-sm font-medium">View all lab results &rarr;</Link> </div>
                </div>
            </section>

            <section className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div>
                    <h2 className="text-2xl font-semibold text-neutral mb-4 flex items-center"><ClipboardDocumentListIcon className="w-6 h-6 mr-2 text-neutral opacity-80"/>Medication Reminders</h2>
                    <div className="bg-base-200 shadow-md rounded-lg p-6 border border-black/10 space-y-3">
                        {isLoadingMeds ? (
                            <div className="text-center py-6"><span className="loading loading-dots loading-md text-neutral"></span></div>
                        ) : medsError ? (
                            <p className="text-center py-6 text-neutral text-sm">{medsError}</p>
                        ) : medicationReminders.length > 0 ? (
                            medicationReminders.map(med => (
                                <div key={med._id} className="p-3 rounded-md bg-base-100 border border-neutral/20">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-neutral">{med.name}</p>
                                        <span className="badge badge-sm badge-outline badge-neutral">{med.nextDue}</span>
                                    </div>
                                    <p className="text-xs text-base-content/70">{med.dosage}</p>
                                    <p className="text-xs text-base-content/60 italic mt-0.5">{med.instructions}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6"> <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-base-content/30 mb-2" /> <p className="text-base-content/70">No active medication reminders.</p> </div>
                        )}
                        <div className="card-actions justify-end mt-4"> <Link to="/medications" className="btn btn-xs btn-outline btn-neutral">Manage Medications</Link> </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center"><FlagIcon className="w-6 h-6 mr-2 text-primary opacity-80"/>Your Health Goals</h2>
                    <div className="bg-base-200 shadow-md rounded-lg p-6 border border-black/10 space-y-3">
                        {isLoadingGoals ? (
                            <div className="text-center py-6"><span className="loading loading-dots loading-md text-primary"></span></div>
                        ) : goalsError ? (
                            <p className="text-center py-6 text-neutral text-sm">{goalsError}</p>
                        ) : healthGoals.length > 0 ? (
                            healthGoals.map(goal => (
                                <div key={goal._id} className="p-3 rounded-md bg-base-100 border border-primary/20">
                                    <div className="flex justify-between items-center mb-1">
                                        <div><p className="text-sm font-medium text-base-content">{goal.name}</p><p className="text-xs text-base-content/70">{goal.description}</p></div>
                                        <span className={getHealthGoalBadgeClassName(goal.status)}>{goal.status}</span>
                                    </div>
                                    <progress className={getHealthGoalProgressClassName(goal.status)} value={goal.progress} max="100"></progress>
                                    <p className="text-xs text-right text-base-content/60 mt-0.5">{goal.progress}% - Target: {goal.target}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6"> <FlagIcon className="w-12 h-12 mx-auto text-base-content/30 mb-2" /> <p className="text-base-content/70">No health goals set yet.</p> </div>
                        )}
                        <div className="card-actions justify-end mt-4"> <Link to="/health-goals" className="btn btn-xs btn-outline btn-primary">Set/View Goals</Link> </div>
                    </div>
                </div>
            </section>

            <section className="mt-8 md:mt-12">
                <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center"><NewspaperIcon className="w-6 h-6 mr-2 text-primary opacity-80"/>Health News & Updates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {healthNews.slice(0,3).map(newsItem => (
                        <div key={newsItem.id} className="card bg-base-200 shadow border border-black/10 hover:shadow-lg transition-shadow h-full flex flex-col">
                            <div className="card-body flex flex-col justify-between">
                                <div>
                                    <h3 className="card-title text-md font-semibold text-base-content leading-tight hover:text-primary transition-colors"><a href={newsItem.link} target="_blank" rel="noopener noreferrer">{newsItem.title}</a></h3>
                                    <p className="text-xs text-base-content/60 mt-1">{newsItem.source} - {newsItem.date}</p>
                                    <p className="text-sm text-base-content/80 mt-2 leading-relaxed line-clamp-3">{newsItem.excerpt}</p>
                                </div>
                                <div className="card-actions justify-end mt-4">
                                    <a href={newsItem.link} target="_blank" rel="noopener noreferrer" className="btn btn-xs btn-outline btn-neutral"> Read More <ArrowRightIcon className="w-3 h-3 ml-1"/> </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {healthNews.length > 3 && (
                    <div className="text-center mt-6"> <Link to="/health-news" className="btn btn-primary btn-outline">View All News</Link> </div>
                )}
            </section>

            <section className="mt-8 md:mt-12">
                <h2 className="text-2xl font-semibold text-neutral mb-4 flex items-center"><LinkIcon className="w-6 h-6 mr-2 text-neutral opacity-80"/>Quick Resources</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {quickLinks.map(link => {
                        const LinkIconComponent = link.icon;
                        return (
                            <Link key={link.id} to={link.href} className="card bg-base-200 shadow hover:shadow-md border border-black/10 p-4 flex flex-col items-center text-center transition-all hover:border-neutral/50 hover:bg-base-300">
                                <LinkIconComponent className="w-7 h-7 text-neutral mb-2" />
                                <p className="text-sm font-medium text-base-content hover:text-neutral transition-colors">{link.name}</p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="mt-8 md:mt-12">
                <h2 className="text-2xl font-semibold text-primary mb-4">Your Health Trends (Placeholder)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-base-200 shadow border border-black/10">
                        <div className="card-body">
                            <h3 className="card-title text-sm text-primary">Blood Pressure Trend</h3>
                            <div className="flex justify-center items-center h-40 bg-base-100 rounded-md mt-2">
                                <ChartBarIcon className="w-16 h-16 text-primary/30" />
                                <p className="text-base-content/50 ml-2">Chart Data Unavailable</p>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-200 shadow border border-black/10">
                        <div className="card-body">
                            <h3 className="card-title text-sm text-neutral">Activity Levels</h3>
                            <div className="flex justify-center items-center h-40 bg-base-100 rounded-md mt-2">
                                <ChartBarIcon className="w-16 h-16 text-neutral/30" />
                                <p className="text-base-content/50 ml-2">Data Unavailable</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

/**
 * Doctor-specific dashboard content.
 * Adheres to strict 3-color palette and UI/UX standards.
 */
const DoctorDashboardView = () => {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const [todaysAppointments, setTodaysAppointments] = useState([]);
    const [upcomingAppointmentsCount, setUpcomingAppointmentsCount] = useState(0);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
    const [appointmentError, setAppointmentsError] = useState(null);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const unreadMessagesCount = 3;
    const pendingLabReviewsCount = 5;

    const doctorTips = [
        { id: 1, tip: "Clearly explain treatment options to empower patient decision-making.", icon: SparklesIcon },
        { id: 2, tip: "Utilize the notes section thoroughly for comprehensive patient history.", icon: ClipboardDocumentListIcon },
        { id: 3, tip: "Take short breaks between consultations to maintain focus and energy.", icon: HeartIcon },
    ];
    const clinicAnnouncements = [
        { id: 1, title: "New EHR System Training - June 15th", excerpt: "Mandatory training session for the new EHR system. Please register your attendance via the internal portal.", link: "#", date: "June 1, 2025" },
        { id: 2, title: "Updated Masking Policy Effective Immediately", excerpt: "Please review the updated clinic guidelines regarding mask usage for staff and patients, available on the intranet.", link: "#", date: "May 28, 2025" },
    ];
    const quickLinksDoctor = [
        { id: 'ql1', name: 'My Full Schedule', href: '/doctor/appointments', icon: BriefcaseIcon },
        { id: 'ql2', name: 'Search Patients', href: '/patients/search', icon: UserGroupIcon },
        { id: 'ql3', name: 'New Consultation Note', href: '/notes/new', icon: ClipboardDocumentListIcon },
        { id: 'ql4', name: 'Clinical Guidelines', href: '/resources/guidelines', icon: DocumentTextIcon },
    ];

    const fetchDoctorDashboardData = useCallback(async () => {
        if (!user || user.role !== UserRoles.DOCTOR) {
            setIsLoadingAppointments(false);
            return;
        }
        setIsLoadingAppointments(true);
        setAppointmentsError(null);
        try {
            const today = new Date();
            const filters = {
                status: ['Confirmed', 'Requested'],
                startDate: format(today, 'yyyy-MM-dd'),
                sortBy: 'appointmentTime', order: 'asc', limit: 20,
            };
            const data = await appointmentService.getMyAppointments(filters);
            const allFetchedAppointments = data.appointments || [];

            const todayFiltered = allFetchedAppointments.filter(appt =>
                appt.appointmentTime && isToday(parseISO(appt.appointmentTime))
            ).slice(0, 3);

            const upcomingCount = allFetchedAppointments.filter(appt =>
                appt.appointmentTime && (isFuture(parseISO(appt.appointmentTime)) || isToday(parseISO(appt.appointmentTime)))
            ).length;

            setTodaysAppointments(todayFiltered);
            setUpcomingAppointmentsCount(upcomingCount);

        } catch (err) {
            console.error("Failed to fetch doctor dashboard data:", err);
            const errorMsg = err.message || 'Could not load your appointments.';
            setAppointmentsError(errorMsg);
            addNotification(errorMsg, 'error');
        } finally {
            setIsLoadingAppointments(false);
        }
    }, [user, addNotification]);

    useEffect(() => {
        fetchDoctorDashboardData();
    }, [fetchDoctorDashboardData]);

    useEffect(() => {
        if (doctorTips.length === 0) return;
        const tipInterval = setInterval(() => {
            setCurrentTipIndex(prevIndex => (prevIndex + 1) % doctorTips.length);
        }, 12000);
        return () => clearInterval(tipInterval);
    }, [doctorTips.length]);

    const currentDoctorTip = doctorTips.length > 0 ? doctorTips[currentTipIndex] : { tip: "Provide excellent care and stay updated!", icon: SparklesIcon };
    const CurrentDoctorTipIcon = currentDoctorTip.icon;

    return (
        <>
            <header className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-primary"> Welcome back, Dr. {user.lastName}! </h1>
                <p className="mt-2 text-lg text-base-content/80"> Here’s an overview of your day and patient activities. </p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card bg-base-200 shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow">
                    <div className="card-body">
                        <div className="flex items-center space-x-3 mb-3"> <CalendarDaysIcon className="w-7 h-7 text-primary" /> <h2 className="card-title text-lg text-primary">Upcoming Appointments</h2> </div>
                        {isLoadingAppointments ? <span className="loading loading-dots loading-sm text-primary"></span> : appointmentError ? <p className="text-base-content/70 text-xs">Error loading</p> : <p className="text-3xl font-bold text-base-content">{upcomingAppointmentsCount}</p>}
                        <div className="card-actions justify-end mt-2"> <Link to="/doctor/appointments" className="btn btn-xs btn-outline btn-primary">View Schedule</Link> </div>
                    </div>
                </div>
                <div className="card bg-base-200 shadow-md border-l-4 border-neutral hover:shadow-lg transition-shadow">
                    <div className="card-body">
                        <div className="flex items-center space-x-3 mb-3"> <ChatBubbleLeftEllipsisIcon className="w-7 h-7 text-neutral" /> <h2 className="card-title text-lg text-neutral">Unread Messages</h2> </div>
                        <p className="text-3xl font-bold text-base-content">{unreadMessagesCount}</p>
                        <div className="card-actions justify-end mt-2"> <Link to="/doctor/messages" className="btn btn-xs btn-outline btn-neutral">View Messages</Link> </div>
                    </div>
                </div>
                <div className="card bg-neutral text-neutral-content shadow-md border-l-4 border-black hover:shadow-lg transition-shadow">
                    <div className="card-body">
                        <div className="flex items-center space-x-3 mb-3"> <BeakerIcon className="w-7 h-7 text-neutral-content" /> <h2 className="card-title text-lg text-neutral-content">Pending Lab Reviews</h2> </div>
                        <p className="text-3xl font-bold">{pendingLabReviewsCount}</p>
                        <div className="card-actions justify-end mt-4"> <Link to="/doctor/labs" className="btn btn-xs btn-outline border-neutral-content text-neutral-content hover:bg-neutral-content hover:text-neutral">Review Labs</Link> </div>
                    </div>
                </div>
            </section>

            <section className="py-6">
                <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
                    <Link to="/doctor/appointments" className="btn btn-primary btn-wide shadow hover:shadow-md"> <BriefcaseIcon className="w-5 h-5 mr-2" /> My Full Schedule </Link>
                    <Link to="/patients/search" className="btn btn-secondary btn-outline btn-wide shadow hover:shadow-md"> <UserGroupIcon className="w-5 h-5 mr-2" /> Find Patient Record </Link>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-primary mb-4">Today's Focus</h2>
                    {isLoadingAppointments ? (
                        <div className="text-center py-10 bg-base-200 rounded-lg shadow"> <span className="loading loading-dots loading-lg text-primary"></span> <p className="mt-2 text-base-content/70">Loading today's schedule...</p> </div>
                    ) : appointmentError ? (
                        <div role="alert" className="alert alert-neutral shadow-md">
                            <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6 text-neutral-content"/>
                            <div> <h3 className="font-bold text-neutral-content">Could not load schedule</h3> <div className="text-xs text-neutral-content/80">{appointmentError}</div> </div>
                        </div>
                    ) : todaysAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {todaysAppointments.map(appt => (
                                <div key={appt._id} className="card card-compact bg-base-200 shadow border border-black/10 hover:border-primary/30 transition-all">
                                    <div className="card-body flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div className="flex items-center space-x-3">
                                            {appt.type === 'Virtual Consultation' ? <VideoCameraIcon className="w-6 h-6 text-primary opacity-70 flex-shrink-0"/> : <CalendarDaysIcon className="w-6 h-6 text-primary opacity-70 flex-shrink-0" />}
                                            <div>
                                                <h3 className="font-semibold text-base-content"> {appt.patient?.userAccount?.fullName || 'Patient Name'} </h3>
                                                <p className="text-sm text-neutral">{appt.reasonForVisit || appt.type || 'Consultation'}</p>
                                                <p className="text-xs text-base-content/70 mt-1"> {appt.appointmentTime ? format(parseISO(appt.appointmentTime), 'p', { timeZone: 'Asia/Jakarta' }) : 'N/A'} {appt.durationMinutes && ` (${appt.durationMinutes} min)`} </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2 sm:mt-0 self-end sm:self-center">
                                            <Link to={`/patient/${appt.patient?._id}/chart`} className="btn btn-xs btn-outline btn-neutral">View Chart</Link>
                                            <Link to={`/appointments/${appt._id}`} className="btn btn-xs btn-primary">Start/Details</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-base-200 rounded-lg shadow"> <CalendarDaysIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" /> <p className="text-base-content/70 mb-4">No appointments scheduled for today.</p> <Link to="/doctor/appointments" className="btn btn-sm btn-primary btn-outline">View Full Schedule</Link> </div>
                    )}
                </div>
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-semibold text-neutral mb-4">Pro Tip</h2>
                    <div className="card bg-primary/10 text-base-content shadow border border-primary/20 h-full flex flex-col">
                        <div className="card-body flex-grow flex flex-col items-center text-center justify-center">
                            <CurrentDoctorTipIcon className="w-10 h-10 text-primary mb-3" />
                            {doctorTips.length > 0 && (
                                <AnimatePresence mode="wait">
                                    <motion.p key={currentTipIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="text-sm sm:text-base leading-relaxed text-base-content">
                                        {currentDoctorTip.tip}
                                    </motion.p>
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-8 md:mt-12">
                <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center"><NewspaperIcon className="w-6 h-6 mr-2 text-primary opacity-80"/>Clinic Announcements</h2>
                <div className="space-y-4">
                    {clinicAnnouncements.slice(0,2).map(newsItem => (
                        <div key={newsItem.id} className="card card-compact bg-base-200 shadow border border-black/10 hover:shadow-md transition-shadow">
                            <div className="card-body">
                                <h3 className="card-title text-md font-semibold text-base-content hover:text-primary transition-colors"><a href={newsItem.link} target="_blank" rel="noopener noreferrer">{newsItem.title}</a></h3>
                                <p className="text-xs text-base-content/60 mt-1">{newsItem.date || new Date().toLocaleDateString()}</p>
                                <p className="text-sm text-base-content/80 mt-1 leading-relaxed line-clamp-2">{newsItem.excerpt}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {clinicAnnouncements.length > 2 && (
                    <div className="text-center mt-6"> <Link to="/clinic/announcements" className="btn btn-primary btn-outline btn-sm">View All Announcements</Link> </div>
                )}
            </section>

            <section className="mt-8 md:mt-12">
                <h2 className="text-2xl font-semibold text-neutral mb-4 flex items-center"><LinkIcon className="w-6 h-6 mr-2 text-neutral opacity-80"/>Quick Links</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {quickLinksDoctor.map(link => {
                        const LinkIconComponent = link.icon;
                        return (
                            <Link key={link.id} to={link.href} className="card bg-base-200 shadow hover:shadow-md border border-black/10 p-4 flex flex-col items-center text-center transition-all hover:border-neutral/50 hover:bg-base-300">
                                <LinkIconComponent className="w-7 h-7 text-neutral mb-2" />
                                <p className="text-sm font-medium text-base-content hover:text-neutral transition-colors">{link.name}</p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="mt-8 md:mt-12">
                <h2 className="text-2xl font-semibold text-primary mb-4">My Performance (Placeholder)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-base-200 shadow border border-black/10">
                        <div className="card-body">
                            <h3 className="card-title text-sm text-primary">Consultations this Week</h3>
                            <div className="flex justify-center items-center h-40 bg-base-100 rounded-md mt-2">
                                <ChartBarIcon className="w-16 h-16 text-primary/30" />
                                <p className="text-base-content/50 ml-2">Data Unavailable</p>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-base-200 shadow border border-black/10">
                        <div className="card-body">
                            <h3 className="card-title text-sm text-neutral">Patient Satisfaction (Avg)</h3>
                            <div className="flex justify-center items-center h-40 bg-base-100 rounded-md mt-2">
                                <SparklesIcon className="w-16 h-16 text-neutral/30" />
                                <p className="text-base-content/50 ml-2">Data Unavailable</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

/**
 * Main DashboardPage component.
 * Conditionally renders Patient or Doctor view based on user role.
 */
function DashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center p-10">
                <p className="text-base-content text-xl font-semibold">Access Denied.</p>
                <p className="text-base-content/80 my-4">You must be logged in to view the dashboard.</p>
                <Link to="/login" className="btn btn-primary">Go to Login</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12 pb-12">
            {user.role === UserRoles.PATIENT && <PatientDashboardView />}
            {user.role === UserRoles.DOCTOR && <DoctorDashboardView />}
            {![UserRoles.PATIENT, UserRoles.DOCTOR].includes(user.role) && (
                <div className="text-center p-10">
                    <InformationCircleIcon className="w-12 h-12 mx-auto text-primary mb-4" />
                    <p className="text-xl font-semibold text-base-content">Dashboard Unavailable</p>
                    <p className="text-base-content/80 mt-2">
                        A dashboard view for your role ({user.role}) is not yet available.
                    </p>
                </div>
            )}
        </div>
    );
}

export default DashboardPage;
