import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Calendar, MapPin, Cake, CheckCircle2, X, ChevronDown } from 'lucide-react';
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
        <div key={label} className="countdown-block card glass">
          <span className="count-num">{value}</span>
          <span className="count-label">{label.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', reason: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRSVP = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 1000));
    setIsSuccess(true);
    setTimeout(() => {
      setIsRSVPModalOpen(false);
      setIsSuccess(false);
      setFormData({ name: '', reason: '' });
    }, 2000);
  };

  return (
    <div className="fun-app">
      {/* Floating Elements Background */}
      <div className="floating-bg">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="floating-item" style={{ 
            left: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 20 + 20}px`
          }}>
            {['🎂', '🎈', '🎉', '💩', '🍻'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <main className="content-wrapper">
        <header className="fun-header">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="logo-circle glass"
          >
            <Cake size={40} className="text-primary" />
          </motion.div>
          <h1 className="main-title">SHIBIN'S <span className="text-primary">ROAST</span> DAY</h1>
        </header>

        <section className="hero-focus">
          <motion.div 
            className="photo-card-container"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="shibin-photo-frame glass">
              <img src="/shibin.jpg" alt="Shibin looking suspicious" className="main-photo" />
              <div className="photo-caption">"I swear I'm 25" - Shibin, probably.</div>
            </div>
          </motion.div>

          <motion.div 
            className="countdown-section"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-subtitle">Days until he officially becomes an uncle...</h2>
            <Countdown targetDate="2026-05-15T19:00:00" />
          </motion.div>

          <motion.div 
            className="action-section"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button onClick={() => setIsRSVPModalOpen(true)} className="pulse-btn">
              RSVP TO ROAST HIM
            </Button>
            <p className="fun-details">
              📅 May 15th @ 7PM | 📍 The Grand Pavilion | 🍻 BYO Jokes
            </p>
          </motion.div>
        </section>

        <section className="roast-ticker glass">
          <div className="ticker-content">
            "Shibin still thinks HTML is a programming language" • "His hairline is retreating faster than his social battery" • "Expert in making 2-minute noodles in 15 minutes" • "Ask him about his 17 failed startups"
          </div>
        </section>
      </main>

      <Modal 
        isOpen={isRSVPModalOpen} 
        onClose={() => setIsRSVPModalOpen(false)}
        title={isSuccess ? "ROAST RECORDED!" : "JOIN THE CIRCUS"}
        size="small"
      >
        {isSuccess ? (
          <div className="success-state">
            <CheckCircle2 size={64} className="text-primary" />
            <p>See you there! Don't forget to bring better jokes than his.</p>
          </div>
        ) : (
          <form className="rsvp-fun-form" onSubmit={handleRSVP}>
            <div className="form-group">
              <label>Your Name (to roast you back)</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Reason for coming</label>
              <select 
                className="form-input"
                required
                value={formData.reason}
                onChange={e => setFormData({...formData, reason: e.target.value})}
              >
                <option value="">Choose your excuse...</option>
                <option value="Cake">Free Cake (Only reason)</option>
                <option value="Roast">Here to roast his fashion</option>
                <option value="Pity">Pity vote for Shibin</option>
              </select>
            </div>
            <Button type="submit" className="w-full">CONFIRM SURVIVAL</Button>
          </form>
        )}
      </Modal>

      <footer className="simple-footer">
        <p>Built with ❤️ and extreme levels of sarcasm for Shibin.</p>
      </footer>
    </div>
  );
}

export default App;
