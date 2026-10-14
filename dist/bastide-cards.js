/*
 * Bastide Cards: custom dashboard cards for Home Assistant.
 * https://github.com/Bolero27/bastide-cards
 *
 * Plain JavaScript, no build step. Every card lives in this file and is built
 * from the same pieces, so the whole pack shares one look:
 *   1. Translations and helpers (languages, numbers, escaping).
 *   2. The Bastide style: shared CSS and HTML building blocks.
 *   3. BastideCard, the base class every card extends.
 *   4. The cards themselves.
 */

const BASTIDE_VERSION = '0.5.0';
const BASTIDE_REPO = 'https://github.com/Bolero27/bastide-cards';

/* ------------------------------------------------------------------------ */
/* 1. Translations and helpers                                              */
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
      between: 'Outdoor {outdoor}, between {low} and {high}: the current source stays on',
      cool_reason: 'Outdoor {outdoor}, the house is being cooled',
      off_reason: 'Nothing is running',
      gauge_label: 'Outdoor {outdoor}, switch-over at {threshold}',
      threshold_boiler: 'Boiler threshold: {value}',
      threshold_hp: 'Heat pump threshold: {value}',
      threshold_single: 'Switch-over point: {value}',
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
      target: 'Target',
      room: 'room {value}',
      lower: 'Lower the target',
      raise: 'Raise the target',
      central_mode: 'Thermostats mode',
    },
    agenda: {
      title: 'Calendar',
      all_day: 'All day',
      empty: 'Nothing planned in the next {days} days.',
      setup: 'Choose one or more calendars in the card editor.',
      error: 'The calendar could not be read.',
    },
    presence: {
      title: 'Home',
      outdoor: 'Outdoor',
      modes: 'Presence modes',
      unavailable: 'Unavailable',
      setup: 'Choose the helper that holds your presence modes in the card editor.',
    },
    entities: {
      setup: 'Choose entities in the card editor.',
      unavailable: 'Unavailable',
      missing: 'Entity not found',
      toggle: 'Turn {name} on or off',
    },
    editor: {
      presence: {
        entity: 'Presence modes (input_select or select)',
        title: 'Title',
        outdoor_entity: 'Outdoor temperature sensor (optional)',
        season_entity: 'Season (optional)',
      },
      entities: {
        title: 'Title',
        icon: 'Icon',
        color: 'Colour',
        entities: 'Entities',
      },
      agenda: {
        entities: 'Calendars',
        title: 'Title',
        color: 'Colour',
        days: 'Days ahead',
        max_events: 'Events shown',
      },
      colors: {
        orange: 'Orange', blue: 'Blue', pink: 'Pink', violet: 'Violet',
        teal: 'Teal', yellow: 'Yellow', green: 'Green', steel: 'Steel blue',
      },
      climate: {
        title: 'Title',
        heat_pumps: 'Heat pumps',
        boilers: 'Boilers',
        outdoor_entity: 'Outdoor temperature sensor',
        boiler_threshold_entity: 'Boiler threshold (helper)',
        boiler_threshold_entity_help: 'Below this outdoor temperature, the boiler takes over. Pick the helper your automations use, so the card always matches them.',
        heat_pump_threshold_entity: 'Heat pump threshold (helper)',
        heat_pump_threshold_entity_help: 'Above this outdoor temperature, the heat pumps take over again. Leave empty if it is the same as the boiler threshold.',
        switch_over: 'Fixed switch-over temperature',
        switch_over_help: 'Used when no helper is chosen.',
        season_entity: 'Season (optional)',
        presence_entity: 'Presence (optional)',
        gauge_min: 'Gauge minimum',
        gauge_max: 'Gauge maximum',
        layout: 'Layout',
        layout_rows: 'List',
        layout_tiles: 'Tiles with target buttons',
        central_mode_entity: 'Thermostats mode selector (optional)',
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
      between: 'Extérieur {outdoor}, entre {low} et {high} : la source actuelle est conservée',
      cool_reason: 'Extérieur {outdoor}, la maison est rafraîchie',
      off_reason: 'Aucun appareil en marche',
      gauge_label: 'Extérieur {outdoor}, bascule à {threshold}',
      threshold_boiler: 'Seuil chaudière : {value}',
      threshold_hp: 'Seuil PAC : {value}',
      threshold_single: 'Seuil de bascule : {value}',
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
      target: 'Consigne',
      room: 'pièce {value}',
      lower: 'Baisser la consigne',
      raise: 'Monter la consigne',
      central_mode: 'Mode des thermostats',
    },
    agenda: {
      title: 'Agenda',
      all_day: 'Toute la journée',
      empty: 'Rien de prévu dans les {days} prochains jours.',
      setup: 'Choisissez un ou plusieurs calendriers dans l’éditeur de la carte.',
      error: 'Impossible de lire le calendrier.',
    },
    presence: {
      title: 'Maison',
      outdoor: 'Extérieur',
      modes: 'Modes de présence',
      unavailable: 'Indisponible',
      setup: 'Choisissez le helper qui contient vos modes de présence dans l’éditeur de la carte.',
    },
    entities: {
      setup: 'Choisissez les entités dans l’éditeur de la carte.',
      unavailable: 'Indisponible',
      missing: 'Entité introuvable',
      toggle: 'Allumer ou éteindre {name}',
    },
    editor: {
      presence: {
        entity: 'Modes de présence (input_select ou select)',
        title: 'Titre',
        outdoor_entity: 'Capteur de température extérieure (facultatif)',
        season_entity: 'Saison (facultatif)',
      },
      entities: {
        title: 'Titre',
        icon: 'Icône',
        color: 'Couleur',
        entities: 'Entités',
      },
      agenda: {
        entities: 'Calendriers',
        title: 'Titre',
        color: 'Couleur',
        days: 'Jours à afficher',
        max_events: 'Événements affichés',
      },
      colors: {
        orange: 'Orange', blue: 'Bleu', pink: 'Rose', violet: 'Violet',
        teal: 'Turquoise', yellow: 'Jaune', green: 'Vert', steel: 'Bleu acier',
      },
      climate: {
        title: 'Titre',
        heat_pumps: 'Pompes à chaleur',
        boilers: 'Chaudières',
        outdoor_entity: 'Capteur de température extérieure',
        boiler_threshold_entity: 'Seuil chaudière (helper)',
        boiler_threshold_entity_help: 'Sous cette température extérieure, la chaudière prend le relais. Choisissez le helper utilisé par vos automatisations : la carte restera toujours d’accord avec elles.',
        heat_pump_threshold_entity: 'Seuil PAC (helper)',
        heat_pump_threshold_entity_help: 'Au-dessus de cette température extérieure, les PAC reprennent la main. Laissez vide si c’est le même seuil que la chaudière.',
        switch_over: 'Seuil fixe',
        switch_over_help: 'Utilisé si aucun helper n’est choisi.',
        season_entity: 'Saison (facultatif)',
        presence_entity: 'Présence (facultatif)',
        gauge_min: 'Minimum de la jauge',
        gauge_max: 'Maximum de la jauge',
        layout: 'Disposition',
        layout_rows: 'Liste',
        layout_tiles: 'Tuiles avec boutons de consigne',
        central_mode_entity: 'Sélecteur du mode des thermostats (facultatif)',
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

// Whole numbers stay whole (21), others keep one decimal (20.4).
function formatNumber(hass, value, digits) {
  const places = digits ?? (Number.isInteger(value) ? 0 : 1);
  const { locale, grouping } = numberLocale(hass);
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: places,
      maximumFractionDigits: places,
      useGrouping: grouping,
    }).format(value);
  } catch (err) {
    return value.toFixed(places);
  }
}

function formatTemperature(hass, value, unit, digits) {
  return `${formatNumber(hass, value, digits)} ${unit}`;
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

// Numeric value of an entity, or null when it is missing or not a number.
function entityNumber(hass, entityId) {
  if (!entityId) return null;
  const stateObj = hass.states[entityId];
  return isUsable(stateObj) ? toNumber(stateObj.state) : null;
}

// Accepts `climate.x`, `[climate.x, …]` or `[{ entity: climate.x, name }, …]`.
function entityItems(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return list
    .map((item) => (typeof item === 'string' ? { entity: item } : item))
    .filter((item) => item && typeof item.entity === 'string' && item.entity.includes('.'));
}

function entityList(value) {
  return entityItems(value).map((item) => item.entity);
}

function fireMoreInfo(node, entityId) {
  node.dispatchEvent(new CustomEvent('hass-more-info', {
    detail: { entityId },
    bubbles: true,
    composed: true,
  }));
}

// The Bastide theme sets `bastide-style: hud`. Cards then switch to their HUD
// look and load the theme's fonts, unless the theme sets `bastide-fonts: none`.
function themeVar(node, name) {
  return getComputedStyle(node).getPropertyValue(`--${name}`).trim();
}

function loadHudFonts(node) {
  if (document.getElementById('bastide-fonts') || themeVar(node, 'bastide-fonts') === 'none') return;
  const link = document.createElement('link');
  link.id = 'bastide-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;1,700;1,800&family=Barlow:wght@400;500;600&display=swap';
  document.head.appendChild(link);
}

// Accent colours shared by the whole pack, in a fixed order.
const ACCENTS = ['orange', 'blue', 'pink', 'violet', 'teal', 'yellow', 'green', 'steel'];

function accentName(value, fallback = 'orange') {
  return ACCENTS.includes(value) ? value : fallback;
}

/* ------------------------------------------------------------------------ */
/* 2. The Bastide style                                                     */
/* ------------------------------------------------------------------------ */

// Shared by every card. Colours come from the Home Assistant theme, except the
// accents, which themes can override with the --bastide-<colour> variables.
const BASE_STYLES = `
  ha-card {
    --bc-orange: var(--bastide-orange, #ef6c00);
    --bc-blue: var(--bastide-blue, #0277bd);
    --bc-pink: var(--bastide-pink, #c2185b);
    --bc-violet: var(--bastide-violet, #5e35b1);
    --bc-teal: var(--bastide-teal, #00897b);
    --bc-yellow: var(--bastide-yellow, #a87900);
    --bc-green: var(--bastide-green, #2e7d32);
    --bc-steel: var(--bastide-steel, #45648f);
    --bc-on-accent: #ffffff;
    --bc-tint: 14%;
    --bc-surface: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
  }
  ha-card.dark, ha-card.hud {
    --bc-orange: var(--bastide-orange, #ffb74d);
    --bc-blue: var(--bastide-blue, #3aa8f0);
    --bc-pink: var(--bastide-pink, #ff5fa2);
    --bc-violet: var(--bastide-violet, #a68bff);
    --bc-teal: var(--bastide-teal, #2ee6c5);
    --bc-yellow: var(--bastide-yellow, #ffd84d);
    --bc-green: var(--bastide-green, #4ade80);
    --bc-steel: var(--bastide-steel, #8fb3e8);
    --bc-on-accent: #0b111c;
    --bc-tint: 20%;
  }
  .content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: var(--primary-text-color);
  }
  .accent-orange { --accent: var(--bc-orange); }
  .accent-blue { --accent: var(--bc-blue); }
  .accent-pink { --accent: var(--bc-pink); }
  .accent-violet { --accent: var(--bc-violet); }
  .accent-teal { --accent: var(--bc-teal); }
  .accent-yellow { --accent: var(--bc-yellow); }
  .accent-green { --accent: var(--bc-green); }
  .accent-steel { --accent: var(--bc-steel); }
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
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    min-height: 24px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 500;
    white-space: nowrap;
    background: var(--bc-surface);
  }
  button.chip:hover {
    background: color-mix(in srgb, var(--primary-text-color) 12%, transparent);
  }
  span.chip {
    cursor: default;
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
  .list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: 12px;
    border-top: 1px solid var(--divider-color);
  }
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 48px;
    margin: 0 -6px;
    padding: 0 6px;
    border-radius: 8px;
  }
  .row:hover {
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
  }
  .row:not(.active) .icon {
    color: var(--secondary-text-color);
    background: var(--bc-surface);
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
  .row-main {
    flex: 1;
    min-width: 0;
    min-height: 48px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .toggle {
    flex-shrink: 0;
    min-width: 60px;
    min-height: 36px;
    padding: 0 12px;
    box-sizing: border-box;
    border: 2px solid var(--divider-color);
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .toggle.on {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--bc-on-accent);
  }

  /* HUD look, switched on by the Bastide theme. */
  ha-card.hud {
    border-radius: 0;
    clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%);
  }
  ha-card.hud .title,
  ha-card.hud .headline,
  ha-card.hud .name,
  ha-card.hud .value,
  ha-card.hud .chip,
  ha-card.hud .toggle {
    font-family: var(--ha-font-family-heading, inherit);
  }
  ha-card.hud .title,
  ha-card.hud .headline {
    font-style: italic;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  ha-card.hud .title { font-size: 20px; }
  ha-card.hud .headline { font-size: 26px; line-height: 30px; }
  ha-card.hud .name {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  ha-card.hud .value {
    font-size: 20px;
    font-style: italic;
    font-weight: 800;
  }
  ha-card.hud .chip,
  ha-card.hud .toggle {
    font-size: 13px;
    font-style: italic;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  ha-card.hud .icon,
  ha-card.hud .chip,
  ha-card.hud .toggle {
    border-radius: 0;
    transform: skewX(-12deg);
  }
  ha-card.hud .icon > *,
  ha-card.hud .chip > *,
  ha-card.hud .toggle > * {
    display: inline-block;
    transform: skewX(12deg);
  }
  ha-card.hud .dot {
    border-radius: 0;
    transform: rotate(45deg);
  }
  ha-card.hud .row { border-radius: 0; }
  ha-card.hud .list,
  ha-card.hud .footer { border-top-width: 2px; }

  .headline-icon {
    flex-shrink: 0;
    color: var(--accent);
    --mdc-icon-size: 26px;
  }
  .steps {
    display: flex;
    gap: 6px;
  }
  .step {
    width: 44px;
    height: 40px;
    box-sizing: border-box;
    border: 2px solid var(--divider-color);
    border-radius: 10px;
    font-size: 20px;
    font-weight: 600;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .segmented {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .seg {
    min-height: 36px;
    padding: 0 12px;
    box-sizing: border-box;
    border: 2px solid var(--divider-color);
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    color: var(--secondary-text-color);
  }
  .seg.active {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--bc-on-accent);
  }
  ha-card.hud .step,
  ha-card.hud .seg {
    border-radius: 0;
    transform: skewX(-12deg);
  }
  ha-card.hud .step > *,
  ha-card.hud .seg > * {
    display: inline-block;
    transform: skewX(12deg);
  }
  ha-card.hud .seg {
    font-family: var(--ha-font-family-heading, inherit);
    font-size: 14px;
    font-style: italic;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* HUD: the card title becomes a slanted tab in the card's colour. */
  ha-card.hud .header .icon { display: none; }
  ha-card.hud .header .title {
    flex: 0 1 auto;
    padding: 3px 16px;
    background: var(--accent);
    color: var(--bc-on-accent);
    transform: skewX(-12deg);
  }
  ha-card.hud .header .title > span {
    display: inline-block;
    transform: skewX(12deg);
  }
  ha-card.hud .header > .chip,
  ha-card.hud .header > .segmented { margin-left: auto; }

  /* HUD: a coloured edge that runs across the card on hover, and a light sweep. */
  ha-card.hud {
    position: relative;
    overflow: hidden;
  }
  .fx-edge {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 64px;
    height: 3px;
    background: var(--card-edge);
    pointer-events: none;
    transition: width 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  ha-card.hud:hover .fx-edge { width: 100%; }
  .fx-sweep {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 18%;
    pointer-events: none;
    background: linear-gradient(90deg, transparent, rgba(243, 246, 251, 0.07), transparent);
    animation: bc-sweep 9s ease-in-out infinite;
  }
  ha-card.hud:hover .fx-sweep { animation-duration: 1.6s; }

  /* HUD: hover and press feedback. */
  ha-card.hud .toggle,
  ha-card.hud button.chip,
  ha-card.hud .step,
  ha-card.hud .seg {
    transition: transform 0.15s ease, filter 0.15s ease, box-shadow 0.2s ease;
  }
  ha-card.hud .toggle:hover,
  ha-card.hud button.chip:hover,
  ha-card.hud .step:hover,
  ha-card.hud .seg:hover {
    transform: skewX(-12deg) translateY(-2px);
    filter: brightness(1.2);
    box-shadow: 0 8px 18px -8px var(--accent, var(--primary-color));
  }
  ha-card.hud .toggle:active,
  ha-card.hud button.chip:active,
  ha-card.hud .step:active,
  ha-card.hud .seg:active {
    transform: skewX(-12deg) translateY(1px) scale(0.97);
    filter: brightness(1.35);
  }
  ha-card.hud .toggle.on {
    box-shadow: 0 0 14px -2px color-mix(in srgb, var(--accent) 70%, transparent);
  }
  ha-card.hud .row {
    transition: background-color 0.2s ease, padding-left 0.2s ease;
  }
  ha-card.hud .row:hover { padding-left: 12px; }

  /* Animations, only with the HUD look (theme variable bastide-fx: none turns them off). */
  @keyframes bc-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  @keyframes bc-pulse {
    0%, 100% { box-shadow: 0 0 6px 0 var(--glow); }
    50% { box-shadow: 0 0 22px 3px var(--glow); }
  }
  @keyframes bc-spin { to { transform: rotate(360deg); } }
  @keyframes bc-flicker {
    0%, 100% { transform: scale(1, 1); opacity: 1; }
    25% { transform: scale(1.07, 0.93); opacity: 0.82; }
    50% { transform: scale(0.94, 1.08); opacity: 1; }
    75% { transform: scale(1.04, 0.96); opacity: 0.9; }
  }
  @keyframes bc-sweep {
    0% { transform: translateX(-160%) skewX(-20deg); }
    55%, 100% { transform: translateX(620%) skewX(-20deg); }
  }
  @keyframes bc-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  @keyframes bc-glitch-a {
    0% { text-shadow: -4px 0 var(--bc-pink), 4px 0 var(--bc-blue); transform: translateX(-3px); }
    25% { text-shadow: 3px 0 var(--bc-pink), -3px 0 var(--bc-blue); transform: translateX(3px); }
    50%, 100% { text-shadow: none; transform: none; }
  }
  @keyframes bc-glitch-b {
    0% { text-shadow: -4px 0 var(--bc-pink), 4px 0 var(--bc-blue); transform: translateX(-3px); }
    25% { text-shadow: 3px 0 var(--bc-pink), -3px 0 var(--bc-blue); transform: translateX(3px); }
    50%, 100% { text-shadow: none; transform: none; }
  }
  ha-card.fx.enter .content { animation: bc-in 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
  ha-card.fx .fx-pulse { animation: bc-pulse 2.4s ease-in-out infinite; }
  ha-card.fx .fx-spin { animation: bc-spin 1.4s linear infinite; }
  ha-card.fx .fx-flicker { animation: bc-flicker 0.8s ease-in-out infinite; transform-origin: 50% 90%; }
  ha-card.fx .fx-blink { animation: bc-blink 1.4s ease-in-out infinite; }
  ha-card.fx .fx-glitch-a { animation: bc-glitch-a 0.7s steps(3, end) both; }
  ha-card.fx .fx-glitch-b { animation: bc-glitch-b 0.7s steps(3, end) both; }
  ha-card:not(.fx) .fx-sweep { display: none; }
  @media (prefers-reduced-motion: reduce) {
    ha-card *, ha-card { animation: none !important; transition: none !important; }
    .fx-sweep { display: none; }
  }
`;

// HTML building blocks. Cards assemble these instead of writing their own
// markup, which keeps every card of the pack looking the same. Every text is
// escaped here; icons are `mdi:` names chosen by the cards.
const ui = {
  // A small rounded value. With an entity it is a button that opens the
  // entity's details, where the value can be changed.
  chip({ entityId, text, label }) {
    const named = label ? ` title="${escapeHtml(label)}"` : '';
    const inner = `<span>${escapeHtml(text)}</span>`;
    if (!entityId) return `<span class="chip"${named}>${inner}</span>`;
    const spoken = label ? ` aria-label="${escapeHtml(label)}"` : '';
    return `<button type="button" class="chip" data-entity="${escapeHtml(entityId)}"${named}${spoken}>${inner}</button>`;
  },

  // A row with an on/off switch on the right. Tapping the row opens the
  // entity's details; tapping the switch toggles it.
  toggleRow({ entityId, icon, name, state, value, accent = 'neutral', active = false, toggle }) {
    const switchHtml = toggle
      ? `<button type="button" class="toggle${toggle.on ? ' on' : ''}" aria-pressed="${toggle.on ? 'true' : 'false'}"
           aria-label="${escapeHtml(toggle.label)}" ${ui.action('homeassistant.toggle', { entity_id: entityId })}>
           <span>${toggle.on ? 'ON' : 'OFF'}</span></button>`
      : '';
    return `
      <div class="row accent-${accent}${active ? ' active' : ''}">
        <button type="button" class="row-main" data-entity="${escapeHtml(entityId)}">
          <span class="icon"><ha-icon icon="${escapeHtml(icon)}"></ha-icon></span>
          <span class="text">
            <span class="name">${escapeHtml(name)}</span>
            ${state ? `<span class="state">${escapeHtml(state)}</span>` : ''}
          </span>
          ${value ? `<span class="value">${escapeHtml(value)}</span>` : ''}
        </button>
        ${switchHtml}
      </div>`;
  },

  // Attributes that make a button call a Home Assistant action when tapped.
  action(service, data) {
    return `data-service="${escapeHtml(service)}" data-data="${escapeHtml(JSON.stringify(data))}"`;
  },

  header({ icon, title, accent = 'neutral', chip, extra = '' }) {
    return `
      <div class="header accent-${accent}">
        <span class="icon"><ha-icon icon="${icon}"></ha-icon></span>
        ${title ? `<span class="title"><span>${escapeHtml(title)}</span></span>` : ''}
        ${extra}
        ${chip ? ui.chip(chip) : ''}
      </div>`;
  },

  // `icon` replaces the dot; `iconFx` animates it (fx-spin, fx-flicker).
  status({ headline, reason, accent = 'neutral', icon, iconFx = '' }) {
    const mark = icon
      ? `<ha-icon class="headline-icon ${iconFx}" icon="${escapeHtml(icon)}"></ha-icon>`
      : '<span class="dot"></span>';
    return `
      <div class="status accent-${accent}">
        <div class="headline">${mark}<span>${escapeHtml(headline)}</span></div>
        ${reason ? `<p class="reason">${escapeHtml(reason)}</p>` : ''}
      </div>`;
  },

  // Plus and minus buttons that change a thermostat's target.
  steps({ entityId, target, step = 0.5, labels }) {
    const button = (delta, sign, label) => `
      <button type="button" class="step" aria-label="${escapeHtml(label)}"
        ${ui.action('climate.set_temperature', { entity_id: entityId, temperature: Number((Math.round((target + delta) / step) * step).toFixed(2)) })}>
        <span>${sign}</span></button>`;
    return `<div class="steps">${button(-step, '−', labels.down)}${button(step, '+', labels.up)}</div>`;
  },

  row({ entityId, icon, name, state, value, accent = 'neutral', active = false }) {
    return `
      <button type="button" class="row accent-${accent}${active ? ' active' : ''}" data-entity="${escapeHtml(entityId)}">
        <span class="icon"><ha-icon icon="${icon}"></ha-icon></span>
        <span class="text">
          <span class="name">${escapeHtml(name)}</span>
          <span class="state">${escapeHtml(state)}</span>
        </span>
        ${value ? `<span class="value">${escapeHtml(value)}</span>` : ''}
      </button>`;
  },

  list(rows) {
    return `<div class="list">${rows.join('')}</div>`;
  },

  footer({ entityId, text }) {
    return `<button type="button" class="footer" data-entity="${escapeHtml(entityId)}">${escapeHtml(text)}</button>`;
  },

  setup(text) {
    return `<p class="setup">${escapeHtml(text)}</p>`;
  },
};

/* ------------------------------------------------------------------------ */
/* 3. BastideCard, the base class                                           */
/* ------------------------------------------------------------------------ */

// Handles what every card needs: configuration, redrawing only when one of
// its entities changes, light and dark themes, and opening an entity's
// details when a row is tapped. A card only says which entities it watches
// (watchedEntities) and what it shows (renderContent).
class BastideCard extends HTMLElement {
  static get styles() {
    return '';
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = null;
    this._hass = null;
    this._seen = new Map();
    this._renderKey = '';
    this.shadowRoot.addEventListener('click', (ev) => {
      const target = ev.target.closest('[data-service], [data-entity]');
      if (!target) return;
      if (target.dataset.service && this._hass) {
        const [domain, service] = target.dataset.service.split('.');
        let data = {};
        try {
          data = JSON.parse(target.dataset.data || '{}');
        } catch (err) {
          data = {};
        }
        this._hass.callService(domain, service, data);
        return;
      }
      if (target.dataset.entity) fireMoreInfo(this, target.dataset.entity);
    });
  }

  // The theme is only readable once the card is on the page.
  connectedCallback() {
    this._renderKey = '';
    this._render();
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

  watchedEntities() {
    return [];
  }

  renderContent() {
    return '';
  }

  t(key, vars) {
    return translate(this._hass, key, vars);
  }

  _currentKey() {
    const hass = this._hass;
    return [
      languageOf(hass),
      hass.themes?.darkMode ? 'dark' : 'light',
      hass.themes?.theme || '',
      hass.locale?.number_format || '',
    ].join('|');
  }

  // Home Assistant sends a new `hass` on every state change in the house:
  // only redraw when something this card shows has changed.
  _hasChanged() {
    if (!this._config || !this._hass) return false;
    if (this._currentKey() !== this._renderKey) return true;
    return this.watchedEntities().some((id) => this._seen.get(id) !== this._hass.states[id]);
  }

  // The accent of the coloured edge at the top of the card, in the HUD look.
  edgeAccent() {
    return 'orange';
  }

  _render() {
    if (!this._config || !this._hass) return;
    const hass = this._hass;
    this._renderKey = this._currentKey();
    this._seen = new Map(this.watchedEntities().map((id) => [id, hass.states[id]]));
    // `_hud` and `_fx` are read by the cards while they render.
    this._hud = this.isConnected && themeVar(this, 'bastide-style') === 'hud';
    this._fx = this._hud && themeVar(this, 'bastide-fx') !== 'none';
    if (this._hud) loadHudFonts(this);
    // The entrance animation only plays the first time the card is drawn.
    const enter = this._fx && !this._entered;
    if (this.isConnected) this._entered = true;
    const classes = [
      hass.themes?.darkMode ? 'dark' : '',
      this._hud ? 'hud' : '',
      this._fx ? 'fx' : '',
      enter ? 'enter' : '',
    ].filter(Boolean).join(' ');
    const content = this.renderContent();
    const edge = { hp: 'blue', boiler: 'orange', neutral: 'steel' }[this.edgeAccent()] || accentName(this.edgeAccent());
    const chrome = this._hud ? '<span class="fx-edge"></span><span class="fx-sweep"></span>' : '';
    this.shadowRoot.innerHTML = `
      <style>${BASE_STYLES}${this.constructor.styles}</style>
      <ha-card class="${classes}" style="--card-edge: var(--bc-${edge})">
        ${chrome}
        <div class="content">${content}</div>
      </ha-card>`;
  }
}

/* ------------------------------------------------------------------------ */
/* 4a. Climate card                                                         */
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
  source.step = toNumber(attrs.target_temp_step) || 0.5;
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

// The heat pumps take the blue accent and the boilers the orange one, unless
// a theme sets its own colours for them.
const CLIMATE_STYLES = `
  .content {
    --bc-hp: var(--bastide-heat-pump-color, var(--bc-blue));
    --bc-boiler: var(--bastide-boiler-color, var(--bc-orange));
    --bc-zone: 35%;
  }
  ha-card.dark .content {
    --bc-zone: 50%;
  }
  .accent-hp { --accent: var(--bc-hp); }
  .accent-boiler { --accent: var(--bc-boiler); }
  .gauge {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .gauge-scale {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .gauge-value {
    position: relative;
    height: 20px;
  }
  .gauge-value span {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    white-space: nowrap;
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
  .zone-band {
    background: linear-gradient(
      to right,
      color-mix(in srgb, var(--bc-boiler) var(--bc-zone), transparent),
      color-mix(in srgb, var(--bc-hp) var(--bc-zone), transparent)
    );
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
  /* Laid out in a row, so the threshold chips never cover the zone names,
     however narrow the card: the spacers only push them towards the band. */
  .gauge-labels {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 28px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .zone-label {
    white-space: nowrap;
  }
  .spacer {
    flex-basis: 0;
    min-width: 0;
  }
  .thresholds {
    display: flex;
    gap: 4px;
    color: var(--primary-text-color);
  }
  .header { flex-wrap: wrap; }

  /* Segmented gauge (HUD look): one cell per degree. */
  .gauge-cells {
    display: flex;
    gap: 3px;
    height: 16px;
  }
  .cell { flex: 1; transform: skewX(-14deg); }
  .cell-boiler { background: color-mix(in srgb, var(--bc-boiler) 40%, transparent); }
  .cell-band { background: color-mix(in srgb, var(--primary-text-color) 18%, transparent); }
  .cell-hp { background: color-mix(in srgb, var(--bc-hp) 40%, transparent); }
  .cell.current { background: var(--primary-text-color); }
  ha-card.hud .gauge-value span {
    font-family: var(--ha-font-family-heading, inherit);
    font-size: 18px;
    font-style: italic;
    font-weight: 800;
  }

  /* Tiles layout: one tile per heat pump, a strip per boiler. */
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }
  .tile {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border-radius: 12px;
    background: var(--bc-surface);
    border-top: 4px solid var(--divider-color);
    transition: transform 0.2s ease, box-shadow 0.25s ease;
  }
  .tile.active { border-top-color: var(--accent); }
  .tile-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .tile-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
  }
  .tile-mode {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 600;
    color: var(--secondary-text-color);
    --mdc-icon-size: 16px;
  }
  .tile.active .tile-mode { color: var(--accent); }
  .tile-temp {
    font-size: 40px;
    line-height: 44px;
    font-weight: 600;
  }
  .tile-unit {
    font-size: 20px;
    color: var(--secondary-text-color);
  }
  .tile-bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .tile-target {
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .tile-target strong {
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .strip {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--bc-surface);
    border-top: 4px solid var(--divider-color);
  }
  .strip.active { border-top-color: var(--accent); }
  .strip:not(.active) .icon {
    color: var(--secondary-text-color);
    background: var(--bc-surface);
  }
  .strip-text {
    flex: 1;
    min-width: 160px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  ha-card.hud .tile,
  ha-card.hud .strip { border-radius: 0; }
  ha-card.hud .tile-name {
    font-family: var(--ha-font-family-heading, inherit);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  ha-card.hud .tile-mode {
    font-family: var(--ha-font-family-heading, inherit);
    font-size: 14px;
    font-style: italic;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  ha-card.hud .tile-temp {
    font-family: var(--ha-font-family-heading, inherit);
    font-size: 52px;
    line-height: 52px;
    font-style: italic;
    font-weight: 800;
  }
  ha-card.hud .tile:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 30px -16px var(--accent);
  }
`;

class BastideClimateCard extends BastideCard {
  static get styles() {
    return CLIMATE_STYLES;
  }

  static getConfigForm() {
    const sourceFilter = [{ domain: 'climate' }, { domain: 'switch' }, { domain: 'input_boolean' }];
    const thresholdFilter = [{ domain: 'input_number' }, { domain: 'number' }, { domain: 'sensor' }];
    const unit = lastHass?.config?.unit_system?.temperature || '°C';
    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        { name: 'heat_pumps', selector: { entity: { multiple: true, filter: sourceFilter } } },
        { name: 'boilers', selector: { entity: { multiple: true, filter: sourceFilter } } },
        { name: 'outdoor_entity', selector: { entity: { filter: { domain: 'sensor', device_class: 'temperature' } } } },
        { name: 'boiler_threshold_entity', selector: { entity: { filter: thresholdFilter } } },
        { name: 'heat_pump_threshold_entity', selector: { entity: { filter: thresholdFilter } } },
        {
          name: 'switch_over',
          selector: { number: { min: -30, max: 30, step: 0.5, mode: 'box', unit_of_measurement: unit } },
        },
        { name: 'season_entity', selector: { entity: { filter: [{ domain: 'input_select' }, { domain: 'select' }, { domain: 'sensor' }] } } },
        { name: 'presence_entity', selector: { entity: {} } },
        {
          name: 'layout',
          selector: {
            select: {
              mode: 'dropdown',
              options: ['rows', 'tiles'].map((value) => ({ value, label: lookup(null, `editor.climate.layout_${value}`) || value })),
            },
          },
        },
        { name: 'central_mode_entity', selector: { entity: { filter: [{ domain: 'select' }, { domain: 'input_select' }] } } },
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
      computeHelper: (schema) => (schema.name ? lookup(null, `editor.climate.${schema.name}_help`) : undefined),
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

  watchedEntities() {
    const config = this._config;
    return [
      ...entityList(config.heat_pumps),
      ...entityList(config.boilers),
      config.outdoor_entity,
      config.boiler_threshold_entity,
      config.heat_pump_threshold_entity,
      config.season_entity,
      config.presence_entity,
      config.central_mode_entity,
    ].filter(Boolean);
  }

  edgeAccent() {
    return this._accent || 'neutral';
  }

  // Heat pumps or boilers, with an optional display name each.
  _sources(value, kind) {
    return entityItems(value).map((item) => {
      const source = readSource(this._hass, item.entity, kind);
      if (item.name) source.name = item.name;
      return source;
    });
  }

  // The selector of the thermostats' common mode, as a row of buttons.
  _centralModeHtml() {
    const hass = this._hass;
    const entityId = this._config.central_mode_entity;
    const stateObj = entityId ? hass.states[entityId] : undefined;
    if (!isUsable(stateObj)) return '';
    const wanted = Array.isArray(this._config.central_modes) ? this._config.central_modes : null;
    const options = (stateObj.attributes?.options || []).filter((option) => !wanted || wanted.includes(option));
    const domain = entityId.split('.')[0];
    const buttons = options.map((option) => {
      const active = option === stateObj.state;
      let label = option;
      try {
        if (typeof hass.formatEntityState === 'function') label = hass.formatEntityState(stateObj, option);
      } catch (err) {
        label = option;
      }
      return `<button type="button" class="seg${active ? ' active' : ''}" aria-pressed="${active ? 'true' : 'false'}"
        ${ui.action(`${domain}.select_option`, { entity_id: entityId, option })}><span>${escapeHtml(label)}</span></button>`;
    }).join('');
    return `<div class="segmented accent-hp" role="group" aria-label="${escapeHtml(this.t('climate.central_mode'))}">${buttons}</div>`;
  }

  _tileHtml(s, unit) {
    const hass = this._hass;
    const t = (key, vars) => this.t(`climate.${key}`, vars);
    const active = !['off', 'unavailable', 'missing'].includes(s.mode);
    const moving = s.mode === 'heating' || s.mode === 'cooling';
    const icon = s.mode === 'cooling' ? 'mdi:snowflake' : 'mdi:fan';
    const target = s.target === null ? '' : formatTemperature(hass, s.target, unit);
    const steps = s.target !== null && s.entityId.startsWith('climate.')
      ? ui.steps({ entityId: s.entityId, target: s.target, step: s.step, labels: { down: t('lower'), up: t('raise') } })
      : '';
    return `
      <div class="tile accent-${s.kind}${active ? ' active' : ''}">
        <div class="tile-top">
          <button type="button" class="tile-name" data-entity="${escapeHtml(s.entityId)}">${escapeHtml(s.name)}</button>
          <span class="tile-mode"><ha-icon class="${moving ? 'fx-spin' : ''}" icon="${icon}"></ha-icon>${escapeHtml(t(s.mode))}</span>
        </div>
        <button type="button" class="tile-temp" data-entity="${escapeHtml(s.entityId)}">${s.current === null ? '—' : escapeHtml(formatNumber(hass, s.current, 1))}<span class="tile-unit">°</span></button>
        <div class="tile-bottom">
          <span class="tile-target">${target ? `${escapeHtml(t('target'))} <strong>${escapeHtml(target)}</strong>` : ''}</span>
          ${steps}
        </div>
      </div>`;
  }

  _stripHtml(s, unit) {
    const hass = this._hass;
    const t = (key, vars) => this.t(`climate.${key}`, vars);
    const active = !['off', 'unavailable', 'missing'].includes(s.mode);
    const room = s.current === null ? '' : ` · ${t('room', { value: formatTemperature(hass, s.current, unit, 1) })}`;
    const steps = s.target !== null && s.entityId.startsWith('climate.')
      ? ui.steps({ entityId: s.entityId, target: s.target, step: s.step, labels: { down: t('lower'), up: t('raise') } })
      : '';
    return `
      <div class="strip accent-${s.kind}${active ? ' active' : ''}">
        <span class="icon"><ha-icon class="${s.mode === 'heating' ? 'fx-flicker' : ''}" icon="mdi:fire"></ha-icon></span>
        <button type="button" class="strip-text" data-entity="${escapeHtml(s.entityId)}">
          <span class="name">${escapeHtml(s.name)}</span>
          <span class="state">${escapeHtml(sourceStatus(hass, s, unit) + room)}</span>
        </button>
        ${steps}
      </div>`;
  }

  // The switch-over band: the boiler takes over below `low`, the heat pumps
  // above `high`. Each edge keeps the helper it came from, if any, so it can
  // be edited from the card. With a single threshold, both edges are the same.
  _thresholds() {
    const hass = this._hass;
    const config = this._config;
    const fixed = toNumber(config.switch_over) ?? CLIMATE_DEFAULTS.switch_over;
    const boilerValue = entityNumber(hass, config.boiler_threshold_entity);
    const pumpValue = entityNumber(hass, config.heat_pump_threshold_entity);
    let low = boilerValue === null
      ? { value: fixed, entityId: null }
      : { value: boilerValue, entityId: config.boiler_threshold_entity };
    let high = pumpValue === null
      ? low
      : { value: pumpValue, entityId: config.heat_pump_threshold_entity };
    if (high.value < low.value) [low, high] = [high, low];
    return { low, high };
  }

  renderContent() {
    const hass = this._hass;
    const config = this._config;
    const t = (key, vars) => this.t(`climate.${key}`, vars);
    const unit = hass.config?.unit_system?.temperature || '°C';
    const title = config.title || t('title');

    const heatPumps = this._sources(config.heat_pumps, 'hp');
    const boilers = this._sources(config.boilers, 'boiler');
    const sources = [...heatPumps, ...boilers];

    if (!sources.length) {
      this._accent = 'neutral';
      return ui.header({ icon: 'mdi:thermometer', title }) + ui.setup(t('setup'));
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

    // Outdoor temperature against the switch-over band.
    const outdoorState = config.outdoor_entity ? hass.states[config.outdoor_entity] : undefined;
    const outdoor = entityNumber(hass, config.outdoor_entity);
    const outdoorUnit = outdoorState?.attributes?.unit_of_measurement || unit;
    const edges = this._thresholds();
    const low = edges.low.value;
    const high = edges.high.value;
    const outdoorText = outdoor === null ? '' : formatTemperature(hass, outdoor, outdoorUnit, 1);
    const lowText = formatTemperature(hass, low, outdoorUnit);
    const highText = formatTemperature(hass, high, outdoorUnit);
    const bandText = low === high ? lowText : `${formatNumber(hass, low)}–${highText}`;

    let reason = '';
    if (status === 'all_off') reason = t('off_reason');
    else if (outdoor !== null && cooling) reason = t('cool_reason', { outdoor: outdoorText });
    else if (outdoor !== null && outdoor < low) reason = t('below', { outdoor: outdoorText, threshold: lowText });
    else if (outdoor !== null && outdoor > high) reason = t('above', { outdoor: outdoorText, threshold: highText });
    else if (outdoor !== null && low === high) reason = t('above', { outdoor: outdoorText, threshold: highText });
    else if (outdoor !== null) {
      reason = t('between', { outdoor: outdoorText, low: formatNumber(hass, low), high: highText });
    }

    const seasonState = config.season_entity ? hass.states[config.season_entity] : undefined;
    const presenceState = config.presence_entity ? hass.states[config.presence_entity] : undefined;

    this._accent = accent;
    let body;
    if (config.layout === 'tiles') {
      body = (heatPumps.length ? `<div class="tiles">${heatPumps.map((s) => this._tileHtml(s, unit)).join('')}</div>` : '')
        + boilers.map((s) => this._stripHtml(s, unit)).join('');
    } else {
      body = ui.list(sources.map((s) => ui.row({
        entityId: s.entityId,
        icon: s.kind === 'boiler' ? 'mdi:fire' : 'mdi:fan',
        name: s.name,
        state: sourceStatus(hass, s, unit),
        value: s.current === null ? '' : formatTemperature(hass, s.current, unit, 1),
        accent: s.kind,
        active: !['off', 'unavailable', 'missing'].includes(s.mode),
      })));
    }

    // In the HUD look the headline gets a moving icon: a turning fan for the
    // heat pumps or the air conditioning, a flickering flame for the boiler.
    const statusIcon = this._hud ? {
      hp_on: ['mdi:fan', 'fx-spin'],
      boiler_on: ['mdi:fire', 'fx-flicker'],
      both_on: ['mdi:fire', 'fx-flicker'],
      cool_on: ['mdi:snowflake', 'fx-spin'],
    }[status] : null;

    return [
      ui.header({
        icon: cooling ? 'mdi:snowflake' : 'mdi:thermometer',
        title,
        accent,
        extra: this._centralModeHtml(),
        chip: isUsable(seasonState) ? { entityId: config.season_entity, text: formatState(hass, seasonState) } : null,
      }),
      ui.status({ headline: t(status), reason, accent, icon: statusIcon?.[0], iconFx: statusIcon?.[1] }),
      outdoor !== null && !cooling ? this._gaugeHtml({ outdoor, edges, unit: outdoorUnit, outdoorText, bandText }) : '',
      body,
      isUsable(presenceState)
        ? ui.footer({
          entityId: config.presence_entity,
          text: `${presenceState.attributes?.friendly_name || config.presence_entity} · ${formatState(hass, presenceState)}`,
        })
        : '',
    ].join('');
  }

  _gaugeHtml({ outdoor, edges, unit, outdoorText, bandText }) {
    const hass = this._hass;
    const t = (key, vars) => this.t(`climate.${key}`, vars);
    const low = edges.low.value;
    const high = edges.high.value;
    const single = edges.low === edges.high;
    let min = toNumber(this._config.gauge_min) ?? CLIMATE_DEFAULTS.gauge_min;
    let max = toNumber(this._config.gauge_max) ?? CLIMATE_DEFAULTS.gauge_max;
    if (max <= min) [min, max] = [CLIMATE_DEFAULTS.gauge_min, CLIMATE_DEFAULTS.gauge_max];

    const percent = (value) => ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
    const marker = percent(outdoor);
    const lowPct = percent(low);
    const highPct = percent(high);
    // Keep the floating labels inside the card.
    const valueLeft = Math.min(88, Math.max(12, marker));
    const bandCentre = (lowPct + highPct) / 2;
    const ticks = single
      ? `<span class="threshold" style="left: ${lowPct.toFixed(2)}%"></span>`
      : `<span class="threshold" style="left: ${lowPct.toFixed(2)}%"></span>
         <span class="threshold" style="left: ${highPct.toFixed(2)}%"></span>`;

    // One chip per threshold. A threshold read from a helper opens it when
    // tapped, so it can be changed from the card.
    const chip = (edge, key) => {
      const value = formatTemperature(hass, edge.value, unit);
      return ui.chip({ entityId: edge.entityId, text: value, label: t(key, { value }) });
    };
    const chips = single
      ? chip(edges.low, 'threshold_single')
      : chip(edges.low, 'threshold_boiler') + chip(edges.high, 'threshold_hp');

    // HUD look: one slanted cell per degree, the current one blinking.
    let bar;
    if (this._hud) {
      const cells = [];
      for (let v = Math.floor(min); v < max; v += 1) {
        const middle = v + 0.5;
        const zone = middle < low ? 'boiler' : (middle < high ? 'band' : 'hp');
        const current = outdoor >= v && outdoor < v + 1;
        cells.push(`<span class="cell cell-${zone}${current ? ' current fx-blink' : ''}"></span>`);
      }
      bar = `<div class="gauge-cells" aria-hidden="true">${cells.join('')}</div>`;
    } else {
      bar = `
          <div class="gauge-bar" aria-hidden="true">
            <span class="zone-boiler" style="width: ${lowPct.toFixed(2)}%"></span>
            <span class="zone-band" style="width: ${(highPct - lowPct).toFixed(2)}%"></span>
            <span class="zone-hp"></span>
            ${ticks}
            <span class="marker" style="left: ${marker.toFixed(2)}%"></span>
          </div>`;
    }

    return `
      <div class="gauge">
        <div class="gauge-scale" role="img" aria-label="${escapeHtml(t('gauge_label', { outdoor: outdoorText, threshold: bandText }))}">
          <div class="gauge-value" aria-hidden="true"><span style="left: ${valueLeft.toFixed(2)}%">${this._hud ? '▼ ' : ''}${escapeHtml(outdoorText)}</span></div>
          ${bar}
        </div>
        <div class="gauge-labels">
          <span class="zone-label">${escapeHtml(t('zone_boiler'))}</span>
          <span class="spacer" style="flex-grow: ${bandCentre.toFixed(2)}"></span>
          <div class="thresholds">${chips}</div>
          <span class="spacer" style="flex-grow: ${(100 - bandCentre).toFixed(2)}"></span>
          <span class="zone-label">${escapeHtml(t('zone_hp'))}</span>
        </div>
      </div>`;
  }
}

/* ------------------------------------------------------------------------ */
/* 4b. Presence card                                                        */
/* ------------------------------------------------------------------------ */

// Default icon for a presence mode, guessed from its name (English or French).
const PRESENCE_ICONS = [
  [/^(pr[ée]sent|home|maison|at home)/i, 'mdi:home'],
  [/^(soir|evening)/i, 'mdi:weather-sunset'],
  [/^(nuit|night|sleep)/i, 'mdi:weather-night'],
  [/^(absen|away)/i, 'mdi:exit-run'],
  [/^(vacan|holiday|vacation)/i, 'mdi:airplane'],
  [/^(invit|guest)/i, 'mdi:account-multiple'],
];
// Presence modes take the accents in this order; blue, kept for heat pumps, comes last.
const MODE_ACCENTS = ['orange', 'pink', 'violet', 'steel', 'teal', 'yellow', 'green', 'blue'];

const PRESENCE_STYLES = `
  .presence {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
  }
  .presence-now {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .label {
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .presence-mode {
    font-size: 32px;
    line-height: 38px;
    font-weight: 600;
  }
  .presence-side {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .outdoor {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .outdoor-value {
    font-size: 28px;
    line-height: 32px;
    font-weight: 600;
  }
  .modes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
    gap: 8px;
  }
  .mode {
    min-height: 60px;
    padding: 6px;
    box-sizing: border-box;
    border: 2px solid var(--divider-color);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-text-color);
    --mdc-icon-size: 22px;
  }
  .mode-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .mode ha-icon { color: var(--accent); }
  .mode-name {
    font-size: 13px;
    font-weight: 600;
    text-align: center;
  }
  .mode.active {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--bc-on-accent);
  }
  .mode.active ha-icon { color: var(--bc-on-accent); }
  ha-card.hud .presence-mode,
  ha-card.hud .outdoor-value {
    font-family: var(--ha-font-family-heading, inherit);
    font-style: italic;
    font-weight: 800;
    text-transform: uppercase;
  }
  ha-card.hud .presence-mode { font-size: 44px; line-height: 46px; }
  ha-card.hud .outdoor-value { font-size: 36px; line-height: 38px; }
  ha-card.hud .mode {
    border-radius: 0;
    transform: skewX(-12deg);
    transition: transform 0.15s ease, filter 0.15s ease, box-shadow 0.2s ease;
  }
  ha-card.hud .mode:hover {
    transform: skewX(-12deg) translateY(-3px);
    filter: brightness(1.2);
    box-shadow: 0 10px 22px -8px var(--accent);
  }
  ha-card.hud .mode:active {
    transform: skewX(-12deg) translateY(1px) scale(0.97);
    filter: brightness(1.35);
  }
  ha-card.hud .mode.active { --glow: color-mix(in srgb, var(--accent) 55%, transparent); }
  ha-card.hud .mode-inner { transform: skewX(12deg); }
  .presence-mode { display: inline-block; }
  ha-card.hud .mode-name {
    font-family: var(--ha-font-family-heading, inherit);
    font-size: 15px;
    font-style: italic;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
`;

class BastidePresenceCard extends BastideCard {
  static get styles() {
    return PRESENCE_STYLES;
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'entity', selector: { entity: { filter: [{ domain: 'input_select' }, { domain: 'select' }] } } },
        { name: 'title', selector: { text: {} } },
        { name: 'outdoor_entity', selector: { entity: { filter: { domain: 'sensor', device_class: 'temperature' } } } },
        { name: 'season_entity', selector: { entity: { filter: [{ domain: 'input_select' }, { domain: 'select' }, { domain: 'sensor' }] } } },
      ],
      computeLabel: (schema) => (schema.name ? lookup(null, `editor.presence.${schema.name}`) : undefined),
    };
  }

  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {});
    const entity = ids.find((id) => id.startsWith('input_select.') && /presen|mode/i.test(id))
      || ids.find((id) => id.startsWith('input_select.'));
    return entity ? { entity } : {};
  }

  getCardSize() {
    return 3;
  }

  edgeAccent() {
    return this._accent || 'orange';
  }

  watchedEntities() {
    const config = this._config;
    return [config.entity, config.outdoor_entity, config.season_entity].filter(Boolean);
  }

  _modeStyle(option, index) {
    const custom = (this._config.modes || {})[option] || {};
    const guessed = PRESENCE_ICONS.find(([pattern]) => pattern.test(option));
    return {
      icon: custom.icon || (guessed ? guessed[1] : 'mdi:checkbox-blank-circle-outline'),
      accent: accentName(custom.color, MODE_ACCENTS[index % MODE_ACCENTS.length]),
    };
  }

  renderContent() {
    const hass = this._hass;
    const config = this._config;
    const t = (key, vars) => this.t(`presence.${key}`, vars);
    const title = config.title || t('title');
    const stateObj = config.entity ? hass.states[config.entity] : undefined;
    if (!stateObj) {
      return ui.header({ icon: 'mdi:home', title }) + ui.setup(t('setup'));
    }

    const options = stateObj.attributes?.options || [];
    const current = stateObj.state;
    const domain = config.entity.split('.')[0];
    const currentIndex = options.indexOf(current);
    const currentAccent = currentIndex >= 0 ? this._modeStyle(current, currentIndex).accent : 'neutral';

    const outdoorState = config.outdoor_entity ? hass.states[config.outdoor_entity] : undefined;
    const outdoor = entityNumber(hass, config.outdoor_entity);
    const unit = outdoorState?.attributes?.unit_of_measurement || hass.config?.unit_system?.temperature || '°C';
    const seasonState = config.season_entity ? hass.states[config.season_entity] : undefined;

    const outdoorHtml = outdoor === null
      ? ''
      : `<button type="button" class="outdoor" data-entity="${escapeHtml(config.outdoor_entity)}">
           <span class="outdoor-value">${escapeHtml(formatTemperature(hass, outdoor, unit, 1))}</span>
           <span class="label">${escapeHtml(t('outdoor'))}</span>
         </button>`;
    const seasonHtml = isUsable(seasonState)
      ? ui.chip({ entityId: config.season_entity, text: formatState(hass, seasonState) })
      : '';

    // When the mode changes, the big name glitches once. The card is redrawn
    // from scratch, so the class is only set on the redraw that follows a change.
    this._accent = currentAccent;
    const glitch = this._lastMode !== undefined && this._lastMode !== current ? 'fx-glitch-a' : '';
    this._lastMode = current;

    const modes = options.map((option, index) => {
      const style = this._modeStyle(option, index);
      const active = option === current;
      return `
        <button type="button" class="mode accent-${style.accent}${active ? ' active fx-pulse' : ''}" aria-pressed="${active ? 'true' : 'false'}"
          ${ui.action(`${domain}.select_option`, { entity_id: config.entity, option })}>
          <span class="mode-inner">
            <ha-icon icon="${escapeHtml(style.icon)}"></ha-icon>
            <span class="mode-name">${escapeHtml(option)}</span>
          </span>
        </button>`;
    }).join('');

    return `
      <div class="presence">
        <div class="presence-now accent-${currentAccent}">
          <span class="label">${escapeHtml(title)}</span>
          <button type="button" class="presence-mode ${glitch}" data-entity="${escapeHtml(config.entity)}">${escapeHtml(isUsable(stateObj) ? current : t('unavailable'))}</button>
        </div>
        <div class="presence-side">${outdoorHtml}${seasonHtml}</div>
      </div>
      <div class="modes" role="group" aria-label="${escapeHtml(t('modes'))}">${modes}</div>`;
  }
}

/* ------------------------------------------------------------------------ */
/* 4c. Entities card                                                        */
/* ------------------------------------------------------------------------ */

const TOGGLE_DOMAINS = ['light', 'switch', 'input_boolean', 'fan', 'automation'];
const DOMAIN_ICONS = {
  light: 'mdi:lightbulb', switch: 'mdi:power-plug', input_boolean: 'mdi:toggle-switch-outline',
  fan: 'mdi:fan', automation: 'mdi:robot', media_player: 'mdi:television', climate: 'mdi:thermostat',
  sensor: 'mdi:eye', binary_sensor: 'mdi:checkbox-blank-circle-outline', camera: 'mdi:cctv',
  update: 'mdi:package-up', cover: 'mdi:window-shutter', lock: 'mdi:lock', person: 'mdi:account',
};
const IDLE_STATES = ['off', 'idle', 'standby', 'unavailable', 'unknown', 'closed', 'locked', 'not_home'];

class BastideEntitiesCard extends BastideCard {
  static getConfigForm() {
    return {
      schema: [
        { name: 'title', selector: { text: {} } },
        { name: 'icon', selector: { icon: {} } },
        {
          name: 'color',
          selector: {
            select: {
              mode: 'dropdown',
              options: ACCENTS.map((value) => ({ value, label: lookup(null, `editor.colors.${value}`) || value })),
            },
          },
        },
        { name: 'entities', selector: { entity: { multiple: true } } },
      ],
      computeLabel: (schema) => (schema.name ? lookup(null, `editor.entities.${schema.name}`) : undefined),
    };
  }

  static getStubConfig(hass) {
    const ids = Object.keys(hass?.states || {});
    const entities = ids.filter((id) => /^(light|switch)\./.test(id)).slice(0, 3);
    return { title: 'Bastide', icon: 'mdi:view-list', color: 'orange', entities };
  }

  getCardSize() {
    return 1 + Math.max(1, this._items().length);
  }

  // Entities given as `light.x` or as `{ entity, name, icon }`.
  _items() {
    const list = Array.isArray(this._config?.entities) ? this._config.entities : [];
    return list
      .map((item) => (typeof item === 'string' ? { entity: item } : item))
      .filter((item) => item && typeof item.entity === 'string' && item.entity.includes('.'));
  }

  watchedEntities() {
    return this._items().map((item) => item.entity);
  }

  renderContent() {
    const hass = this._hass;
    const config = this._config;
    const accent = accentName(config.color);
    const items = this._items();
    this._accent = accent;
    const header = ui.header({ icon: config.icon || 'mdi:view-list', title: config.title || '', accent });
    if (!items.length) return header + ui.setup(this.t('entities.setup'));

    const rows = items.map((item) => {
      const stateObj = hass.states[item.entity];
      const domain = item.entity.split('.')[0];
      const name = item.name || stateObj?.attributes?.friendly_name || item.entity;
      const icon = item.icon || stateObj?.attributes?.icon || DOMAIN_ICONS[domain] || 'mdi:circle-outline';
      if (!stateObj) {
        return ui.toggleRow({ entityId: item.entity, icon, name, state: this.t('entities.missing'), accent });
      }
      const usable = isUsable(stateObj);
      const canToggle = usable && TOGGLE_DOMAINS.includes(domain);
      const on = stateObj.state === 'on';
      return ui.toggleRow({
        entityId: item.entity,
        icon,
        name,
        state: item.secondary || (canToggle ? formatState(hass, stateObj) : ''),
        value: canToggle ? '' : (usable ? formatState(hass, stateObj) : this.t('entities.unavailable')),
        accent,
        active: canToggle ? on : !IDLE_STATES.includes(stateObj.state),
        toggle: canToggle ? { on, label: this.t('entities.toggle', { name }) } : null,
      });
    });
    return header + ui.list(rows);
  }
}

/* ------------------------------------------------------------------------ */
/* 4d. Agenda card                                                          */
/* ------------------------------------------------------------------------ */

const AGENDA_STYLES = `
  .events {
    display: flex;
    flex-direction: column;
  }
  .event {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 0;
    border-bottom: 1px solid var(--divider-color);
  }
  .event:last-child { border-bottom: 0; }
  .event-date {
    width: 52px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4px 0;
    border-radius: 8px;
    background: var(--bc-surface);
    border-top: 3px solid var(--accent);
  }
  .event-day {
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .event-num {
    font-size: 20px;
    line-height: 24px;
    font-weight: 600;
  }
  .event-text {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  ha-card.hud .event-date { border-radius: 0; }
  ha-card.hud .event-num {
    font-family: var(--ha-font-family-heading, inherit);
    font-style: italic;
    font-weight: 800;
  }
  ha-card.hud .event {
    transition: padding-left 0.2s ease;
  }
  ha-card.hud .event:hover { padding-left: 8px; }
`;

class BastideAgendaCard extends BastideCard {
  static get styles() {
    return AGENDA_STYLES;
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'entities', selector: { entity: { multiple: true, filter: { domain: 'calendar' } } } },
        { name: 'title', selector: { text: {} } },
        {
          name: 'color',
          selector: {
            select: {
              mode: 'dropdown',
              options: ACCENTS.map((value) => ({ value, label: lookup(null, `editor.colors.${value}`) || value })),
            },
          },
        },
        {
          type: 'grid',
          name: '',
          schema: [
            { name: 'days', selector: { number: { min: 1, max: 60, step: 1, mode: 'box' } } },
            { name: 'max_events', selector: { number: { min: 1, max: 20, step: 1, mode: 'box' } } },
          ],
        },
      ],
      computeLabel: (schema) => (schema.name ? lookup(null, `editor.agenda.${schema.name}`) : undefined),
    };
  }

  static getStubConfig(hass) {
    const calendar = Object.keys(hass?.states || {}).find((id) => id.startsWith('calendar.'));
    return calendar ? { entities: [calendar] } : {};
  }

  getCardSize() {
    return 4;
  }

  edgeAccent() {
    return accentName(this._config?.color, 'violet');
  }

  watchedEntities() {
    return entityList(this._config?.entities);
  }

  set hass(hass) {
    super.hass = hass;
    this._maybeFetch();
  }

  setConfig(config) {
    super.setConfig(config);
    this._fetchedAt = 0;
    this._maybeFetch();
  }

  // Events are read through the Home Assistant calendar API, at most every
  // 10 minutes, or right away when a calendar starts or ends an event.
  _maybeFetch() {
    if (!this._hass || !this._config || this._fetching) return;
    const calendars = entityList(this._config.entities);
    if (!calendars.length) return;
    const signature = calendars.map((id) => this._hass.states[id]?.last_changed).join('|');
    const stale = Date.now() - (this._fetchedAt || 0) > 10 * 60 * 1000;
    if (!stale && signature === this._signature) return;
    this._signature = signature;
    this._fetch(calendars);
  }

  async _fetch(calendars) {
    this._fetching = true;
    const days = toNumber(this._config.days) || 7;
    const start = new Date();
    const end = new Date(start.getTime() + days * 24 * 3600 * 1000);
    const range = `start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`;
    try {
      const lists = await Promise.all(calendars.map((id) => this._hass.callApi('GET', `calendars/${id}?${range}`)));
      this._events = lists.flat().map((event) => ({
        title: event.summary || '',
        allDay: Boolean(event.start?.date && !event.start?.dateTime),
        start: new Date(event.start?.dateTime || `${event.start?.date}T00:00:00`),
        end: new Date(event.end?.dateTime || `${event.end?.date}T00:00:00`),
        location: event.location || '',
      })).sort((a, b) => a.start - b.start);
      this._error = false;
    } catch (err) {
      this._error = true;
    }
    this._fetchedAt = Date.now();
    this._fetching = false;
    this._renderKey = '';
    this._render();
  }

  renderContent() {
    const hass = this._hass;
    const config = this._config;
    const t = (key, vars) => this.t(`agenda.${key}`, vars);
    const accent = accentName(config.color, 'violet');
    const header = ui.header({ icon: 'mdi:calendar', title: config.title || t('title'), accent });
    if (!entityList(config.entities).length) return header + ui.setup(t('setup'));
    if (this._error) return header + ui.setup(t('error'));
    if (!this._events) return header;

    const locale = hass.locale?.language || hass.language || 'en';
    const day = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' });
    const max = toNumber(config.max_events) || 5;
    const events = this._events.slice(0, max);
    if (!events.length) return header + ui.setup(t('empty', { days: toNumber(config.days) || 7 }));

    const rows = events.map((event) => {
      const when = event.allDay ? t('all_day') : `${time.format(event.start)} – ${time.format(event.end)}`;
      const detail = event.location ? `${when} · ${event.location}` : when;
      return `
        <div class="event">
          <div class="event-date">
            <span class="event-day">${escapeHtml(day.format(event.start).replace('.', ''))}</span>
            <span class="event-num">${event.start.getDate()}</span>
          </div>
          <div class="event-text">
            <span class="name">${escapeHtml(event.title)}</span>
            <span class="state">${escapeHtml(detail)}</span>
          </div>
        </div>`;
    }).join('');
    return `${header}<div class="events accent-${accent}">${rows}</div>`;
  }
}

/* ------------------------------------------------------------------------ */
/* Registration                                                             */
/* ------------------------------------------------------------------------ */

const BASTIDE_CARDS = [
  {
    type: 'bastide-climate-card',
    element: BastideClimateCard,
    name: 'Bastide Climate',
    description: 'Which heat source is running and why in winter, the air conditioning in summer.',
  },
  {
    type: 'bastide-presence-card',
    element: BastidePresenceCard,
    name: 'Bastide Presence',
    description: 'The current presence mode in large type, one-tap mode buttons, outdoor temperature and season.',
  },
  {
    type: 'bastide-entities-card',
    element: BastideEntitiesCard,
    name: 'Bastide Entities',
    description: 'A titled list of devices with on/off switches.',
  },
  {
    type: 'bastide-agenda-card',
    element: BastideAgendaCard,
    name: 'Bastide Agenda',
    description: 'The next events of one or more calendars.',
  },
];

window.customCards = window.customCards || [];
for (const card of BASTIDE_CARDS) {
  if (customElements.get(card.type)) continue;
  customElements.define(card.type, card.element);
  window.customCards.push({
    type: card.type,
    name: card.name,
    description: card.description,
    preview: true,
    documentationURL: BASTIDE_REPO,
  });
}

console.info(
  `%c BASTIDE CARDS %c ${BASTIDE_VERSION} `,
  'color: #fff; background: #8a5a14; font-weight: 700; border-radius: 3px 0 0 3px',
  'color: #8a5a14; background: #f3ebe0; border-radius: 0 3px 3px 0',
);
