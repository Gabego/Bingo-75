import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BALLS, LETTERS, previousFive, letterFor, pickAvailable, spokenText } from './bingo.js';
import './style.css';

const PREF_KEY = 'bingo75.preferences.v1';
const DEFAULTS = { mode: 'manual', voiceEnabled: false, speechFormat: 'letter-number', voiceURI: '', fullscreen: false };

function readPreferences() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(PREF_KEY) || '{}') }; }
  catch { return DEFAULTS; }
}

function App() {
  const [called, setCalled] = useState([]);
  const [preferences, setPreferences] = useState(readPreferences);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voiceNotice, setVoiceNotice] = useState('');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  useEffect(() => { localStorage.setItem(PREF_KEY, JSON.stringify(preferences)); }, [preferences]);
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load(); window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);
  useEffect(() => {
    const onInstall = (event) => { event.preventDefault(); setInstallPrompt(event); };
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener('beforeinstallprompt', onInstall);
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => { window.removeEventListener('beforeinstallprompt', onInstall); document.removeEventListener('fullscreenchange', onFullscreen); };
  }, []);
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  const latest = called.at(-1) ?? null;
  const recent = previousFive(called);
  const calledSet = useMemo(() => new Set(called), [called]);
  const compatibleVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('es'));

  function announce(number) {
    if (!preferences.voiceEnabled) return;
    if (!('speechSynthesis' in window)) { setVoiceNotice('Este navegador no ofrece lectura de voz.'); return; }
    const voice = voices.find((item) => item.voiceURI === preferences.voiceURI) || compatibleVoices.find((item) => item.lang.toLowerCase() === 'es-co') || compatibleVoices[0];
    if (!voice) { setVoiceNotice('No hay una voz en español disponible en este dispositivo. Revisa las voces instaladas.'); return; }
    setVoiceNotice('');
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText(number, preferences.speechFormat));
    utterance.lang = voice.lang || 'es-CO'; utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  function toggleNumber(number) {
    if (calledSet.has(number)) { setCalled((items) => items.filter((item) => item !== number)); return; }
    setCalled((items) => [...items, number]); announce(number);
  }

  function drawRandom() {
    const number = pickAvailable(called);
    if (number !== null) toggleNumber(number);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { setVoiceNotice('El navegador no permitió activar pantalla completa.'); }
  }

  async function installApp() {
    if (!installPrompt) return;
    await installPrompt.prompt(); setInstallPrompt(null);
  }

  function resetGame() {
    if (!called.length) return;
    if (window.confirm('¿Reiniciar la partida? Se quitarán todos los números registrados.')) setCalled([]);
  }

  const setPref = (key, value) => setPreferences((current) => ({ ...current, [key]: value }));

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark">75</span><div><h1>Bingo <span>75</span></h1><p>Tablero de partida presencial</p></div></div>
      <div className="toolbar">
        {preferences.mode === 'random' && <button className="draw-button" onClick={drawRandom} disabled={called.length === 75}>✦ Sacar número</button>}
        {installPrompt && <button className="quiet-button" onClick={installApp}>Instalar app</button>}
        <button className="icon-button" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Activar pantalla completa'} title="Pantalla completa">{isFullscreen ? '⛶' : '⛶'}<span className="button-label">Pantalla</span></button>
        <button className="icon-button" onClick={() => setSettingsOpen(true)} aria-label="Abrir ajustes" title="Ajustes">⚙<span className="button-label">Ajustes</span></button>
      </div>
    </header>

    <section className="status-row" aria-label="Resumen de la partida">
      <div className="history-card"><div className="section-kicker">CINCO ANTERIORES</div><div className="history-list">{recent.length ? recent.map((number) => <div className={`history-chip col-${letterFor(number)}`} key={number} aria-label={`${letterFor(number)} ${number}`}><span>{letterFor(number)}</span><strong>{number}</strong></div>) : <span className="empty-history">Aún no hay anteriores</span>}</div></div>
      <div className="latest-card"><div className="section-kicker">ÚLTIMA BALOTA</div>{latest ? <div className={`latest-ball col-${letterFor(latest)}`} aria-label={`${letterFor(latest)} ${latest}`}><span>{letterFor(latest)}</span><strong>{latest}</strong></div> : <div className="waiting-ball"><span>—</span><strong>Listos</strong></div>}</div>
      <div className="progress-card"><div className="section-kicker">PARTIDA</div><strong>{called.length}<small> / 75</small></strong><div className="progress-track"><span style={{ width: `${(called.length / 75) * 100}%` }} /></div></div>
    </section>

    {called.length === 75 && <section className="finish-banner" role="status"><span>🎉</span><div><strong>¡Partida finalizada!</strong><p>Han salido los 75 números.</p></div><button onClick={resetGame}>Nueva partida</button></section>}
    {voiceNotice && <div className="notice" role="status">{voiceNotice}</div>}

    <section className="board" aria-label="Tablero de Bingo 75">
      {LETTERS.map((letter, row) => <div className={`board-row row-${letter}`} key={letter}>
        <div className={`row-label col-${letter}`} aria-label={`Columna ${letter}`}>{letter}</div>
        {BALLS.slice(row * 15, row * 15 + 15).map((number) => <button key={number} className={`number-cell ${calledSet.has(number) ? 'is-called' : ''} ${latest === number ? 'is-latest' : ''}`} aria-pressed={calledSet.has(number)} aria-label={`${letter} ${number}${calledSet.has(number) ? ', salió' : ', disponible'}`} onClick={() => toggleNumber(number)}>{number}</button>)}
      </div>)}
    </section>

    <footer className="bottom-row"><div className="mode-pill"><span className={`mode-dot ${preferences.mode}`} />Modalidad {preferences.mode === 'manual' ? 'manual' : 'aleatoria'}</div><p>Toca un número para marcarlo o quitarlo.</p><button className="reset-button" onClick={resetGame} disabled={!called.length}>↻ <span>Reiniciar partida</span></button></footer>

    {settingsOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}><section className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title"><header className="modal-header"><div><span className="section-kicker">PERSONALIZA TU PARTIDA</span><h2 id="settings-title">Ajustes</h2></div><button className="close-button" onClick={() => setSettingsOpen(false)} aria-label="Cerrar ajustes">×</button></header>
      <label className="setting-row"><span><strong>Modalidad</strong><small>Elige cómo registrar cada número</small></span><select value={preferences.mode} onChange={(event) => setPref('mode', event.target.value)}><option value="manual">Manual</option><option value="random">Aleatoria</option></select></label>
      <label className="setting-row"><span><strong>Lectura verbal</strong><small>Pronuncia cada número nuevo</small></span><input className="switch" type="checkbox" checked={preferences.voiceEnabled} onChange={(event) => setPref('voiceEnabled', event.target.checked)} /></label>
      <label className="setting-row"><span><strong>Formato de pronunciación</strong><small>Idioma: español (voz del dispositivo)</small></span><select value={preferences.speechFormat} onChange={(event) => setPref('speechFormat', event.target.value)}><option value="letter-number">Letra y número</option><option value="number">Solamente número</option><option value="pause">Letra, pausa y número</option></select></label>
      <label className="setting-row"><span><strong>Voz</strong><small>Se prefiere español de Colombia cuando está disponible</small></span><select value={preferences.voiceURI} onChange={(event) => setPref('voiceURI', event.target.value)}><option value="">Automática (preferir Colombia)</option>{compatibleVoices.map((voice) => <option value={voice.voiceURI} key={voice.voiceURI}>{voice.name} · {voice.lang}{voice.localService ? ' · local' : ''}</option>)}</select></label>
      {!compatibleVoices.length && <p className="voice-help">El dispositivo aún no ofrece voces en español. Instala una voz de español en sus ajustes de accesibilidad o voz.</p>}
      <label className="setting-row"><span><strong>Pantalla completa</strong><small>Amplía el tablero para proyectarlo</small></span><input className="switch" type="checkbox" checked={isFullscreen} onChange={toggleFullscreen} /></label>
      <div className="modal-footer"><span>Las preferencias se guardan en este dispositivo.</span><button onClick={() => setSettingsOpen(false)}>Listo</button></div>
    </section></div>}
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
