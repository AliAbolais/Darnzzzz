# 💍 The Love Quest for My Darnzzzz 💖
*Built with React 18 & Tailwind CSS*

A romantic quest website featuring **Qoobee 🐲** and **Pengu 🐧**, real character stickers, an exciting 15-second bomb-dodging rush, an easy 4-pair memory match, Bible verse memorization, and the proposal altar with an unclickable dodging "No" button!

---

## 🔒 Strict Quest Progression Rules
1. **Trial 2 is STRICTLY LOCKED 🔒** until Trial 1 is cleared with 100 points in 15 seconds.
2. **Trial 3 is STRICTLY LOCKED 🔒** until Trial 2 is cleared (all 4 pairs matched).
3. **Trial 4 (Proposal Altar) is STRICTLY LOCKED 🔒** until Trial 3 (Bible Verses) is completed.
4. **The Grand Ending is STRICTLY LOCKED**: Guarded in React state; impossible to open until she passes the proposal trial ("She said YES!").

---

## 🗺️ The 4 Quest Trials

1. **Trial I: 🐲 Qoobee's 15-Second Rush**
   - **Time**: Exactly **15 seconds**!
   - **Target**: Score **100 points**!
   - **Points**: 5 to 10 points per treat (`🍓 +5`, `💖 +8`, `💌 +10`, `🧸 +10`).
   - **The Catch**: Watch out for **💣 BOMBS**! Catching a bomb deducts **-20 points**!
   - Fast, exciting arcade gameplay demanding quick reflexes!

2. **Trial II: 🐧 Pengu's Sweet Match (Easy!)**
   - Made sweet and easy: only **4 pairs (8 cards total)** in a 2x4 grid.
   - Pairs: Pengu, Qoobee, Strawberry, Ring.
   - Strictly locked until Trial 1 is passed!

3. **Trial III: ✝️ The Sacred Scripture Trial (Bible Verses Memorization)**
   - Fill in the missing holy words of love and devotion:
     - **1 Corinthians 13:4**: *"Love is patient, love is [kind]..."*
     - **1 John 4:19**: *"We love because He [first] loved us."*
     - **Ecclesiastes 4:12**: *"A cord of [three] strands is not quickly broken."*
     - **Song of Solomon 3:4**: *"I have found the one whom my soul [loves]."*
   - Unlocks the Final Proposal Altar!

4. **👑 Trial IV (Final Climax): "Will You Be My Wife?" 💍👰**
   - **The Unclickable Dodging "No" Button**:
     - Automatically flees on cursor proximity (within 55px) and mobile touch.
     - Displays cheeky lines (*"Wait... Qoobee ate the No button!"*, *"Pengu is crying! Don't click that!"*, *"Error 404: No not found!"*).
     - The **"YES! 💍💖"** button grows larger with each dodge.
     - **The Plot Twist**: Even if she manages to force-click "No", it announces:
       > *"✨ PLOT TWIST! In the language of true love, 'No' translates to: YES I WANT TO BE YOUR WIFE! 💍👰🎉"*

---

## 💌 The Grand Ending Finale:
- **Polaroid Photo Frame**: Clean tilted frame with custom caption and a **"📷 Change / Upload Our Picture"** button that lets you upload your real couple photo (persisted in `localStorage`).
- **Heartfelt Love Letter**: Clean typography on love parchment with customizable names.
- **Wife Privileges & Vows**: Redeemable golden coupons (*Princess Treatment*, *Midnight Cravings*, *Massages*, *"Wife is Always Right"*).
- **Save as Keepsake**: One-click print/PDF button formatted for a souvenir certificate.

---

## 🚀 How to Open
1. **Intro Letter**: Double-click **`intro.html`** to read the opening letter.
2. **Main Quest**: Select **“Yes, Let’s Play!”** to continue to **`index.html`**.
