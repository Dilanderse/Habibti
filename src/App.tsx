import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, useScroll, useTransform, Variants, AnimatePresence } from 'motion/react';
import { CalendarHeart, MapPin, Clock, Video, Heart, Send, CalendarPlus, X, PhoneCall, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

// Apple-style smooth easing curve
const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)', 
    transition: { duration: 1.2, ease: appleEase } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
  }
};

const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.05, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { duration: 1.5, ease: appleEase } 
  }
};

export default function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [drinkChoice, setDrinkChoice] = useState('');
  const [guestType, setGuestType] = useState('solo');
  const [partnerName, setPartnerName] = useState('');
  const [partnerDrinkChoice, setPartnerDrinkChoice] = useState('');
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  
  // Parallax setup
  const { scrollYProgress } = useScroll();
  const yBgHero = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const yBgVideo = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  useEffect(() => {
    const targetDate = new Date('2026-03-08T16:00:00+02:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const modalElement = modalRef.current;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !modalElement) {
        return;
      }

      const focusableElements = modalElement.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousActiveElement?.focus();
    };
  }, [isModalOpen]);

  const jaelWhatsappNumber = '243832699494';
  const eventDateLabel = 'Dimanche 8 Mars 2026';
  const eventTimeLabel = '16h00 - 20h30';
  const eventLocationTitle = 'À la maison chez nous';
  const eventLocationReference = 'Référence: Bureau de River City sur Kiwele';
  const eventContactWhatsappNumber = '243812221562';
  const eventContactLabel = '+243812221562';
  const eventLocation = `${eventLocationTitle}. ${eventLocationReference}. Contact WhatsApp: ${eventContactLabel}`;
  const invitationPhoto = '/1.webp';
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Anniversaire+de+Mariage+Surprise&dates=20260308T140000Z/20260308T183000Z&details=Chut...+C'est+une+surprise+!&location=${encodeURIComponent(eventLocation)}&ctz=Africa%2FLubumbashi`;
  const whatsappVideoUrl = `https://wa.me/${jaelWhatsappNumber}?text=${encodeURIComponent("Bonjour Jael, je t'envoie ma vidéo pour la surprise.")}`;
  const locationWhatsappMessageUrl = `https://wa.me/${eventContactWhatsappNumber}?text=${encodeURIComponent(
    "Bonjour, je vous contacte pour avoir la localisation exacte de l'evenement.",
  )}`;
  const locationWhatsappCallUrl = `whatsapp://call?phone=${eventContactWhatsappNumber}`;

  const buildRsvpWhatsappMessage = () => {
    const messageLines = [
      'Bonjour Jael,',
      '',
      'Nouvelle confirmation de presence:',
      `- Nom: ${guestName.trim()}`,
      `- Presence: ${guestType === 'couple' ? 'En couple' : 'Seul(e)'}`,
      `- Boisson: ${drinkChoice}`,
    ];

    if (guestType === 'couple') {
      messageLines.push(
        `- Accompagnant(e): ${partnerName.trim()}`,
        `- Boisson accompagnant(e): ${partnerDrinkChoice}`,
      );
    }

    messageLines.push(
      '',
      "Details de l'evenement:",
      `- Date: ${eventDateLabel}`,
      `- Heure: ${eventTimeLabel}`,
      `- Lieu: ${eventLocation}`,
    );

    return messageLines.join('\n');
  };

  const handleRSVP = (e: FormEvent) => {
    e.preventDefault();

    const whatsappRsvpUrl = `https://wa.me/${jaelWhatsappNumber}?text=${encodeURIComponent(buildRsvpWhatsappMessage())}`;
    const whatsappWindow = window.open(whatsappRsvpUrl, '_blank', 'noopener,noreferrer');

    if (!whatsappWindow) {
      window.location.href = whatsappRsvpUrl;
    }

    setIsModalOpen(false);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#ffffff', '#8c7326']
    });
    setHasRSVPed(true);
  };

  const timelineEvents = [
    { year: '2006', title: 'Le Grand Oui', desc: 'Le début de cette belle aventure à deux.' },
    { year: '2007', title: 'La Famille s\'agrandit', desc: 'L\'arrivée du premier enfant, un nouveau chapitre.' },
    { year: '2024', title: 'L\'arrivée du dernier enfant', desc: 'Avec l\'arrivée de leur dernier enfant, leur amour rayonne désormais à travers 6 enfants.' },
    { year: '2026', title: 'Noces de Porcelaine', desc: '20 ans plus tard, l\'amour est toujours là, plus fort que jamais.' },
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#2a2a2a] selection:bg-[#d4af37] selection:text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0" 
          style={{ y: yBgHero }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: appleEase }}
        >
          <img
            src="https://picsum.photos/seed/romance/1920/1080?blur=2"
            alt="Background"
            className="w-full h-[120%] object-cover opacity-20 -mt-[10%]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/50 via-transparent to-[#fdfbf7] z-0"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={fadeUp} className="text-sm md:text-base tracking-[0.3em] uppercase mb-6 text-[#8c7326] font-medium">
              Chut... C'est une surprise !
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-serif text-6xl md:text-8xl lg:text-9xl mb-4 font-light leading-none">
              20 Ans
            </motion.h1>
            <motion.p variants={fadeUp} className="font-serif text-3xl md:text-5xl italic text-[#5a5a5a] mb-16">
              de Mariage
            </motion.p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex justify-center gap-4 md:gap-8 mb-12"
          >
            {[
              { label: 'Jours', value: timeLeft.days },
              { label: 'Heures', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Secondes', value: timeLeft.seconds },
            ].map((item, i) => (
              <motion.div variants={fadeUp} key={i} className="flex flex-col items-center">
                <span className="font-serif text-3xl md:text-5xl text-[#d4af37] mb-1 w-12 md:w-20">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs tracking-widest uppercase text-[#8c7326]">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '6rem' }}
            transition={{ duration: 1.5, delay: 1, ease: appleEase }}
            className="w-[1px] bg-[#d4af37] mx-auto"
          ></motion.div>
        </div>
      </section>

      {/* Invitation Note */}
      <section className="py-24 px-6 relative bg-[#fdfbf7]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeUp}>
              <Heart className="w-8 h-8 mx-auto text-[#d4af37] mb-8" strokeWidth={1} />
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-12">L'Invitation</motion.h2>

            <motion.div variants={imageReveal} className="mb-12 px-4">
              <img
                src={invitationPhoto}
                alt="Nos Parents"
                loading="lazy"
                decoding="async"
                className="w-full h-auto md:h-[450px] object-cover rounded-[2rem] shadow-2xl border-8 border-white mx-auto rotate-1 hover:rotate-0 transition-transform duration-500"
              />
            </motion.div>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl leading-relaxed font-light text-[#4a4a4a] mb-8">
              Il y a 20 ans, ils se disaient oui. Aujourd'hui, nous voulons les surprendre et célébrer ces deux décennies d'amour, de rires et de famille. 
            </motion.p>
            <motion.p variants={fadeUp} className="text-lg md:text-xl leading-relaxed font-light text-[#4a4a4a]">
              Mes frères et moi-même sommes ravis de vous convier à leur fête d'anniversaire de mariage surprise. Votre présence rendra cette soirée vraiment inoubliable pour eux.
            </motion.p>
            <motion.p variants={fadeUp} className="mt-12 font-serif text-2xl italic text-[#8c7326]">
              - Les Enfants
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 bg-[#fdfbf7]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-4">20 Ans d'Amour</motion.h2>
            <motion.p variants={fadeUp} className="tracking-widest uppercase text-sm text-[#8c7326]">Une histoire magnifique</motion.p>
          </motion.div>

          <div className="relative">
            {/* Vertical Line */}
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: '100%', opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2, ease: appleEase }}
              className="absolute left-1/2 transform -translate-x-1/2 w-[1px] bg-[#e8e2d2] hidden md:block"
            ></motion.div>

            <div className="space-y-16">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex flex-col md:flex-row items-center justify-between w-full ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="w-full md:w-5/12"></div>
                  
                  {/* Center Dot */}
                  <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#fdfbf7] border border-[#d4af37] shadow-sm my-4 md:my-0">
                    <div className="w-2 h-2 rounded-full bg-[#8c7326]"></div>
                  </div>

                  <div className={`w-full md:w-5/12 text-center ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <h3 className="font-serif text-4xl text-[#d4af37] mb-2">{event.year}</h3>
                    <h4 className="font-serif text-2xl mb-3">{event.title}</h4>
                    <p className="font-light text-[#5a5a5a]">{event.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 px-6 bg-[#f4f0e6]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-4">Les Détails</motion.h2>
            <motion.p variants={fadeUp} className="tracking-widest uppercase text-sm text-[#8c7326]">Noces de Porcelaine</motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          >
            <motion.div variants={fadeUp} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-[#d4af37] flex items-center justify-center mb-6">
                <CalendarHeart className="w-6 h-6 text-[#8c7326]" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl mb-3">La Date</h3>
              <p className="font-light text-[#5a5a5a]">Dimanche 8 Mars 2026</p>
              <p className="font-light text-[#5a5a5a] text-sm mt-2">Merci d'arriver à l'heure pour la surprise !</p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-[#d4af37] flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-[#8c7326]" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl mb-3">L'Heure</h3>
              <p className="font-light text-[#5a5a5a]">16h00 - 20h30</p>
              <p className="font-light text-[#5a5a5a] text-sm mt-2">Les parents arriveront vers 16h30.</p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-[#d4af37] flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-[#8c7326]" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl mb-3">Le Lieu</h3>
              <p className="font-light text-[#5a5a5a]">{eventLocationTitle}</p>
              <p className="font-light text-[#5a5a5a] text-sm mt-2">{eventLocationReference}</p>
              <p className="font-light text-[#5a5a5a] text-sm mt-2">
                Contact WhatsApp:{' '}
                <a
                  href={locationWhatsappMessageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[#d4af37] underline-offset-4 hover:text-[#8c7326] transition-colors"
                >
                  {eventContactLabel}
                </a>
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={locationWhatsappMessageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#d4af37] px-4 py-2 text-sm text-[#8c7326] hover:bg-[#d4af37] hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Envoyer un message
                </a>
                <a
                  href={locationWhatsappCallUrl}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d4af37] px-4 py-2 text-sm text-[#8c7326] hover:bg-[#d4af37] hover:text-white transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  Appeler sur WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Video Project Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-[#fdfbf7]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={imageReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative h-[600px] rounded-t-full overflow-hidden"
            >
              <motion.img
                style={{ y: yBgVideo }}
                src="/2.webp"
                alt="Vidéo dédicace"
                loading="lazy"
                decoding="async"
                className="absolute top-0 left-0 w-full h-[120%] object-cover -mt-[10%]"
              />
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:pl-8"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#d4af37] text-[#8c7326] text-sm uppercase tracking-wider mb-8">
                <Video className="w-4 h-4" />
                <span>Projet Secret</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-6">Une Vidéo Dédicace</motion.h2>
              <motion.p variants={fadeUp} className="text-lg font-light leading-relaxed text-[#4a4a4a] mb-6">
                Pour rendre cette surprise encore plus magnifique, nous préparons un montage vidéo qui sera diffusé lors de la soirée.
              </motion.p>
              <motion.p variants={fadeUp} className="text-lg font-light leading-relaxed text-[#4a4a4a] mb-8">
                Nous vous invitons à filmer un petit message avec votre téléphone (à l'horizontale !), une anecdote amusante ou vos vœux pour eux. 
              </motion.p>
              
              <motion.div variants={fadeUp} className="bg-[#f4f0e6] p-8 rounded-2xl border border-[#e8e2d2]">
                <h3 className="font-serif text-2xl mb-4">Comment participer ?</h3>
                <ul className="space-y-4 font-light text-[#5a5a5a]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#8c7326] font-medium shrink-0">1.</span>
                    <span>Filmez-vous dans un endroit lumineux.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8c7326] font-medium shrink-0">2.</span>
                    <span>Faites un message court (max 1 minute).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#8c7326] font-medium shrink-0">3.</span>
                    <span>Envoyez la vidéo à <strong className="text-[#2a2a2a] font-medium">Jael</strong> via WhatsApp ou par email avant le 5 Mars.</span>
                  </li>
                </ul>
                <a
                  href={whatsappVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 w-full bg-[#2a2a2a] text-white py-4 rounded-xl hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Envoyer ma vidéo à Jael
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-32 px-6 bg-[#2a2a2a] text-white text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-6xl mb-6">Serez-vous des nôtres ?</motion.h2>
            <motion.p variants={fadeUp} className="font-light text-gray-300 mb-12 text-lg">
              Merci de nous confirmer votre présence avant le Jeudi 5 Mars pour nous aider à organiser cette belle surprise.
            </motion.p>
            
            <motion.div variants={fadeUp}>
              {!hasRSVPed ? (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#d4af37] text-white px-12 py-5 rounded-full text-lg tracking-wider uppercase hover:bg-[#c4a030] transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                >
                  Je confirme ma présence
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, ease: appleEase }}
                  className="bg-white/10 border border-[#d4af37]/30 p-8 rounded-2xl backdrop-blur-sm"
                >
                  <Heart className="w-12 h-12 mx-auto text-[#d4af37] mb-4 fill-[#d4af37]" />
                  <h3 className="font-serif text-3xl mb-2 text-[#d4af37]">Merci !</h3>
                  <p className="font-light text-gray-300">
                    Nous avons hâte de célébrer ce moment avec vous.
                  </p>
                </motion.div>
              )}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex justify-center">
              <a 
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4af37] transition-colors border-b border-transparent hover:border-[#d4af37] pb-1"
              >
                <CalendarPlus className="w-4 h-4" />
                Ajouter au calendrier
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-12 text-sm text-gray-500 italic">
              N'oubliez pas, c'est un secret ! Ne leur en parlez surtout pas.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-[#8c7326] font-light bg-[#2a2a2a]">
        <p>Fait avec amour par les enfants.</p>
      </footer>

      {/* RSVP Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsModalOpen(false);
              }
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: appleEase }}
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="rsvp-modal-title"
              aria-describedby="rsvp-modal-description"
              className="bg-[#fdfbf7] text-[#2a2a2a] p-8 rounded-3xl max-w-md w-full relative shadow-2xl"
            >
              <button 
                type="button"
                ref={closeButtonRef}
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-[#2a2a2a] transition-colors"
                aria-label="Fermer la fenêtre de confirmation"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h3 id="rsvp-modal-title" className="font-serif text-3xl mb-2 text-[#d4af37]">Confirmation</h3>
              <p id="rsvp-modal-description" className="font-light text-[#5a5a5a] mb-8">Nous sommes ravis de vous compter parmi nous !</p>
              
              <div className="max-h-[65vh] overflow-y-auto pr-2 -mr-2">
                <form onSubmit={handleRSVP} className="space-y-6 text-left pb-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2a2a2a] mb-3">
                      Vous venez :
                    </label>
                    <div className="flex gap-4">
                      <label className="flex-1 flex items-center gap-3 p-3 rounded-xl border border-[#e8e2d2] bg-white cursor-pointer hover:border-[#d4af37] transition-colors">
                        <input type="radio" name="guestType" value="solo" checked={guestType === 'solo'} onChange={() => setGuestType('solo')} className="w-4 h-4 text-[#d4af37] focus:ring-[#d4af37]" />
                        <span className="font-light">Seul(e)</span>
                      </label>
                      <label className="flex-1 flex items-center gap-3 p-3 rounded-xl border border-[#e8e2d2] bg-white cursor-pointer hover:border-[#d4af37] transition-colors">
                        <input type="radio" name="guestType" value="couple" checked={guestType === 'couple'} onChange={() => setGuestType('couple')} className="w-4 h-4 text-[#d4af37] focus:ring-[#d4af37]" />
                        <span className="font-light">En couple</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#2a2a2a] mb-2">
                      {guestType === 'couple' ? 'Votre Prénom et Nom' : 'Prénom et Nom'}
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#e8e2d2] bg-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 transition-shadow"
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#2a2a2a] mb-3">
                      Que souhaitez-vous boire ?
                    </label>
                    <div className="space-y-3">
                      {['Bière', 'Boisson sucrée / Soda'].map((drink) => (
                        <label key={drink} className="flex items-center gap-3 p-3 rounded-xl border border-[#e8e2d2] bg-white cursor-pointer hover:border-[#d4af37] transition-colors">
                          <input 
                            type="radio" 
                            name="drink1" 
                            value={drink}
                            required
                            checked={drinkChoice === drink}
                            onChange={(e) => setDrinkChoice(e.target.value)}
                            className="w-4 h-4 text-[#d4af37] focus:ring-[#d4af37]"
                          />
                          <span className="font-light">{drink}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {guestType === 'couple' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className="space-y-6 pt-6 border-t border-[#e8e2d2]"
                    >
                      <div>
                        <label htmlFor="partnerName" className="block text-sm font-medium text-[#2a2a2a] mb-2">
                          Prénom et Nom de l'accompagnant(e)
                        </label>
                        <input 
                          type="text" 
                          id="partnerName" 
                          required
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-[#e8e2d2] bg-white focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50 transition-shadow"
                          placeholder="Ex: Marie Dupont"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2a2a2a] mb-3">
                          Que souhaite boire {partnerName || "l'accompagnant(e)"} ?
                        </label>
                        <div className="space-y-3">
                          {['Bière', 'Boisson sucrée / Soda'].map((drink) => (
                            <label key={`partner-${drink}`} className="flex items-center gap-3 p-3 rounded-xl border border-[#e8e2d2] bg-white cursor-pointer hover:border-[#d4af37] transition-colors">
                              <input 
                                type="radio" 
                                name="drink2" 
                                value={drink}
                                required
                                checked={partnerDrinkChoice === drink}
                                onChange={(e) => setPartnerDrinkChoice(e.target.value)}
                                className="w-4 h-4 text-[#d4af37] focus:ring-[#d4af37]"
                              />
                              <span className="font-light">{drink}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <button 
                    type="submit"
                    className="w-full bg-[#2a2a2a] text-white py-4 rounded-xl hover:bg-[#1a1a1a] transition-colors font-medium tracking-wide mt-4"
                  >
                    Valider ma présence
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
