# 🚀 Moonlander Game Development Roadmap

A structured plan to build a 6-level lunar lander-style game with physics, exploration, and precision landing.

---

## 🎯 Phase 1 – Core Mechanics & First Level

### ✅ Milestone 1: Lander Physics Prototype

- [x] Create a simple lander body using Box2D.js
- [ ] Implement thrust and rotation controls (left/right + main thrust)
- [x] Add gravity and a basic terrain body (flat ground)
- [x] Set up camera to follow the lander

🧪 _Goal:_ You can hover and land on flat ground with physics.

---

### ✅ Milestone 2: First LDtk Level Integration

- [ ] Design a 1280 × 2560 px test level in LDtk
- [ ] Use 32px grid (2 meters per tile with world scale = 16)
- [ ] Entity layer name: `Colliders`
- [ ] Define terrain using `GroundCollider` entities as Rectangles for now
- [ ] Load LDtk level into Phaser
- [ ] Create Box2D colliders from entities

🧪 _Goal:_ You can fly through a visually designed level with physics.

---

### ✅ Milestone 3: Landing & Win/Lose Conditions

- [ ] Add a landing pad (special tag/entity in LDtk)
- [ ] Detect landing angle and speed using Box2D
- [ ] Add win condition (gentle landing)
- [ ] Add crash condition (high-speed or bad angle)
- [ ] Provide feedback (e.g. screen shake, message, SFX)

🧪 _Goal:_ Player can win or crash based on landing.

---

### 🆕 Milestone 3.5: Sky Boundaries

- [ ] Add invisible static walls on left, right, and top of level
- [ ] (Optional) Replace with soft boundaries using forces (e.g., wind zones)
- [ ] (Optional) Show visual cues near edge (dust, distortion)

🧪 _Goal:_ Player stays within intended space even in open sky levels.

---

## ✨ Phase 2 – Polish & Experience

### ✅ Milestone 4: UI + Feedback

- [ ] Display velocity, altitude, and fuel as HUD
- [ ] Add particle effects for thrust (simple white trails)
- [ ] Add screen shake or flash on crash
- [ ] Add restart or replay button

🧪 _Goal:_ Landing feels responsive, game is readable and restartable.

---

### ✅ Milestone 5: Fuel Management

- [ ] Consume fuel when thrusting
- [ ] Show fuel bar on screen
- [ ] Add lose condition for running out of fuel
- [ ] (Optional) Add fuel pickups for later levels

🧪 _Goal:_ Player must manage resources while flying.

---

### ✅ Milestone 6: Level Polish

- [ ] Add background art or parallax layers
- [ ] Add rocks, decorations, or ruins
- [ ] Include alternate landing zones or routes

🧪 _Goal:_ Level is visually complete and encourages replay.

---

## 🚀 Phase 3 – Expansion to Full Game

### ✅ Milestone 7: Level Progression System

- [ ] Add level selection or "Next Level" flow
- [ ] Keep each level as a separate LDtk `Level`
- [ ] Progressively introduce new mechanics

### 🧭 Level Themes Overview

| Level | Environment       | Size (m) | Core Mechanic                     | Theme                      |
| ----- | ----------------- | -------- | --------------------------------- | -------------------------- |
| 1     | Open sky          | 80×160   | Just land, no obstacles           | “Training drop”            |
| 2     | Surface gaps      | 100×160  | Bounce off cliffs, land in canyon | “Desert planet”            |
| 3     | Subsurface tunnel | 80×200   | Narrow descent, limited fuel      | “Subterranean mine”        |
| 4     | Caverns + hazards | 120×180  | Wind zones, vents, angled landers | “Volcanic caves”           |
| 5     | Magnetic chaos    | 100×200  | Magnetic fields shift gravity     | “Alien reactor core”       |
| 6     | Darkness & decay  | 80×160   | Flickering light, collapsing land | “End of the world” descent |

🧪 _Goal:_ Each level adds something new and memorable.

---

### ✅ Milestone 8: Obstacles and Features

- [ ] Add wind zones that push the lander
- [ ] Add moving hazards (falling rocks, steam vents)
- [ ] Add complex terrain (angled slopes, tight spaces)

🧪 _Goal:_ Player must react and adapt — challenge increases.

---

### ✅ Milestone 9: Scoring & Leaderboards

- [ ] Score based on fuel remaining, landing speed/angle, and time
- [ ] Show results after landing
- [ ] (Optional) Add local leaderboard or allow sharing scores

🧪 _Goal:_ Adds depth and replay value.

---

### ✅ Milestone 10: Audio & Juice

- [ ] Add sound effects for thrust, landing, crashes
- [ ] Add background hum or space ambiance
- [ ] Add dust, glow, or camera effects for polish

🧪 _Goal:_ Game feels polished and satisfying.

---

## 🧰 Notes & Tips

- Use invisible static Box2D walls or force fields to handle open sky levels
- Start with Level 1 ("Training drop") at 1280×2560 px — open sky to rocky floor
- Track progress in Trello, Notion, or a TODO file
- Focus on feel before optimization
- Playtest often to balance challenge and control

---

[🟥 -10][🟨 -10–0][🎮 0–80][🟨 80–95][🟥 95+]
