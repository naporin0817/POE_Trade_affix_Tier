// ==UserScript==
// @name         POE Trade Affix Tier Helper
// @namespace    https://jp.pathofexile.com/
// @version      0.1.0
// @description  Adds inline affix tier helpers to the official Path of Exile trade site and auto-fills min/max values when a tier is selected.
// @author       OpenAI Codex
// @match        https://jp.pathofexile.com/trade/search/*
// @match        https://www.pathofexile.com/trade/search/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  const SCRIPT_ID = 'poe-trade-affix-tier-helper';
  const PANEL_CLASS = 'poe-affix-tier-panel';
  const ROW_MARKER = 'data-poe-affix-tier-row';
  const INPUT_MARKER = 'data-poe-affix-tier-bound';
  const DEBUG = false;
  const SCAN_INTERVAL_MS = 800;

  const AFFIX_DATA = [
    createSingleTierAffix({
      key: 'explicit.stat_life',
      aliases: ['最大ライフ', 'maximum life'],
      tiers: [
        ['T1', 120, 129],
        ['T2', 110, 119],
        ['T3', 100, 109],
        ['T4', 90, 99],
        ['T5', 80, 89],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_strength',
      aliases: ['筋力', 'strength'],
      tiers: [
        ['T1', 51, 55],
        ['T2', 46, 50],
        ['T3', 41, 45],
        ['T4', 36, 40],
        ['T5', 31, 35],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_dexterity',
      aliases: ['敏捷', 'dexterity'],
      tiers: [
        ['T1', 51, 55],
        ['T2', 46, 50],
        ['T3', 41, 45],
        ['T4', 36, 40],
        ['T5', 31, 35],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_intelligence',
      aliases: ['知性', 'intelligence'],
      tiers: [
        ['T1', 51, 55],
        ['T2', 46, 50],
        ['T3', 41, 45],
        ['T4', 36, 40],
        ['T5', 31, 35],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_fire_resistance',
      aliases: ['火炎耐性', 'fire resistance'],
      tiers: [
        ['T1', 46, 48],
        ['T2', 41, 45],
        ['T3', 36, 40],
        ['T4', 31, 35],
        ['T5', 26, 30],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_cold_resistance',
      aliases: ['冷気耐性', 'cold resistance'],
      tiers: [
        ['T1', 46, 48],
        ['T2', 41, 45],
        ['T3', 36, 40],
        ['T4', 31, 35],
        ['T5', 26, 30],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_lightning_resistance',
      aliases: ['雷耐性', 'lightning resistance'],
      tiers: [
        ['T1', 46, 48],
        ['T2', 41, 45],
        ['T3', 36, 40],
        ['T4', 31, 35],
        ['T5', 26, 30],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_chaos_resistance',
      aliases: ['混沌耐性', 'chaos resistance'],
      tiers: [
        ['T1', 31, 35],
        ['T2', 26, 30],
        ['T3', 21, 25],
        ['T4', 16, 20],
        ['T5', 12, 15],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_attack_speed',
      aliases: ['攻撃速度', 'attack speed'],
      tiers: [
        ['T1', 16, 18],
        ['T2', 13, 15],
        ['T3', 10, 12],
        ['T4', 8, 9],
        ['T5', 5, 7],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_cast_speed',
      aliases: ['詠唱速度', 'cast speed'],
      tiers: [
        ['T1', 16, 18],
        ['T2', 13, 15],
        ['T3', 10, 12],
        ['T4', 8, 9],
        ['T5', 5, 7],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_global_critical_strike_chance',
      aliases: ['クリティカル率', 'critical strike chance'],
      tiers: [
        ['T1', 31, 35],
        ['T2', 26, 30],
        ['T3', 21, 25],
        ['T4', 16, 20],
        ['T5', 11, 15],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_global_critical_strike_multiplier',
      aliases: ['クリティカルダメージ倍率', 'critical strike multiplier'],
      tiers: [
        ['T1', 31, 35],
        ['T2', 26, 30],
        ['T3', 21, 25],
        ['T4', 16, 20],
        ['T5', 11, 15],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_accuracy_rating',
      aliases: ['命中力', 'accuracy rating'],
      tiers: [
        ['T1', 401, 480],
        ['T2', 321, 400],
        ['T3', 241, 320],
        ['T4', 161, 240],
        ['T5', 81, 160],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_armour',
      aliases: ['防御力', 'armour'],
      tiers: [
        ['T1', 401, 480],
        ['T2', 321, 400],
        ['T3', 241, 320],
        ['T4', 161, 240],
        ['T5', 81, 160],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_evasion_rating',
      aliases: ['回避力', 'evasion rating'],
      tiers: [
        ['T1', 401, 480],
        ['T2', 321, 400],
        ['T3', 241, 320],
        ['T4', 161, 240],
        ['T5', 81, 160],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_energy_shield',
      aliases: ['エナジーシールド', 'energy shield'],
      tiers: [
        ['T1', 121, 132],
        ['T2', 109, 120],
        ['T3', 97, 108],
        ['T4', 85, 96],
        ['T5', 73, 84],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_item_rarity',
      aliases: ['アイテムのレアリティ', 'rarity of items found'],
      tiers: [
        ['T1', 21, 25],
        ['T2', 16, 20],
        ['T3', 11, 15],
        ['T4', 6, 10],
        ['T5', 3, 5],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_movement_speed',
      aliases: ['移動速度', 'movement speed'],
      tiers: [
        ['T1', 31, 35],
        ['T2', 26, 30],
        ['T3', 21, 25],
        ['T4', 16, 20],
        ['T5', 11, 15],
      ],
    }),
    createSingleTierAffix({
      key: 'explicit.stat_spell_suppression',
      aliases: ['スペル抑制', 'chance to suppress spell damage'],
      tiers: [
        ['T1', 13, 14],
        ['T2', 11, 12],
        ['T3', 9, 10],
        ['T4', 7, 8],
        ['T5', 5, 6],
      ],
    }),
    createMultiTierAffix({
      key: 'explicit.stat_added_fire_damage_to_attacks',
      aliases: ['火炎ダメージを追加', 'adds fire damage to attacks'],
      fields: [
        { key: 'flatMin', label: '下限' },
        { key: 'flatMax', label: '上限' },
      ],
      tiers: [
        ['T1', { flatMin: 27, flatMax: 48 }],
        ['T2', { flatMin: 23, flatMax: 41 }],
        ['T3', { flatMin: 19, flatMax: 34 }],
        ['T4', { flatMin: 15, flatMax: 27 }],
        ['T5', { flatMin: 11, flatMax: 20 }],
      ],
    }),
    createMultiTierAffix({
      key: 'explicit.stat_added_cold_damage_to_attacks',
      aliases: ['冷気ダメージを追加', 'adds cold damage to attacks'],
      fields: [
        { key: 'flatMin', label: '下限' },
        { key: 'flatMax', label: '上限' },
      ],
      tiers: [
        ['T1', { flatMin: 24, flatMax: 43 }],
        ['T2', { flatMin: 20, flatMax: 36 }],
        ['T3', { flatMin: 16, flatMax: 30 }],
        ['T4', { flatMin: 12, flatMax: 24 }],
        ['T5', { flatMin: 9, flatMax: 18 }],
      ],
    }),
    createMultiTierAffix({
      key: 'explicit.stat_added_lightning_damage_to_attacks',
      aliases: ['雷ダメージを追加', 'adds lightning damage to attacks'],
      fields: [
        { key: 'flatMin', label: '下限' },
        { key: 'flatMax', label: '上限' },
      ],
      tiers: [
        ['T1', { flatMin: 5, flatMax: 88 }],
        ['T2', { flatMin: 4, flatMax: 74 }],
        ['T3', { flatMin: 4, flatMax: 60 }],
        ['T4', { flatMin: 3, flatMax: 46 }],
        ['T5', { flatMin: 2, flatMax: 32 }],
      ],
    }),
  ];

  const AFFIX_INDEX = buildAffixIndex(AFFIX_DATA);
  const state = {
    lastScanAt: 0,
    siteStats: [],
    siteStatsLoaded: false,
  };

  addStyles();
  bootstrap();

  function bootstrap() {
    maybeLoadOfficialTradeStats();
    scanForRows();

    const observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - state.lastScanAt < SCAN_INTERVAL_MS) {
        return;
      }
      scanForRows();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    document.addEventListener('focusin', handleFocusIn, true);
    document.addEventListener('input', handleInput, true);
    document.addEventListener('change', handleInput, true);
  }

  function handleFocusIn(event) {
    const row = resolveFilterRow(event.target);
    if (!row) {
      return;
    }
    enhanceRow(row);
  }

  function handleInput(event) {
    const row = resolveFilterRow(event.target);
    if (!row) {
      return;
    }
    enhanceRow(row);
    syncHighlightForRow(row);
  }

  function scanForRows() {
    state.lastScanAt = Date.now();
    const candidates = collectCandidateRows();
    candidates.forEach(enhanceRow);
  }

  function collectCandidateRows() {
    const candidates = new Set();
    const inputs = Array.from(document.querySelectorAll('input'));

    inputs.forEach((input) => {
      const row = resolveFilterRow(input);
      if (row) {
        candidates.add(row);
      }
    });

    return Array.from(candidates);
  }

  function resolveFilterRow(node) {
    if (!(node instanceof Element)) {
      return null;
    }

    const row = node.closest(`[${ROW_MARKER}]`) || climbForCandidateRow(node);
    if (!row) {
      return null;
    }

    if (!row.hasAttribute(ROW_MARKER)) {
      row.setAttribute(ROW_MARKER, '1');
    }

    return row;
  }

  function climbForCandidateRow(node) {
    let current = node;
    while (current && current !== document.body) {
      if (looksLikeFilterRow(current)) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  function looksLikeFilterRow(element) {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    const inputs = getVisibleInputs(element);
    if (inputs.length < 2 || inputs.length > 6) {
      return false;
    }

    const statText = extractRowText(element);
    if (!statText || statText.length < 4) {
      return false;
    }

    return /#|％|%|ライフ|耐性|ダメージ|速度|命中|Life|Resistance|Damage|Speed|Armour|Evasion|Energy/i.test(statText);
  }

  function enhanceRow(row) {
    const inputs = getVisibleInputs(row);
    if (inputs.length < 2) {
      removePanel(row);
      return;
    }

    const statMatch = resolveAffixForRow(row);
    if (!statMatch) {
      renderUnsupportedPanel(row, 'affix を判定できませんでした');
      return;
    }

    const panel = ensurePanel(row);
    panel.dataset.affixKey = statMatch.affix.key;
    panel.innerHTML = '';

    const title = document.createElement('div');
    title.className = `${PANEL_CLASS}__title`;
    title.textContent = `${statMatch.affix.displayName} のTier`;
    panel.appendChild(title);

    const meta = document.createElement('div');
    meta.className = `${PANEL_CLASS}__meta`;
    meta.textContent = statMatch.affix.type === 'single'
      ? 'Tierクリックで min/max を即入力'
      : '複合mod: 対応する入力欄に順番で自動入力';
    panel.appendChild(meta);

    const tierList = document.createElement('div');
    tierList.className = `${PANEL_CLASS}__list`;

    statMatch.affix.tiers.forEach((tier) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `${PANEL_CLASS}__tier`;
      button.dataset.tier = tier.label;
      button.textContent = `${tier.label} ${formatTierRange(statMatch.affix, tier)}`;
      button.addEventListener('click', () => {
        applyTierToRow(row, statMatch.affix, tier);
      });
      tierList.appendChild(button);
    });

    panel.appendChild(tierList);
    syncHighlightForRow(row);
  }

  function renderUnsupportedPanel(row, message) {
    const panel = ensurePanel(row);
    panel.dataset.affixKey = '';
    panel.innerHTML = '';

    const title = document.createElement('div');
    title.className = `${PANEL_CLASS}__title`;
    title.textContent = 'Tier helper';
    panel.appendChild(title);

    const body = document.createElement('div');
    body.className = `${PANEL_CLASS}__meta`;
    body.textContent = message;
    panel.appendChild(body);
  }

  function removePanel(row) {
    const panel = row.nextElementSibling instanceof HTMLElement && row.nextElementSibling.classList.contains(PANEL_CLASS)
      ? row.nextElementSibling
      : null;
    if (panel instanceof HTMLElement) {
      panel.remove();
    }
  }

  function ensurePanel(row) {
    let panel = row.nextElementSibling;
    if (!(panel instanceof HTMLElement) || !panel.classList.contains(PANEL_CLASS)) {
      panel = document.createElement('div');
      panel.className = PANEL_CLASS;
      row.insertAdjacentElement('afterend', panel);
    }
    return panel;
  }

  function resolveAffixForRow(row) {
    const text = extractRowText(row);
    const normalizedText = normalizeText(text);
    if (!normalizedText) {
      return null;
    }

    for (const alias of AFFIX_INDEX.aliases) {
      if (normalizedText.includes(alias.normalized)) {
        return { affix: alias.affix, matchedAlias: alias.raw, source: 'embedded' };
      }
    }

    if (state.siteStatsLoaded) {
      for (const stat of state.siteStats) {
        const normalizedLabel = normalizeText(stat.label);
        if (normalizedLabel && normalizedText.includes(normalizedLabel)) {
          const affix = findAffixByOfficialLabel(stat.label);
          if (affix) {
            return { affix, matchedAlias: stat.label, source: 'official-stats' };
          }
        }
      }
    }

    return null;
  }

  function findAffixByOfficialLabel(label) {
    const normalized = normalizeText(label);
    return AFFIX_DATA.find((affix) => affix.normalizedAliases.some((alias) => alias === normalized)) || null;
  }

  function applyTierToRow(row, affix, tier) {
    const inputs = getVisibleInputs(row);
    if (inputs.length < 2) {
      return;
    }

    if (affix.type === 'single') {
      setInputValue(inputs[0], tier.min);
      setInputValue(inputs[1], tier.max);
    } else {
      const orderedValues = affix.fields.flatMap((field) => {
        const value = tier.values[field.key];
        return value == null ? [] : [value];
      });
      orderedValues.forEach((value, index) => {
        if (inputs[index]) {
          setInputValue(inputs[index], value);
        }
      });
    }

    syncHighlightForRow(row);
  }

  function syncHighlightForRow(row) {
    const panel = row.nextElementSibling;
    if (!(panel instanceof HTMLElement) || !panel.classList.contains(PANEL_CLASS)) {
      return;
    }

    const affix = AFFIX_DATA.find((item) => item.key === panel.dataset.affixKey);
    if (!affix) {
      return;
    }

    const activeTier = resolveActiveTier(row, affix);
    panel.querySelectorAll(`.${PANEL_CLASS}__tier`).forEach((button) => {
      const isActive = button instanceof HTMLElement && button.dataset.tier === activeTier;
      button.classList.toggle('is-active', Boolean(isActive));
    });
  }

  function resolveActiveTier(row, affix) {
    const inputs = getVisibleInputs(row);
    if (inputs.length < 2) {
      return null;
    }

    if (affix.type === 'single') {
      const min = parseNumberish(inputs[0].value);
      const max = parseNumberish(inputs[1].value);
      const exactTier = affix.tiers.find((tier) => tier.min === min && tier.max === max);
      if (exactTier) {
        return exactTier.label;
      }
      if (min == null && max == null) {
        return null;
      }
      const overlappingTier = affix.tiers.find((tier) => {
        const minMatches = min == null || (min >= tier.min && min <= tier.max);
        const maxMatches = max == null || (max >= tier.min && max <= tier.max);
        return minMatches && maxMatches;
      });
      return overlappingTier ? overlappingTier.label : null;
    }

    const values = affix.fields.map((field, index) => ({
      field,
      value: parseNumberish(inputs[index]?.value),
    }));

    const exactTier = affix.tiers.find((tier) => values.every(({ field, value }) => value == null || tier.values[field.key] === value));
    return exactTier ? exactTier.label : null;
  }

  async function maybeLoadOfficialTradeStats() {
    try {
      const response = await fetch('/api/trade/data/stats', { credentials: 'same-origin' });
      if (!response.ok) {
        return;
      }

      const payload = await response.json();
      const entries = [];
      for (const result of payload.result || []) {
        for (const entry of result.entries || []) {
          entries.push({ id: entry.id, label: entry.text || '' });
        }
      }
      state.siteStats = entries;
      state.siteStatsLoaded = true;
      debug('Loaded official trade stats', entries.length);
    } catch (error) {
      debug('Unable to load official trade stats', error);
    }
  }

  function extractRowText(row) {
    const clone = row.cloneNode(true);
    clone.querySelectorAll('input, button svg, style, script').forEach((element) => element.remove());
    return clone.textContent?.replace(/\s+/g, ' ').trim() || '';
  }

  function getVisibleInputs(container) {
    return Array.from(container.querySelectorAll('input'))
      .filter((input) => input instanceof HTMLInputElement)
      .filter((input) => isVisible(input))
      .filter((input) => input.type !== 'hidden')
      .filter((input) => input.readOnly !== true)
      .slice(0, 4);
  }

  function isVisible(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  function setInputValue(input, value) {
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    nativeSetter?.call(input, String(value));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.setAttribute(INPUT_MARKER, '1');
  }

  function parseNumberish(value) {
    if (value == null || value === '') {
      return null;
    }
    const numeric = Number(String(value).replace(/,/g, '').trim());
    return Number.isFinite(numeric) ? numeric : null;
  }

  function createSingleTierAffix({ key, aliases, tiers }) {
    return {
      key,
      type: 'single',
      aliases,
      normalizedAliases: aliases.map(normalizeText),
      displayName: aliases[0],
      tiers: tiers.map(([label, min, max]) => ({ label, min, max })),
    };
  }

  function createMultiTierAffix({ key, aliases, fields, tiers }) {
    return {
      key,
      type: 'multi',
      aliases,
      normalizedAliases: aliases.map(normalizeText),
      displayName: aliases[0],
      fields,
      tiers: tiers.map(([label, values]) => ({ label, values })),
    };
  }

  function buildAffixIndex(affixes) {
    const aliases = affixes
      .flatMap((affix) => affix.aliases.map((raw) => ({ raw, normalized: normalizeText(raw), affix })))
      .sort((left, right) => right.normalized.length - left.normalized.length);

    return { aliases };
  }

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFKC')
      .replace(/[+#]/g, ' ')
      .replace(/[%％]/g, ' percent ')
      .replace(/[()\[\],.:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function formatTierRange(affix, tier) {
    if (affix.type === 'single') {
      return `${tier.min}–${tier.max}`;
    }
    return affix.fields
      .map((field) => `${field.label}:${tier.values[field.key] ?? '?'}`)
      .join(' / ');
  }

  function addStyles() {
    const css = `
      .${PANEL_CLASS} {
        margin: 6px 0 10px;
        padding: 10px 12px;
        border: 1px solid rgba(210, 166, 92, 0.35);
        background: rgba(24, 18, 12, 0.92);
        border-radius: 8px;
        box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset;
      }

      .${PANEL_CLASS}__title {
        color: #f2d6a2;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 4px;
      }

      .${PANEL_CLASS}__meta {
        color: #b7aa8f;
        font-size: 12px;
        margin-bottom: 8px;
      }

      .${PANEL_CLASS}__list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .${PANEL_CLASS}__tier {
        appearance: none;
        border: 1px solid rgba(210, 166, 92, 0.45);
        background: rgba(48, 33, 21, 0.95);
        color: #efe7d6;
        padding: 6px 9px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        line-height: 1.2;
      }

      .${PANEL_CLASS}__tier:hover {
        background: rgba(79, 55, 33, 0.98);
      }

      .${PANEL_CLASS}__tier.is-active {
        border-color: #f2d6a2;
        box-shadow: 0 0 0 1px rgba(242, 214, 162, 0.4) inset;
        background: rgba(101, 71, 39, 0.98);
      }
    `;

    if (typeof GM_addStyle === 'function') {
      GM_addStyle(css);
      return;
    }

    const style = document.createElement('style');
    style.id = `${SCRIPT_ID}-style`;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function debug(...args) {
    if (DEBUG) {
      console.log(`[${SCRIPT_ID}]`, ...args);
    }
  }
})();
