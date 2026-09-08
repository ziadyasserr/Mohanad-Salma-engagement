import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Send,
  CheckCircle,
  X,
  Menu,
  Play,
  Pause,
  Maximize2,
  UserCheck,
  Music,
  Compass,
  ArrowRight,
  Gift,
  Trash2,
  Mail,
  MailOpen,
  Flower2
} from "lucide-react";
import "./App.css";

import img1 from "./assets/img1.jpeg";
import img2 from "./assets/img2.jpeg";
import img3 from "./assets/img3.jpeg";
import img4 from "./assets/img4.jpeg";
import childrenImg from "./assets/children.jpeg";
import msImg from "./assets/ms.png";
import music from "./assets/music.mp3";

/* ==========================================================================
   EASY-TO-REPLACE PLACEHOLDER DATA & IMAGES
   You can easily replace the URLs, names, and text here.
   ========================================================================== */
const WEDDING_DATA = {
  groomName: "Mohanad",
  brideName: "Salma",
  weddingDateISO: "2026-09-29T19:00:00",
  formattedDate: "Tuesday, September 29, 2026",
  // venueName: "Police Officers Club",
  venueAddress: "Al Khalifa Al Kaher St, Nasr City, Cairo, Egypt",
  googleMapsUrl: "https://maps.app.goo.gl/yRiBotKJYzEybc2TA?g_st=iw",
};

// High-Resolution Editorial Gallery Photos (Using Real Couple Photos)
const GALLERY_IMAGES = [
  {
    id: 1,
    url: img4,
    title: "Our Beginning & Forever",
    subtitle: "From the first moment to eternity",
  },
  {
    id: 2,
    url: img2,
    title: "Golden Hour Romance",
    subtitle: "Wrapped in light, promises spoken from the heart.",
  },
  {
    id: 3,
    url: img3,
    title: "Forever Begins",
    subtitle: "Counting down the days until September 29.",
  },
];

// Initial Guestbook Messages
const INITIAL_WISHES = [
  {
    id: 1,
    name: "Alexander & Eleanor",
    message: "Wishing Mohanad and Salma a lifetime of unconditional love, warmth, and endless joy! We cannot wait to celebrate with you both on September 29.",
    time: "2 hours ago",
    likes: 14,
  },
  {
    id: 2,
    name: "The Montgomery Family",
    message: "Congratulations to the most radiant couple! May your journey together be blessed with endless happiness.",
    time: "5 hours ago",
    likes: 21,
  },
  {
    id: 3,
    name: "Dr. Julian Vance",
    message: "So thrilled for you both! Mohanad, you are a lucky man. Raising a toast to a magical wedding night!",
    time: "1 day ago",
    likes: 9,
  },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const ytPlayerRef = useRef(null);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Intro Sequence Stages: 'envelope' | 'opening' | 'card' | 'dismissed'
  const [introStage, setIntroStage] = useState("envelope");

  // Slider State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Guestbook State persisted in localStorage
  const [wishes, setWishes] = useState(() => {
    try {
      const saved = localStorage.getItem("wedding_wishes");
      return saved ? JSON.parse(saved) : INITIAL_WISHES;
    } catch {
      return INITIAL_WISHES;
    }
  });
  const [newGuestName, setNewGuestName] = useState("");
  const [newMessageText, setNewMessageText] = useState("");

  // Sync wishes state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("wedding_wishes", JSON.stringify(wishes));
    } catch (err) {
      console.error("Failed to save wishes to localStorage", err);
    }
  }, [wishes]);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState({
    name: "",
    email: "",
    phone: "",
    attending: "yes",
    guestsCount: "1",
    mealPreference: "beef",
    songRequest: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Audio Ref
  const audioRef = useRef(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate Countdown to Sept 29, 2026
  useEffect(() => {
    const weddingTargetTime = new Date(WEDDING_DATA.weddingDateISO).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = weddingTargetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Slider Autoplay Timer
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  };




  // const handleOpenEnvelope = () => {
  //   if (introStage !== "envelope") return;
  //   setIntroStage("opening");
  //   // Start music on first user interaction
  //   if (!musicStarted) {
  //     setMusicStarted(true);
  //     setIsPlaying(true);
  //   }
  // };
  const handleOpenEnvelope = () => {
    if (introStage !== "envelope") return;

    setIntroStage("opening");

    if (!musicStarted) {
      setMusicStarted(true);
      setIsPlaying(true);

      audioRef.current
        ?.play()
        .catch((error) => {
          console.log("Music playback blocked:", error);
          setIsPlaying(false);
        });
    }
  };

  // const toggleMusic = () => {
  //   if (ytPlayerRef.current) {
  //     if (isPlaying) {
  //       ytPlayerRef.current.contentWindow.postMessage(
  //         JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
  //         "*"
  //       );
  //       setIsPlaying(false);
  //     } else {
  //       ytPlayerRef.current.contentWindow.postMessage(
  //         JSON.stringify({ event: "command", func: "playVideo", args: [] }),
  //         "*"
  //       );
  //       setIsPlaying(true);
  //     }
  //   }
  // };

  // Automated 4-stage sequence transitions
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.log("Music playback blocked:", error);
        });
    }
  };

  // useEffect(() => {
  //   if (introStage === "envelope") {
  //     const timer1 = setTimeout(() => {
  //       handleOpenEnvelope();
  //     }, 700);
  //     return () => clearTimeout(timer1);
  //   }
  //   if (introStage === "opening") {
  //     const timer2 = setTimeout(() => {
  //       setIntroStage("card");
  //     }, 1200);
  //     return () => clearTimeout(timer2);
  //   }
  //   if (introStage === "card") {
  //     const timer3 = setTimeout(() => {
  //       setIntroStage("dismissed");
  //     }, 2000);
  //     return () => clearTimeout(timer3);
  //   }
  // }, [introStage]);

  useEffect(() => {
  if (introStage === "opening") {
    const timer = setTimeout(() => {
      setIntroStage("card");
    }, 1200);

    return () => clearTimeout(timer);
  }

  if (introStage === "card") {
    const timer = setTimeout(() => {
      setIntroStage("dismissed");
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [introStage]);
  const handleReopenEnvelope = () => {
    setIntroStage("envelope");
  };

  const handleAddWish = (e) => {
    e.preventDefault();
    if (!newGuestName.trim() || !newMessageText.trim()) return;

    const newWishObj = {
      id: Date.now(),
      name: newGuestName.trim(),
      message: newMessageText.trim(),
      time: "Just now",
      likes: 1,
    };

    setWishes([newWishObj, ...wishes]);
    setNewGuestName("");
    setNewMessageText("");
  };

  const handleLikeWish = (id) => {
    setWishes(
      wishes.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  const handleDeleteWish = (id) => {
    setWishes(wishes.filter((item) => item.id !== id));
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    setRsvpSubmitted(true);
    setTimeout(() => {
      setIsRsvpOpen(false);
      setRsvpSubmitted(false);
      setRsvpData({
        name: "",
        email: "",
        phone: "",
        attending: "yes",
        guestsCount: "1",
        mealPreference: "beef",
        songRequest: "",
      });
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] font-sans-inter selection:bg-[#c5a059] selection:text-white relative">
      {/* Background Audio - loads only after first user interaction */}
      {/* {musicStarted && (
        <iframe
          ref={ytPlayerRef}
          width="0"
          height="0"
          src="https://www.youtube.com/embed/QfgJQUiQFes?autoplay=1&loop=1&playlist=QfgJQUiQFes&enablejsapi=1"
          allow="autoplay; encrypted-media"
          style={{ display: "none", position: "absolute", pointerEvents: "none" }}
          title="background-music"
        ></iframe>
      )} */}
      <audio
        ref={audioRef}
        src={music}
        loop
        preload="auto"
      />

      {/* ================= STAGE 1 & 2: INTERACTIVE ENVELOPE OVERLAY ================= */}
      {(introStage === "envelope" || introStage === "opening") && (
        <div
          className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#141312]/95 backdrop-blur-xl transition-all duration-700 p-4 ${introStage === "opening" ? "opacity-90" : "opacity-100"
            }`}
        >
          {/* Background Sparkle Radial Gradient */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.15)_0%,transparent_70%)]" />

          {/* Heading Intro Banner */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="font-cinzel text-xs uppercase tracking-[0.35em] text-[#c5a059] block mb-2 font-bold">
              You Are Cordially Invited
            </span>
            <h2 className="font-serif-cormorant text-4xl sm:text-6xl text-white font-light flex flex-col items-center justify-center leading-tight">
              <span>Mohanad</span>
              <span className="text-[#c5a059] font-serif-playfair italic text-2xl sm:text-4xl my-1">&amp;</span>
              <span>Salma</span>
            </h2>
          </div>

          {/* 3D Interactive Envelope Component */}
          <div
            className="perspective-1000 w-[310px] sm:w-[460px] h-[230px] sm:h-[310px] relative cursor-pointer group"
            onClick={handleOpenEnvelope}
          >
            {/* Base Envelope */}
            <div className="absolute inset-0 bg-[#e3d7c5] rounded-2xl border border-[#c5a059]/40 shadow-2xl overflow-hidden" />

            {/* Inner Envelope Pocket Fold Flaps */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#ebdcc9] border-r border-[#c5a059]/20 shadow-sm opacity-95 [clip-path:polygon(0_0,100%_50%,0_100%)]" />
              <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#ebdcc9] border-l border-[#c5a059]/20 shadow-sm opacity-95 [clip-path:polygon(100%_0,0_50%,100%_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#f2e6d5] border-t border-[#c5a059]/30 shadow-md [clip-path:polygon(0_100%,50%_0,100%_100%)]" />
            </div>

            {/* Top Flap (Flips 180deg) */}
            <div
              className={`envelope-top-flap absolute top-0 left-0 right-0 h-1/2 bg-[#f5ebe0] border-b border-[#c5a059]/40 shadow-lg z-30 [clip-path:polygon(0_0,50%_100%,100%_0)] ${introStage === "opening" ? "open-flap" : ""
                }`}
            />

            {/* Wax Seal */}
            <button
              onClick={handleOpenEnvelope}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-16 h-16 sm:w-20 sm:h-20 rounded-full gold-gradient-bg border-2 border-white/90 flex flex-col items-center justify-center text-white shadow-2xl animate-wax-pulse transition-all duration-500 cursor-pointer ${introStage === "opening" ? "scale-0 opacity-0" : "hover:scale-110"
                }`}
            >
              <Sparkles className="w-4 h-4 text-white mb-0.5" />
              <span className="font-cinzel text-xs font-bold tracking-wider text-white">M &amp; S</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STAGE 3: "YOU ARE INVITED" CINEMATIC CARD ================= */}
      {introStage === "card" && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0d0b09]/98 backdrop-blur-2xl"
          style={{ animation: "cardOverlayIn 0.5s ease forwards" }}
          onClick={() => setIntroStage("dismissed")}
        >
          {/* Ambient gold radial glows */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(197,160,89,0.12) 0%, transparent 70%)" }} />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(197,160,89,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(197,160,89,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />

          {/* Card */}
          <div
            className="relative flex flex-col items-center justify-center text-center px-10 py-12"
            style={{ animation: "cardContentIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both" }}
          >
            {/* Top thin gold line */}
            <div style={{ width: "1px", height: "60px", background: "linear-gradient(to bottom, transparent, #c5a059)", animation: "lineGrow 0.5s ease 0.2s both" }} />

            {/* Monogram circle */}
            <div className="my-5 w-16 h-16 rounded-full border border-[#c5a059]/60 flex items-center justify-center"
              style={{ boxShadow: "0 0 30px rgba(197,160,89,0.3), inset 0 0 20px rgba(197,160,89,0.05)", animation: "monogramIn 0.5s ease 0.3s both" }}>
              <span className="font-cinzel text-lg font-bold tracking-widest gold-gradient-text">M&S</span>
            </div>

            {/* YOU ARE INVITED staggered */}
            <div className="flex flex-col items-center gap-1 my-4">
              <span className="font-cinzel text-[10px] uppercase tracking-[0.5em] text-[#c5a059]/70"
                style={{ animation: "fadeSlideUp 0.5s ease 0.35s both" }}>You Are</span>
              <span className="font-serif-cormorant text-7xl sm:text-8xl font-light text-white tracking-tight leading-none"
                style={{ animation: "fadeSlideUp 0.6s ease 0.45s both" }}>Invited</span>
            </div>

            {/* Names */}
            <div className="mt-3 flex items-center gap-3"
              style={{ animation: "fadeSlideUp 0.5s ease 0.6s both" }}>
              <span className="font-serif-cormorant text-2xl sm:text-3xl font-light text-white/80">Mohanad</span>
              <span className="font-serif-playfair italic text-[#c5a059] text-xl">&</span>
              <span className="font-serif-cormorant text-2xl sm:text-3xl font-light text-white/80">Salma</span>
            </div>

            {/* Date */}
            <p className="font-cinzel text-[10px] uppercase tracking-[0.4em] text-[#c5a059]/60 mt-3"
              style={{ animation: "fadeSlideUp 0.5s ease 0.7s both" }}>September 29 · 2026</p>

            {/* Bottom thin gold line */}
            <div className="mt-6" style={{ width: "1px", height: "60px", background: "linear-gradient(to bottom, #c5a059, transparent)", animation: "lineGrow 0.5s ease 0.3s both" }} />
          </div>
        </div>
      )}

      {/* ================= STICKY EDITORIAL NAVBAR ================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/85 backdrop-blur-md border-b border-[#c5a059]/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">

          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={toggleMusic}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#c5a059]/30 bg-white/60 text-[#c5a059] hover:bg-[#c5a059] hover:text-white transition shadow-sm text-xs font-semibold uppercase tracking-wider cursor-pointer"
              title={isPlaying ? "Mute Background Music" : "Play Background Music"}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse text-[#c5a059]" />
                  <span className="hidden sm:inline">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">Play Sound</span>
                </>
              )}
            </button>

            {/* Re-open Envelope Button */}
            <button
              onClick={handleReopenEnvelope}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#c5a059]/30 bg-white/60 text-[#6e675f] hover:text-[#c5a059] transition text-xs font-medium uppercase tracking-wider cursor-pointer"
              title="View Envelope Intro Again"
            >
              <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Envelope</span>
            </button>
          </div>

          {/* Monogram Brand */}
          <a href="#home" className="text-center group">
            <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.2em] gold-gradient-text uppercase group-hover:scale-105 transition transform inline-block">
              M & S
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-[0.15em] text-[#6e675f]">
            <a href="#home" className="hover:text-[#c5a059] transition">
              Home
            </a>
            <a href="#story" className="hover:text-[#c5a059] transition">
              Our Story
            </a>
            <a href="#gallery" className="hover:text-[#c5a059] transition">
              Gallery
            </a>
            <a href="#details" className="hover:text-[#c5a059] transition">
              Details
            </a>
            <a href="#schedule" className="hover:text-[#c5a059] transition">
              Schedule
            </a>
            <a href="#wishes" className="hover:text-[#c5a059] transition">
              Guestbook
            </a>
          </div>

          {/* Action RSVP Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRsvpOpen(true)}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full gold-gradient-bg text-white font-semibold text-xs tracking-wider uppercase shadow-sm hover:brightness-105 transition transform active:scale-95 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              RSVP Now
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[#1a1918]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-[#faf8f5] border-b border-[#c5a059]/20 py-6 px-8 shadow-xl animate-fade-in">
            <div className="flex flex-col items-center gap-5 text-sm uppercase tracking-widest font-medium text-[#1a1918]">
              <a href="#home" onClick={() => setMenuOpen(false)}>
                Home
              </a>
              <a href="#story" onClick={() => setMenuOpen(false)}>
                Our Story
              </a>
              <a href="#gallery" onClick={() => setMenuOpen(false)}>
                Gallery
              </a>
              <a href="#details" onClick={() => setMenuOpen(false)}>
                Details
              </a>
              <a href="#schedule" onClick={() => setMenuOpen(false)}>
                Schedule
              </a>
              <a href="#wishes" onClick={() => setMenuOpen(false)}>
                Guestbook
              </a>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setIsRsvpOpen(true);
                }}
                className="w-full py-3 rounded-full gold-gradient-bg text-white font-bold text-xs uppercase tracking-widest shadow-md"
              >
                RSVP Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section
        id="home"
        className="relative min-h-screen pt-26 pb-20 flex items-center justify-center overflow-hidden"
      >
        {/* Soft Warm Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#fdf6ec] via-[#faf8f5] to-[#faf8f5]" />
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, #c5a059 0%, transparent 50%), radial-gradient(circle at 70% 80%, #c5a059 0%, transparent 50%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-fade-in">
          {/* Top Invitation Badge */}
          {/* <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full champagne-glass text-[#c5a059] text-xs uppercase tracking-[0.25em] font-semibold mb-8 shadow-xs border border-[#c5a059]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Together with their families</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div> */}

          {/* Names Typography - Stacked Vertical Layout */}
          <div className=" flex flex-col items-center justify-center leading-none">
            <h1 className="font-serif-cormorant text-6xl sm:text-8xl md:text-9xl font-light tracking-tight text-[#1a1918]">
              Mohanad
            </h1>
            <span className="font-serif-playfair italic text-[#c5a059] font-normal text-3xl sm:text-6xl md:text-7xl  sm:my-3">
              &amp;
            </span>
            <h1 className="font-serif-cormorant text-6xl sm:text-8xl md:text-9xl font-light tracking-tight text-[#1a1918]">
              Salma
            </h1>
            <p className="font-cinzel text-xs sm:text-sm tracking-[0.35em] text-[#8c6a2b] uppercase font-semibold mt-6 sm:mt-8">
              Invite you to celebrate their union
            </p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex items-center justify-center gap-5 my-6">
            <div className="h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent w-24 sm:w-48" />
            <Heart className="w-4 h-4 text-[#c5a059] fill-[#c5a059]" />
            <div className="h-px bg-gradient-to-r from-transparent via-[#c5a059] to-transparent w-24 sm:w-48" />
          </div>

          {/* MS Couple Illustration - Hero Centerpiece */}
          <div className="relative mx-auto mb-4" style={{ maxWidth: "340px" }}>
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-3xl" style={{ boxShadow: "0 0 60px 20px rgba(197,160,89,0.18), 0 0 120px 40px rgba(197,160,89,0.08)" }} />
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#c5a059]/40 shadow-2xl bg-white/50">
              <img
                src={msImg}
                alt="Mohanad & Salma - Wedding Illustration"
                className="w-full h-auto object-contain"
                style={{ display: "block" }}
              />
            </div>
            {/* Corner Decorative Dots */}
            <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-[#c5a059]/60" />
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#c5a059]/60" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-[#c5a059]/60" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-[#c5a059]/60" />
          </div>

          {/* Wedding Date & Location */}
          <div className="mb-12">
            <p className="font-serif-cormorant text-3xl sm:text-5xl text-[#1a1918] font-normal tracking-wide">
              September 29, 2026
            </p>
            <p className="text-xs sm:text-sm text-[#6e675f] uppercase tracking-[0.2em] font-medium mt-2">
              {WEDDING_DATA.venueName}
            </p>
          </div>

          {/* ELEGANT MINIMALIST COUNTDOWN TIMER (NO BOXES, PIPE SEPARATED) */}
          <div className="py-4 sm:py-6 max-w-3xl mx-auto text-center">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#c5a059] mb-6 sm:mb-8">
              Counting Down To The Big Day
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-8">
              <CountdownItem value={timeLeft.days} label="Days" />
              <span className="text-[#c5a059]/40 font-serif-cormorant text-3xl sm:text-6xl font-light select-none pb-4">|</span>

              <CountdownItem value={timeLeft.hours} label="Hours" />
              <span className="text-[#c5a059]/40 font-serif-cormorant text-3xl sm:text-6xl font-light select-none pb-4">|</span>

              <CountdownItem value={timeLeft.minutes} label="Minutes" />
              <span className="text-[#c5a059]/40 font-serif-cormorant text-3xl sm:text-6xl font-light select-none pb-4">|</span>

              <CountdownItem value={timeLeft.seconds} label="Seconds" />
            </div>
          </div>

          {/* SEPTEMBER 2026 CALENDAR HIGHLIGHT WIDGET */}
          <div className="mt-8 sm:mt-10 max-w-sm mx-auto champagne-glass rounded-3xl p-6 sm:p-7 shadow-xl border border-[#c5a059]/35 animate-fade-in">
            {/* Calendar Header */}
            <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-4 mb-4">
              <div className="text-left">
                <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#c5a059] font-bold block">
                  Save The Date
                </span>
                <h3 className="font-serif-cormorant text-2xl sm:text-3xl font-light text-[#1a1918]">
                  September 2026
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/35 text-[#8c6a2b] text-[10px] font-bold uppercase tracking-wider shadow-xs">
                <Heart className="w-3 h-3 fill-[#c5a059] text-[#c5a059]" />
                <span>Sept 29</span>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 text-center font-cinzel text-[11px] font-bold text-[#8c6a2b] mb-3">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days Grid for Sept 2026 */}
            <div className="grid grid-cols-7 gap-1 text-center font-serif-cormorant text-base sm:text-lg items-center justify-items-center">
              {/* Sept 1 2026 is Tuesday -> 2 empty slots (Su, Mo) */}
              <span />
              <span />

              {/* Days 1 to 30 */}
              {[...Array(30)].map((_, index) => {
                const dayNumber = index + 1;
                const isWeddingDay = dayNumber === 29;

                return (
                  <div key={dayNumber} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center relative">
                    {isWeddingDay ? (
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full gold-gradient-bg text-white font-bold text-base sm:text-lg shadow-lg border-2 border-white flex items-center justify-center relative scale-110 z-10 animate-pulse-slow"
                        title="Mohanad & Salma's Wedding Day!"
                      >
                        {dayNumber}
                        <span className="absolute -top-1.5 -right-1 text-[11px]">❤️</span>
                      </div>
                    ) : (
                      <span className="text-[#1a1918]/80 hover:text-[#c5a059] transition font-medium">
                        {dayNumber}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-10">


            <a
              href="#details"
              className="px-8 py-4 rounded-full bg-white/90 border border-[#c5a059]/40 text-[#1a1918] font-medium text-xs uppercase tracking-[0.2em] shadow-sm hover:bg-[#c5a059] hover:text-white transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#c5a059]" />
              Event Details
            </a>
          </div>
        </div>
      </section>

      {/* ================= PHOTO CAROUSEL / GALLERY SECTION ================= */}
      <section
        id="gallery"
        className="py-24 px-6 bg-[#f4efe6] border-y border-[#c5a059]/20"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="The Portrait Gallery"
            subtitle="Moments captured in time as we prepare for our wedding day."
          />

          {/* Main Slider Container */}
          <div className="relative mt-14 bg-[#faf8f5] rounded-3xl p-4 sm:p-6 shadow-2xl border border-[#c5a059]/30">
            {/* Slider Image Frame */}
            <div className="relative h-[380px] sm:h-[520px] md:h-[620px] rounded-2xl overflow-hidden group">
              <img
                src={GALLERY_IMAGES[currentIndex].url}
                alt={GALLERY_IMAGES[currentIndex].title}
                className="w-full h-full object-cover object-center transition-all duration-1000 ease-in-out transform group-hover:scale-105"
              />

              {/* Editorial Gradient & Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1918]/85 via-[#1a1918]/25 to-transparent flex flex-col justify-end p-6 sm:p-12 text-white">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    {/* <span className="px-3.5 py-1 bg-[#c5a059]/90 backdrop-blur-md rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] mb-3 inline-block">
                      Frame 0{currentIndex + 1} / 0{GALLERY_IMAGES.length}
                    </span> */}
                    <h3 className="font-serif-cormorant text-3xl sm:text-5xl font-light text-white leading-tight">
                      {GALLERY_IMAGES[currentIndex].title}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm font-light tracking-wide mt-2">
                      {GALLERY_IMAGES[currentIndex].subtitle}
                    </p>
                  </div>

                  {/* Lightbox Zoom Trigger */}
                  <button
                    onClick={() => setLightboxIndex(currentIndex)}
                    className="p-3.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition transform hover:scale-110 cursor-pointer"
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Prev / Next Arrow Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-[#c5a059]/30 flex items-center justify-center text-[#1a1918] hover:bg-[#c5a059] hover:text-white transition shadow-lg z-20 cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-[#c5a059]/30 flex items-center justify-center text-[#1a1918] hover:bg-[#c5a059] hover:text-white transition shadow-lg z-20 cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Slider Bottom Controls & Thumbnails */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
              {/* Autoplay Toggle */}
              <button
                onClick={() => setIsAutoplay(!isAutoplay)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition cursor-pointer ${isAutoplay
                  ? "bg-[#c5a059]/15 text-[#8c6a2b] border border-[#c5a059]/40"
                  : "bg-gray-200/70 text-gray-700 border border-gray-300"
                  }`}
              >
                {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isAutoplay ? "Autoplay Active" : "Play Slideshow"}
              </button>

              {/* Thumbnail Strip */}
              <div className="flex items-center gap-3 overflow-x-auto py-2 max-w-full">
                {GALLERY_IMAGES.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 transition-all duration-300 cursor-pointer ${currentIndex === index
                      ? "ring-2 ring-[#c5a059] ring-offset-2 scale-105 shadow-md"
                      : "opacity-50 hover:opacity-100 scale-95"
                      }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR STORY SECTION ================= */}
      {/* <section id="story" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            title="Our Journey"
            subtitle="Three distinct chapters leading to a lifetime together."
          />

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <StoryCard
              number="01"
              title="First Impression"
              subtitle="Summer 2024"
              description="A chance meeting at an art exhibition ignited a conversation that never truly ended."
            />
            <StoryCard
              number="02"
              title="The Proposal"
              subtitle="Spring 2025"
              description="Under a starlit terrace overlooking the hills, a simple 'Yes' sealed our forever promise."
            />
            <StoryCard
              number="03"
              title="The Celebration"
              subtitle="September 29, 2026"
              description="Surrounded by those we cherish most, we begin our greatest adventure as husband and wife."
            />
          </div>
        </div>
      </section> */}

      {/* ================= CHILDHOOD MEMORIES SECTION ================= */}
      <section id="childhood" className="py-24 px-6 bg-[#faf8f5] border-t border-[#c5a059]/20">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="Where It All Began"
            subtitle="From sweet childhood innocence to an everlasting love story."
          />

          <div className="mt-14 flex justify-center">
            <div className="relative group max-w-md w-full bg-[#f4efe6] p-5 sm:p-7 rounded-3xl shadow-xl border-2 border-[#c5a059]/35 transition transform hover:-translate-y-1">
              {/* Polarized Image Frame */}
              <div className="relative h-[340px] sm:h-[420px] rounded-2xl overflow-hidden shadow-md border border-[#c5a059]/30">
                <img
                  src={childrenImg}
                  alt="Mohanad & Salma Childhood"
                  className="w-full h-full object-cover object-center transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-cinzel text-xs uppercase tracking-[0.25em] text-white bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-sm">
                  Young Hearts
                </span>
              </div>

              {/* Caption */}
              <div className="mt-6 text-center">
                <h3 className="font-serif-cormorant text-3xl sm:text-4xl font-light text-[#1a1918]">
                  Mohanad <span className="font-serif-playfair italic text-[#c5a059]">&amp;</span> Salma
                </h3>
                <p className="text-[#6e675f] text-xs font-light mt-2 tracking-widest uppercase">
                  Pure innocence, timeless bond, infinite love
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EVENT DETAILS & VENUE ================= */}
      <section id="details" className="py-24 px-6 bg-[#f4efe6] border-y border-[#c5a059]/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Wedding Details & Location"
            subtitle="We look forward to welcoming you to an unforgettable evening."
          />

          <div className="grid md:grid-cols-2 gap-10 mt-16">
            {/* Left Card: Date & Location */}
            <div className="bg-[#faf8f5] rounded-3xl p-8 sm:p-10 shadow-xl border border-[#c5a059]/30 flex flex-col justify-between">
              <div>
                <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#c5a059] font-bold block mb-2">
                  Venue & Timing
                </span>
                <h3 className="font-serif-cormorant text-4xl font-light text-[#1a1918] mb-8">
                  The Ceremony &amp; Reception
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#c5a059]/20">
                    <Calendar className="w-6 h-6 text-[#c5a059] shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-[#1a1918]">
                        Date
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {WEDDING_DATA.formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#c5a059]/20">
                    <Clock className="w-6 h-6 text-[#c5a059] shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-[#1a1918]">
                        Time
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        7:00 PM – 12:00 Midnight
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#c5a059]/20">
                    <MapPin className="w-6 h-6 text-[#c5a059] shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-[#1a1918]">
                        Location
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {WEDDING_DATA.venueName}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {WEDDING_DATA.venueAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={WEDDING_DATA.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 w-full py-4 rounded-2xl gold-gradient-bg text-white font-medium text-xs uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition"
              >
                <Compass className="w-4 h-4" />
                Open Location in Google Maps
              </a>
            </div>

            {/* Right Card: Google Map Embed */}
            <div className="bg-[#faf8f5] rounded-3xl p-8 sm:p-10 shadow-xl border border-[#c5a059]/30 flex flex-col justify-between">
              <div>
                <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#c5a059] font-bold block mb-2">
                  Interactive Map
                </span>
                <h3 className="font-serif-cormorant text-4xl font-light text-[#1a1918] mb-6">
                  Venue Directions
                </h3>

                <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#c5a059]/30 shadow-inner">
                  <iframe
                    title="Venue Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.684128032731!2d31.3090886!3d30.0458826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583efe003cba13%3A0xf043ad61cb39d8f3!2sPolice%20Officers%20Club!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
                    className="w-full h-full border-0"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>

              <p className="text-gray-500 text-xs italic text-center mt-6">
                * Complimentary valet parking will be available at the grand entrance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SCHEDULE OF EVENTS ================= */}
      <section id="schedule" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Schedule of Events"
            subtitle="An itinerary designed for joy, celebration, and dancing."
          />

          <div className="mt-16 space-y-6">
            <ScheduleItem
              time="07:00 PM"
              title="Welcome & Guest Arrival"
              details="Welcome drinks & receiving our beloved guests."
            />
            <ScheduleItem
              time="08:00 PM"
              title="Ceremony & Vows Exchange"
              details="Mohanad & Salma exchange vows and celebrate their union."
            />
            <ScheduleItem
              time="09:00 PM"
              title="Gala Dinner & First Dance"
              details="A multi-course culinary experience followed by toasts & dancing."
            />
            <ScheduleItem
              time="11:00 PM"
              title="Cake Cutting & Celebrations"
              details="Cake cutting, photos & party celebrations until midnight 12:00 AM."
            />
          </div>
        </div>
      </section>

      {/* ================= GUESTBOOK / WORDS OF LOVE ================= */}
      <section id="wishes" className="py-24 px-6 bg-[#f4efe6] border-t border-[#c5a059]/20">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Words of Love & Wishes"
            subtitle="Leave a personal message for Mohanad & Salma."
          />

          {/* Form */}
          <div className="mt-12 bg-[#faf8f5] rounded-3xl p-8 sm:p-10 shadow-xl border border-[#c5a059]/30">
            <form onSubmit={handleAddWish} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1a1918] mb-2">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Charlotte & Henry Vance"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 outline-none text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1a1918] mb-2">
                  Your Wishes for the Bride &amp; Groom
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Write your heart-felt message here..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 outline-none text-sm bg-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl gold-gradient-bg text-white font-medium text-xs uppercase tracking-[0.2em] shadow-md hover:brightness-105 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Post Wish
              </button>
            </form>
          </div>

          {/* Feed */}
          <div className="mt-12 space-y-4">
            {wishes.map((item) => (
              <div
                key={item.id}
                className="bg-[#faf8f5] rounded-2xl p-6 shadow-sm border border-[#c5a059]/20 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gold-gradient-bg text-white font-bold flex items-center justify-center text-xs">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#1a1918]">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {item.time}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mt-3 leading-relaxed">
                    "{item.message}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleLikeWish(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition cursor-pointer"
                  >
                    {/* <Heart className="w-3.5 h-3.5 fill-rose-500" /> */}
                    {/* <span>{item.likes}</span> */}
                  </button>
                  <button
                    onClick={() => handleDeleteWish(item.id)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-20 gold-gradient-dark-bg text-white text-center border-t border-[#c5a059]/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif-cormorant text-5xl font-light gold-gradient-text tracking-tight">
            Mohanad &amp; Salma
          </h2>

          <p className="font-cinzel text-xs uppercase tracking-[0.35em] text-[#c5a059] mt-3">
            September 29, 2026
          </p>

          <div className="flex items-center justify-center gap-4 my-8">
            <span className="w-16 h-px bg-[#c5a059]/30" />
            <Heart className="w-4 h-4 text-[#c5a059] fill-[#c5a059]" />
            <span className="w-16 h-px bg-[#c5a059]/30" />
          </div>

          <p className="text-gray-400 text-xs uppercase tracking-widest font-light">
            Thank you for sharing in our joy and love.
          </p>
        </div>
      </footer>

      {/* ================= RSVP MODAL DIALOG ================= */}
      {isRsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#faf8f5] rounded-3xl max-w-lg w-full p-8 sm:p-10 shadow-2xl relative border border-[#c5a059]">
            <button
              onClick={() => setIsRsvpOpen(false)}
              className="absolute right-6 top-6 p-2 rounded-full bg-gray-200/60 hover:bg-gray-300 text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {rsvpSubmitted ? (
              <div className="text-center py-10">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                <h3 className="font-serif-cormorant text-4xl font-light text-[#1a1918]">
                  RSVP Received!
                </h3>
                <p className="text-gray-600 text-sm mt-2 font-light">
                  Thank you for responding. We look forward to celebrating with you!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-8">
                  <span className="font-cinzel text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-bold block mb-1">
                    Response Requested
                  </span>
                  <h3 className="font-serif-cormorant text-4xl font-light text-[#1a1918]">
                    Confirm Attendance
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    Kindly respond by August 30, 2026.
                  </p>
                </div>

                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#1a1918] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={rsvpData.name}
                      onChange={(e) =>
                        setRsvpData({ ...rsvpData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c5a059] outline-none text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#1a1918] mb-1">
                      Email or Phone
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="your.email@example.com"
                      value={rsvpData.email}
                      onChange={(e) =>
                        setRsvpData({ ...rsvpData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c5a059] outline-none text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#1a1918] mb-1">
                        Will You Attend?
                      </label>
                      <select
                        value={rsvpData.attending}
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, attending: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c5a059] outline-none text-xs bg-white"
                      >
                        <option value="yes">Joyfully Accept</option>
                        <option value="no">Regretfully Decline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#1a1918] mb-1">
                        Guests Count
                      </label>
                      <select
                        value={rsvpData.guestsCount}
                        onChange={(e) =>
                          setRsvpData({ ...rsvpData, guestsCount: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c5a059] outline-none text-xs bg-white"
                      >
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4+ Guests</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#1a1918] mb-1">
                      Meal Preference
                    </label>
                    <select
                      value={rsvpData.mealPreference}
                      onChange={(e) =>
                        setRsvpData({
                          ...rsvpData,
                          mealPreference: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c5a059] outline-none text-xs bg-white"
                    >
                      <option value="beef">Prime Aged Beef Tenderloin</option>
                      <option value="salmon">Pan-Seared Chilean Sea Bass</option>
                      <option value="vegetarian">Truffle &amp; Wild Mushroom Risotto (V)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#1a1918] mb-1">
                      Song Request (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="What song gets you on the dancefloor?"
                      value={rsvpData.songRequest}
                      onChange={(e) =>
                        setRsvpData({ ...rsvpData, songRequest: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c5a059] outline-none text-xs bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl gold-gradient-bg text-white font-medium text-xs uppercase tracking-[0.2em] shadow-md hover:brightness-105 transition cursor-pointer mt-3"
                  >
                    Submit RSVP
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIGHTBOX PREVIEW */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6 animate-fade-in">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={GALLERY_IMAGES[lightboxIndex].url}
            alt="Fullscreen preview"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

/* ================= HELPER SUB-COMPONENTS ================= */

function CountdownItem({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center min-w-[55px] sm:min-w-[90px]">
      <span className="font-serif-cormorant text-4xl sm:text-7xl font-light text-[#1a1918] tracking-tight leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] sm:text-xs font-semibold text-[#8c6a2b] uppercase tracking-[0.25em] mt-2 sm:mt-3">
        {label}
      </span>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#c5a059] font-bold block mb-2">
        Celebration
      </span>
      <h2 className="font-serif-cormorant text-4xl sm:text-6xl font-light text-[#1a1918]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 text-sm mt-3 font-light leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function StoryCard({ number, title, subtitle, description }) {
  return (
    <div className="bg-[#faf8f5] rounded-3xl p-8 shadow-md border border-[#c5a059]/25 relative transition hover:-translate-y-1 hover:shadow-xl">
      <span className="font-cinzel text-5xl font-bold text-[#c5a059]/20 absolute top-6 right-8">
        {number}
      </span>
      <span className="text-[10px] font-semibold text-[#c5a059] uppercase tracking-[0.2em] block mb-1">
        {subtitle}
      </span>
      <h3 className="font-serif-cormorant text-3xl font-light text-[#1a1918] mb-3">
        {title}
      </h3>
      <p className="text-gray-600 text-xs leading-relaxed font-light">
        {description}
      </p>
    </div>
  );
}

function ScheduleItem({ time, title, details }) {
  return (
    <div className="bg-[#faf8f5] rounded-2xl p-6 shadow-sm border border-[#c5a059]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="px-4 py-2 rounded-xl gold-gradient-bg text-white font-cinzel text-xs font-semibold tracking-widest shrink-0">
          {time}
        </span>
        <div>
          <h4 className="font-serif-cormorant text-2xl font-normal text-[#1a1918]">
            {title}
          </h4>
          <p className="text-gray-500 text-xs mt-0.5 font-light">
            {details}
          </p>
        </div>
      </div>
    </div>
  );
}