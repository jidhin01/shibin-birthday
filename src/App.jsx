import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Calendar, MapPin, X, ChevronDown, Skull, Frown, TrendingDown, Laugh, AlertTriangle } from 'lucide-react';
import Button from './components/common/Button';
import Modal from './components/common/Modal';
import './App.css';

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="modern-countdown">
      {Object.entries(timeLeft).map(([label, value]) => (
        <motion.div 
          key={label} 
          className="countdown-block"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <span className="count-num">{value.toString().padStart(2, '0')}</span>
          <span className="count-label">{label.toUpperCase()}</span>
        </motion.div>
      ))}
    </div>
  );
};

const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <div 
        className={`form-input custom-select-header ${isOpen ? 'open' : ''} ${!value ? 'placeholder' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value ? options.find(o => o.value === value)?.label : placeholder}</span>
        <ChevronDown size={20} className="select-icon" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="custom-select-dropdown"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            {options.map((option) => (
              <div 
                key={option.value}
                className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SlapGame = () => {
  const [slaps, setSlaps] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState([]);

  const playFunnySounds = () => {
    try {
      // 1. Play the crisp slap sound immediately
      const slap = new Audio('https://www.myinstants.com/media/sounds/slap.mp3');
      slap.volume = 0.8;
      slap.play().catch(e => console.log("Audio play failed:", e));

      // 2. Play Shibin's custom crying sound a split second later for maximum realism
      setTimeout(() => {
        const cryingSound = new Audio('/faaaa.mp3');
        cryingSound.volume = 1.0;
        cryingSound.play().catch(e => console.log("Audio play failed:", e));
      }, 150);
    } catch (e) {
      console.log("Audio error:", e);
    }
  };

  const handleSlap = (e) => {
    setSlaps(prev => prev + 1);
    playFunnySounds();
    
    // Get click coordinates relative to the container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 50; // offset for text centering
    const y = e.clientY - rect.top - 20;

    const phrases = ["OUCH!", "MY HAIRLINE!", "STOP!", "I'LL TELL MOM!", "I'M ONLY 25!", "404 ERROR!", "BUG REPORTED!"];
    const text = phrases[Math.floor(Math.random() * phrases.length)];

    const id = Date.now();
    setFloatingTexts(prev => [...prev, { id, x, y, text }]);

    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 800);
  };

  return (
    <div className="slap-game-container">
      <h2 className="section-subtitle" style={{color: '#fff'}}>INTERACTIVE ACTIVITY: SLAP SHIBIN</h2>
      <p style={{textAlign: 'center', fontSize: '1.2rem', marginBottom: '20px', fontWeight: 900}}>Take your anger out on him. He probably deserves it.</p>
      
      <div className="slap-area" onClick={handleSlap}>
        <motion.img 
          src="/shibin.jpg" 
          alt="Slap me" 
          className="slap-face"
          whileTap={{ scale: 0.8, rotate: (Math.random() - 0.5) * 60 }}
        />
        <AnimatePresence>
          {floatingTexts.map(ft => (
            <motion.div 
              key={ft.id}
              className="slap-text"
              initial={{ opacity: 1, y: ft.y, x: ft.x, scale: 0.5 }}
              animate={{ opacity: 0, y: ft.y - 150, scale: 1.5, rotate: (Math.random() - 0.5) * 40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {ft.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="slap-score">
        TOTAL SLAPS: {slaps}
      </div>
    </div>
  );
};

const RoastGenerator = () => {
  const roasts = [
    "Shibin is the human equivalent of a typo.",
    "His hairline has its own timezone.",
    "Shibin's code has more bugs than a rainforest.",
    "He's the reason we have 'Do Not Eat' labels on silica gel.",
    "Shibin is living proof that people can survive without a brain.",
    "If Shibin were a spice, he'd be flour.",
    "Shibin's fashion sense is a cry for help.",
    "He thinks an IP address is where the internet lives.",
    "Shibin is the reason aliens won't talk to us."
  ];
  const [roast, setRoast] = useState("Click the button to reveal a brutal truth.");

  const handleGenerate = () => {
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    setRoast(randomRoast);
  };

  return (
    <div className="roast-generator">
      <h3 style={{fontFamily: 'Bangers', fontSize: '2.5rem', color: 'var(--accent)', textShadow: '2px 2px 0 #000', transform: 'rotate(-1deg)'}}>Random Roast Machine</h3>
      <motion.div 
        key={roast}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="roast-display"
      >
        "{roast}"
      </motion.div>
      <Button onClick={handleGenerate} className="pulse-btn" style={{ fontSize: '1.5rem', padding: '15px 30px' }}>GENERATE NEW ROAST</Button>
    </div>
  );
};

function App() {
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', reason: '', hairline: '10' });
  const [isSuccess, setIsSuccess] = useState(false);

  const submitTexts = ["SUBMIT ROAST", "END HIM", "NO MERCY", "DESTROY HIS EGO", "SEND IT"];
  const [submitText, setSubmitText] = useState(submitTexts[0]);

  const handleRSVP = async (e) => {
    e.preventDefault();
    if (!formData.reason) {
      alert("YO! Pick an excuse!");
      return;
    }
    await new Promise(r => setTimeout(r, 800));
    setIsSuccess(true);
    setTimeout(() => {
      setIsRSVPModalOpen(false);
      setIsSuccess(false);
      setFormData({ name: '', reason: '', hairline: '10' });
      setSubmitText(submitTexts[0]);
    }, 4000);
  };

  const handleNameChange = (e) => {
    let val = e.target.value;
    if (val.toLowerCase() === 'shibin') {
      alert("Nice try Shibin. You can't RSVP to your own roast! I'm changing your name to 'Loser'.");
      val = "Loser";
    }
    setFormData({...formData, name: val});
  };

  const handleButtonHover = () => {
    setSubmitText(submitTexts[Math.floor(Math.random() * submitTexts.length)]);
  };

  const reasonOptions = [
    { value: "Cake", label: "🍰 Free Cake (Only reason)" },
    { value: "Roast", label: "🔥 Here to roast his fashion" },
    { value: "Hair", label: "👴 To check his hairline" },
    { value: "Debt", label: "💰 He owes me money" },
    { value: "Pity", label: "😭 Pure pity vote" }
  ];

  return (
    <div className="fun-app">
      <div className="floating-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="floating-item" style={{ 
            left: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 5 + 3}s`,
            fontSize: `${Math.random() * 40 + 30}px`,
            zIndex: Math.random() > 0.5 ? 2 : 0
          }}>
            {['🤡', '👴', '📉', '😭', '💸', '🐌', '🛑'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      <main className="content-wrapper">
        <header className="fun-header">
          <motion.div 
            initial={{ scale: 0, rotate: -720 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="logo-circle"
          >
            <AlertTriangle size={60} color="#000" />
          </motion.div>
          <motion.h1 
            className="main-title text-gradient"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.6 }}
          >
            VINTAGE 2003 EDITION
          </motion.h1>
          <p className="birth-year-roast">Born in 2003. Still hasn't matured past 2005.</p>
        </header>

        <section className="hero-focus">
          <motion.div 
            className="photo-card-container"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.7 }}
          >
            <div className="shibin-photo-frame">
              <img src="/shibin_new.jpg" alt="Shibin looking lost" className="main-photo" />
              <div className="photo-caption">"I swear I'm a Gen Z, but I have the back pain of a Boomer"</div>
            </div>
          </motion.div>

          <motion.div 
            className="countdown-section"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <h2 className="section-subtitle">COUNTDOWN TO HIS MID-LIFE CRISIS:</h2>
            <Countdown targetDate="2026-05-15T19:00:00" />
          </motion.div>

          <motion.div 
            className="action-section"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button onClick={() => setIsRSVPModalOpen(true)} className="pulse-btn">
                <Skull size={30} />
                I'M READY TO ROAST
                <Skull size={30} />
              </Button>
            </div>

            <div className="fun-details">
              <div className="detail-item"><Calendar size={24} color="#000" /> May 15th @ 7PM</div>
              <div className="detail-item"><MapPin size={24} color="#000" /> The Grand Pavilion</div>
              <div className="detail-item"><TrendingDown size={24} color="#000" /> His Dignity</div>
            </div>
          </motion.div>
        </section>

        <SlapGame />
        <RoastGenerator />

        <section className="roast-ticker">
          <div className="ticker-content">
            "Shibin thinks a 5K run is a computer monitor" 🛑 "Still copies code from StackOverflow without reading it" 🛑 "Hairline retreating faster than his crypto portfolio" 🛑 "Uses light mode in VS Code" 🛑 "Ask him about his 17 failed app ideas" 🛑 "Takes 3 days to reply to 'hello'" 🛑 "Thinks mayonnaise is spicy" 🛑 "Shibin thinks a 5K run is a computer monitor"
          </div>
        </section>
      </main>

      <Modal 
        isOpen={isRSVPModalOpen} 
        onClose={() => setIsRSVPModalOpen(false)}
        title={isSuccess ? "PRAY FOR SHIBIN" : "SIGN HIS DEATH WARRANT"}
        size="small"
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              className="success-state"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.6 }}
            >
              <div className="success-icon-wrap">
                <Laugh size={70} color="#000" />
              </div>
              <h3 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0, fontFamily: 'Bangers' }}>YOU'RE IN!</h3>
              <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 900 }}>Bring your best insults. He's gonna cry.</p>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              className="rsvp-fun-form" 
              onSubmit={handleRSVP}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
            >
              <div className="form-group">
                <label>Your Fake Name (Hide from him)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Batman"
                  value={formData.name}
                  onChange={handleNameChange}
                />
              </div>
              
              <div className="form-group">
                <label>How bad is his hairline today? (1-10)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.5rem' }}>👨</span>
                  <input 
                    type="range" 
                    min="1" max="10" 
                    className="form-input" 
                    style={{ padding: '0', height: '10px', flex: 1, accentColor: 'var(--primary)' }}
                    value={formData.hairline}
                    onChange={e => setFormData({...formData, hairline: e.target.value})}
                  />
                  <span style={{ fontSize: '1.5rem' }}>👴</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#000', width: '40px', textAlign: 'right' }}>
                    {formData.hairline}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Why are you even doing this?</label>
                <CustomSelect
                  value={formData.reason}
                  onChange={(val) => setFormData({...formData, reason: val})}
                  options={reasonOptions}
                  placeholder="Select a lame excuse..."
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full pulse-btn" 
                style={{ marginTop: '20px', padding: '15px' }}
                onMouseEnter={handleButtonHover}
              >
                {submitText}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </Modal>

      <footer className="simple-footer">
        <p>Built with 0% respect for Shibin.</p>
      </footer>
    </div>
  );
}

export default App;

