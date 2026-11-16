/**
 * Root React Application: The Romantic Proposal Quest
 * Built with React 18 + Native Element Builder
 * Updated: 4-Step Questline (Trial 3: Scripture, Trial 4: Proposal Altar)
 */

(function () {
  const { useState, useEffect } = React;
  const h = window.h;

  const DEFAULT_CONFIG = {
    girlName: "My Darnzzzz",
    boyName: "Your Future Hubby",
    subtitle: "A special fairytale quest made with all my heart! Guide our loyal companions Qoobee 🐲 and Pengu 🐧 through the trials to reach the altar!",
    caption: "You & Me, Hand in Hand, Forever & Always 💕",
    letterP1: "From the very first day you entered my life, my world was transformed. Everything became warmer, brighter, and full of purpose. You bring out the purest smile on my face, the happiest laughs, and a peace in my soul that I never knew existed.",
    letterP2: "Asking you to be my wife is the easiest, most confident decision of my entire life. I promise to hold your hand through every chapter, cook your favorite comfort foods, cuddle you tightly when it's chilly, and love you endlessly every single day.",
    letterP3: "Thank you for being my dream girl, my sweetheart, and my forever home. I cannot wait to marry you and spend the rest of our lives making beautiful memories together."
  };

  const DEFAULT_COUPLE_PHOTO = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=700&q=80";

  function App() {
    // Progression State (4 Steps)
    const [unlockedLevel, setUnlockedLevel] = useState(() => Math.min(4, parseInt(localStorage.getItem('quest_unlocked_level') || '1', 10)));
    const [currentTrial, setCurrentTrial] = useState(() => Math.min(4, parseInt(localStorage.getItem('quest_unlocked_level') || '1', 10)));
    const [gameWon, setGameWon] = useState(() => localStorage.getItem('quest_game_won') === 'true');

    // Modals
    const [showEndingModal, setShowEndingModal] = useState(false);
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Configuration
    const [config, setConfig] = useState(() => ({
      girlName: localStorage.getItem('love_girlName') || DEFAULT_CONFIG.girlName,
      boyName: localStorage.getItem('love_boyName') || DEFAULT_CONFIG.boyName,
      subtitle: localStorage.getItem('love_subtitle') || DEFAULT_CONFIG.subtitle,
      caption: localStorage.getItem('love_caption') || DEFAULT_CONFIG.caption,
      letterP1: localStorage.getItem('love_letterP1') || DEFAULT_CONFIG.letterP1,
      letterP2: localStorage.getItem('love_letterP2') || DEFAULT_CONFIG.letterP2,
      letterP3: localStorage.getItem('love_letterP3') || DEFAULT_CONFIG.letterP3
    }));

    const [couplePhoto, setCouplePhoto] = useState(() => localStorage.getItem('love_couplePhoto') || DEFAULT_COUPLE_PHOTO);
    const [companionMessage, setCompanionMessage] = useState("Qoobee is hungry! Catch treats (1-5 pts) to reach 35 points in 15s and dodge the bombs! 🍓💣");

    const levelTitles = {
      1: "Heart Apprentice 🍓",
      2: "Memory Keeper 🐧",
      3: "Scripture Devotee ✝️",
      4: "Forever Wife 💍"
    };

    const isStepLocked = (step) => step > unlockedLevel;
    const isStepCompleted = (step) => (step < unlockedLevel) || (step === 4 && gameWon);
    const getTrialIcon = (step) => ['🍓', '🐧', '✝️', '💍'][step - 1];
    const getTrialName = (step) => ['1. Qoobee', '2. Pengu', '3. Scripture', '4. Altar'][step - 1];

    const selectTrial = (step) => {
      if (isStepLocked(step)) {
        if (window.cuteAudio) window.cuteAudio.playOops();
        setCompanionMessage(`Qoobee blocks the path: "Trial ${step} is LOCKED! You must first finish Trial ${step - 1}, Princess!"`);
        return;
      }
      if (window.cuteAudio) window.cuteAudio.playPop();
      setCurrentTrial(step);
      updateCompanionSpeech(step);
    };

    const proceedToTrial = (step) => {
      if (!isStepLocked(step)) {
        setCurrentTrial(step);
        updateCompanionSpeech(step);
        if (window.cuteAudio) window.cuteAudio.playPop();
      }
    };

    const handleTrialComplete = (clearedStep) => {
      if (unlockedLevel <= clearedStep) {
        const nextLvl = Math.min(4, clearedStep + 1);
        setUnlockedLevel(nextLvl);
        localStorage.setItem('quest_unlocked_level', nextLvl);
        triggerConfetti();
        if (window.cuteAudio) window.cuteAudio.playFanfare();
      }
    };

    const updateCompanionSpeech = (step) => {
      const msgs = {
        1: "Qoobee is hungry! Catch treats (1-5 pts) to reach 35 points in 15s while dodging bombs! 🍓💣",
        2: "Pengu waddles over: 'Match all 4 cute pairs to melt my heart!' 🐧",
        3: "Qoobee & Pengu: 'Complete God\'s holy words of love to open the sacred altar!' ✝️",
        4: "Qoobee & Pengu crying happy tears: 'LOOK AT HIM ON BENDED KNEE! THIS IS IT! SAY YES!' 💍👰"
      };
      if (msgs[step]) setCompanionMessage(msgs[step]);
    };

    const handleProposalYes = () => {
      setGameWon(true);
      localStorage.setItem('quest_game_won', 'true');
      if (window.cuteAudio) window.cuteAudio.playLoveSparkle();
      triggerConfetti();

      setCompanionMessage("SHE SAID YES! Qoobee and Pengu are throwing heart fireworks!");

      setTimeout(() => {
        setShowEndingModal(true);
      }, 1300);
    };

    const handleUploadPhoto = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          setCouplePhoto(base64);
          try {
            localStorage.setItem('love_couplePhoto', base64);
          } catch (err) { }
          triggerConfetti();
          if (window.cuteAudio) window.cuteAudio.playMatch();
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSaveConfig = (newForm) => {
      setConfig(prev => ({ ...prev, ...newForm }));
      localStorage.setItem('love_girlName', newForm.girlName);
      localStorage.setItem('love_boyName', newForm.boyName);
      localStorage.setItem('love_caption', newForm.caption);
      localStorage.setItem('love_letterP2', newForm.letterP2);

      setShowCustomizeModal(false);
      if (window.cuteAudio) window.cuteAudio.playMatch();
      triggerConfetti();
    };

    const handleResetDefaults = () => {
      if (confirm("Reset everything back to default quest settings?")) {
        localStorage.clear();
        setUnlockedLevel(1);
        setCurrentTrial(1);
        setGameWon(false);
        setConfig(DEFAULT_CONFIG);
        setCouplePhoto(DEFAULT_COUPLE_PHOTO);
        setShowCustomizeModal(false);
        if (window.cuteAudio) window.cuteAudio.playPop();
      }
    };

    const toggleSound = () => {
      if (window.cuteAudio) {
        const muted = window.cuteAudio.toggleMute();
        setIsMuted(muted);
        if (!muted) window.cuteAudio.playPop();
      }
    };

    useEffect(() => {
      initCanvasParticles();
    }, []);

    const completionPct = Math.round(((gameWon ? 4 : unlockedLevel - 1) / 4) * 100);

    return h('div', { className: 'max-w-3xl mx-auto px-4 py-4 sm:py-6 relative z-10' },

      // Top HUD Header
      h('header', { className: 'app-header flex items-center justify-between bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-rose-100 shadow-sm mb-4' },
        h('div', { className: 'flex items-center gap-2' },
          h('img', { src: 'assets/qoobee.jpg', alt: 'Qoobee', className: 'w-6 h-6 rounded-full object-cover border border-amber-300 shadow-xs' }),
          h('img', { src: 'assets/pengu.png', alt: 'Pengu', className: 'w-6 h-6 rounded-full object-cover border border-pink-300 shadow-xs' }),
          h('span', { className: 'text-xs sm:text-sm font-extrabold text-rose-600' },
            `Level ${unlockedLevel}/4: `,
            h('span', { className: 'text-gray-600 font-bold' }, levelTitles[unlockedLevel] || 'Hero')
          )
        ),
        h('div', { className: 'flex items-center gap-2' },
          h('a', {
            href: 'intro.html',
            className: 'px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-full text-xs font-bold transition flex items-center gap-1',
            title: 'Back to Intro'
          }, 'Intro Letter'),
          h('button', {
            onClick: toggleSound,
            className: 'px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full text-xs font-bold transition'
          }, isMuted ? '🔇' : '🔊'),
          h('button', {
            onClick: () => setShowCustomizeModal(true),
            className: 'px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold shadow-sm transition'
          }, 'Customize')
        )
      ),

      // Main Quest Hero Card
      h('div', { className: 'bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-rose-100 text-center mb-4' },
        h('span', { className: 'inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 mb-2' },
          'An Epic Proposal Quest'
        ),
        h('h1', { className: 'text-2xl sm:text-3xl font-black text-gray-800 tracking-tight' },
          'Quest For My Queen: ',
          h('span', { className: 'font-hand text-3xl sm:text-4xl text-rose-500' }, config.girlName)
        ),
        h('p', { className: 'text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mt-1' }, config.subtitle),

        // Companion Banner with Real Stickers
        h('div', { className: 'mt-4 bg-amber-50/50 border border-amber-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 text-left' },
          h('div', { className: 'flex gap-2.5 shrink-0' },
            h('div', { className: 'w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-300 shadow-sm bg-white' },
              h('img', { src: 'assets/qoobee.jpg', alt: 'Qoobee', className: 'w-full h-full object-cover' })
            ),
            h('div', { className: 'w-12 h-12 rounded-xl overflow-hidden border-2 border-pink-300 shadow-sm bg-white' },
              h('img', { src: 'assets/pengu.png', alt: 'Pengu', className: 'w-full h-full object-cover' })
            )
          ),
          h('p', { className: 'text-xs sm:text-sm font-bold text-gray-700 italic text-center sm:text-left flex-1' },
            `"${companionMessage}"`
          )
        ),

        // Strict 4-Step Route Grid
        h('div', { className: 'mt-4 bg-rose-50/50 rounded-2xl p-3 border border-rose-100' },
          h('div', { className: 'flex justify-between items-center text-[11px] font-black text-gray-500 mb-2 px-1' },
            h('span', null, 'STRICT QUEST PROGRESSION:'),
            h('span', { className: 'text-rose-600' }, `${completionPct}% COMPLETED`)
          ),
          h('div', { className: 'grid grid-cols-4 gap-2' },
            [1, 2, 3, 4].map(step =>
              h('button', {
                key: step,
                onClick: () => selectTrial(step),
                className: `p-2.5 rounded-xl border flex flex-col items-center justify-center transition relative ${currentTrial === step
                    ? 'bg-rose-500 text-white shadow-sm border-rose-500'
                    : isStepCompleted(step)
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : isStepLocked(step)
                        ? 'opacity-40 bg-gray-50 border-gray-100 cursor-not-allowed text-gray-400'
                        : 'bg-white border-rose-100 text-gray-700 hover:border-rose-300'
                  }`
              },
                h('span', { className: 'absolute -top-1.5 -right-1 text-[10px]' },
                  isStepLocked(step) ? '🔒' : isStepCompleted(step) ? '✅' : '⭐'
                ),
                h('span', { className: 'text-lg sm:text-xl mb-0.5' }, getTrialIcon(step)),
                h('span', { className: 'text-[10px] sm:text-xs font-extrabold truncate w-full text-center' }, getTrialName(step))
              )
            )
          )
        )
      ),

      // Active Trial Content
      h('main', null,
        currentTrial === 1 && h(window.Trials.Trial1Catcher, {
          isCompleted: isStepCompleted(1),
          onComplete: () => handleTrialComplete(1),
          onProceed: () => proceedToTrial(2)
        }),
        currentTrial === 2 && h(window.Trials.Trial2Memory, {
          isCompleted: isStepCompleted(2),
          onComplete: () => handleTrialComplete(2),
          onProceed: () => proceedToTrial(3)
        }),
        currentTrial === 3 && h(window.Trials.Trial3Scripture, {
          isCompleted: isStepCompleted(3),
          onComplete: () => handleTrialComplete(3),
          onProceed: () => proceedToTrial(4)
        }),
        currentTrial === 4 && h(window.Trials.Trial4Proposal, {
          gameWon: gameWon,
          onProposalYes: handleProposalYes,
          onOpenEnding: () => setShowEndingModal(true)
        })
      ),

      // Grand Ending Modal
      h(window.Modals.EndingModal, {
        isOpen: gameWon && showEndingModal,
        onClose: () => setShowEndingModal(false),
        config: config,
        couplePhoto: couplePhoto,
        onUploadPhoto: handleUploadPhoto,
        onFireworks: triggerConfetti,
        onPrint: () => window.print()
      }),

      // Customize Modal
      h(window.Modals.CustomizeModal, {
        isOpen: showCustomizeModal,
        onClose: () => setShowCustomizeModal(false),
        config: config,
        onSave: handleSaveConfig,
        onReset: handleResetDefaults
      })
    );
  }

  // Floating background particles
  function initCanvasParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const symbols = ['❤', '✦', '✿'];

    for (let i = 0; i < 16; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 14 + Math.random() * 14,
        speedY: 0.3 + Math.random() * 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        color: Math.random() > 0.5 ? '#f43f75' : '#fb7199',
        opacity: 0.15 + Math.random() * 0.25,
        angle: Math.random() * 360,
        spin: (Math.random() - 0.5) * 0.8
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.angle += p.spin;

        if (p.y < -30) { p.y = height + 30; p.x = Math.random() * width; }
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      });
      requestAnimationFrame(render);
    }
    render();
  }

  function triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f75', '#facc15', '#fb7199', '#fecdd6']
      });
    }
  }

  function mount() {
    const rootEl = document.getElementById('root');
    if (!rootEl || !window.React || !window.ReactDOM) {
      setTimeout(mount, 50);
      return;
    }
    const root = ReactDOM.createRoot(rootEl);
    root.render(h(App));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
