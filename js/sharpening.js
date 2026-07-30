/**
 * Pocketknife Pioneers - Interactive Sharpening & Stropping Minigame
 */

class SharpeningMinigame {
  constructor(game) {
    this.game = game;
    this.activeKnife = null;
    this.animId = null;
    this.position = 0;
    this.direction = 1;
    this.speed = 2.2;
    this.targetStart = 40;
    this.targetEnd = 60;
  }

  start(knife, onComplete) {
    this.activeKnife = knife;
    this.onComplete = onComplete;
    this.position = 0;
    this.direction = 1;

    sounds.click();
    this.renderModal();
    this.animate();
  }

  renderModal() {
    let modal = document.getElementById('sharpening-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'sharpening-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content retro-card">
        <h2>🔪 SHARPENING & STROPPING STATION</h2>
        <p>Sharpening: <strong>${this.activeKnife.name}</strong> (${this.activeKnife.steel})</p>
        <p class="hint-text">Click <strong>"LOCK BEVEL ANGLE"</strong> when the slider hits the green sweet spot!</p>

        <div class="sharpening-track-container">
          <div class="sharpening-track">
            <div class="sweet-spot" style="left: ${this.targetStart}%; width: ${this.targetEnd - this.targetStart}%;"></div>
            <div class="sharpening-marker" id="sharpening-marker"></div>
          </div>
        </div>

        <div class="sharpening-result" id="sharpening-result">Aim for the center angle!</div>

        <div class="modal-actions">
          <button class="btn btn-primary btn-large" id="btn-lock-bevel">LOCK BEVEL ANGLE!</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    document.getElementById('btn-lock-bevel').onclick = () => this.lockAngle();
  }

  animate() {
    this.position += this.direction * this.speed;
    if (this.position >= 96) {
      this.position = 96;
      this.direction = -1;
    } else if (this.position <= 0) {
      this.position = 0;
      this.direction = 1;
    }

    const marker = document.getElementById('sharpening-marker');
    if (marker) {
      marker.style.left = `${this.position}%`;
    }

    if (this.animId !== null) {
      this.animId = requestAnimationFrame(() => this.animate());
    }
  }

  lockAngle() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }

    const hit = this.position >= this.targetStart && this.position <= this.targetEnd;
    const nearHit = Math.abs(this.position - 50) <= 20;

    const resultBox = document.getElementById('sharpening-result');
    const lockBtn = document.getElementById('btn-lock-bevel');
    if (lockBtn) lockBtn.disabled = true;

    if (hit) {
      sounds.slice();
      sounds.victory();
      this.activeKnife.sharpness = Math.min(100, this.activeKnife.sharpness + 45);
      this.activeKnife.condition = Math.min(100, this.activeKnife.condition + 25);
      if (resultBox) {
        resultBox.className = 'sharpening-result hit-perfect';
        resultBox.textContent = '🎯 PERFECT ANGLE! Razor edge restored! (+45% Sharpness, +25% Condition)';
      }
    } else if (nearHit) {
      sounds.slice();
      this.activeKnife.sharpness = Math.min(100, this.activeKnife.sharpness + 20);
      if (resultBox) {
        resultBox.className = 'sharpening-result hit-good';
        resultBox.textContent = '👍 GOOD STROPE! Edge improved (+20% Sharpness)';
      }
    } else {
      sounds.damage();
      this.activeKnife.condition = Math.max(10, this.activeKnife.condition - 10);
      if (resultBox) {
        resultBox.className = 'sharpening-result hit-miss';
        resultBox.textContent = '💥 SLIPPED! Scratched the primary bevel (-10% Condition)';
      }
    }

    setTimeout(() => {
      const modal = document.getElementById('sharpening-modal');
      if (modal) modal.style.display = 'none';
      if (this.onComplete) this.onComplete();
    }, 2000);
  }
}
