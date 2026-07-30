/**
 * Pocketknife Pioneers - Main Game State Controller & UI Engine
 */

class PocketknifePioneersGame {
  constructor() {
    this.state = {
      archetype: null,
      health: 100,
      sanity: 100,
      cash: 0,
      items: {},
      inventory: [],
      currentLocationIndex: 0,
      daysElapsed: 1,
      isGameOver: false,
      crtEnabled: true
    };

    this.auctionManager = new WhatnotAuctionManager(this);
    this.sharpeningMinigame = new SharpeningMinigame(this);
    this.shareManager = new ScoreShareManager(this);

    this.initDOM();
  }

  initDOM() {
    window.addEventListener('DOMContentLoaded', () => {
      this.bindEvents();
      this.renderArchetypeSelection();
    });
  }

  bindEvents() {
    const crtBtn = document.getElementById('crt-toggle');
    if (crtBtn) {
      crtBtn.onclick = () => {
        sounds.click();
        this.state.crtEnabled = !this.state.crtEnabled;
        document.body.classList.toggle('crt-off', !this.state.crtEnabled);
        crtBtn.textContent = this.state.crtEnabled ? '📺 CRT: ON' : '📺 CRT: OFF';
      };
    }

    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
      soundBtn.onclick = () => {
        const isMuted = sounds.toggleMute();
        soundBtn.textContent = isMuted ? '🔇 SOUND: OFF' : '🔊 SOUND: ON';
      };
    }

    const shareBtn = document.getElementById('top-share-score-btn');
    if (shareBtn) {
      shareBtn.onclick = () => {
        sounds.click();
        this.shareManager.showShareModal();
      };
    }
  }

  resetGame() {
    this.state = {
      archetype: null,
      health: 100,
      sanity: 100,
      cash: 0,
      items: {},
      inventory: [],
      currentLocationIndex: 0,
      daysElapsed: 1,
      isGameOver: false,
      crtEnabled: this.state.crtEnabled
    };

    this.renderArchetypeSelection();
  }

  renderArchetypeSelection() {
    const app = document.getElementById('app-container');
    if (!app) return;

    app.innerHTML = `
      <div class="screen-container retro-card">
        <header class="game-header">
          <h1 class="pixel-title">🔪 POCKETKNIFE PIONEERS 🔪</h1>
          <p class="subtitle">The Trail of the Grail: From Blade Outpost to Blade Show Atlanta</p>
        </header>

        <div class="archetype-selection-box">
          <h2>SELECT YOUR PIONEER COLLECTOR:</h2>
          <div class="archetype-grid">
            ${GAME_DATA.archetypes.map(a => `
              <div class="archetype-card" data-id="${a.id}">
                <h3>${a.name}</h3>
                <p class="tagline">"${a.tagline}"</p>
                <p class="desc">${a.description}</p>
                <div class="perk-box"><strong>Perk:</strong> ${a.perk}</div>
                <div class="stat-badge">Starting Cash: $${a.startingCash}</div>
                <button class="btn btn-primary select-archetype-btn" data-id="${a.id}">EMBARK AS ${a.name.toUpperCase()}</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('.select-archetype-btn').forEach(btn => {
      btn.onclick = (e) => {
        sounds.buy();
        const archId = e.target.getAttribute('data-id');
        this.selectArchetype(archId);
      };
    });
  }

  selectArchetype(archId) {
    const archetype = GAME_DATA.archetypes.find(a => a.id === archId);
    if (!archetype) return;

    this.state.archetype = archetype;
    this.state.cash = archetype.startingCash;
    this.state.items = { ...archetype.startingItems };
    this.state.inventory = archetype.startingKnives.map(kKey => {
      const template = GAME_DATA.knives[kKey];
      return { ...template, id: kKey + '_' + Date.now() };
    });

    this.renderOutpostShop();
  }

  renderOutpostShop() {
    const app = document.getElementById('app-container');
    const loc = GAME_DATA.trailLocations[this.state.currentLocationIndex];

    app.innerHTML = `
      <div class="screen-container retro-card">
        <header class="location-header">
          <h2>📍 ${loc.name} (Mile ${loc.mile})</h2>
          <p>${loc.desc}</p>
        </header>

        <div class="status-bar-strip">
          <span>💰 Cash: <strong>$${this.state.cash}</strong></span>
          <span>🩹 Health: <strong>${this.state.health}%</strong></span>
          <span>🧠 Sanity: <strong>${this.state.sanity}%</strong></span>
          <span>🗡️ Knives: <strong>${this.state.inventory.length}</strong></span>
        </div>

        <div class="shop-grid">
          <div class="shop-supplies">
            <h3>Pioneer Supply Outpost</h3>
            <div class="supply-list">
              ${Object.keys(GAME_DATA.items).map(itemKey => {
                const item = GAME_DATA.items[itemKey];
                const owned = this.state.items[itemKey] || 0;
                return `
                  <div class="supply-item">
                    <div class="supply-info">
                      <strong>${item.name} ($${item.cost})</strong>
                      <p>${item.desc}</p>
                      <span class="owned-count">Owned: ${owned}</span>
                    </div>
                    <button class="btn btn-secondary buy-item-btn" data-key="${itemKey}">BUY +1</button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="shop-inventory-summary">
            <h3>Your Knife Collection Vault</h3>
            <div class="vault-list">
              ${this.state.inventory.map(k => `
                <div class="vault-item">
                  <span class="v-icon">${k.image}</span>
                  <div class="v-details">
                    <strong>${k.name}</strong>
                    <span class="v-meta">Steel: ${k.steel} | Condition: ${k.condition}% | Value: $${k.value}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="outpost-actions">
          <button class="btn btn-primary btn-large" id="btn-embark">🚀 EMBARK ON THE TRAIL OF THE GRAIL</button>
        </div>
      </div>
    `;

    document.querySelectorAll('.buy-item-btn').forEach(btn => {
      btn.onclick = (e) => {
        const itemKey = e.target.getAttribute('data-key');
        this.buyItem(itemKey);
      };
    });

    document.getElementById('btn-embark').onclick = () => {
      sounds.click();
      this.renderTrailHub();
    };
  }

  buyItem(itemKey) {
    const item = GAME_DATA.items[itemKey];
    if (this.state.cash < item.cost) {
      sounds.damage();
      alert("Not enough cash!");
      return;
    }

    sounds.buy();
    this.state.cash -= item.cost;
    this.state.items[itemKey] = (this.state.items[itemKey] || 0) + 1;
    this.renderOutpostShop();
  }

  renderTrailHub() {
    const app = document.getElementById('app-container');
    const loc = GAME_DATA.trailLocations[this.state.currentLocationIndex];

    app.innerHTML = `
      <div class="screen-container retro-card hub-layout">
        <header class="hub-header">
          <div class="header-left">
            <h2>📍 ${loc.name}</h2>
            <span class="mile-badge">Mile ${loc.mile} / 1800</span>
          </div>
          <div class="header-right">
            <button class="btn btn-warning" id="hub-share-btn">📲 SHARE SCORE</button>
          </div>
        </header>

        <!-- Animated Distance Bar -->
        <div class="trail-progress-container">
          <div class="trail-progress-bar" style="width: ${(loc.mile / 1800) * 100}%;">
            <span class="pioneer-wagon">🔪 Pioneer Wagon</span>
          </div>
        </div>

        <!-- Status Dashboard -->
        <div class="dashboard-panel">
          <div class="stat-box">
            <span class="stat-title">HEALTH</span>
            <div class="bar-fill-bg"><div class="bar-fill health-bar" style="width: ${this.state.health}%;"></div></div>
            <span class="stat-val">${this.state.health}%</span>
          </div>
          <div class="stat-box">
            <span class="stat-title">SANITY</span>
            <div class="bar-fill-bg"><div class="bar-fill sanity-bar" style="width: ${this.state.sanity}%;"></div></div>
            <span class="stat-val">${this.state.sanity}%</span>
          </div>
          <div class="stat-box">
            <span class="stat-title">CASH</span>
            <span class="stat-val cash-val">$${this.state.cash}</span>
          </div>
          <div class="stat-box">
            <span class="stat-title">DAYS SURVIVED</span>
            <span class="stat-val">Day ${this.state.daysElapsed}</span>
          </div>
        </div>

        <div class="hub-main-split">
          <!-- Inventory & Supplies Sidebar -->
          <div class="hub-sidebar">
            <div class="section-box">
              <h3>📦 Item Stash</h3>
              <div class="item-stash-list">
                ${Object.keys(GAME_DATA.items).map(kKey => {
                  const qty = this.state.items[kKey] || 0;
                  const item = GAME_DATA.items[kKey];
                  return `
                    <div class="stash-row">
                      <span>${item.name}</span>
                      <div class="stash-control">
                        <strong>x${qty}</strong>
                        ${qty > 0 && (kKey === 'bandaid' || kKey === 'energy' || kKey === 'sharpening_kit') ? `<button class="btn btn-xs use-item-btn" data-key="${kKey}">USE</button>` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <div class="section-box">
              <h3>🗡️ Knife Vault (${this.state.inventory.length})</h3>
              <div class="vault-cards-container">
                ${this.state.inventory.map(k => `
                  <div class="knife-badge-card">
                    <div class="badge-icon">${k.image}</div>
                    <div class="badge-body">
                      <strong>${k.name}</strong>
                      <div class="badge-sub">${k.steel} | Cond: ${k.condition}%</div>
                      <div class="badge-sub">Sharpness: ${k.sharpness}% | Value: $${k.value}</div>
                    </div>
                    <button class="btn btn-xs btn-primary sharpen-knife-btn" data-id="${k.id}">MAINTAIN</button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Trail Log & Actions -->
          <div class="hub-center">
            <div class="section-box log-box">
              <h3>📜 Pioneer Trail Log</h3>
              <div class="log-entries" id="trail-log-entries">
                <div class="log-line">Welcome to ${loc.name}. The road ahead is filled with Whatnot stream snipers and humid rust hazards.</div>
              </div>
            </div>

            <div class="hub-action-buttons">
              <button class="btn btn-primary btn-large" id="btn-next-leg">🚶 CONTINUE TRAIL JOURNEY (+300 MILES)</button>
              <button class="btn btn-warning" id="btn-live-auction">🔴 ENTER WHATNOT AUCTION WILDS</button>
              <button class="btn btn-secondary" id="btn-rest-camp">⛺ REST AT CAMP (Restore Sanity)</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('hub-share-btn').onclick = () => this.shareManager.showShareModal();

    document.querySelectorAll('.use-item-btn').forEach(btn => {
      btn.onclick = (e) => {
        const itemKey = e.target.getAttribute('data-key');
        this.useItem(itemKey);
      };
    });

    document.querySelectorAll('.sharpen-knife-btn').forEach(btn => {
      btn.onclick = (e) => {
        const kId = e.target.getAttribute('data-id');
        const knife = this.state.inventory.find(k => k.id === kId);
        if (knife) {
          if ((this.state.items.sharpening_kit || 0) <= 0) {
            alert("You need a Kapex & Strop Kit to sharpen knives!");
            return;
          }
          this.state.items.sharpening_kit--;
          this.sharpeningMinigame.start(knife, () => this.renderTrailHub());
        }
      };
    });

    document.getElementById('btn-next-leg').onclick = () => this.advanceTrail();
    document.getElementById('btn-live-auction').onclick = () => this.triggerWhatnotAuction();
    document.getElementById('btn-rest-camp').onclick = () => this.restAtCamp();
  }

  useItem(itemKey) {
    if ((this.state.items[itemKey] || 0) <= 0) return;

    sounds.buy();
    this.state.items[itemKey]--;

    if (itemKey === 'bandaid') {
      this.state.health = Math.min(100, this.state.health + 30);
      this.addLog('🩹 You applied a Band-Aid! (+30 Health)');
    } else if (itemKey === 'energy') {
      this.state.sanity = Math.min(100, this.state.sanity + 35);
      this.addLog('⚡ Drank Nitrous Cold Brew! (+35 Sanity)');
    } else if (itemKey === 'sharpening_kit') {
      let knife = this.state.inventory[0];
      if (knife) {
        this.sharpeningMinigame.start(knife, () => this.renderTrailHub());
        return;
      }
    }

    this.renderTrailHub();
  }

  restAtCamp() {
    sounds.click();
    this.state.daysElapsed += 1;
    this.state.sanity = Math.min(100, this.state.sanity + 20);
    this.state.health = Math.min(100, this.state.health + 10);
    this.addLog('⛺ Rested at camp for a night. (+20 Sanity, +10 Health)');
    this.renderTrailHub();
  }

  triggerWhatnotAuction() {
    const item = GAME_DATA.whatnotAuctions[Math.floor(Math.random() * GAME_DATA.whatnotAuctions.length)];
    this.auctionManager.startAuction(item, (won, finalBid, itemData) => {
      if (won) {
        this.addLog(`🎉 WHATNOT WIN! Acquired ${itemData.name} for $${finalBid}!`);
      } else {
        this.addLog(`❌ AUCTION LOST! Outbid on ${itemData.name}.`);
      }
      this.renderTrailHub();
    });
  }

  advanceTrail() {
    sounds.click();
    this.state.currentLocationIndex += 1;
    this.state.daysElapsed += 2;

    if (this.state.currentLocationIndex >= GAME_DATA.trailLocations.length - 1) {
      // Reached Blade Show Atlanta!
      sounds.victory();
      this.shareManager.showShareModal();
      return;
    }

    // Trigger random event or rainstorm condition
    this.triggerRandomEvent();
  }

  triggerRandomEvent() {
    const event = GAME_DATA.randomEvents[Math.floor(Math.random() * GAME_DATA.randomEvents.length)];

    let modal = document.getElementById('event-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'event-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content retro-card">
        <span class="live-badge">⚡ TRAIL INCIDENT</span>
        <h2>${event.title}</h2>
        <p class="event-desc">${event.text}</p>

        <div class="event-options-box" id="event-options-box">
          ${event.options ? event.options.map((opt, i) => `
            <button class="btn btn-secondary btn-event-opt" data-index="${i}">${opt.label}</button>
          `).join('') : `
            <button class="btn btn-primary" id="btn-event-continue">RESOLVE INCIDENT</button>
          `}
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    if (event.options) {
      document.querySelectorAll('.btn-event-opt').forEach(btn => {
        btn.onclick = (e) => {
          sounds.click();
          const idx = parseInt(e.target.getAttribute('data-index'), 10);
          const res = event.options[idx].action(this.state);
          this.applyEventResult(res, modal);
        };
      });
    } else {
      document.getElementById('btn-event-continue').onclick = () => {
        sounds.click();
        const res = event.effect(this.state);
        this.applyEventResult(res, modal);
      };
    }
  }

  applyEventResult(res, modal) {
    if (res.healthDelta) this.state.health = Math.max(0, Math.min(100, this.state.health + res.healthDelta));
    if (res.sanityDelta) this.state.sanity = Math.max(0, Math.min(100, this.state.sanity + res.sanityDelta));
    if (res.cashDelta) this.state.cash = Math.max(0, this.state.cash + res.cashDelta);

    if (this.state.health <= 0 || this.state.sanity <= 0) {
      sounds.gameover();
      alert("GAME OVER! You ran out of health or sanity on the trail!");
      modal.style.display = 'none';
      this.shareManager.showShareModal();
      return;
    }

    this.addLog(res.text);

    setTimeout(() => {
      modal.style.display = 'none';
      this.renderTrailHub();
    }, 500);
  }

  addLog(msg) {
    const logBox = document.getElementById('trail-log-entries');
    if (logBox) {
      const line = document.createElement('div');
      line.className = 'log-line';
      line.textContent = msg;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
    }
  }
}

// Instantiate game instance
const gameApp = new PocketknifePioneersGame();
