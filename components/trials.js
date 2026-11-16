/**
 * React Trial Components for The Romantic Proposal Quest
 * Built with React 18 + Native Element Builder
 * Updated:
 * - Trial 1: 15s challenge, 1-5 points per treat, MORE BOMBS 💣 (-10 pts), target 35 points!
 * - Trial 2: Easy 4-pair (8 cards) memory match, strictly locked until Trial 1 is passed
 * - Trial 3: Bible Verses Memorization
 * - Trial 4: Proposal Altar with runaway "No" button & plot twist
 */

(function () {
  const { useState, useEffect, useRef } = React;
  const h = window.h;

  // ============================================================================
  // TRIAL 1: QOOBEE'S 15-SECOND BOMB DODGING CATCHER (1-5 PTS, MORE BOMBS!)
  // ============================================================================
  function Trial1Catcher({ isCompleted, onComplete, onProceed }) {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isPlaying, setIsPlaying] = useState(false);

    const targetScore = 35; // Target score with 1-5 pts per treat

    const gameState = useRef({
      basket: { x: 195, y: 295, width: 75, height: 35, speed: 9 },
      items: [],
      floatingTexts: [],
      animId: null,
      timerId: null,
      spawnId: null
    });

    const startGame = () => {
      setScore(0);
      setTimeLeft(15);
      setIsPlaying(true);
      if (window.cuteAudio) window.cuteAudio.playPop();

      const gs = gameState.current;
      gs.items = [];
      gs.floatingTexts = [];
      clearInterval(gs.timerId);
      clearInterval(gs.spawnId);
      cancelAnimationFrame(gs.animId);

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Fast spawner loop (220ms) with MORE BOMBS (35-40% bomb chance!)
      gs.spawnId = setInterval(() => {
        const isBombSpawn = Math.random() < 0.38; // ~38% chance of Bomb!
        if (isBombSpawn) {
          gs.items.push({
            x: 25 + Math.random() * (canvas.width - 50),
            y: -20,
            emoji: '💣',
            pts: -10,
            speed: 4.8 + Math.random() * 0.8,
            size: 30,
            isBomb: true
          });
        } else {
          // Treats give between 1 and 5 points!
          const treats = [
            { emoji: '🍓', pts: 1, speed: 4.6, size: 26 },
            { emoji: '🌸', pts: 2, speed: 4.4, size: 26 },
            { emoji: '💖', pts: 3, speed: 4.8, size: 26 },
            { emoji: '💌', pts: 4, speed: 5.0, size: 28 },
            { emoji: '🧸', pts: 5, speed: 5.2, size: 30 }
          ];
          const t = treats[Math.floor(Math.random() * treats.length)];
          gs.items.push({
            x: 25 + Math.random() * (canvas.width - 50),
            y: -20,
            ...t
          });
        }
      }, 230);

      gs.timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      runLoop();
    };

    const endGame = () => {
      const gs = gameState.current;
      setIsPlaying(false);
      clearInterval(gs.timerId);
      clearInterval(gs.spawnId);
      cancelAnimationFrame(gs.animId);

      setScore(curScore => {
        if (curScore >= targetScore) {
          onComplete(1);
        }
        return curScore;
      });
    };

    const runLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const gs = gameState.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw basket
      ctx.fillStyle = '#f43f75';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(gs.basket.x, gs.basket.y, gs.basket.width, gs.basket.height, 10);
      } else {
        ctx.rect(gs.basket.x, gs.basket.y, gs.basket.width, gs.basket.height);
      }
      ctx.fill();
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧺', gs.basket.x + gs.basket.width / 2, gs.basket.y + 24);

      // Draw items
      for (let i = gs.items.length - 1; i >= 0; i--) {
        const it = gs.items[i];
        it.y += it.speed;

        ctx.font = `${it.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(it.emoji, it.x, it.y);

        // Catch detection
        if (
          it.y >= gs.basket.y &&
          it.y <= gs.basket.y + gs.basket.height + 10 &&
          it.x >= gs.basket.x - 10 &&
          it.x <= gs.basket.x + gs.basket.width + 10
        ) {
          if (it.isBomb) {
            if (window.cuteAudio) window.cuteAudio.playOops();
            setScore(s => Math.max(0, s + it.pts));
            gs.floatingTexts.push({ x: it.x, y: gs.basket.y - 10, text: '-10 BOMB! 💥', color: '#ef4444', alpha: 1 });
          } else {
            if (window.cuteAudio) window.cuteAudio.playCatch();
            setScore(s => s + it.pts);
            gs.floatingTexts.push({ x: it.x, y: gs.basket.y - 10, text: `+${it.pts}!`, color: '#f43f75', alpha: 1 });
          }
          gs.items.splice(i, 1);
          continue;
        }

        if (it.y > canvas.height + 30) {
          gs.items.splice(i, 1);
        }
      }

      // Floating text scores
      for (let i = gs.floatingTexts.length - 1; i >= 0; i--) {
        const ft = gs.floatingTexts[i];
        ft.y -= 1.3;
        ft.alpha -= 0.035;
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
        if (ft.alpha <= 0) gs.floatingTexts.splice(i, 1);
      }

      gs.animId = requestAnimationFrame(runLoop);
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const handleMove = (clientX) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const canvasX = (clientX - rect.left) * scaleX;
        gameState.current.basket.x = Math.max(0, Math.min(canvas.width - gameState.current.basket.width, canvasX - gameState.current.basket.width / 2));
      };

      const onPointerMove = (e) => handleMove(e.clientX);
      const onPointerDown = (e) => handleMove(e.clientX);

      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerdown', onPointerDown);

      return () => {
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerdown', onPointerDown);
        clearInterval(gameState.current.timerId);
        clearInterval(gameState.current.spawnId);
        cancelAnimationFrame(gameState.current.animId);
      };
    }, []);

    return h('div', { className: 'bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-rose-100 text-center animate-fade-in' },
      h('div', { className: 'w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-amber-200 shadow-sm bg-amber-50 mb-3' },
        h('img', { src: 'assets/qoobee.jpg', alt: 'Qoobee', className: 'w-full h-full object-cover' })
      ),
      h('span', { className: 'inline-block px-3 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 uppercase mb-1' },
        'Trial I: 15-Second Rush'
      ),
      h('h2', { className: 'text-xl font-black text-gray-800' }, 'Qoobee\'s Sweet Treat Feast'),
      h('p', { className: 'text-xs text-gray-500 max-w-md mx-auto mt-1' },
        'Catch treats (1 to 5 points each) to score ',
        h('strong', null, '35 points'),
        ' in ',
        h('strong', null, '15 seconds'),
        '! WATCH OUT FOR FREQUENT BOMBS 💣 (-10 pts)!'
      ),

      h('div', { className: 'flex justify-center gap-4 my-3 text-xs font-extrabold' },
        h('span', { className: 'px-3 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-100' },
          'Score: ', h('strong', { className: 'text-sm' }, score), ' / 35'
        ),
        h('span', { className: 'px-3 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-100' },
          'Time: ', timeLeft, 's'
        )
      ),

      h('div', { className: 'catcher-stage relative w-full max-w-[460px] mx-auto rounded-2xl overflow-hidden border border-rose-200 bg-gradient-to-b from-rose-50 to-pink-50 shadow-inner' },
        h('canvas', { ref: canvasRef, width: 460, height: 340, className: 'catcher-canvas w-full h-full block' }),
        !isPlaying && h('div', { className: 'absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-4' },
          h('div', { className: 'w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-200 shadow-sm bg-amber-50 mb-2' },
            h('img', { src: 'assets/qoobee.jpg', alt: 'Qoobee', className: 'w-full h-full object-cover' })
          ),
          h('h3', { className: 'text-base font-black text-gray-800' },
            isCompleted ? 'Trial I Cleared!' : 'Ready to Dodge the Bombs?'
          ),
          h('p', { className: 'text-xs text-gray-500 mt-1 max-w-xs mb-3' },
            isCompleted ? 'You cleared Trial 1! Proceed to Trial 2 or replay for fun.' : 'Score 35 points in 15 seconds while dodging frequent bombs to unlock Trial 2!'
          ),
          h('button', {
            onClick: startGame,
            className: 'px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md transition'
          }, isCompleted ? 'Play Again' : 'Start Trial 1 (15s)')
        )
      ),

      isCompleted && h('div', { className: 'mt-4' },
        h('button', {
          onClick: onProceed,
          className: 'px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md transition hover:scale-105'
        }, 'Proceed to Trial II: Pengu\'s Match ➔')
      )
    );
  }

  // ============================================================================
  // TRIAL 2: PENGU'S EASY 4-PAIR (8 CARDS) MEMORY MATCH
  // ============================================================================
  function Trial2Memory({ isCompleted, onComplete, onProceed }) {
    // Easy: 4 cute pairs (8 cards total)!
    const MEMORY_ITEMS = [
      { emoji: '🐧', compliment: "You are the sweetest soul in his universe!" },
      { emoji: '🐲', compliment: "Qoobee gives you a big warm cuddle!" },
      { emoji: '🍓', compliment: "Sweet strawberries for the sweetest girl!" },
      { emoji: '💍', compliment: "A sparkling ring is waiting for you!" }
    ];

    const [deck, setDeck] = useState([]);
    const [pairs, setPairs] = useState(0);
    const [moves, setMoves] = useState(0);
    const [compliment, setCompliment] = useState("Find the 4 matching pairs!");
    const [flipped, setFlipped] = useState([]);
    const [isLocked, setIsLocked] = useState(false);

    const resetGame = () => {
      setPairs(0);
      setMoves(0);
      setCompliment("Find the 4 matching pairs!");
      setFlipped([]);
      setIsLocked(false);

      const full = [...MEMORY_ITEMS, ...MEMORY_ITEMS]
        .sort(() => Math.random() - 0.5)
        .map((it, idx) => ({ id: idx, emoji: it.emoji, compliment: it.compliment, isFlipped: false, isMatched: false }));
      setDeck(full);
    };

    useEffect(() => {
      resetGame();
    }, []);

    const handleCardClick = (idx) => {
      if (isLocked) return;
      const card = deck[idx];
      if (card.isFlipped || card.isMatched) return;

      if (window.cuteAudio) window.cuteAudio.playFlip();

      const newDeck = [...deck];
      newDeck[idx].isFlipped = true;
      setDeck(newDeck);

      const newFlipped = [...flipped, idx];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves(m => m + 1);
        setIsLocked(true);
        const [i1, i2] = newFlipped;
        const c1 = newDeck[i1];
        const c2 = newDeck[i2];

        if (c1.emoji === c2.emoji) {
          setTimeout(() => {
            if (window.cuteAudio) window.cuteAudio.playMatch();
            newDeck[i1].isMatched = true;
            newDeck[i2].isMatched = true;
            setDeck(newDeck);
            setPairs(p => {
              const nextP = p + 1;
              if (nextP === 4) {
                onComplete(2);
              }
              return nextP;
            });
            setCompliment(c1.compliment);
            setFlipped([]);
            setIsLocked(false);
          }, 350);
        } else {
          setTimeout(() => {
            newDeck[i1].isFlipped = false;
            newDeck[i2].isFlipped = false;
            setDeck(newDeck);
            setFlipped([]);
            setIsLocked(false);
          }, 700);
        }
      }
    };

    return h('div', { className: 'bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-rose-100 text-center animate-fade-in' },
      h('div', { className: 'w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-pink-200 shadow-sm bg-pink-50 mb-3' },
        h('img', { src: 'assets/pengu.png', alt: 'Pengu', className: 'w-full h-full object-cover' })
      ),
      h('span', { className: 'inline-block px-3 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 uppercase mb-1' },
        'Trial II: Pengu\'s Sweet Match'
      ),
      h('h2', { className: 'text-xl font-black text-gray-800' }, 'Pengu\'s Memory Match'),
      h('p', { className: 'text-xs text-gray-500 max-w-md mx-auto mt-1' },
        'An easy, sweet trial! Match all ',
        h('strong', null, '4 pairs (8 cards)'),
        ' to clear Pengu\'s challenge!'
      ),

      h('div', { className: 'flex justify-center items-center gap-3 my-3 text-xs font-extrabold' },
        h('span', { className: 'px-3 py-1 bg-rose-50 text-rose-600 rounded-full border border-rose-100' },
          'Pairs: ', h('strong', { className: 'text-sm' }, pairs), ' / 4'
        ),
        h('span', { className: 'px-3 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-100' },
          'Moves: ', moves
        ),
        h('button', {
          onClick: resetGame,
          className: 'px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-[11px] text-gray-700 transition'
        }, '🔄 Shuffle')
      ),

      h('div', { className: 'font-hand text-base sm:text-lg font-bold text-rose-600 min-h-[30px] bg-rose-50/60 py-1 px-3 rounded-lg max-w-sm mx-auto mb-4 border border-rose-100' },
        `"${compliment}"`
      ),

      // Easy 2x4 Grid (8 Cards)
      h('div', { className: 'grid grid-cols-4 gap-3 max-w-[320px] mx-auto' },
        deck.map((card, idx) =>
          h('button', {
            key: idx,
            onClick: () => handleCardClick(idx),
            className: `aspect-square rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all duration-300 border ${card.isFlipped || card.isMatched
              ? 'bg-white border-rose-300 scale-95'
              : 'bg-rose-500 hover:bg-rose-600 border-rose-400 text-white'
              }`
          }, card.isFlipped || card.isMatched ? card.emoji : '🐧')
        )
      ),

      isCompleted && h('div', { className: 'mt-4' },
        h('button', {
          onClick: onProceed,
          className: 'px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md transition hover:scale-105'
        }, 'Proceed to Trial III: Sacred Scriptures ➔')
      )
    );
  }

  // ============================================================================
  // TRIAL 3: BIBLE VERSES MEMORIZATION
  // ============================================================================
  function Trial3Scripture({ isCompleted, onComplete, onProceed }) {
    const BIBLE_VERSES = [
      {
        ref: "1 Corinthians 13:4",
        textBefore: "Love is patient, love is ",
        blank: "kind",
        textAfter: ". It does not envy, it does not boast, it is not proud.",
        fullVerse: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
        options: ["kind", "fast", "loud", "proud"]
      },
      {
        ref: "1 John 4:19",
        textBefore: "We love because He ",
        blank: "first",
        textAfter: " loved us.",
        fullVerse: "We love because He first loved us.",
        options: ["first", "always", "also", "never"]
      },
      {
        ref: "Ecclesiastes 4:12",
        textBefore: "Though one may be overpowered, two can defend themselves. A cord of ",
        blank: "three",
        textAfter: " strands is not quickly broken.",
        fullVerse: "Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.",
        options: ["three", "two", "four", "many"]
      },
      {
        ref: "Song of Solomon 3:4",
        textBefore: "I have found the one whom my soul ",
        blank: "loves",
        textAfter: ".",
        fullVerse: "I have found the one whom my soul loves.",
        options: ["loves", "seeks", "admires", "praises"]
      }
    ];

    const [verseIndex, setVerseIndex] = useState(0);
    const [selectedWord, setSelectedWord] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [feedback, setFeedback] = useState("");

    const currentVerse = BIBLE_VERSES[verseIndex];

    const handleSelectWord = (word) => {
      setSelectedWord(word);
      if (word.toLowerCase() === currentVerse.blank.toLowerCase()) {
        setIsCorrect(true);
        if (window.cuteAudio) window.cuteAudio.playMatch();
        setFeedback(`Amen! "${currentVerse.fullVerse}"`);

        setTimeout(() => {
          if (verseIndex < BIBLE_VERSES.length - 1) {
            setVerseIndex(v => v + 1);
            setSelectedWord(null);
            setIsCorrect(null);
            setFeedback("");
          } else {
            setFeedback("All 4 Sacred Scriptures Completed! The Proposal Altar is Unlocked!");
            onComplete(3);
          }
        }, 1400);
      } else {
        setIsCorrect(false);
        if (window.cuteAudio) window.cuteAudio.playOops();
        setFeedback("Not quite, try again!");
      }
    };

    return h('div', { className: 'bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-rose-100 text-center animate-fade-in' },
      h('div', { className: 'flex justify-center gap-3 mb-3' },
        h('div', { className: 'w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-200 shadow-sm bg-white' },
          h('img', { src: 'assets/qoobee.jpg', alt: 'Qoobee', className: 'w-full h-full object-cover' })
        ),
        h('div', { className: 'w-12 h-12 rounded-xl overflow-hidden border-2 border-pink-200 shadow-sm bg-white' },
          h('img', { src: 'assets/pengu.png', alt: 'Pengu', className: 'w-full h-full object-cover' })
        )
      ),

      h('span', { className: 'inline-block px-3 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 uppercase mb-1' },
        'Trial III: Bible Verses Memorization'
      ),
      h('h2', { className: 'text-xl font-black text-gray-800' }, 'The Sacred Scripture Trial'),
      h('p', { className: 'text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4' },
        'Complete the sacred verse by tapping the missing word from God\'s Word.'
      ),

      // Verse Card
      h('div', { className: 'max-w-md mx-auto bg-amber-50/50 p-5 rounded-2xl border border-amber-200 text-left shadow-inner' },
        h('div', { className: 'flex justify-between items-center text-[11px] font-black text-amber-700 uppercase mb-2' },
          h('span', null, currentVerse.ref),
          h('span', null, `Verse ${verseIndex + 1} of ${BIBLE_VERSES.length}`)
        ),

        h('div', { className: 'w-full bg-white h-1.5 rounded-full overflow-hidden mb-4 border border-amber-200' },
          h('div', {
            className: 'bg-amber-500 h-full transition-all duration-300',
            style: { width: `${((verseIndex + 1) / BIBLE_VERSES.length) * 100}%` }
          })
        ),

        // Display Verse with blank
        h('p', { className: 'text-sm sm:text-base font-extrabold text-gray-800 leading-relaxed mb-4' },
          `"${currentVerse.textBefore}`,
          h('span', {
            className: `inline-block px-2.5 py-0.5 mx-1 rounded border-b-2 font-black transition-all ${selectedWord
              ? isCorrect
                ? 'bg-emerald-100 text-emerald-700 border-emerald-500'
                : 'bg-red-100 text-red-600 border-red-500'
              : 'bg-white text-rose-500 border-dashed border-rose-400'
              }`
          }, selectedWord ? selectedWord : '______'),
          `${currentVerse.textAfter}"`
        ),

        // Multiple Choice Options
        h('div', { className: 'grid grid-cols-2 gap-2 mt-2' },
          currentVerse.options.map((word, wIdx) =>
            h('button', {
              key: wIdx,
              onClick: () => handleSelectWord(word),
              disabled: isCorrect === true,
              className: `p-2.5 rounded-xl text-xs font-black border transition flex items-center justify-between ${selectedWord === word
                ? isCorrect
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-red-100 text-red-600 border-red-300'
                : 'bg-white border-amber-200 text-gray-700 hover:border-amber-400 hover:bg-amber-100/50'
                }`
            },
              h('span', null, word),
              h('span', { className: 'text-amber-500 text-xs' }, '✝')
            )
          )
        ),

        feedback && h('div', {
          className: `mt-3 p-2 rounded-xl text-center text-xs font-bold ${isCorrect ? 'bg-white text-emerald-700 border border-emerald-200' : 'bg-white text-red-500 border border-red-200'
            }`
        }, feedback)
      ),

      isCompleted && h('div', { className: 'mt-4' },
        h('button', {
          onClick: onProceed,
          className: 'px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition hover:scale-105'
        }, 'Enter The Final Altar: The Proposal ➔')
      )
    );
  }

  // ============================================================================
  // TRIAL 4: THE FINAL BOSS PROPOSAL ("WILL YOU BE MY WIFE?")
  // ============================================================================
  function Trial4Proposal({ gameWon, onProposalYes, onOpenEnding }) {
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [feedback, setFeedback] = useState("(P.S. Look closely at the No button... it has a mind of its own! 😉)");
    const dodgeCount = useRef(0);
    const noBtnRef = useRef(null);

    const PHRASES = [
      "Plot twist: That button is broken! 🏃‍♂️💨",
      "Wait... Qoobee ate the 'No' button! 🐲",
      "Pengu is crying! Don't click that! 🐧😭",
      "Error 404: 'No' does not exist in our universe!",
      "You're stuck with me forever, baby! 🥰",
      "The mouse refuses to disobey true love! 😂",
      "Plot twist: Clicking No actually means YES! 😉",
      "Nice try cutie, but your destiny is sealed! 💍"
    ];

    const dodgeNo = () => {
      dodgeCount.current++;
      if (window.cuteAudio) window.cuteAudio.playOops();

      const button = noBtnRef.current;
      const bounds = button && button.parentElement.getBoundingClientRect();
      const rect = button && button.getBoundingClientRect();
      const baseLeft = rect && rect.left - pos.x;
      const baseTop = rect && rect.top - pos.y;
      const minX = bounds && rect ? Math.max(-100, bounds.left + 8 - baseLeft) : -100;
      const maxX = bounds && rect ? Math.min(100, bounds.right - 8 - rect.width - baseLeft) : 100;
      const minY = bounds && rect ? Math.max(-35, bounds.top + 8 - baseTop) : -35;
      const maxY = bounds && rect ? Math.min(35, bounds.bottom - 8 - rect.height - baseTop) : 35;
      const rx = minX <= maxX ? minX + Math.random() * (maxX - minX) : 0;
      const ry = minY <= maxY ? minY + Math.random() * (maxY - minY) : 0;
      setPos({ x: rx, y: ry });
      setScale(s => Math.min(1.8, s + 0.12));
      setFeedback(PHRASES[dodgeCount.current % PHRASES.length]);
    };

    useEffect(() => {
      const handleGlobalMove = (e) => {
        if (gameWon) return;
        const btn = noBtnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < 55) {
          dodgeNo();
        }
      };

      document.addEventListener('pointermove', handleGlobalMove);
      return () => document.removeEventListener('pointermove', handleGlobalMove);
    }, [gameWon, pos]);

    const handleNoClick = (e) => {
      e.preventDefault();
      setFeedback("✨ PLOT TWIST! In the language of true love, 'No' translates to: YES I WANT TO BE YOUR WIFE! 💍👰🎉");
      setTimeout(onProposalYes, 800);
    };

    return h('div', { className: 'bg-gradient-to-b from-white to-amber-50/30 rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-amber-200 text-center animate-fade-in' },
      h('span', { className: 'inline-block px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-700 uppercase mb-2' },
        '👑 FINAL CLIMAX: THE PROPOSAL OF A LIFETIME 💍'
      ),

      // Real Stickers Display
      h('div', { className: 'flex gap-3 justify-center my-3' },
        h('div', { className: 'w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-sm bg-white' },
          h('img', { src: 'assets/qoobee.jpg', alt: 'Qoobee', className: 'w-full h-full object-cover' })
        ),
        h('div', { className: 'w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-300 shadow-sm bg-white' },
          h('img', { src: 'assets/pengu.png', alt: 'Pengu', className: 'w-full h-full object-cover' })
        )
      ),

      h('h2', { className: 'text-2xl font-black text-gray-800' }, 'The Ultimate Question'),
      h('p', { className: 'text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5' },
        'Through every trial, sweet cuddle, and God\'s guidance... my heart has chosen you.'
      ),

      h('div', { className: 'bg-white p-4 sm:p-6 rounded-2xl border border-dashed border-rose-200 max-w-md mx-auto min-h-[240px] flex flex-col items-center justify-center' },
        h('h3', { className: 'text-lg sm:text-xl font-black text-rose-600 leading-snug mb-5' },
          'Will you do me the greatest honor of my life, and be my lovely wife forever? 💍👰💖'
        ),

        h('div', { className: 'proposal-actions relative min-h-[70px] flex flex-wrap items-center justify-center gap-3 w-full' },
          h('button', {
            onClick: onProposalYes,
            style: { transform: `scale(${scale})` },
            className: 'max-w-full px-5 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-black text-sm shadow-md transition-all duration-200 z-10 whitespace-normal'
          }, gameWon ? '💍 SHE SAID YES! FOREVER & ALWAYS! 💕' : 'YES! A THOUSAND TIMES YES! 💍👰✨'),

          !gameWon && h('button', {
            ref: noBtnRef,
            onMouseEnter: dodgeNo,
            onTouchStart: (e) => { e.preventDefault(); dodgeNo(); },
            onClick: handleNoClick,
            style: { position: 'relative', left: `${pos.x}px`, top: `${pos.y}px` },
            className: 'px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-gray-400 font-bold text-xs cursor-not-allowed transition-all duration-150 whitespace-nowrap'
          }, 'No 😢')
        ),

        h('div', { className: 'mt-4 font-hand text-base sm:text-lg font-bold text-rose-600 min-h-[26px]' }, feedback)
      ),

      gameWon && h('div', { className: 'mt-6' },
        h('button', {
          onClick: onOpenEnding,
          className: 'px-7 py-3 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-white font-black text-sm shadow-lg hover:scale-105 transition'
        }, 'OPEN MY LETTER FOR YOU, MY DARNZZZ 💌')
      )
    );
  }

  // Export
  window.Trials = {
    Trial1Catcher,
    Trial2Memory,
    Trial3Scripture,
    Trial4Proposal
  };
})();
