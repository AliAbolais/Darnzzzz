/**
 * React Modals for The Romantic Proposal Quest
 * Built with React 18 + Native Element Builder (Zero Dependencies, Zero CORS)
 */

(function() {
  const { useState } = React;
  const h = window.h;

  // ============================================================================
  // GRAND ENDING MODAL: LOVE LETTER & POLAROID PHOTO
  // ============================================================================
  function EndingModal({ isOpen, onClose, config, couplePhoto, onUploadPhoto, onFireworks, onPrint }) {
    if (!isOpen) return null;

    return h('div', { className: 'modal-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in' },
      h('div', { className: 'ending-modal bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden' },
        
        h('button', {
          onClick: onClose,
          className: 'absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm transition'
        }, '✕'),

        h('div', { className: 'overflow-y-auto pr-1 space-y-5' },
          h('div', { className: 'text-center' },
            h('span', { className: 'inline-block px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 uppercase mb-1' },
              '👑 ETERNAL LOVE VOW 💍'
            ),
            h('h2', { className: 'text-2xl font-black text-rose-600' }, 'She Said YES! 💍🎉'),
            h('p', { className: 'text-xs font-bold text-gray-400' }, 'To My Future Wife, My Best Friend & Soulmate')
          ),

          // OUR POLAROID PICTURE
          h('div', { className: 'flex flex-col items-center' },
            h('div', { className: 'bg-white p-3 pb-5 rounded-md shadow-md border border-gray-200 max-w-[280px] w-full -rotate-1 hover:rotate-0 transition duration-300 text-center' },
              h('div', { className: 'aspect-[4/3] w-full bg-rose-50 rounded overflow-hidden' },
                h('img', { src: couplePhoto, alt: 'Our Picture', className: 'w-full h-full object-cover block' })
              ),
              h('p', { className: 'font-hand text-lg font-bold text-rose-600 mt-2' }, `"${config.caption}"`)
            ),

            h('label', { className: 'mt-2.5 text-xs font-bold px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 cursor-pointer transition' },
              '📷 Change / Upload Our Picture',
              h('input', { type: 'file', accept: 'image/*', onChange: onUploadPhoto, className: 'hidden' })
            )
          ),

          // LOVE LETTER PARCHMENT
          h('div', { className: 'bg-amber-50/40 border border-amber-200 rounded-2xl p-5 relative' },
            h('span', { className: 'absolute top-3 right-3 text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded' },
              '💌 SACRED VOW'
            ),
            h('h3', { className: 'font-hand text-2xl text-rose-600 mb-2' }, `My Dearest ${config.girlName},`),
            h('div', { className: 'font-hand text-lg text-gray-700 leading-relaxed space-y-2' },
              h('p', null, config.letterP1),
              h('p', null, config.letterP2),
              h('p', null, config.letterP3)
            ),
            h('div', { className: 'text-right mt-3' },
              h('p', { className: 'text-[11px] font-bold text-gray-400' }, 'Yours Forever & Always,'),
              h('p', { className: 'font-script text-3xl text-rose-500' }, `${config.boyName} 💖`)
            )
          ),

          // WIFE PRIVILEGES
          h('div', { className: 'bg-rose-50/40 border border-dashed border-rose-200 rounded-2xl p-4' },
            h('h4', { className: 'text-center font-black text-xs text-rose-600 uppercase tracking-wider mb-2' },
              '💍 Official Wife Privileges 🎟️'
            ),
            h('div', { className: 'grid grid-cols-2 gap-2 text-xs' },
              h('div', { className: 'bg-white p-2 rounded-xl border border-rose-100 flex items-center gap-2' },
                h('span', { className: 'text-base' }, '👸'),
                h('div', null,
                  h('strong', { className: 'text-[11px] text-gray-800 block' }, 'Princess Treatment'),
                  h('p', { className: 'text-[10px] text-gray-400' }, 'Forehead kisses & endless love.')
                )
              ),
              h('div', { className: 'bg-white p-2 rounded-xl border border-rose-100 flex items-center gap-2' },
                h('span', { className: 'text-base' }, '🍨'),
                h('div', null,
                  h('strong', { className: 'text-[11px] text-gray-800 block' }, 'Midnight Cravings'),
                  h('p', { className: 'text-[10px] text-gray-400' }, 'Boba & ice cream whenever desired.')
                )
              ),
              h('div', { className: 'bg-white p-2 rounded-xl border border-rose-100 flex items-center gap-2' },
                h('span', { className: 'text-base' }, '💆‍♀️'),
                h('div', null,
                  h('strong', { className: 'text-[11px] text-gray-800 block' }, 'Massages On Demand'),
                  h('p', { className: 'text-[10px] text-gray-400' }, 'Shoulder & back rubs when tired.')
                )
              ),
              h('div', { className: 'bg-white p-2 rounded-xl border border-rose-100 flex items-center gap-2' },
                h('span', { className: 'text-base' }, '🛡️'),
                h('div', null,
                  h('strong', { className: 'text-[11px] text-gray-800 block' }, '"Wife Always Right"'),
                  h('p', { className: 'text-[10px] text-gray-400' }, 'Automatic win in any debate!')
                )
              )
            )
          ),

          // Actions
          h('div', { className: 'flex justify-center gap-3 pt-1' },
            h('button', {
              onClick: onPrint,
              className: 'px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md transition'
            }, '💌 Save / Print as Keepsake'),
            h('button', {
              onClick: onFireworks,
              className: 'px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md transition'
            }, '🎉 Heart Fireworks!')
          )
        )
      )
    );
  }

  // ============================================================================
  // CUSTOMIZE MODAL
  // ============================================================================
  function CustomizeModal({ isOpen, onClose, config, onSave, onReset }) {
    if (!isOpen) return null;

    const [form, setForm] = useState({
      girlName: config.girlName,
      boyName: config.boyName,
      caption: config.caption,
      letterP2: config.letterP2
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(form);
    };

    return h('div', { className: 'modal-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in' },
      h('div', { className: 'customize-modal bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative' },
        h('button', {
          onClick: onClose,
          className: 'absolute top-4 right-4 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs'
        }, '✕'),

        h('h3', { className: 'text-lg font-black text-gray-800 mb-0.5' }, '✨ Personalize The Quest'),
        h('p', { className: 'text-xs text-gray-400 mb-4' }, 'Easily customize names and romantic messages!'),

        h('form', { onSubmit: handleSubmit, className: 'space-y-3 text-xs text-left' },
          h('div', null,
            h('label', { className: 'block font-bold text-gray-600 mb-1' }, 'Her Name / Nickname:'),
            h('input', {
              type: 'text',
              value: form.girlName,
              onChange: (e) => setForm({ ...form, girlName: e.target.value }),
              className: 'w-full p-2 rounded-xl border border-gray-200 focus:border-rose-400 outline-none text-xs',
              required: true
            })
          ),

          h('div', null,
            h('label', { className: 'block font-bold text-gray-600 mb-1' }, 'Your Name / Title:'),
            h('input', {
              type: 'text',
              value: form.boyName,
              onChange: (e) => setForm({ ...form, boyName: e.target.value }),
              className: 'w-full p-2 rounded-xl border border-gray-200 focus:border-rose-400 outline-none text-xs',
              required: true
            })
          ),

          h('div', null,
            h('label', { className: 'block font-bold text-gray-600 mb-1' }, 'Polaroid Caption:'),
            h('input', {
              type: 'text',
              value: form.caption,
              onChange: (e) => setForm({ ...form, caption: e.target.value }),
              className: 'w-full p-2 rounded-xl border border-gray-200 focus:border-rose-400 outline-none text-xs'
            })
          ),

          h('div', null,
            h('label', { className: 'block font-bold text-gray-600 mb-1' }, 'Custom Letter Paragraph:'),
            h('textarea', {
              rows: 3,
              value: form.letterP2,
              onChange: (e) => setForm({ ...form, letterP2: e.target.value }),
              className: 'w-full p-2 rounded-xl border border-gray-200 focus:border-rose-400 outline-none text-xs'
            })
          ),

          h('div', { className: 'flex justify-between items-center pt-2' },
            h('button', {
              type: 'button',
              onClick: onReset,
              className: 'text-gray-400 hover:text-red-500 font-bold'
            }, 'Reset Defaults'),
            h('button', {
              type: 'submit',
              className: 'px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-black shadow-md'
            }, 'Save Changes 💾')
          )
        )
      )
    );
  }

  // Export
  window.Modals = {
    EndingModal,
    CustomizeModal
  };
})();
