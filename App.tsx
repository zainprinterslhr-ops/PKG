import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  UserPlus,
  FileText,
  QrCode,
  ChevronRight,
  Navigation,
  Sun,
  Moon,
  MessageCircle,
  Facebook,
  Linkedin,
  Twitter,
  Loader2,
  X,
  Languages,
  Check
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

// ==========================================
// INITIAL CONTENT (English)
// ==========================================
const INITIAL_CONTENT: Record<string, string> = {
  welcome: "Welcome to",
  companyName: "PKG INTERNATIONAL PROJECTS & LOGISTICS CORPORATION LTD.",
  tagline: "Services Beyond Excellence",
  saveContact: "Save Contact",
  saveContactSub: "Digital Business Card",
  companyProfile: "Company Profile",
  companyProfileSub: "View Corporate Profile",
  whatsapp: "Direct WhatsApp",
  whatsappSub: "Connect with our team",
  directContact: "Direct Contact",
  callLabel: "Call Hotline",
  emailLabel: "Send Email",
  portalLabel: "Official Portal",
  followUs: "Follow Us",
  globalHubs: "Global Hubs",
  karachiOffice: "Karachi Headquarters",
  karachiAddr: "909-914 Business Centre, Mumtaz Hassan Road",
  lahoreOffice: "Lahore Operations",
  lahoreAddr: "International Shipping & Logistics Complex",
  showQr: "Show QR Code",
  rendering: "Translating...",
  footerNote: "Logistics Reimagined"
};

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese (中文)', flag: '🇨🇳' },
  { code: 'ur', name: 'Urdu (اردو)', flag: '🇵🇰' },
  { code: 'ar', name: 'Arabic (العربية)', flag: '🇸🇦' }
];

// ==========================================
// CONFIG & ASSETS
// ==========================================
const WEBSITE = "www.pkg.com.pk";
const EMAIL = "info@pkg.com.pk";
const PHONE = "+92 42 111 097 111";
const WHATSAPP = "+923001110971";
const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/PKGInternational/",
  linkedin: "https://www.linkedin.com/company/pkg-international-shipping-&-logistics-ltd/",
  twitter: "https://twitter.com/pkgintl"
};
const SKETCH_BG_URL = "https://img.freepik.com/premium-photo/sketch-truck-front-warehouse_1020495-231362.jpg";

const LAHORE_LOCATION = "https://www.google.com/maps/place/PKG+International+Shipping+%26+Logistics+Ltd/@31.4242198,74.2436897,17z/data=!3m1!4b1!4m6!3m5!1s0x391903e3041b728b:0x1ec4b32d242edeaa!8m2!3d31.4242198!4d74.2436897!16s%2Fg%2F11f_zxv3tx?entry=ttu";
const KARACHI_LOCATION = "https://www.google.com/maps/search/909+to+914,+Business+Centre,+Mumtaz+Hassan+Road,+Karachi/@24.8965796,66.9752291,12z/data=!3m1!4b1?entry=ttu";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  subtext?: string;
  variant?: 'primary' | 'secondary';
  isDarkMode: boolean;
  isRtl?: boolean;
  onLongPress?: () => void;
  showToast?: (msg: string) => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick, subtext, variant = 'primary', isDarkMode, isRtl, onLongPress, showToast }) => {
  const isPrimary = variant === 'primary';

  let bgClasses = "";
  if (isPrimary) bgClasses = `bg-gradient-to-r from-[#2E3192]/90 to-[#00A651]/90 backdrop-blur-md text-white border-white/20 shadow-[0_10px_30px_-10px_rgba(46,49,146,0.5)]`;
  else bgClasses = isDarkMode
    ? "bg-slate-900/60 border-slate-700/50 text-white backdrop-blur-xl"
    : "bg-white/70 border-white/40 text-gray-800 backdrop-blur-xl shadow-sm";

  // Long-press + ripple state
  const holdTimer = useRef<number | null>(null);
  const hasLongPressed = useRef(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const nextId = useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // ripple
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = nextId.current++;
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => {
      setRipples(r => r.filter(p => p.id !== id));
    }, 450);

    // long press
    if (onLongPress) {
      hasLongPressed.current = false;
      holdTimer.current = window.setTimeout(() => {
        hasLongPressed.current = true;
        onLongPress();
        if (showToast) showToast(`${label} saved`);
      }, 600);
    }
  };
  const handlePointerUp = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const handleClick = () => {
    if (hasLongPressed.current) {
      hasLongPressed.current = false;
      return; // already handled by long press
    }
    onClick();
    if (showToast) showToast(`${label} saved`);
  };

  return (
    <motion.button
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`relative overflow-hidden w-full group flex items-center p-4 rounded-2xl transition-all duration-300 transform shadow-xl border ${bgClasses}`}
      aria-label={label}
    >
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 6, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className={`p-3 rounded-xl mr-4 transition-all duration-300 ${isPrimary ? 'bg-white/20 text-white' : (isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-[#2E3192]')}`}
      >
        {icon}
      </motion.div>
      <div className={`flex-1 text-left ${isRtl ? 'rtl' : 'ltr'}`}>
        <p className={`font-bold ${isRtl ? 'text-xl' : 'text-lg'} leading-tight uppercase tracking-tight`}>{label}</p>
        {subtext && <p className={`${isRtl ? 'text-sm' : 'text-xs'} mt-1 ${isPrimary ? 'text-white/80' : (isDarkMode ? 'text-slate-400' : 'text-gray-500')}`}>{subtext}</p>}
      </div>
      <motion.div animate={{ x: 0 }} whileHover={{ x: 6 }} className={`ml-2 ${isPrimary ? 'text-white/50' : (isDarkMode ? 'text-slate-600' : 'text-gray-300')}`}>
        <ChevronRight className="w-5 h-5" />
      </motion.div>

      {/* ripples */}
      <div className="absolute inset-0 pointer-events-none">
        {ripples.map(r => (
          <motion.span
            key={r.id}
            initial={{ opacity: 0.45, scale: 0 }}
            animate={{ opacity: 0, scale: 6 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{ left: r.x - 6, top: r.y - 6 }}
            className="absolute w-3 h-3 rounded-full bg-white/40 dark:bg-slate-300"
          />
        ))}
      </div>
    </motion.button>
  );
};

const Snackbar: React.FC<{ text: string; open: boolean; onClose: () => void }> = ({ text, open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed left-1/2 -translate-x-1/2 bottom-8 z-[120] bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-lg"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center space-x-3">
            <SparkleIcon />
            <div className="text-sm font-medium">{text}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SparkleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-90">
    <path d="M12 2l1.5 3 3 1.2-3 1.2L12 11l-1.5-3L7 6.8 10 5.6 12 2z" fill="currentColor" />
    <path d="M4 14l.8 1.6L6.4 16 4.8 17.4 4 19 3.2 17.4 1.6 16 3.2 15.6 4 14z" fill="currentColor" />
  </svg>
);

const App: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Translation State
  const [currentLang, setCurrentLang] = useState('en');
  const [content, setContent] = useState<Record<string, string>>(INITIAL_CONTENT);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Snackbar state
  const [snackText, setSnackText] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const showToast = useCallback((msg: string) => {
    setSnackText(msg);
    setSnackOpen(true);
  }, []);

  // Pointer / gesture related
  const cardRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Parallax using mouse position
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const bgPosX = useTransform(pointerX, [-1, 1], ['10%', '90%']);
  const bgPosY = useTransform(pointerY, [-1, 1], ['10%', '90%']);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;
      pointerX.set(nx);
      pointerY.set(ny);
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [pointerX, pointerY]);

  // Keyboard: ESC to close QR
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowQR(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Translation: simulated client-side to avoid Node SDK in browser
  const translatePage = useCallback(async (langCode: string) => {
    if (langCode === 'en') {
      setContent(INITIAL_CONTENT);
      setCurrentLang('en');
      setIsLangMenuOpen(false);
      showToast('Switched to English');
      return;
    }

    setIsTranslating(true);
    setIsLangMenuOpen(false);

    try {
      // Simulate an async translation step so UI shows loader
      await new Promise(resolve => setTimeout(resolve, 700));
      const lang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];

      // Simple safe simulation: append flag to values (keeps keys intact)
      const simulated: Record<string, string> = {};
      Object.keys(INITIAL_CONTENT).forEach(k => {
        const v = INITIAL_CONTENT[k] ?? '';
        // For short labels, simulate with flag + translated label fallback:
        simulated[k] = `${v} ${lang.flag}`;
      });

      setContent(simulated);
      setCurrentLang(langCode);
      showToast(`Switched to ${lang.name}`);
    } catch (err) {
      console.error("Translation error (simulated):", err);
      showToast('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  }, [showToast]);

  const downloadVCard = useCallback(() => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${INITIAL_CONTENT.companyName}\nORG:${INITIAL_CONTENT.companyName}\nTEL;TYPE=WORK,VOICE:${PHONE}\nEMAIL;TYPE=PREF,INTERNET:${EMAIL}\nURL:${WEBSITE}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'PKG_Contact.vcf');
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, []);

  const openLink = (url: string) => window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');

  const isRtl = currentLang === 'ur' || currentLang === 'ar';

  // Swipe to cycle languages on the main profile card
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      const idx = LANGUAGES.findIndex(l => l.code === currentLang);
      const nextIndex = dx < 0 ? (idx + 1) % LANGUAGES.length : (idx - 1 + LANGUAGES.length) % LANGUAGES.length;
      translatePage(LANGUAGES[nextIndex].code);
    }
    touchStartX.current = null;
  };

  return (
    <div className={`min-h-screen relative flex flex-col items-center justify-start pb-20 overflow-x-hidden ${isDarkMode ? 'text-slate-100' : 'text-slate-900'} ${isRtl ? 'font-urdu' : ''}`}>
      <motion.div
        className={`fixed inset-0 -z-20 transition-all duration-700 bg-cover bg-center bg-no-repeat`}
        style={{ backgroundImage: `url(${SKETCH_BG_URL})`, backgroundPositionX: bgPosX, backgroundPositionY: bgPosY }}
        aria-hidden
      />

      <div className={`fixed inset-0 -z-10 transition-colors duration-700 ${isDarkMode ? 'bg-slate-950/90' : 'bg-white/70 backdrop-blur-[1px]'}`} />

      <div className="w-full max-w-md flex justify-between items-center p-6 z-[60] sticky top-0">
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className={`p-3 rounded-full shadow-lg transition-all flex items-center space-x-2 backdrop-blur-md border ${isDarkMode ? 'bg-slate-800/80 text-blue-400 border-slate-700' : 'bg-white/80 text-slate-800 border-white/50'}`}
          >
            <Languages size={18} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isRtl ? 'font-urdu' : ''}`}>{LANGUAGES.find(l => l.code === currentLang)?.name.split(' ')[0]}</span>
          </button>

          {isLangMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`absolute top-full left-0 mt-2 w-48 rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}
            >
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => translatePage(l.code)}
                  className={`w-full px-5 py-4 text-left flex items-center justify-between transition-colors ${currentLang === l.code ? (isDarkMode ? 'bg-slate-800' : 'bg-slate-50') : 'hover:bg-slate-50 dark:hover:bg-slate-800'} ${l.code === 'ur' || l.code === 'ar' ? 'font-urdu' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{l.flag}</span>
                    <span className="text-xs font-bold uppercase tracking-tight">{l.name}</span>
                  </div>
                  {currentLang === l.code && <Check size={14} className="text-green-500" />}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:rotate-90 backdrop-blur-md border ${isDarkMode ? 'bg-slate-800/80 text-yellow-400 border-slate-700' : 'bg-white/80 text-slate-800 border-white/50'}`}
          aria-pressed={isDarkMode}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="max-w-md w-full px-6 animate-fade-in relative">
        {isTranslating && (
          <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-[3rem] animate-in fade-in">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">{content.rendering}</p>
          </div>
        )}

        <motion.div
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className={`rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] p-10 mb-8 text-center relative border transition-all duration-500 backdrop-blur-3xl ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-white/60'}`}
        >
          <div className="flex flex-col items-center mb-8">
            <p className={`font-black uppercase tracking-[0.3em] mb-1 text-[#2E3192] dark:text-blue-400 ${isRtl ? 'text-lg' : 'text-[11px]'}`}>
               {content.welcome}
            </p>
            <div className={`font-futura text-[82px] leading-[0.85] drop-shadow-md select-none`}>
               <span className="text-[#00A651]">P</span>
               <span className="text-[#2E3192]">K</span>
               <span className="text-[#00A651]">G</span>
            </div>
          </div>
          <h1 className={`leading-tight uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2E3192] to-[#00A651] ${isRtl ? 'text-2xl' : 'text-[17px] font-black'}`}>
            {content.companyName}
          </h1>
          <p className={`font-black uppercase tracking-[0.4em] mt-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} ${isRtl ? 'text-base' : 'text-[9px]'}`}>
            {content.tagline}
          </p>
        </motion.div>

        <div className="space-y-4">
          <ActionButton
            icon={<UserPlus size={24} />}
            label={content.saveContact}
            subtext={content.saveContactSub}
            onClick={() => { downloadVCard(); showToast('Contact downloaded'); }}
            onLongPress={() => { downloadVCard(); showToast('Contact downloaded'); }}
            showToast={showToast}
            isDarkMode={isDarkMode}
            isRtl={isRtl}
          />
          <ActionButton
            icon={<FileText size={24} />}
            label={content.companyProfile}
            subtext={content.companyProfileSub}
            onClick={() => { openLink(WEBSITE); showToast('Opening profile'); }}
            showToast={showToast}
            isDarkMode={isDarkMode}
            isRtl={isRtl}
          />
          <ActionButton
            icon={<MessageCircle size={24} />}
            label={content.whatsapp}
            subtext={content.whatsappSub}
            onClick={() => { openLink(`https://wa.me/${WHATSAPP}`); showToast('Opening WhatsApp'); }}
            showToast={showToast}
            isDarkMode={isDarkMode}
            isRtl={isRtl}
          />
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between px-3 mb-6">
            <h2 className={`font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} ${isRtl ? 'text-base' : 'text-[10px]'}`}>{content.directContact}</h2>
            <div className={`h-px flex-1 ml-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-300'}`} />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: <Phone size={22} />, label: content.callLabel, value: PHONE, action: () => { openLink(`tel:${PHONE}`); showToast('Calling...'); } },
              { icon: <Mail size={22} />, label: content.emailLabel, value: EMAIL, action: () => { openLink(`mailto:${EMAIL}`); showToast('Opening mail'); } },
              { icon: <Globe size={22} />, label: content.portalLabel, value: WEBSITE, action: () => { openLink(WEBSITE); showToast('Opening portal'); } }
            ].map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                onClick={item.action}
                className={`flex items-center p-5 rounded-3xl shadow-lg border transition-all duration-300 transform group backdrop-blur-md ${isDarkMode ? 'bg-slate-900/60 border-slate-800/50' : 'bg-white/70 border-white/50'}`}
              >
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-[#2E3192]'}`}>
                  {item.icon}
                </div>
                <div className={`ml-5 text-left ${isRtl ? 'rtl' : 'ltr'}`}>
                  <p className={`font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} ${isRtl ? 'text-sm' : 'text-[8px]'}`}>{item.label}</p>
                  <p className={`font-bold ${isRtl ? 'text-xl' : 'text-base'}`}>{item.value}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between px-3 mb-6">
            <h2 className={`font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} ${isRtl ? 'text-base' : 'text-[10px]'}`}>{content.followUs}</h2>
            <div className={`h-px flex-1 ml-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-300'}`} />
          </div>
          <div className="flex justify-between gap-3">
            {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
              <motion.button
                key={platform}
                onClick={() => { openLink(url); showToast('Opening social'); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 flex justify-center py-5 rounded-3xl border transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-md ${isDarkMode ? 'bg-slate-900/60 border-slate-800/50 text-blue-400' : 'bg-white/70 border-white/50 text-[#2E3192]'}`}
              >
                {platform === 'facebook' && <Facebook size={24} />}
                {platform === 'linkedin' && <Linkedin size={24} />}
                {platform === 'twitter' && <Twitter size={24} />}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between px-3 mb-6">
            <h2 className={`font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} ${isRtl ? 'text-base' : 'text-[10px]'}`}>{content.globalHubs}</h2>
            <div className={`h-px flex-1 ml-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-300'}`} />
          </div>
          <div className="space-y-4">
            {[
              { title: content.karachiOffice, subtitle: content.karachiAddr, url: KARACHI_LOCATION },
              { title: content.lahoreOffice, subtitle: content.lahoreAddr, url: LAHORE_LOCATION }
            ].map((loc, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                onClick={() => { openLink(loc.url); showToast('Opening map'); }}
                className={`w-full flex items-center p-6 rounded-3xl shadow-lg border transition-all duration-300 transform hover:scale-[1.02] group text-left backdrop-blur-md ${isDarkMode ? 'bg-slate-900/60 border-slate-800/50' : 'bg-white/70 border-white/50'}`}
              >
                <div className={`p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 ${isDarkMode ? 'bg-slate-800 text-[#00A651] group-hover:bg-[#00A651] group-hover:text-white' : 'bg-green-50 text-[#00A651] group-hover:bg-[#00A651] group-hover:text-white'}`}>
                  <Navigation size={24} />
                </div>
                <div className={`ml-5 flex-1 ${isRtl ? 'rtl' : 'ltr'}`}>
                  <p className={`font-black text-[#00A651] uppercase tracking-[0.1em] mb-1 ${isRtl ? 'text-base' : 'text-[10px]'}`}>{loc.title}</p>
                  <p className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} ${isRtl ? 'text-sm' : 'text-xs'}`}>{loc.subtitle}</p>
                </div>
                <MapPin className="text-[#00A651] opacity-40 group-hover:opacity-100" size={24} />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center opacity-80">
          <button onClick={() => setShowQR(!showQR)} className={`uppercase tracking-[0.3em] flex items-center mx-auto space-x-3 mb-6 group ${isRtl ? 'text-lg' : 'text-[10px] font-black'}`}>
            <QrCode size={18} className="group-hover:rotate-12 transition-transform" /> <span>{content.showQr}</span>
          </button>
          <p className={`font-black uppercase tracking-[0.5em] mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'} ${isRtl ? 'text-lg' : 'text-[10px]'}`}>{content.footerNote}</p>
          <p className={`font-medium uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-600'} ${isRtl ? 'text-sm' : 'text-[8px]'}`}>© {new Date().getFullYear()} PKG INTERNATIONAL PROJECTS & LOGISTICS CORPORATION LTD.</p>
        </div>

        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            >
              <motion.div
                drag="y"
                dragConstraints={{ top: -10, bottom: 300 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 120) setShowQR(false);
                }}
                initial={{ y: 80, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 80, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className={`p-10 rounded-[4rem] shadow-2xl relative max-w-xs w-full text-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
              >
                <button onClick={() => setShowQR(false)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800"><X size={20} /></button>
                <div className="p-4 bg-white rounded-[2.5rem] inline-block shadow-inner border">
                  <QRCodeSVG value={currentUrl} size={200} fgColor="#2E3192" />
                </div>
                <p className={`mt-8 font-black uppercase tracking-widest ${isRtl ? 'text-base font-urdu' : 'text-[10px]'}`}>Digital Hub Access</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Snackbar text={snackText} open={snackOpen} onClose={() => setSnackOpen(false)} />
    </div>
  );
};

export default App;
