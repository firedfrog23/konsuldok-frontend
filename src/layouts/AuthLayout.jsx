/* eslint-disable no-unused-vars */
// src/layouts/AuthLayout.jsx
import {
    CalendarDaysIcon,
    ChevronLeftIcon, ChevronRightIcon,
    DocumentTextIcon,
    HeartIcon,
    LockClosedIcon as LockIcon, // Renamed to avoid conflict if LockClosedIcon is used directly from outline
    UserGroupIcon
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Platform Features Data - Colors will be driven by theme or direct utility classes
const platformFeatures = [
    { id: 1, icon: CalendarDaysIcon, title: "Seamless Scheduling", description: "Book and manage appointments with verified specialists effortlessly.", iconColor: "text-primary-content/80" }, // White icon on Blue BG
    { id: 2, icon: LockIcon, title: "Secure Medical Records", description: "Your health data is kept safe and confidential with robust security measures.", iconColor: "text-primary-content/80" },
    { id: 3, icon: UserGroupIcon, title: "Connect with Specialists", description: "Access a wide network of verified doctors across various specialties.", iconColor: "text-primary-content/80" },
    { id: 4, icon: DocumentTextIcon, title: "Organized Documents", description: "Upload and access your important medical documents anytime, anywhere.", iconColor: "text-primary-content/80" },
    { id: 5, icon: HeartIcon, title: "Personalized Healthcare", description: "Manage your health journey with tools tailored to your needs.", iconColor: "text-primary-content/80" }
];

// Abstract Animated Graphic Component
// Uses primary (Blue) and primary-content (White) with opacity, and neutral (Black) with opacity.
const AbstractAnimatedGraphic = () => {
    const shapeVariants = {
        float: {
            y: ["-5%", "5%", "-5%"],
            x: ["-3%", "3%", "-3%"],
            rotate: [0, 5, 0],
            transition: { duration: 15, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }
        }
    };
    const shapeVariants2 = {
        float: {
            y: ["5%", "-5%", "5%"],
            x: ["3%", "-3%", "3%"],
            rotate: [0, -5, 0],
            transition: { duration: 18, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }
        }
    };

    return (
        <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
            {/* primary-content is White. primary is Blue. neutral is Black. */}
            <motion.div
                className="absolute w-full h-full rounded-full bg-primary-content/30" // White with opacity
                variants={shapeVariants}
                animate="float"
            />
            <motion.div
                className="absolute w-3/4 h-3/4 rounded-full bg-primary/20" // Blue with opacity
                variants={shapeVariants2}
                animate="float"
            />
            <motion.div
                className="absolute w-1/2 h-1/2 rounded-lg bg-primary-content/30 transform rotate-12" // White with opacity
                variants={shapeVariants}
                animate="float"
            />
            <motion.div
                className="absolute w-1/3 h-1/3 rounded-full bg-primary/40" // Blue with opacity
                variants={shapeVariants2}
                animate="float"
            />
            <div className="absolute rounded-full bg-neutral/30" style={{ width: '15%', height: '15%', top: '42.5%', left: '42.5%' }}></div> {/* Black with opacity */}
        </div>
    );
};

/**
 * AuthLayout. Adheres to strict 3-color palette.
 * - Left Panel: Blue BG (bg-primary), White text (text-primary-content).
 * - Right Panel: White BG (bg-base-100), Black text (text-base-content).
 * - Animated graphic uses variations of Blue, White, Black with opacity.
 */
function AuthLayout({ children }) {
    const [featureIndex, setFeatureIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const navigateFeature = (newDirection) => {
        setDirection(newDirection);
        setFeatureIndex(prevIndex => {
            const length = platformFeatures.length;
            return ((prevIndex + newDirection) % length + length) % length;
        });
    };

    const currentFeature = platformFeatures[featureIndex];
    const FeatureIcon = currentFeature ? currentFeature.icon : null;

    const textVariants = {
        enter: (direction) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 30 : -30, opacity: 0 })
    };

    return (
        // Main container: White BG (bg-base-100)
        <div className="flex flex-col md:flex-row min-h-screen bg-base-100">
            {/* Left Side: Visual Panel - Blue BG (bg-primary) */}
            <div className="w-full md:w-1/2 lg:w-2/5 hidden md:flex flex-col items-center justify-between p-8 lg:p-12 bg-primary relative overflow-hidden">
                {/* Subtle dot pattern using primary-content (White) */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]" style={{backgroundImage: 'radial-gradient(var(--color-primary-content) 1px, transparent 1px)', backgroundSize: '15px 15px'}}></div>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="z-10 w-full text-left">
                    {/* Brand Link: White text (text-primary-content) */}
                    <Link to="/" className="inline-block text-3xl font-bold text-primary-content hover:opacity-90 transition-opacity"> KonsulDok </Link>
                </motion.div>
                <div className="z-10 flex flex-col items-center w-full max-w-sm space-y-8 my-auto">
                    <AbstractAnimatedGraphic />
                    {/* Text Carousel: White text (text-primary-content) */}
                    <div className="text-center text-primary-content relative h-28 w-full overflow-hidden">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={featureIndex}
                                custom={direction}
                                variants={textVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ x: { type: "tween", duration: 0.3, ease: 'easeInOut' }, opacity: { duration: 0.2 } }}
                                className="absolute inset-0 flex flex-col items-center justify-start pt-2"
                            >
                                {FeatureIcon && (
                                    // Icon color is White with opacity (text-primary-content/80)
                                    <FeatureIcon className={`w-8 h-8 mb-3 ${currentFeature?.iconColor || 'text-primary-content/80'}`} />
                                )}
                                <h3 className={`text-lg font-semibold mb-1 text-primary-content`}>{currentFeature?.title || ''}</h3>
                                <p className="text-sm opacity-80 px-4 text-primary-content/90">{currentFeature?.description || ''}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
                {/* Carousel Navigation: Buttons use White BG (primary-content) with opacity, White icons */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="z-10 flex justify-center items-center space-x-4 w-full">
                    <button onClick={() => navigateFeature(-1)} className="btn btn-circle btn-sm bg-primary-content/20 hover:bg-primary-content/40 text-primary-content border-none" aria-label="Previous Feature"> <ChevronLeftIcon className="w-5 h-5" /> </button>
                    <div className="flex space-x-2">
                        {platformFeatures.map((_, index) => (
                            <button key={index} onClick={() => { setDirection(index > featureIndex ? 1 : -1); setFeatureIndex(index); }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === featureIndex ? 'bg-primary-content scale-125' : 'bg-primary-content/40 hover:bg-primary-content/60'}`}
                                aria-label={`Go to feature ${index + 1}`}
                            />
                        ))}
                    </div>
                    <button onClick={() => navigateFeature(1)} className="btn btn-circle btn-sm bg-primary-content/20 hover:bg-primary-content/40 text-primary-content border-none" aria-label="Next Feature"> <ChevronRightIcon className="w-5 h-5" /> </button>
                </motion.div>
            </div>

            {/* Right Side: Form Content - White BG (bg-base-100 from parent) */}
            <div className="w-full md:w-1/2 lg:w-3/5 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
                {/* Mobile Brand Link: text-primary is Blue */}
                <Link to="/" className="mb-6 md:hidden inline-block text-3xl font-bold text-primary">KonsulDok</Link>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="w-full max-w-md">
                    {children}
                </motion.div>
                {/* Copyright Text: text-base-content (Black) with opacity */}
                <p className="mt-8 text-center text-xs text-base-content/60">&copy; {new Date().getFullYear()} KonsulDok Healthcare.</p>
            </div>
        </div>
    );
}

export default AuthLayout;
