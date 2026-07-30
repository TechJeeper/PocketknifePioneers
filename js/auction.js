/**
 * Pocketknife Pioneers - Whatnot Live Bidding Mini-Game Engine
 */

class WhatnotAuctionManager {
  constructor(game) {
    this.game = game;
    this.activeItem = null;
    this.currentBid = 0;
    this.highBidder = null;
    this.timer = 6;
    this.intervalId = null;
    this.chatIntervalId = null;
    this.onCompleteCallback = null;
    this.chatComments = [
      "No reserve chat! Let's GOOOOO!",
      "BID BID BID!",
      "Way over retail bro",
      "MagnaCut > everything",
      "Is this M390 or D2?",
      "Take my money!",
      "Grail hunter in the building!",
      "I'm broke after this drop haha",
      "Snipe coming in 3.. 2.. 1..",
      "What a steal!!"
    ];
  }

  startAuction(itemData, onComplete) {
    this.activeItem = itemData;
    this.currentBid = itemData.startingBid;
    this.highBidder = 'ChatSniper_' + Math.floor(Math.random() * 899 + 100);
    this.timer = 6;
    this.onCompleteCallback = onComplete;

    sounds.gavel();
    this.renderModal();
    this.startTimers();
  }

  startTimers() {
    clearInterval(this.intervalId);
    clearInterval(this.chatIntervalId);

    // Main countdown timer
    this.intervalId = setInterval(() => {
      this.timer -= 1;
      this.updateTimerDisplay();

      // Simulated opponent bids
      if (Math.random() < 0.45 && this.timer > 1) {
        this.opponentBid();
      }

      if (this.timer <= 0) {
        this.finishAuction();
      }
    }, 1000);

    // Chat scroll generator
    this.chatIntervalId = setInterval(() => {
      if (Math.random() < 0.6) {
        this.addChatMessage(
          'Collector_' + Math.floor(Math.random() * 90 + 10),
          this.chatComments[Math.floor(Math.random() * this.chatComments.length)]
        );
      }
    }, 800);
  }

  opponentBid() {
    const increment = Math.floor(Math.random() * 3 + 1) * 10;
    this.currentBid += increment;
    this.highBidder = 'Bot_' + ['Slayer', 'Flipper', 'Snob', 'Collector'][Math.floor(Math.random() * 4)] + '_' + Math.floor(Math.random() * 99);
    this.timer = Math.max(this.timer, 3); // Reset timer to at least 3 seconds on new bid
    sounds.bid();
    this.updateBidDisplay();
    this.addChatMessage(this.highBidder, `BID $${this.currentBid}! 🔥`);
  }

  playerBid() {
    sounds.click();
    const nextBid = this.currentBid + 10;
    if (this.game.state.cash < nextBid) {
      alert("You don't have enough cash for this bid!");
      return;
    }

    this.currentBid = nextBid;
    this.highBidder = 'YOU (' + this.game.state.archetype.name + ')';
    this.timer = Math.max(this.timer, 3);
    sounds.bid();
    this.updateBidDisplay();
    this.addChatMessage('YOU', `BID $${this.currentBid}! ⚡`);
  }

  useExpressPass() {
    if (this.game.state.items.pass <= 0) {
      alert("No Whatnot Express Passes left!");
      return;
    }

    sounds.buy();
    this.game.state.items.pass--;
    const snipeBid = this.currentBid + 10;
    if (this.game.state.cash < snipeBid) {
      alert("Insufficient funds even with snipe pass!");
      return;
    }

    this.currentBid = snipeBid;
    this.highBidder = 'YOU (' + this.game.state.archetype.name + ')';
    this.timer = 1; // Instant end
    this.addChatMessage('SYSTEM', '⚡ EXPRESS PASS ACTIVATED! AUTO-SNIPED!');
    this.updateBidDisplay();
  }

  finishAuction() {
    clearInterval(this.intervalId);
    clearInterval(this.chatIntervalId);
    sounds.gavel();

    const won = this.highBidder.startsWith('YOU');
    const resultModal = document.getElementById('auction-modal');

    if (won) {
      this.game.state.cash -= this.currentBid;
      const newKnife = {
        id: 'auction_' + Date.now(),
        name: this.activeItem.name,
        tier: this.activeItem.tier,
        steel: this.activeItem.steel,
        value: this.activeItem.estimatedValue,
        sharpness: 95,
        condition: 100,
        rustResist: 75,
        image: this.activeItem.image
      };
      this.game.state.inventory.push(newKnife);
      sounds.victory();

      this.addChatMessage('SYSTEM', '🎉 WINNER! You won the auction for $' + this.currentBid + '!');
    } else {
      sounds.damage();
      this.addChatMessage('SYSTEM', '❌ SOLD to ' + this.highBidder + ' for $' + this.currentBid);
    }

    setTimeout(() => {
      if (resultModal) resultModal.style.display = 'none';
      if (this.onCompleteCallback) {
        this.onCompleteCallback(won, this.currentBid, this.activeItem);
      }
    }, 2200);
  }

  renderModal() {
    let modal = document.getElementById('auction-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'auction-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content retro-card">
        <div class="auction-header">
          <span class="live-badge">🔴 LIVE STREAM AUCTION</span>
          <h2>WHATNOT AUCTION WILDS</h2>
        </div>

        <div class="auction-body">
          <div class="auction-item-card">
            <div class="auction-icon">${this.activeItem.image}</div>
            <h3>${this.activeItem.name}</h3>
            <p><strong>Steel:</strong> ${this.activeItem.steel} | <strong>Est. Value:</strong> $${this.activeItem.estimatedValue}</p>
            <div class="bid-box">
              <span class="bid-label">Current High Bid:</span>
              <span class="bid-amount" id="auction-bid-amount">$${this.currentBid}</span>
              <span class="high-bidder" id="auction-high-bidder">By: ${this.highBidder}</span>
            </div>
            <div class="auction-timer-box">
              <span class="timer-label">Time Remaining:</span>
              <span class="timer-value" id="auction-timer">${this.timer}s</span>
            </div>
          </div>

          <div class="auction-chat-container">
            <h4>Live Chat Feed</h4>
            <div class="chat-messages" id="auction-chat-messages"></div>
          </div>
        </div>

        <div class="auction-actions">
          <button class="btn btn-primary btn-large" id="btn-auction-bid">BID $${this.currentBid + 10}</button>
          <button class="btn btn-warning" id="btn-auction-pass">⚡ USE EXPRESS PASS (${this.game.state.items.pass || 0})</button>
          <button class="btn btn-secondary" id="btn-auction-bail">PASS / BAIL</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    document.getElementById('btn-auction-bid').onclick = () => this.playerBid();
    document.getElementById('btn-auction-pass').onclick = () => this.useExpressPass();
    document.getElementById('btn-auction-bail').onclick = () => {
      this.timer = 0;
      this.finishAuction();
    };

    this.addChatMessage('STREAMER', `WHATNOT NO RESERVE! Starting bid $${this.currentBid}!`);
  }

  updateTimerDisplay() {
    const el = document.getElementById('auction-timer');
    if (el) el.textContent = `${this.timer}s`;
  }

  updateBidDisplay() {
    const bidEl = document.getElementById('auction-bid-amount');
    const bidderEl = document.getElementById('auction-high-bidder');
    const bidBtn = document.getElementById('btn-auction-bid');

    if (bidEl) bidEl.textContent = `$${this.currentBid}`;
    if (bidderEl) bidderEl.textContent = `By: ${this.highBidder}`;
    if (bidBtn) bidBtn.textContent = `BID $${this.currentBid + 10}`;
  }

  addChatMessage(author, message) {
    const box = document.getElementById('auction-chat-messages');
    if (box) {
      const msgLine = document.createElement('div');
      msgLine.className = 'chat-line';
      msgLine.innerHTML = `<span class="chat-author">${author}:</span> <span class="chat-text">${message}</span>`;
      box.appendChild(msgLine);
      box.scrollTop = box.scrollHeight;
    }
  }
}
