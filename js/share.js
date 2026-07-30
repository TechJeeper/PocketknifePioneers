/**
 * Pocketknife Pioneers - Score Calculation & Share Score System
 */

class ScoreShareManager {
  constructor(game) {
    this.game = game;
  }

  calculateFinalScore() {
    const s = this.game.state;

    let totalCollectionValue = s.inventory.reduce((sum, k) => sum + (k.value * (k.condition / 100)), 0);
    totalCollectionValue = Math.round(totalCollectionValue);

    let grailsCount = s.inventory.filter(k => k.tier === 'Grail' || k.tier === 'Custom').length;
    let distanceScore = s.currentLocationIndex * 300;
    let netWorth = s.cash + totalCollectionValue;

    let totalScore = Math.round(
      (s.health * 10) +
      (s.sanity * 15) +
      (s.cash * 1.5) +
      (totalCollectionValue * 2) +
      (grailsCount * 1500) +
      (distanceScore * 3)
    );

    let rankTitle = 'Broke Mall Ninja';
    if (totalScore >= 12000) rankTitle = '👑 LORD OF THE GRAILS (Legendary)';
    else if (totalScore >= 8500) rankTitle = '🗡️ BLADE SHOW VIP';
    else if (totalScore >= 5500) rankTitle = '🔥 FLIPPING VETERAN';
    else if (totalScore >= 3000) rankTitle = '📦 WHATNOT ADDICT';
    else if (totalScore >= 1500) rankTitle = '🩹 BAND-AID ENTHUSIAST';

    return {
      totalScore,
      rankTitle,
      totalCollectionValue,
      grailsCount,
      netWorth,
      milesCovered: distanceScore,
      health: s.health,
      sanity: s.sanity,
      cash: s.cash,
      knivesCount: s.inventory.length
    };
  }

  generateShareText(scoreData) {
    return `🔪 POCKETKNIFE PIONEERS 🔪\n` +
      `Trail Result: ${scoreData.rankTitle}\n` +
      `--------------------------------\n` +
      `🏆 Final Score: ${scoreData.totalScore.toLocaleString()}\n` +
      `💰 Net Worth: $${scoreData.netWorth.toLocaleString()}\n` +
      `👑 Grails / Customs: ${scoreData.grailsCount}\n` +
      `🗡️ Knife Collection: ${scoreData.knivesCount} blades ($${scoreData.totalCollectionValue.toLocaleString()} value)\n` +
      `📍 Distance: ${scoreData.milesCovered} / 1800 Miles\n` +
      `🩹 Health: ${scoreData.health}% | 🧠 Sanity: ${scoreData.sanity}%\n\n` +
      `Play Pocketknife Pioneers online: https://github.com/pages/pocketknifepioneers`;
  }

  showShareModal() {
    const score = this.calculateFinalScore();
    const shareText = this.generateShareText(score);

    let modal = document.getElementById('share-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'share-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content retro-card share-card">
        <span class="live-badge">🎉 GAME COMPLETE</span>
        <h2>BLADE SHOW ATLANTA SCORECARD</h2>
        
        <div class="rank-banner">
          <span class="rank-label">PIONEER RANK:</span>
          <h3 class="rank-title">${score.rankTitle}</h3>
        </div>

        <div class="score-grid">
          <div class="score-stat">
            <span class="stat-num">${score.totalScore.toLocaleString()}</span>
            <span class="stat-label">TOTAL SCORE</span>
          </div>
          <div class="score-stat">
            <span class="stat-num">$${score.netWorth.toLocaleString()}</span>
            <span class="stat-label">NET WORTH</span>
          </div>
          <div class="score-stat">
            <span class="stat-num">${score.grailsCount}</span>
            <span class="stat-label">GRAILS</span>
          </div>
          <div class="score-stat">
            <span class="stat-num">${score.knivesCount}</span>
            <span class="stat-label">BLADES</span>
          </div>
        </div>

        <div class="share-preview-box">
          <textarea id="share-text-area" readonly>${shareText}</textarea>
        </div>

        <div class="share-modal-actions">
          <button class="btn btn-primary btn-large" id="btn-copy-score">📋 COPY SCORE TO CLIPBOARD</button>
          <button class="btn btn-warning" id="btn-web-share">📲 SHARE VIA MOBILE / APPS</button>
          <button class="btn btn-secondary" id="btn-restart-game">🔄 PLAY AGAIN</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    document.getElementById('btn-copy-score').onclick = () => this.copyToClipboard(shareText);
    document.getElementById('btn-web-share').onclick = () => this.triggerNativeShare(score, shareText);
    document.getElementById('btn-restart-game').onclick = () => {
      modal.style.display = 'none';
      this.game.resetGame();
    };
  }

  async copyToClipboard(text) {
    sounds.click();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const area = document.getElementById('share-text-area');
        if (area) {
          area.select();
          document.execCommand('copy');
        }
      }
      this.showToast('✅ Score copied to clipboard!');
    } catch (err) {
      this.showToast('❌ Unable to copy automatically.');
    }
  }

  async triggerNativeShare(score, text) {
    sounds.click();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pocketknife Pioneers Scorecard',
          text: text,
          url: window.location.href
        });
      } catch (e) {
        console.log('Share canceled', e);
      }
    } else {
      this.copyToClipboard(text);
    }
  }

  showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast-box';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}
