// apology-generator.js

const defaultReasons = [
    "The media convinced me he was done",
    "I didn't watch the actual games",
    "I only looked at advanced analytics",
    "I don't know baseball",
    "I was jealous of [Player Name]",
    "I overreacted like an idiot"
  ];
  
  const playerNameInput       = document.getElementById('playerName');
  const playerTeamInput       = document.getElementById('playerTeam');
  const playerImageInput      = document.getElementById('playerImage');
  const reasonsListDiv        = document.getElementById('reasonsList');
  const customReasonInput     = document.getElementById('customReason');
  const addReasonBtn          = document.getElementById('addReasonBtn');
  const finalStatementCheckbox= document.getElementById('finalStatement');
  const playerNamePreviewSpan = document.getElementById('playerNamePreview');
  const previewDiv            = document.getElementById('apologyFormPreview');
  const downloadBtn           = document.getElementById('downloadBtn');
  
  let reasons = [...defaultReasons];
  let selectedReasons = new Set();
  let uploadedImageDataUrl = null;
  
  function renderReasons() {
    reasonsListDiv.innerHTML = '<strong>Reasons for behavior:</strong>';
    reasons.forEach((reason, i) => {
      const id = `reason_${i}`;
      const label = document.createElement('label');
      label.style.display = 'block';
  
      const chk = document.createElement('input');
      chk.type    = 'checkbox';
      chk.id      = id;
      chk.value   = reason;
      chk.checked = selectedReasons.has(reason);
      chk.addEventListener('change', () => {
        if (chk.checked) selectedReasons.add(reason);
        else            selectedReasons.delete(reason);
        updatePreview();
      });
  
      label.appendChild(chk);
      label.append(' ' + reason.replace('[Player Name]', playerNameInput.value || '[Player Name]'));
      reasonsListDiv.appendChild(label);
    });
  }
  
  function parseBold(text) {
    // Replace **word** with <strong>word</strong>
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
  
  function updatePreview() {
    const name = playerNameInput.value.trim() || '[Player Name]';
    const date = new Date().toLocaleDateString();
    playerNamePreviewSpan.textContent = name;

    // build the header image HTML
    const imgHtml = uploadedImageDataUrl
      ? `<img src="${uploadedImageDataUrl}" alt="${name}">`
      : `<div style="width:80px;height:80px;border-radius:50%;background:#eee;"></div>`;

    // which reasons are checked?
    const checked = new Set(selectedReasons);

    // generate the preview markup
    previewDiv.innerHTML = `
      <div class="header">
        ${imgHtml}
        <h2><span class="name">${name}</span> Apology Form</h2>
      </div>

      <div class="meta">
        <div class="to">To: ${name.toUpperCase()}</div>
        <div class="from-date">
          <span>From:</span> ________ &nbsp;&nbsp;
          <span>Date:</span> ${date}
        </div>
      </div>

      <div class="reasons-section">
        <div class="title">Reason for behavior:</div>
        <div class="reasons-grid">
          ${reasons.map(r => `
            <label>
              <input type="checkbox" disabled ${checked.has(r) ? 'checked' : ''}>
              ${parseBold(r.replace('[Player Name]', name))}
            </label>
          `).join('')}
        </div>
      </div>

      <hr>

      <div class="final">
        <label>
          <input type="checkbox" disabled ${finalStatementCheckbox.checked ? 'checked' : ''}>
          ${parseBold(`I will hereby respect <strong>${name}</strong> and I will NOT talk down on the future first-ballot Hall of Famer.`)}
        </label>
      </div>
      <div class="disclaimer">
        <em>Your apology needs to be as loud as your disrespect was</em>
      </div>
    `;
  }
  
  playerNameInput.addEventListener('input', () => {
    renderReasons();
    updatePreview();
  });
  playerTeamInput.addEventListener('input', updatePreview);
  finalStatementCheckbox.addEventListener('change', updatePreview);
  
  // add custom reason
  addReasonBtn.addEventListener('click', () => {
    const txt = customReasonInput.value.trim();
    if (txt && !reasons.includes(txt)) {
      reasons.push(txt);
      selectedReasons.add(txt);
      customReasonInput.value = '';
      renderReasons();
      updatePreview();
    }
  });
  
  // handle image upload
  playerImageInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return uploadedImageDataUrl = null, updatePreview();
    const reader = new FileReader();
    reader.onload = evt => { uploadedImageDataUrl = evt.target.result; updatePreview(); };
    reader.readAsDataURL(file);
  });
  
  // download via html2canvas
  downloadBtn.addEventListener('click', () => {
    if (!window.html2canvas) return alert('html2canvas not loaded.');
    html2canvas(previewDiv).then(canvas => {
      const link = document.createElement('a');
      link.download = `${playerNameInput.value || 'apology-form'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  });
  
  // initial render
  renderReasons();
  updatePreview();
  