/*
 * Bastide Cards: custom dashboard cards for Home Assistant.
 * https://github.com/Bolero27/bastide-cards
 *
 * Plain JavaScript, no build step. Every card lives in this file and shares
 * the helpers at the top.
 */

const BASTIDE_VERSION = '0.1.0';
const BASTIDE_REPO = 'https://github.com/Bolero27/bastide-cards';

/* ------------------------------------------------------------------------ */
/* Translations                                                             */
/* ------------------------------------------------------------------------ */

// Cards follow the language of the Home Assistant user profile. Any language
// missing here falls back to English, key by key.
const STRINGS = {
  en: {
    climate: {
      title: 'Heating & cooling',
      hp_on: 'Heat pump running',
      boiler_on: 'Boiler running',
      both_on: 'Heat pump and boiler running',
      cool_on: 'Air conditioning running',
      all_off: 'Everything off',
      above: 'Outdoor {outdoor}, above the {threshold} switch-over point',
      below: 'Outdoor {outdoor}, below the {threshold} switch-over point',
      cool_reason: 'Outdoor {outdoor}, the house is being cooled',
      off_reason: 'Nothing is running',
      gauge_label: 'Outdoor {outdoor}, switch-over at {threshold}',
      zone_boiler: 'Boiler',
      zone_hp: 'Heat pump',
      heating: 'Heating',
      standby: 'Standby',
      on: 'On',
      cooling: 'Cooling',
      drying: 'Drying',
      fan: 'Fan only',
      off: 'Off',
      unavailable: 'Unavailable',
      missing: 'Entity not found',
      with_target: '{status} · target {target}',
      setup: 'Choose your heat pumps and boilers in the card editor.',
    },
    editor: {
      climate: {
        title: 'Title',
        heat_pumps: 'Heat pumps',
        boilers: 'Boilers',
        outdoor_entity: 'Outdoor temperature sensor',
        switch_over: 'Switch-over temperature',
        switch_over_help: 'Below this outdoor temperature, the boiler takes over from the heat pumps.',
        season_entity: 'Season (optional)',
        presence_entity: 'Presence (optional)',
        gauge_min: 'Gauge minimum',
        gauge_max: 'Gauge maximum',
      },
    },
  },
  fr: {
    climate: {
      title: 'Chauffage et clim',
      hp_on: 'Pompe à chaleur en marche',
      boiler_on: 'Chaudière en marche',
      both_on: 'PAC et chaudière en marche',
      cool_on: 'Climatisation en marche',
      all_off: 'Tout est arrêté',
      above: 'Extérieur {outdoor}, au-dessus du seuil de {threshold}',
      below: 'Extérieur {outdoor}, sous le seuil de {threshold}',
      cool_reason: 'Extérieur {outdoor}, la maison est rafraîchie',
      off_reason: 'Aucun appareil en marche',
      gauge_label: 'Extérieur {outdoor}, bascule à {threshold}',
      zone_boiler: 'Chaudière',
      zone_hp: 'PAC',
      heating: 'Chauffe',
      standby: 'En veille',
      on: 'Allumé',
      cooling: 'Refroidit',
      drying: 'Déshumidifie',
      fan: 'Ventilation',
      off: 'Arrêt',
      unavailable: 'Indisponible',
      missing: 'Entité introuvable',
      with_target: '{status} · consigne {target}',
      setup: 'Choisissez vos pompes à chaleur et chaudières dans l’éditeur de la carte.',
    },
    editor: {
      climate: {
        title: 'Titre',
        heat_pumps: 'Pompes à chaleur',
        boilers: 'Chaudières',
        outdoor_entity: 'Capteur de température extérieure',
        switch_over: 'Température de bascule',
        switch_over_help: 'Sous cette température extérieure, la chaudière prend le relais des pompes à chaleur.',
        season_entity: 'Saison (facultatif)',
        presence_entity: 'Présence (facultatif)',
        gauge_min: 'Minimum de la jauge',
        gauge_max: 'Maximum de la jauge',
      },
    },
  },
};

// Last Home Assistant object seen by any card. The visual editor has no direct
// access to it, and needs it to pick the language of its labels.
let lastHass;

function languageOf(hass) {
  const source = hass || lastHass || document.querySelector('home-assistant')?.hass;
  const code = String(source?.locale?.language || source?.language || navigator.language || 'en');
  const base = code.toLowerCase().split('-')[0];
  return STRINGS[base] ? base : 'en';
}

function lookup(hass, key) {
  const find = (lang) => key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), STRINGS[lang]);
  const text = find(languageOf(hass));
  return typeof text === 'string' ? text : find('en');
}

function translate(hass, key, vars = {}) {
  const text = lookup(hass, key);
  if (typeof text !== 'string') return key;
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
}

/* ------------------------------------------------------------------------ */
/* Shared helpers                                                           */
/* ------------------------------------------------------------------------ */

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[ch]);
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

// Honours the number format chosen in the Home Assistant user profile.
function numberLocale(hass) {
  const locale = hass?.locale || {};
  const language = locale.language || hass?.language || 'en';
  switch (locale.number_format) {
    case 'comma_decimal': return { locale: 'en-US', grouping: true };
    case 'decimal_comma': return { locale: 'de', grouping: true };
    case 'space_comma': return { locale: 'fr', grouping: true };
    case 'system': return { locale: undefined, grouping: true };
    case 'none': return { locale: language, grouping: false };
    default: return { locale: language, grouping: true };
  }
}

function formatNumber(hass, value, digits) {
  const { locale, grouping } = numberLocale(hass);
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      useGrouping: grouping,
    }).format(value);
  } catch (err) {
    return value.toFixed(digits);
  }
}

// Whole numbers stay whole (21 °C), others keep one decimal (20.4 °C).
function formatTemperature(hass, value, unit, digits) {
  const places = digits ?? (Number.isInteger(value) ? 0 : 1);
  return `${formatNumber(hass, value, places)} ${unit}`;
}

function formatState(hass, stateObj) {
  if (!stateObj) return '';
  try {
    if (typeof hass.formatEntityState === 'function') return hass.formatEntityState(stateObj);
  } catch (err) {
    // Older Home Assistant versions: fall back to the raw state.
  }
  return stateObj.state;
}

function isUsable(stateObj) {
  return Boolean(stateObj) && stateObj.state !== 'unavailable' && stateObj.state !== 'unknown';
}

// Accepts `climate.x`, `[climate.x, …]` or `[{ entity: climate.x }, …]`.
function entityList(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return list
    .map((item) => (typeof item === 'string' ? item : item?.entity))
    .filter((id) => typeof id === 'string' && id.includes('.'));
}

function fireMoreInfo(node, entityId) {
  node.dispatchEvent(new CustomEvent('hass-more-info', {
    detail: { entityId },
    bubbles: true,
    composed: true,
  }));
}

/* ------------------------------------------------------------------------ */
/* Climate card                                                             */
/* ------------------------------------------------------------------------ */

const CLIMATE_DEFAULTS = { switch_over: 5, gauge_min: -10, gauge_max: 25 };

// Reads one heat pump or boiler. Climate entities give their mode, current
// action and temperatures; switches and booleans only say on or off.
function readSource(hass, entityId, kind) {
  const source = {
    entityId, kind, name: entityId, mode: 'missing', heats: false, cools: false, target: null, current: null,
  };
  const stateObj = hass.states[entityId];
  if (!stateObj) return source;

  const attrs = stateObj.attributes || {};
  const state = stateObj.state;
  source.name = attrs.friendly_name || entityId;
  if (!isUsable(stateObj)) {
    source.mode = 'unavailable';
    return source;
  }

  if (!entityId.startsWith('climate.')) {
    source.mode = state === 'on' ? 'heating' : 'off';
    source.heats = state === 'on';
    return source;
  }

  source.current = toNumber(attrs.current_temperature);
  source.target = toNumber(attrs.temperature);
  if (state === 'off') {
    source.mode = 'off';
    return source;
  }

  const action = attrs.hvac_action;
  if (action === 'heating' || action === 'preheating' || action === 'defrosting') source.mode = 'heating';
  else if (action === 'cooling') source.mode = 'cooling';
  else if (action === 'drying') source.mode = 'drying';
  else if (action === 'fan') source.mode = 'fan';
  else if (action === 'idle' || action === 'off') source.mode = 'standby';
  else source.mode = { heat: 'heating', cool: 'cooling', dry: 'drying', fan_only: 'fan' }[state] || 'on';

  // `heats` / `cools` describe the mode the source is set to, not whether it
  // is blowing right now: a heat pump in heat mode that reached its target
  // is still the heat source in use.
  const coolingNow = source.mode === 'cooling' || source.mode === 'drying';
  if (state === 'heat') source.heats = true;
  else if (state === 'cool' || state === 'dry') source.cools = true;
  else if (state === 'heat_cool' || state === 'auto') {
    if (coolingNow) source.cools = true;
    else if (source.mode !== 'fan') source.heats = true;
  }
  return source;
}

function sourceStatus(hass, source, unit) {
  const label = translate(hass, `climate.${source.mode}`);
  const showsTarget = ['heating', 'standby', 'on', 'cooling'].includes(source.mode) && source.target !== null;
  if (!showsTarget) return label;
  return translate(hass, 'climate.with_target', {
    status: label,
    target: formatTemperature(hass, source.target, unit),
  });
}

const CLIMATE_STYLES = `
  :host {
    --bc-hp: var(--bastide-heat-pump-color, #0277bd);
    --bc-boiler: var(--bastide-boiler-color, #ef6c00);
    --bc-zone: 35%;
    --bc-tint: 14%;
  }
  ha-card.dark {
    --bc-hp: var(--bastide-heat-pump-color, #3aa8f0);
    --bc-boiler: var(--bastide-boiler-color, #ffb74d);
    --bc-zone: 50%;
    --bc-tint: 20%;
  }
  .content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: var(--primary-text-color);
  }
  .accent-hp { --accent: var(--bc-hp); }
  .accent-boiler { --accent: var(--bc-boiler); }
  .accent-neutral { --accent: var(--secondary-text-color); }
  button {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    margin: 0;
    padding: 0;
    text-align: inherit;
    cursor: pointer;
  }
  button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
  .icon {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) var(--bc-tint), transparent);
    --mdc-icon-size: 20px;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .title {
    flex: 1;
    min-width: 0;
    font-size: 16px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chip {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
  }
  .status {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .headline {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
  }
  .dot {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--accent);
  }
  .reason, .setup {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--secondary-text-color);
  }
  .gauge {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .gauge-value, .gauge-labels {
    position: relative;
  }
  .gauge-value {
    height: 20px;
  }
  .gauge-value span, .gauge-labels span {
    position: absolute;
    top: 0;
    white-space: nowrap;
  }
  .gauge-value span {
    transform: translateX(-50%);
    font-size: 13px;
    line-height: 20px;
    font-weight: 500;
  }
  .gauge-bar {
    position: relative;
    display: flex;
    height: 10px;
  }
  .zone-boiler {
    border-radius: 5px 0 0 5px;
    background: color-mix(in srgb, var(--bc-boiler) var(--bc-zone), transparent);
  }
  .zone-hp {
    flex: 1;
    border-radius: 0 5px 5px 0;
    background: color-mix(in srgb, var(--bc-hp) var(--bc-zone), transparent);
  }
  .threshold {
    position: absolute;
    top: -4px;
    width: 2px;
    height: 18px;
    margin-left: -1px;
    background: var(--primary-text-color);
  }
  .marker {
    position: absolute;
    top: -3px;
    width: 16px;
    height: 16px;
    margin-left: -8px;
    box-sizing: border-box;
    border-radius: 50%;
    background: var(--primary-text-color);
    border: 3px solid var(--ha-card-background, var(--card-background-color, #fff));
  }
  .gauge-labels {
    height: 16px;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }
  .gauge-labels .start { left: 0; }
  .gauge-labels .end { right: 0; }
  .gauge-labels .mid { transform: translateX(-50%); }
  .sources {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 12px;
    border-top: 1px solid var(--divider-color);
  }
  .source {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 48px;
    margin: 0 -6px;
    padding: 0 6px;
    border-radius: 8px;
  }
  .source:hover {
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
  }
  .source.hp { --accent: var(--bc-hp); }
  .source.boiler { --accent: var(--bc-boiler); }
  .source:not(.active) .icon {
    color: var(--secondary-text-color);
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
  }
  .text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .name {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .state {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }
  .value {
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
  }
  .footer {
    padding-top: 12px;
    border-top: 1px solid var(--divider-color);
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
  }
`;

class BastideClimateCard extends HTMLElement {
  static getConfigForm() {
    const sourceFilter = [{ domain: 'climate' }, { domain: 'switch' }, { domain: 'input_boolean' }];
    const unit = lastHass?.config?.unit_system?.temperature || '°C';
    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        { name: 'heat_pumps', selector: { entity: { multiple: true, filter: sourceFilter } } },
        { name: 'boilers', selector: { entity: { multiple: true, filter: sourceFilter } } },
        { name: 'outdoor_entity', selector: { entity: { filter: { domain: 'sensor', device_class: 'temperature' } } } },
        {
          name: 'switch_over',
          selector: { number: { min: -30, max: 30, step: 0.5, mode: 'box', unit_of_measurement: unit } },
        },
        { name: 'season_entity', selector: { entity: { filter: [{ domain: 'input_select' }, { domain: 'select' }, { domain: 'sensor' }] } } },
        { name: 'presence_entity', selector: { entity: {} } },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'gauge_min', selector: { number: { min: -50, max: 30, step: 1, mode: 'box', unit_of_measurement: unit } } },
            { name: 'gauge_max', selector: { number: { min: -20, max: 60, step: 1, mode: 'box', unit_of_measurement: unit } } },
          ],
        },
      ],
      computeLabel: (schema) => (schema.name ? lookup(null, `editor.climate.${schema.name}`) : undefined),
      computeHelper: (schema) => (schema.name === 'switch_over' ? lookup(null, 'editor.climate.switch_over_help') : undefined),
    };
  }

  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {});
    const climates = ids.filter((id) => id.startsWith('climate.'));
    const outdoor = ids.find((id) => {
      const attrs = hass.states[id].attributes || {};
      return id.startsWith('sensor.')
        && attrs.device_class === 'temperature'
        && /outdoor|outside|exterior|ext[eé]rieur/i.test(`${id} ${attrs.friendly_name || ''}`);
    });
    const stub = { heat_pumps: climates.slice(0, 2), switch_over: CLIMATE_DEFAULTS.switch_over };
    if (outdoor) stub.outdoor_entity = outdoor;
    return stub;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = null;
    this._hass = null;
    this._seen = new Map();
    this._renderKey = '';
    this.shadowRoot.addEventListener('click', (ev) => {
      const target = ev.target.closest('[data-entity]');
      if (target) fireMoreInfo(this, target.dataset.entity);
    });
  }

  setConfig(config) {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration');
    }
    this._config = { ...config };
    this._renderKey = '';
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    lastHass = hass;
    if (this._hasChanged()) this._render();
  }

  getCardSize() {
    return 6;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  _watchedEntities() {
    const config = this._config;
    return [
      ...entityList(config.heat_pumps),
      ...entityList(config.boilers),
      config.outdoor_entity,
      config.season_entity,
      config.presence_entity,
    ].filter(Boolean);
  }

  _currentKey() {
    const hass = this._hass;
    return [languageOf(hass), hass.themes?.darkMode ? 'dark' : 'light', hass.locale?.number_format || ''].join('|');
  }

  // Home Assistant sends a new `hass` on every state change in the house:
  // only redraw when something this card shows has changed.
  _hasChanged() {
    if (!this._config || !this._hass) return false;
    if (this._currentKey() !== this._renderKey) return true;
    return this._watchedEntities().some((id) => this._seen.get(id) !== this._hass.states[id]);
  }

  _render() {
    if (!this._config || !this._hass) return;
    const hass = this._hass;
    this._renderKey = this._currentKey();
    this._seen = new Map(this._watchedEntities().map((id) => [id, hass.states[id]]));
    this.shadowRoot.innerHTML = `<style>${CLIMATE_STYLES}</style>${this._cardHtml()}`;
  }

  _cardHtml() {
    const hass = this._hass;
    const config = this._config;
    const t = (key, vars) => translate(hass, `climate.${key}`, vars);
    const unit = hass.config?.unit_system?.temperature || '°C';
    const dark = Boolean(hass.themes?.darkMode);
    const title = config.title || t('title');

    const heatPumps = entityList(config.heat_pumps).map((id) => readSource(hass, id, 'hp'));
    const boilers = entityList(config.boilers).map((id) => readSource(hass, id, 'boiler'));
    const sources = [...heatPumps, ...boilers];

    if (!sources.length) {
      return `
        <ha-card class="${dark ? 'dark' : ''}">
          <div class="content accent-neutral">
            <div class="header">
              <span class="icon"><ha-icon icon="mdi:thermometer"></ha-icon></span>
              <span class="title">${escapeHtml(title)}</span>
            </div>
            <p class="setup">${escapeHtml(t('setup'))}</p>
          </div>
        </ha-card>`;
    }

    // What is running: heating wins over cooling, and the boiler is named
    // first when both heat sources run at once.
    const pumpHeats = heatPumps.some((s) => s.heats);
    const boilerHeats = boilers.some((s) => s.heats);
    let status = 'all_off';
    let accent = 'neutral';
    if (pumpHeats && boilerHeats) [status, accent] = ['both_on', 'boiler'];
    else if (boilerHeats) [status, accent] = ['boiler_on', 'boiler'];
    else if (pumpHeats) [status, accent] = ['hp_on', 'hp'];
    else if (sources.some((s) => s.cools)) [status, accent] = ['cool_on', 'hp'];
    const cooling = status === 'cool_on';

    // Outdoor temperature against the switch-over point.
    const outdoorState = config.outdoor_entity ? hass.states[config.outdoor_entity] : undefined;
    const outdoor = isUsable(outdoorState) ? toNumber(outdoorState.state) : null;
    const outdoorUnit = outdoorState?.attributes?.unit_of_measurement || unit;
    const threshold = toNumber(config.switch_over) ?? CLIMATE_DEFAULTS.switch_over;
    const outdoorText = outdoor === null ? '' : formatTemperature(hass, outdoor, outdoorUnit, 1);
    const thresholdText = formatTemperature(hass, threshold, outdoorUnit);

    let reason = '';
    if (status === 'all_off') reason = t('off_reason');
    else if (outdoor !== null && cooling) reason = t('cool_reason', { outdoor: outdoorText });
    else if (outdoor !== null) {
      reason = t(outdoor >= threshold ? 'above' : 'below', { outdoor: outdoorText, threshold: thresholdText });
    }

    const seasonState = config.season_entity ? hass.states[config.season_entity] : undefined;
    const presenceState = config.presence_entity ? hass.states[config.presence_entity] : undefined;

    const header = `
      <div class="header accent-${accent}">
        <span class="icon"><ha-icon icon="${cooling ? 'mdi:snowflake' : 'mdi:thermometer'}"></ha-icon></span>
        <span class="title">${escapeHtml(title)}</span>
        ${isUsable(seasonState)
          ? `<button type="button" class="chip" data-entity="${escapeHtml(config.season_entity)}">${escapeHtml(formatState(hass, seasonState))}</button>`
          : ''}
      </div>`;

    const statusBlock = `
      <div class="status accent-${accent}">
        <div class="headline"><span class="dot"></span><span>${escapeHtml(t(status))}</span></div>
        ${reason ? `<p class="reason">${escapeHtml(reason)}</p>` : ''}
      </div>`;

    const gauge = outdoor !== null && !cooling
      ? this._gaugeHtml(outdoor, threshold, outdoorText, thresholdText)
      : '';

    const rows = sources.map((s) => {
      const active = !['off', 'unavailable', 'missing'].includes(s.mode);
      const value = s.current === null
        ? ''
        : `<span class="value">${escapeHtml(formatTemperature(hass, s.current, unit, 1))}</span>`;
      return `
        <button type="button" class="source ${s.kind}${active ? ' active' : ''}" data-entity="${escapeHtml(s.entityId)}">
          <span class="icon"><ha-icon icon="${s.kind === 'boiler' ? 'mdi:fire' : 'mdi:fan'}"></ha-icon></span>
          <span class="text">
            <span class="name">${escapeHtml(s.name)}</span>
            <span class="state">${escapeHtml(sourceStatus(hass, s, unit))}</span>
          </span>
          ${value}
        </button>`;
    }).join('');

    const footer = isUsable(presenceState)
      ? `<button type="button" class="footer" data-entity="${escapeHtml(config.presence_entity)}">${escapeHtml(
        `${presenceState.attributes?.friendly_name || config.presence_entity} · ${formatState(hass, presenceState)}`,
      )}</button>`
      : '';

    return `
      <ha-card class="${dark ? 'dark' : ''}">
        <div class="content">
          ${header}
          ${statusBlock}
          ${gauge}
          <div class="sources">${rows}</div>
          ${footer}
        </div>
      </ha-card>`;
  }

  _gaugeHtml(outdoor, threshold, outdoorText, thresholdText) {
    const hass = this._hass;
    const t = (key, vars) => translate(hass, `climate.${key}`, vars);
    let min = toNumber(this._config.gauge_min) ?? CLIMATE_DEFAULTS.gauge_min;
    let max = toNumber(this._config.gauge_max) ?? CLIMATE_DEFAULTS.gauge_max;
    if (max <= min) [min, max] = [CLIMATE_DEFAULTS.gauge_min, CLIMATE_DEFAULTS.gauge_max];

    const percent = (value) => ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
    const marker = percent(outdoor);
    const split = percent(threshold);
    // Keep the floating labels inside the card.
    const valueLeft = Math.min(88, Math.max(12, marker));
    const splitLabelLeft = Math.min(80, Math.max(20, split));

    return `
      <div class="gauge" role="img" aria-label="${escapeHtml(t('gauge_label', { outdoor: outdoorText, threshold: thresholdText }))}">
        <div class="gauge-value" aria-hidden="true"><span style="left: ${valueLeft.toFixed(2)}%">${escapeHtml(outdoorText)}</span></div>
        <div class="gauge-bar" aria-hidden="true">
          <span class="zone-boiler" style="width: ${split.toFixed(2)}%"></span>
          <span class="zone-hp"></span>
          <span class="threshold" style="left: ${split.toFixed(2)}%"></span>
          <span class="marker" style="left: ${marker.toFixed(2)}%"></span>
        </div>
        <div class="gauge-labels" aria-hidden="true">
          <span class="start">${escapeHtml(t('zone_boiler'))}</span>
          <span class="mid" style="left: ${splitLabelLeft.toFixed(2)}%">${escapeHtml(thresholdText)}</span>
          <span class="end">${escapeHtml(t('zone_hp'))}</span>
        </div>
      </div>`;
  }
}

/* ------------------------------------------------------------------------ */
/* Registration                                                             */
/* ------------------------------------------------------------------------ */

if (!customElements.get('bastide-climate-card')) {
  customElements.define('bastide-climate-card', BastideClimateCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'bastide-climate-card',
    name: 'Bastide Climate',
    description: 'Which heat source is running and why in winter, the air conditioning in summer.',
    preview: true,
    documentationURL: BASTIDE_REPO,
  });
}

console.info(
  `%c BASTIDE CARDS %c ${BASTIDE_VERSION} `,
  'color: #fff; background: #8a5a14; font-weight: 700; border-radius: 3px 0 0 3px',
  'color: #8a5a14; background: #f3ebe0; border-radius: 0 3px 3px 0',
);
