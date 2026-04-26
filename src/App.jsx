import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Calendar, MapPin, X, ChevronDown, Skull, Frown, TrendingDown, Laugh, AlertTriangle, Phone } from 'lucide-react';
import Button from './components/common/Button';
import Modal from './components/common/Modal';
import { malayalamRoasts } from './roasts';
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
  const [slaps, setSlaps] = useState(() => {
    // Generate a massive global number based on time so it always increases for everyone
    const baseGlobal = Math.floor((Date.now() - 1714000000000) / 500) + 13849;
    const local = parseInt(localStorage.getItem('shibin_slaps') || '0');
    return baseGlobal + local;
  });
  const [floatingTexts, setFloatingTexts] = useState([]);

  const playFunnySounds = () => {
    try {
      // Play Shibin's custom crying sound immediately
      const cryingSound = new Audio('/faaaa.mp3');
      cryingSound.volume = 1.0;
      cryingSound.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
      console.log("Audio error:", e);
    }
  };

  const handleSlap = (e) => {
    setSlaps(prev => prev + 1);
    const local = parseInt(localStorage.getItem('shibin_slaps') || '0');
    localStorage.setItem('shibin_slaps', local + 1);
    
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
      <h2 className="section-subtitle" style={{ color: '#fff' }}>INTERACTIVE ACTIVITY: SLAP SHIBIN</h2>
      <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '20px', fontWeight: 900 }}>Take your anger out on him. He probably deserves it.</p>

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

      <div className="slap-score" onClick={handleSlap} style={{ cursor: 'pointer' }}>
        TOTAL SLAPS: {slaps}
      </div>
    </div>
  );
};

const RoastGenerator = () => {
  const [roast, setRoast] = useState(malayalamRoasts[0]);

  const handleGenerate = () => {
    const randomRoast = malayalamRoasts[Math.floor(Math.random() * malayalamRoasts.length)];
    setRoast(randomRoast);
  };

  return (
    <div className="roast-generator">
      <h3 style={{ fontFamily: 'Bangers', fontSize: '2.5rem', color: 'var(--accent)', textShadow: '2px 2px 0 #000', transform: 'rotate(-1deg)' }}>റാൻഡം റോസ്റ്റ് മെഷീൻ</h3>
      <motion.div
        key={roast}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="roast-display"
      >
        "{roast}"
      </motion.div>
      <Button onClick={handleGenerate} className="pulse-btn" style={{ fontSize: '1.5rem', padding: '15px 30px', fontFamily: 'inherit', fontWeight: '900' }}>പുതിയ റോസ്റ്റ്</Button>
    </div>
  );
};

const CursorTrail = () => {
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.85) { // Spawn occasionally
        const id = Date.now() + Math.random();
        setTrails(prev => [...prev, { x: e.clientX, y: e.clientY, id }]);
        setTimeout(() => {
          setTrails(prev => prev.filter(t => t.id !== id));
        }, 800);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ pointerEvents: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999 }}>
      <AnimatePresence>
        {trails.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 1, scale: 1, y: t.y, x: t.x }}
            animate={{ opacity: 0, scale: 0.2, y: t.y + 50, rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'absolute', fontSize: '24px' }}
          >
            {['🤡', '💩', '💀', '📉'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const DangerButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const searchHistory = [
    "3 ദിവസം കൊണ്ട് മുടി വളർത്താൻ എളുപ്പവഴികൾ",
    "എന്റെ കോഡ് എന്താ വർക്ക് ആവാത്തത്?",
    "StackOverflow: ഒരു div എങ്ങനെ സെന്റർ ആക്കാം?",
    "HTML വെച്ച് ബാക്കെൻഡ് ചെയ്യാൻ പറ്റുമോ?",
    "തുർക്കിയിൽ ഏറ്റവും വിലകുറഞ്ഞ ഹെയർ ട്രാൻസ്പ്ലാന്റ് 2026",
    "ഞാൻ ക്രിപ്റ്റോയെക്കുറിച്ച് സംസാരിക്കുമ്പോൾ പെൺകുട്ടികൾ എന്നെ അവഗണിക്കുന്നത് എന്തുകൊണ്ട്?",
    "23 വയസ്സിൽ താഴെ പ്രായം തോന്നിക്കാൻ എന്ത് ചെയ്യണം?",
    "കസേരയിൽ ഇരുന്ന് 5K ഓടാൻ പറ്റുമോ?",
    "സീനിയർ ഡെവലപ്പർ ആണെന്ന് എങ്ങനെ തള്ളാം?",
    "മയോണൈസിന് എരിവുണ്ടോ?"
  ];

  return (
    <div style={{ margin: '60px 0', textAlign: 'center' }}>
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        style={{
          background: '#ff0000',
          color: 'white',
          fontSize: '2rem',
          padding: '20px 40px',
          border: '8px solid black',
          borderRadius: '15px',
          fontFamily: 'Bangers',
          cursor: 'pointer',
          boxShadow: '10px 10px 0 #000',
          transform: 'rotate(-2deg)'
        }}
      >
        🛑 ഇതിൽ ക്ലിക്ക് ചെയ്യരുത് 🛑
      </motion.button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="⚠️ ചോർന്ന വിവരങ്ങൾ ⚠️"
        size="medium"
      >
        <div style={{ color: 'white', textAlign: 'left', fontFamily: 'Comic Neue' }}>
          <h3 style={{ color: 'var(--accent)', fontFamily: 'Bangers', fontSize: '2rem', marginBottom: '15px' }}>
            ഷിബിന്റെ ഫോണിലെ റീസെന്റ് സെർച്ച് ഹിസ്റ്ററി:
          </h3>
          <ul style={{ listStyleType: 'none', padding: 0, fontSize: '1.2rem', lineHeight: '1.6' }}>
            {searchHistory.map((item, index) => (
              <li key={index} style={{ marginBottom: '10px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', border: '2px solid black' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', marginRight: '10px' }}>{index + 1}.</span> 
                {item}
              </li>
            ))}
          </ul>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button onClick={() => setIsOpen(false)} className="pulse-btn" style={{ background: 'var(--primary)', color: 'white', padding: '10px 20px', width: '100%' }}>
              ഞാൻ ആരോടും പറയില്ല എന്ന് സത്യം ചെയ്യുന്നു
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const FakeCodeEditor = () => {
  const [typedCode, setTypedCode] = useState("");
  const [isOnFire, setIsOnFire] = useState(false);
  
  const funnyString = "I have absolutely no idea what I am doing... Please help... StackOverflow save me... I am just copying and pasting blindly... Why is there a syntax error on line 1?...";
  
  const handleKeyDown = (e) => {
    e.preventDefault();
    if (isOnFire) return;
    
    setTypedCode(prev => {
      const nextChar = funnyString[prev.length % funnyString.length];
      const newStr = prev + nextChar;
      if (newStr.length > 50 && !isOnFire) {
        setIsOnFire(true);
      }
      return newStr;
    });
  };

  return (
    <div className={`fake-code-container ${isOnFire ? 'on-fire' : ''}`}>
      <h2 style={{color: 'white', fontFamily: 'Bangers'}}>Fix Shibin's Code</h2>
      <p style={{color: 'var(--primary)'}}>Type anywhere below to fix the bug!</p>
      
      <div className="code-editor" tabIndex="0" onKeyDown={handleKeyDown}>
        <div className="code-header">
          <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
          <span className="file-name">shibin_logic.js</span>
        </div>
        <div className="code-body">
          <pre style={{ margin: 0 }}><code>
<span style={{color: '#ff7b72'}}>function</span> <span style={{color: '#d2a8ff'}}>makeShibinSmart</span>() {'{\n'}
{'  '}if (brain === <span style={{color: '#79c0ff'}}>null</span>) {'{\n'}
{'    '}return <span style={{color: '#a5d6ff'}}>"Error 404"</span>;{'\n'}
{'  '}{'}\n'}
{'}'}
          </code></pre>
          <div className="typed-overlay">
            {typedCode}<span className="cursor">|</span>
          </div>
        </div>
        
        {isOnFire && (
          <div className="fire-overlay">
            <div style={{ padding: '20px' }}>
              🔥 SYSTEM CRITICAL FAILURE 🔥<br/>
              YOU BROKE IT WORSE THAN HE DID!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FakeCallButton = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState("incoming"); // incoming, declined, accepted
  const audioRef = useRef(null);

  const startCall = () => {
    setIsCalling(true);
    setCallStatus("incoming");
    const ringtone = new Audio('/faaaa.mp3');
    ringtone.loop = true;
    ringtone.play().catch(e => console.log(e));
    audioRef.current = ringtone;
  };

  const endCall = (status) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCallStatus(status);
    setTimeout(() => {
      setIsCalling(false);
    }, 3000);
  };

  return (
    <div style={{ margin: '60px 0', textAlign: 'center' }}>
      <Button 
        onClick={startCall}
        className="pulse-btn"
        style={{
          background: '#000',
          color: '#ff0000',
          border: '4px solid #ff0000',
          fontSize: '1.5rem',
          padding: '15px 30px'
        }}
      >
        ⚠️ EMERGENCY: DO NOT CLICK ⚠️
      </Button>

      <AnimatePresence>
        {isCalling && (
          <motion.div 
            className="fake-call-screen"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0 }}
          >
            {callStatus === "incoming" && (
              <>
                <div className="call-header">
                  <h2 style={{fontFamily: 'Comic Neue', margin: 0, fontWeight: 400}}>Incoming Call</h2>
                  <h1 style={{fontSize: '3rem', margin: '10px 0'}}>രണ്ടാമത്തെ ബെസ്റ്റി 🤡</h1>
                  <p>Mobile</p>
                </div>
                
                <div className="call-actions">
                  <div className="call-btn decline" onClick={() => endCall("declined")}>
                    <X size={40} />
                  </div>
                  <div className="call-btn accept" onClick={() => endCall("accepted")}>
                    <Phone size={40} fill="currentColor" />
                  </div>
                </div>
              </>
            )}
            
            {callStatus === "declined" && (
              <div className="call-message">
                <h2>കോൾ കട്ട് ചെയ്തു!</h2>
                <p>ഷിബിന് ഇപ്പോൾ നിന്നെക്കാൾ വലുത് വേറെ ചിലരുണ്ട്...</p>
              </div>
            )}

            {callStatus === "accepted" && (
              <div className="call-message">
                <h2>ഷിബിൻ ബിസിയാണ്!</h2>
                <p style={{color: 'red'}}>ക്ഷമിക്കണം, ഷിബിൻ ഇപ്പോൾ ഒന്നാമത്തെ ബെസ്റ്റിയുടെ കൂടെയാണ്. ദയവായി ശല്യം ചെയ്യാതിരിക്കുക.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MaturityCaptcha = () => {
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, error, success
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images = [
    { id: 1, content: '🤡', label: 'Clown' },
    { id: 2, content: '👶', label: 'Baby' },
    { id: 3, content: '🐒', label: 'Monkey' },
    { id: 4, content: '/shibin.jpg', label: 'Shibin', isShibin: true },
    { id: 5, content: '🍼', label: 'Bottle' },
    { id: 6, content: '🍭', label: 'Lollipop' },
    { id: 7, content: '🧸', label: 'Teddy' },
    { id: 8, content: '🐥', label: 'Chick' },
    { id: 9, content: '💩', label: 'Poop' },
  ];

  const toggleSelect = (id) => {
    if (status === 'error') return;
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleVerify = () => {
    const shibinId = images.find(img => img.isShibin).id;
    if (selected.includes(shibinId)) {
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setSelected([]);
      }, 3000);
    } else if (selected.length > 0) {
      setStatus('success');
    }
  };

  return (
    <div style={{ margin: '60px 0', textAlign: 'center' }}>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="pulse-btn"
        style={{ background: '#2563eb', color: 'white', padding: '15px 30px', fontSize: '1.2rem' }}
      >
        🔐 സെക്യൂരിറ്റി ചെക്ക് (Security Check)
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="മനുഷ്യനാണോ എന്ന് ഉറപ്പുവരുത്തുക"
        size="medium"
      >
        <div className="captcha-container">
          <p className="captcha-task">
            താഴെ പറയുന്നവയിൽ നിന്നും <strong>'പ്രായപൂർത്തിയായ ഒരാളെ' (Mature Adult)</strong> തിരഞ്ഞെടുക്കുക.
          </p>
          
          <div className="captcha-grid">
            {images.map(img => (
              <div 
                key={img.id} 
                className={`captcha-item ${selected.includes(img.id) ? 'selected' : ''}`}
                onClick={() => toggleSelect(img.id)}
              >
                {img.isShibin ? (
                  <img src={img.content} alt="Mature?" className="captcha-img" />
                ) : (
                  <span className="captcha-emoji">{img.content}</span>
                )}
                {selected.includes(img.id) && <div className="checkmark">✅</div>}
              </div>
            ))}
          </div>

          {status === 'error' && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="captcha-error"
            >
              ❌ തെറ്റായ ഉത്തരം! ഇതിൽ പ്രായപൂർത്തിയായവർ ആരുമില്ല. പ്രത്യേകിച്ച് ആ ഫോട്ടോയിലുള്ള ആൾ ഒരു കൊച്ചു കുട്ടിയാണ്!
            </motion.div>
          )}

          {status === 'success' && (
            <div className="captcha-success">
              ✅ വെരിഫിക്കേഷൻ പൂർത്തിയായി! നിങ്ങൾക്ക് തുടരാം.
            </div>
          )}

          <div className="captcha-footer">
            <Button 
              onClick={handleVerify}
              disabled={selected.length === 0 || status === 'success'}
              style={{ background: '#2563eb', color: 'white', width: '100%' }}
            >
              VERIFY
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function App() {
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', reason: '', hairline: '10' });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "😭 Come back! Shibin is crying!";
      } else {
        document.title = "Shibin's Roast Day 🔥";
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

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
    setFormData({ ...formData, name: val });
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
      <CursorTrail />
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
            drag
            dragConstraints={{ left: -200, right: 200, top: -100, bottom: 200 }}
            dragElastic={0.5}
            whileDrag={{ scale: 1.2, rotate: 180 }}
            initial={{ scale: 0, rotate: -720 }} 
            animate={{ scale: 1, rotate: 0 }} 
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="logo-circle"
            style={{ cursor: 'grab' }}
            title="Throw me around!"
          >
            <AlertTriangle size={60} color="#000" />
          </motion.div>
          <motion.h1 
            className="main-title text-gradient glitch-text"
            data-text="VINTAGE 2003 EDITION"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.6 }}
          >
            VINTAGE 2003 EDITION
          </motion.h1>
          <p className="birth-year-roast" style={{ fontSize: '1.5rem', fontWeight: '900' }}>Born in 2003. Still hasn't matured past 2005.</p>

          <div className="maturity-progress">
            <div className="progress-label">MATURITY LEVEL:</div>
            <div className="progress-bar-container">
              <motion.div 
                className="progress-bar-fill"
                initial={{ width: '0%' }}
                animate={{ width: '12%' }}
                transition={{ delay: 0.5, duration: 2.5, ease: "easeOut" }}
              />
              <span className="progress-text">ERROR 404: MATURITY NOT FOUND</span>
            </div>
          </div>
        </header>

        <section className="hero-focus">
          <motion.div
            className="photo-card-container"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.7 }}
          >
            <div className="shibin-photo-frame">
              <img src="/shibin.jpg" alt="Shibin looking lost" className="main-photo" />
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
        <MaturityCaptcha />
        <FakeCodeEditor />
        <FakeCallButton />
        <DangerButton />

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
                    onChange={e => setFormData({ ...formData, hairline: e.target.value })}
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
                  onChange={(val) => setFormData({ ...formData, reason: val })}
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

