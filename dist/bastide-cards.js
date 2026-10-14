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

const BASTIDE_VERSION = '0.6.0';
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
    heating: {
      title: 'Heating check',
      period: 'Period',
      period_24: '24 h',
      period_48: '48 h',
      period_168: '7 d',
      period_note_24: 'Over the last 24 hours',
      period_note_48: 'Over the last 48 hours',
      period_note_168: 'Over the last 7 days',
      kpi_outdoor: 'Mean outdoor',
      kpi_hp: 'Heat pump',
      kpi_boiler: 'Boiler',
      kpi_running: 'Running',
      kpi_switches: 'Switch-overs',
      kpi_all_ok: 'All at the right thresholds',
      kpi_some: '{n} to check',
      kpi_check: 'To check',
      kpi_check_note: 'See the log below',
      kpi_nothing: 'Nothing to report',
      outdoor_title: 'Outdoor temperature and switch-over points',
      outdoor: 'Outdoor',
      threshold_hp: 'Heat pump threshold {value}',
      threshold_boiler: 'Boiler threshold {value}',
      min: 'min {value}',
      max: 'max {value}',
      source: 'Source',
      mode: 'Mode',
      src_pac: 'Heat pump',
      src_boiler: 'Boiler',
      src_cool: 'Cooling',
      src_off: 'Off',
      rooms_title: 'Does each room follow its target?',
      legend_room: 'Room temperature',
      legend_target: 'Target',
      legend_hp: 'Heating',
      verdict_ok: 'Follows its target',
      verdict_off: 'Off over the period',
      verdict_gap: '{value} below target on average',
      no_data: 'No history yet.',
      log_title: 'What the automation did',
      col_when: 'When',
      col_what: 'What happened',
      col_why: 'Why',
      col_check: 'Check',
      to_boiler: 'Switch to the boiler',
      back_pac: 'Back to the heat pump',
      start_pac: 'Heat pump on',
      start_boiler: 'Boiler on',
      start_cool: 'Air conditioning on',
      start_off: 'Heating off',
      why_outdoor: 'Outdoor {value}',
      why_check_boiler: 'Outdoor {value}, above the heat pump threshold',
      why_check_pac: 'Outdoor {value}, below the boiler threshold',
      mode_change: 'Mode {mode}',
      ok: 'As expected',
      check: 'To check',
      info: 'Info',
      loading: 'Reading the history…',
      error: 'The history could not be read.',
      empty: 'Nothing happened over this period.',
    },
    insulation: {
      title: 'How the home reacts',
      setup: 'Choose the outdoor sensor and the rooms in the card configuration.',
      loading: 'Reading the statistics…',
      error: 'The statistics could not be read.',
      intro: 'These indicators compare the rooms with each other and one year with the next, and show where to look first. They are not a diagnosis: to find a defect, use a thermal camera or an air-tightness test.',
      winter: 'Winter · keeping the heat in',
      summer: 'Summer · keeping the heat out',
      signature: 'Energy signature',
      signature_sub: 'Heat delivered per day against the mean outdoor temperature · heat pumps: electricity × {scop}',
      signature_boiler: ' · boiler: hours × {kw} kW',
      signature_noboiler: ' · {n} boiler days left out (no gas data)',
      legend_hp_day: 'Heat pump day',
      legend_boiler_day: 'Boiler day',
      slope: 'Slope ≈ {kwh} kWh per day and per degree, i.e. losses of about {wk} W/K (±15–30 %)',
      balance: 'Balance ≈ {value}: above it, no heating needed',
      need_days: 'Not enough heating days yet: {n} of the 10 needed.',
      tau: 'Time constant of each room',
      tau_sub: 'Hours to lose 63 % of the gap with outdoors, heating off at night · longer is better',
      tau_none: 'No night without heating in the last 30 days yet.',
      tau_missing: 'No usable night yet',
      tau_nights: '{n} nights',
      tau_few: '{n} night(s) · to be confirmed',
      tau_insight: '{room} loses its heat {ratio} times faster than {best}. Look at its window, shutter box and outside wall first, ideally with a thermal camera.',
      hot_day: 'A hot day, air conditioning off',
      hot_sub: '{room}, {date}',
      outdoor: 'Outdoor',
      damping: 'Damping',
      damping_note: 'Indoors varies {n} times less than outdoors',
      lag: 'Time lag',
      lag_note: 'The heat peak arrives {n} h later indoors',
      no_hot_day: 'No full summer day with the air conditioning off was found.',
      overheating: 'Overheating last summer, air conditioning off',
      since: 'since {date}',
      overheating_sub: 'Hours counted only while the air conditioning is off · outdoor temperature from the weather service',
      no_summer: 'No summer data yet.',
      col_room: 'Room',
      col_measure: 'Measure',
      col_value: 'Value',
      col_ref: 'Benchmark',
      col_verdict: 'Verdict',
      measure_living: 'Hours above adaptive comfort (EN 16798-1, cat. II)',
      measure_bedroom: 'Night hours above 26 °C',
      ref_living: '≤ 60 h · 3 % of 9 am–10 pm hours, May–Sept. (TM59)',
      ref_bedroom: '≤ 32 h · 1 % of 10 pm–7 am hours (TM59)',
      pass: 'As expected',
      fail: 'Exceeded',
      methods: 'Method and sources',
      col_indicator: 'Indicator',
      col_how: 'What is calculated',
      col_source: 'Based on',
      col_limits: 'Limits',
      m_signature_name: 'Energy signature',
      m_signature_what: 'Line of the heat delivered per day against the mean outdoor temperature. Its slope gives the home’s losses; where it reaches zero, the balance temperature.',
      m_signature_source: 'PRISM method (Fels, 1986); critical review by Hammarsten (Applied Energy, 1987); in-situ methods compared with co-heating (Bauwens and Roels, Energy and Buildings, 2014)',
      m_signature_limits: 'Sun and occupants also heat and skew the slope. Reliable to compare two winters; as an absolute value, allow ±15 to 30 %. The heat pump COP changes with the cold.',
      m_tau_name: 'Time constant',
      m_tau_what: 'How fast each room moves towards the outdoor temperature with the heating off (Newton’s law of cooling).',
      m_tau_source: 'Simple resistance-capacitance model (Bacher and Madsen, Energy and Buildings, 2011); principle of the QUB method (Alzetto et al., Energy and Buildings, 2018)',
      m_tau_limits: 'Mixes insulation and thermal mass; rooms exchange heat with each other. Measured at night, doors and windows shut.',
      m_damping_name: 'Damping and time lag',
      m_damping_what: 'Ratio between the indoor and outdoor temperature swing over a day, and the delay between both peaks.',
      m_damping_source: 'Decrement factor and time lag of EN ISO 13786, measured here at room scale',
      m_damping_limits: 'Valid with the air conditioning off and shutters and windows in the same position all day.',
      m_overheating_name: 'Overheating',
      m_overheating_what: 'Hours spent above a comfort limit.',
      m_overheating_source: 'Adaptive comfort of EN 16798-1; CIBSE TM59 criteria for homes (2017)',
      m_overheating_limits: 'Sensor out of direct sun. The 2026 edition of TM59 counts hot nights rather than hours.',
      methods_note: 'For reliable figures: energy readings (gas meter, air conditioners’ electricity), at least a full season, nights without heating for the time constant, and windows shut during the measurements.',
    },
    camera: {
      offline: 'Camera unavailable',
      live: 'Live',
    },
    nav: {
      aria: 'Dashboard views',
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
      camera: {
        entity: 'Camera',
        title: 'Title',
        name: 'Label on the image',
        entities: 'Devices below the image',
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
    heating: {
      title: 'Contrôle du chauffage',
      period: 'Période',
      period_24: '24 h',
      period_48: '48 h',
      period_168: '7 j',
      period_note_24: 'Sur les dernières 24 h',
      period_note_48: 'Sur les dernières 48 h',
      period_note_168: 'Sur les 7 derniers jours',
      kpi_outdoor: 'Extérieur moyen',
      kpi_hp: 'Pompe à chaleur',
      kpi_boiler: 'Chaudière',
      kpi_running: 'En service',
      kpi_switches: 'Bascules',
      kpi_all_ok: 'Toutes aux bons seuils',
      kpi_some: '{n} à vérifier',
      kpi_check: 'À vérifier',
      kpi_check_note: 'Voir le journal plus bas',
      kpi_nothing: 'Rien à signaler',
      outdoor_title: 'Température extérieure et seuils de bascule',
      outdoor: 'Extérieur',
      threshold_hp: 'Seuil PAC {value}',
      threshold_boiler: 'Seuil chaudière {value}',
      min: 'min {value}',
      max: 'max {value}',
      source: 'Source',
      mode: 'Mode',
      src_pac: 'PAC',
      src_boiler: 'Chaudière',
      src_cool: 'Clim',
      src_off: 'Arrêt',
      rooms_title: 'Chaque pièce suit-elle sa consigne ?',
      legend_room: 'Température de la pièce',
      legend_target: 'Consigne',
      legend_hp: 'Chauffe',
      verdict_ok: 'Suit sa consigne',
      verdict_off: 'Arrêté sur la période',
      verdict_gap: 'En moyenne {value} sous la consigne',
      no_data: 'Pas encore d’historique.',
      log_title: 'Ce que l’automatisation a fait',
      col_when: 'Quand',
      col_what: 'Ce qui s’est passé',
      col_why: 'Pourquoi',
      col_check: 'Vérification',
      to_boiler: 'Bascule vers la chaudière',
      back_pac: 'Retour à la pompe à chaleur',
      start_pac: 'Pompe à chaleur en marche',
      start_boiler: 'Chaudière en marche',
      start_cool: 'Climatisation en marche',
      start_off: 'Chauffage arrêté',
      why_outdoor: 'Extérieur {value}',
      why_check_boiler: 'Extérieur {value}, au-dessus du seuil PAC',
      why_check_pac: 'Extérieur {value}, sous le seuil chaudière',
      mode_change: 'Mode {mode}',
      ok: 'Conforme',
      check: 'À vérifier',
      info: 'Info',
      loading: 'Lecture de l’historique…',
      error: 'Impossible de lire l’historique.',
      empty: 'Rien ne s’est passé sur cette période.',
    },
    insulation: {
      title: 'Comment le logement réagit',
      setup: 'Choisissez le capteur extérieur et les pièces dans la configuration de la carte.',
      loading: 'Lecture des statistiques…',
      error: 'Impossible de lire les statistiques.',
      intro: 'Ces indicateurs servent à comparer les pièces entre elles et une année à l’autre, et à savoir où chercher en premier. Ils ne remplacent pas un diagnostic : pour localiser un défaut, il faut une caméra thermique ou un test d’étanchéité à l’air.',
      winter: 'Hiver · garder la chaleur',
      summer: 'Été · se protéger de la chaleur',
      signature: 'Signature énergétique',
      signature_sub: 'Chaleur fournie par jour selon la température extérieure moyenne · PAC : électricité × {scop}',
      signature_boiler: ' · chaudière : heures × {kw} kW',
      signature_noboiler: ' · {n} jours de chaudière exclus (pas de données de gaz)',
      legend_hp_day: 'Jour PAC',
      legend_boiler_day: 'Jour chaudière',
      slope: 'Pente ≈ {kwh} kWh par jour et par degré, soit des pertes d’environ {wk} W/K (à ±15–30 %)',
      balance: 'Équilibre ≈ {value} : au-dessus, plus besoin de chauffer',
      need_days: 'Pas encore assez de jours de chauffage : {n} sur les 10 nécessaires.',
      tau: 'Constante de temps de chaque pièce',
      tau_sub: 'Heures pour perdre 63 % de l’écart avec l’extérieur, chauffage coupé la nuit · plus c’est long, mieux la pièce garde la chaleur',
      tau_none: 'Pas encore de nuit sans chauffage sur les 30 derniers jours.',
      tau_missing: 'Pas encore de nuit exploitable',
      tau_nights: '{n} nuits',
      tau_few: '{n} nuit(s) · à confirmer',
      tau_insight: '{room} perd sa chaleur {ratio} fois plus vite que {best}. Fenêtre, coffre de volet et mur extérieur sont à regarder en premier, idéalement avec une caméra thermique.',
      hot_day: 'Une journée chaude, clim coupée',
      hot_sub: '{room}, {date}',
      outdoor: 'Extérieur',
      damping: 'Amortissement',
      damping_note: 'L’intérieur varie {n} fois moins que l’extérieur',
      lag: 'Déphasage',
      lag_note: 'Le pic de chaleur arrive {n} h plus tard à l’intérieur',
      no_hot_day: 'Aucune journée d’été complète sans clim trouvée.',
      overheating: 'Surchauffe l’été dernier, clim coupée',
      since: 'depuis le {date}',
      overheating_sub: 'Heures comptées seulement quand la clim est coupée · température extérieure du service météo',
      no_summer: 'Pas encore de données d’été.',
      col_room: 'Pièce',
      col_measure: 'Mesure',
      col_value: 'Valeur',
      col_ref: 'Repère',
      col_verdict: 'Verdict',
      measure_living: 'Heures au-dessus du confort adaptatif (EN 16798-1, cat. II)',
      measure_bedroom: 'Heures de nuit au-dessus de 26 °C',
      ref_living: '≤ 60 h · 3 % des heures 9 h–22 h, mai à sept. (TM59)',
      ref_bedroom: '≤ 32 h · 1 % des heures 22 h–7 h (TM59)',
      pass: 'Conforme',
      fail: 'Dépassé',
      methods: 'Méthode et sources',
      col_indicator: 'Indicateur',
      col_how: 'Ce qu’on calcule',
      col_source: 'S’appuie sur',
      col_limits: 'Limites',
      m_signature_name: 'Signature énergétique',
      m_signature_what: 'Droite de la chaleur fournie par jour selon la température extérieure moyenne. La pente donne les pertes du logement, le point où elle s’annule la température d’équilibre.',
      m_signature_source: 'Méthode PRISM (Fels, 1986) ; revue critique de Hammarsten (Applied Energy, 1987) ; méthodes sur données réelles comparées au co-heating (Bauwens et Roels, Energy and Buildings, 2014)',
      m_signature_limits: 'Le soleil et les occupants chauffent aussi et faussent la pente. Fiable pour comparer deux hivers ; en valeur absolue, compter ±15 à 30 %. Le COP de la PAC varie avec le froid.',
      m_tau_name: 'Constante de temps',
      m_tau_what: 'Vitesse à laquelle chaque pièce se rapproche de la température extérieure quand le chauffage est coupé (loi de refroidissement de Newton).',
      m_tau_source: 'Modèle « résistance-capacité » simple (Bacher et Madsen, Energy and Buildings, 2011) ; principe de la méthode QUB (Alzetto et al., Energy and Buildings, 2018)',
      m_tau_limits: 'Mélange isolation et masse thermique ; les pièces échangent de la chaleur entre elles. Mesurée la nuit, portes et fenêtres fermées.',
      m_damping_name: 'Amortissement et déphasage',
      m_damping_what: 'Rapport entre la variation de température intérieure et extérieure sur une journée, et décalage entre les deux pics.',
      m_damping_source: 'Facteur d’amortissement et déphasage de la norme EN ISO 13786, mesurés ici à l’échelle de la pièce',
      m_damping_limits: 'Valable clim coupée, avec volets et fenêtres dans la même position toute la journée.',
      m_overheating_name: 'Surchauffe',
      m_overheating_what: 'Heures passées au-dessus d’une limite de confort.',
      m_overheating_source: 'Confort adaptatif de la norme EN 16798-1 ; critères des logements CIBSE TM59 (2017)',
      m_overheating_limits: 'Sonde à l’abri du soleil direct. La version 2026 de la TM59 compte des nuits chaudes plutôt que des heures.',
      methods_note: 'Pour des chiffres fiables : les relevés d’énergie (compteur gaz, électricité des clims), au moins une saison complète, des nuits sans chauffage pour la constante de temps, et les fenêtres fermées pendant les mesures.',
    },
    camera: {
      offline: 'Caméra indisponible',
      live: 'Direct',
    },
    nav: {
      aria: 'Vues du dashboard',
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
      camera: {
        entity: 'Caméra',
        title: 'Titre',
        name: 'Nom sur l’image',
        entities: 'Appareils sous l’image',
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
      const target = ev.target.closest('[data-local], [data-service], [data-entity]');
      if (!target) return;
      // `data-local` actions stay inside the card (a period, a view to open).
      if (target.dataset.local) {
        this.onLocal(target.dataset.local, target);
        return;
      }
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

  // Extra classes for ha-card; `plain` drops the card background and frame.
  cardClasses() {
    return [];
  }

  onLocal() {}

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
    const extra = this.cardClasses().filter(Boolean);
    const classes = [
      hass.themes?.darkMode ? 'dark' : '',
      this._hud ? 'hud' : '',
      this._fx ? 'fx' : '',
      enter ? 'enter' : '',
      ...extra,
    ].filter(Boolean).join(' ');
    const content = this.renderContent();
    const edge = { hp: 'blue', boiler: 'orange', neutral: 'steel' }[this.edgeAccent()] || accentName(this.edgeAccent());
    const chrome = this._hud && !extra.includes('plain') ? '<span class="fx-edge"></span><span class="fx-sweep"></span>' : '';
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
    const config = this._config;
    const accent = accentName(config.color);
    const items = this._items();
    this._accent = accent;
    const header = ui.header({ icon: config.icon || 'mdi:view-list', title: config.title || '', accent });
    if (!items.length) return header + ui.setup(this.t('entities.setup'));
    return header + ui.list(entityRowsHtml(this, items, accent));
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
/* 4e. History and statistics helpers                                       */
/* ------------------------------------------------------------------------ */

// History points as { t (ms), s (state), a (attributes or null) }, oldest first.
function historyPoints(list) {
  return (list || []).map((item) => {
    const seconds = item.lu ?? item.lc;
    return {
      t: seconds != null ? seconds * 1000 : Date.parse(item.last_updated || item.last_changed),
      s: item.s ?? item.state,
      a: item.a ?? item.attributes ?? null,
    };
  }).sort((x, y) => x.t - y.t);
}

async function fetchHistory(hass, entityIds, start, end, withAttributes) {
  const ids = entityIds.filter(Boolean);
  if (!ids.length) return {};
  const result = await hass.callWS({
    type: 'history/history_during_period',
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    entity_ids: ids,
    minimal_response: !withAttributes,
    no_attributes: !withAttributes,
    significant_changes_only: false,
  });
  const out = {};
  for (const id of ids) out[id] = historyPoints(result?.[id]);
  return out;
}

// Long-term statistics as { start (ms), mean, change }, oldest first.
async function fetchStatistics(hass, ids, start, end, period) {
  const list = [...new Set(ids.filter(Boolean))];
  if (!list.length) return {};
  const result = await hass.callWS({
    type: 'recorder/statistics_during_period',
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    statistic_ids: list,
    period,
    types: ['mean', 'change'],
  });
  const out = {};
  for (const id of list) {
    out[id] = (result?.[id] || []).map((row) => ({
      start: typeof row.start === 'number' ? row.start : Date.parse(row.start),
      mean: row.mean ?? null,
      change: row.change ?? null,
    }));
  }
  return out;
}

// The point in effect at time `t`: the last one at or before it.
function pointAt(points, t) {
  let found = null;
  for (const point of points || []) {
    if (point.t > t) break;
    found = point;
  }
  return found;
}

// Spans of constant value between start and end, from one or more step series.
function combinedSpans(start, end, seriesList, combine) {
  const times = new Set([start]);
  for (const series of seriesList) {
    for (const point of series || []) if (point.t > start && point.t < end) times.add(point.t);
  }
  const spans = [];
  for (const t of [...times].sort((a, b) => a - b)) {
    const value = combine(seriesList.map((series) => pointAt(series, t)));
    const last = spans[spans.length - 1];
    if (last && last.value === value) continue;
    if (last) last.to = t;
    spans.push({ from: t, to: end, value });
  }
  return spans;
}

// Removes spans shorter than `minMs` (an automation passing through a state
// for a few seconds), then joins neighbours that end up with the same value.
function mergeShortSpans(spans, minMs) {
  const out = [];
  for (const span of spans) {
    const last = out[out.length - 1];
    if (last && (span.to - span.from < minMs || last.value === span.value)) {
      last.to = span.to;
      continue;
    }
    out.push({ ...span });
  }
  if (out.length > 1 && out[0].to - out[0].from < minMs) {
    out[1].from = out[0].from;
    out.shift();
  }
  return out;
}

// Time-weighted mean of a numeric step series.
function timeMean(points, start, end) {
  let total = 0;
  let weight = 0;
  const spans = combinedSpans(start, end, [points], ([p]) => (p ? toNumber(p.s) : null));
  for (const span of spans) {
    if (span.value === null) continue;
    total += span.value * (span.to - span.from);
    weight += span.to - span.from;
  }
  return weight ? total / weight : null;
}

function linearFit(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const slope = sxx ? sxy / sxx : 0;
  return { slope, intercept: my - slope * mx };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Round tick values covering [min, max].
function niceTicks(min, max, step) {
  const ticks = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

const pct = (value) => `${value.toFixed(2)}%`;

const CHART_STYLES = `
  .content {
    --bc-hp: var(--bastide-heat-pump-color, var(--bc-blue));
    --bc-boiler: var(--bastide-boiler-color, var(--bc-orange));
  }
  .intro, .panel-sub {
    margin: 0;
    font-size: 13px;
    line-height: 19px;
    color: var(--secondary-text-color);
  }
  .block {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .block-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 6px 16px;
  }
  .block-title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
  }
  ha-card.hud .block-title {
    font-family: var(--ha-font-family-heading, inherit);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .legend > span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .key-line { width: 18px; height: 3px; }
  .key-dash { width: 18px; height: 0; border-top: 2px dashed; }
  .key-dot { width: 10px; height: 10px; border-radius: 50%; }
  .key-box { width: 12px; height: 12px; }
  .chart {
    display: flex;
    gap: 8px;
  }
  .axis-y {
    position: relative;
    width: 44px;
    flex-shrink: 0;
  }
  .axis-y span, .axis-x span {
    position: absolute;
    white-space: nowrap;
    font-size: 11px;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }
  .axis-y span {
    right: 0;
    transform: translateY(-50%);
  }
  .plot {
    position: relative;
    flex: 1;
    min-width: 0;
  }
  .plot svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .grid-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--divider-color);
  }
  .band {
    position: absolute;
    left: 0;
    right: 0;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
  }
  .shade {
    position: absolute;
    top: 0;
    bottom: 0;
  }
  .axis-x {
    position: relative;
    height: 16px;
    margin-left: 52px;
  }
  .pt {
    position: absolute;
    width: 10px;
    height: 10px;
    margin: -5px 0 0 -5px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff));
  }
  .pt-label {
    position: absolute;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 700;
  }
  .callout {
    position: absolute;
    max-width: 240px;
    padding: 6px 10px;
    font-size: 12px;
    line-height: 17px;
    background: var(--primary-background-color);
    border: 1px solid var(--divider-color);
  }
  .strip-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .strip-label {
    width: 44px;
    flex-shrink: 0;
    text-align: right;
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .strip-bar {
    flex: 1;
    min-width: 0;
    height: 24px;
    position: relative;
  }
  .strip-seg {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding-left: 6px;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border-right: 2px solid var(--ha-card-background, var(--card-background-color, #fff));
  }
  .kpis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 10px;
  }
  .kpi {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--bc-surface);
    border-top: 4px solid var(--kpi);
  }
  .kpi-label, .kpi-note {
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .kpi-value {
    font-size: 28px;
    line-height: 32px;
    font-weight: 600;
  }
  .kpi-unit {
    font-size: 14px;
    color: var(--secondary-text-color);
  }
  ha-card.hud .kpi { border-radius: 0; }
  ha-card.hud .kpi-value {
    font-family: var(--ha-font-family-heading, inherit);
    font-size: 34px;
    font-style: italic;
    font-weight: 800;
  }
  .multiples {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
  }
  .multiple {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--bc-surface);
    border-top: 4px solid var(--divider-color);
  }
  .multiple.flag { border-top-color: var(--bc-yellow); }
  .multiple-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 4px 8px;
  }
  ha-card.hud .multiple { border-radius: 0; }
  .table-wrap { overflow-x: auto; }
  table.data {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  table.data th {
    text-align: left;
    padding: 6px 10px 6px 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    border-bottom: 2px solid var(--divider-color);
  }
  table.data td, table.data tbody th {
    padding: 8px 10px 8px 0;
    vertical-align: top;
    border-bottom: 1px solid var(--divider-color);
  }
  table.data tbody th {
    text-transform: none;
    letter-spacing: 0;
    font-size: 13px;
    color: var(--primary-text-color);
  }
  table.data td.num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }
  .verdict {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    --mdc-icon-size: 16px;
  }
  .verdict.ok { color: var(--bc-green); }
  .verdict.check { color: var(--bc-yellow); }
  .verdict.fail { color: var(--bc-orange); }
  .verdict.info { color: var(--secondary-text-color); }
  table.data small {
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .kind {
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-right: 8px;
    transform: rotate(45deg);
  }
  .note-box {
    margin: 0;
    padding: 10px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    font-size: 13px;
    line-height: 19px;
  }
  ha-card.hud .note-box { border-radius: 0; }
  .bars {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .bar-line {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .bar {
    height: 18px;
    border-radius: 0 4px 4px 0;
  }
  .bar-value {
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }
  .columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
  }
  .season-title {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 6px;
    border-bottom: 2px solid var(--accent);
    font-size: 16px;
    font-weight: 700;
    --mdc-icon-size: 20px;
  }
  .season-title ha-icon { color: var(--accent); }
  ha-card.hud .season-title {
    font-family: var(--ha-font-family-heading, inherit);
    font-size: 20px;
    font-style: italic;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
  }
`;

// Draws a time chart: grid lines, optional shaded spans and band, SVG paths.
function timeChart({ height, ticks, yOf, paths = '', shades = '', band = '', overlays = '', label }) {
  const grid = ticks.map((tick) => `<span class="grid-line" style="top: ${pct(yOf(tick.value))}"></span>`).join('');
  const axis = ticks.map((tick) => `<span style="top: ${pct(yOf(tick.value))}">${escapeHtml(tick.label)}</span>`).join('');
  return `
    <div class="chart">
      <div class="axis-y" style="height: ${height}px" aria-hidden="true">${axis}</div>
      <div class="plot" style="height: ${height}px" role="img" aria-label="${escapeHtml(label)}">
        ${shades}${band}${grid}
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">${paths}</svg>
        ${overlays}
      </div>
    </div>`;
}

function svgPath(d, colour, width = 2, dashed = false) {
  return `<path d="${d}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"
    ${dashed ? 'stroke-dasharray="6 4"' : ''} vector-effect="non-scaling-stroke"></path>`;
}

/* ------------------------------------------------------------------------ */
/* 4f. Heating check card                                                   */
/* ------------------------------------------------------------------------ */

const HEATING_PERIODS = [24, 48, 168];

class BastideHeatingCard extends BastideCard {
  static get styles() {
    return CHART_STYLES;
  }

  static getStubConfig() {
    return {};
  }

  getCardSize() {
    return 14;
  }

  edgeAccent() {
    return 'orange';
  }

  // The card reads the history on a timer instead of redrawing on every change.
  watchedEntities() {
    return [];
  }

  set hass(hass) {
    super.hass = hass;
    this._maybeFetch();
  }

  setConfig(config) {
    super.setConfig(config);
    this._hours = this._hours || toNumber(config.hours) || 48;
    this._fetchedAt = 0;
    this._maybeFetch();
  }

  onLocal(action) {
    if (!action.startsWith('hours:')) return;
    this._hours = Number(action.slice(6));
    this._data = null;
    this._fetchedAt = 0;
    this._renderKey = '';
    this._render();
    this._maybeFetch();
  }

  _maybeFetch() {
    if (!this._hass || !this._config || this._fetching) return;
    if (Date.now() - (this._fetchedAt || 0) < 5 * 60 * 1000) return;
    this._fetch();
  }

  async _fetch() {
    this._fetching = true;
    const config = this._config;
    const end = new Date();
    const start = new Date(end.getTime() - this._hours * 3600 * 1000);
    try {
      const plain = await fetchHistory(this._hass, [
        config.outdoor_entity, config.boiler_threshold_entity, config.heat_pump_threshold_entity,
        config.heat_pump_mode_entity, config.boiler_entity, config.presence_entity,
      ], start, end, false);
      const rooms = await fetchHistory(this._hass, entityList(config.rooms), start, end, true);
      this._data = { start: start.getTime(), end: end.getTime(), plain, rooms };
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
    const config = this._config;
    const t = (key, vars) => this.t(`heating.${key}`, vars);
    const periods = HEATING_PERIODS.map((hours) => `
      <button type="button" class="seg${hours === this._hours ? ' active' : ''}" aria-pressed="${hours === this._hours}"
        data-local="hours:${hours}"><span>${escapeHtml(t(`period_${hours}`))}</span></button>`).join('');
    const header = ui.header({
      icon: 'mdi:radiator',
      title: config.title || t('title'),
      accent: 'orange',
      extra: `<div class="segmented accent-orange" role="group" aria-label="${escapeHtml(t('period'))}">${periods}</div>`,
    });
    if (this._error) return header + ui.setup(t('error'));
    if (!this._data) return header + ui.setup(t('loading'));
    return header + this._body();
  }

  _body() {
    const hass = this._hass;
    const config = this._config;
    const t = (key, vars) => this.t(`heating.${key}`, vars);
    const { start, end, plain, rooms } = this._data;
    const span = end - start;
    const xOf = (time) => ((time - start) / span) * 1000;
    const leftOf = (time) => pct(((time - start) / span) * 100);
    const unit = hass.config?.unit_system?.temperature || '°C';
    const temp = (value, digits) => formatTemperature(hass, value, unit, digits);
    const num = (point) => (point ? toNumber(point.s) : null);

    const outdoor = (plain[config.outdoor_entity] || []).filter((p) => toNumber(p.s) !== null);
    const lows = plain[config.boiler_threshold_entity] || [];
    const highs = plain[config.heat_pump_threshold_entity] || [];
    const fixed = toNumber(config.switch_over) ?? CLIMATE_DEFAULTS.switch_over;
    const lowAt = (time) => num(pointAt(lows, time)) ?? fixed;
    const highAt = (time) => num(pointAt(highs, time)) ?? lowAt(time);

    // Which source heats, over time: the boiler thermostat on wins; the heat
    // pumps count when their common mode allows it and a room thermostat is on.
    const heatStates = config.heat_pump_heat_states || ['Heat only'];
    const coolStates = config.heat_pump_cool_states || ['Cool only'];
    const roomSeries = entityList(config.rooms).map((id) => rooms[id] || []);
    const sources = mergeShortSpans(combinedSpans(start, end, [plain[config.heat_pump_mode_entity], plain[config.boiler_entity], ...roomSeries], ([mode, boiler, ...thermostats]) => {
      if (boiler && ['heat', 'on'].includes(boiler.s)) return 'boiler';
      const anyRoom = (state) => !roomSeries.length || thermostats.some((p) => p && p.s === state);
      if (mode && heatStates.includes(mode.s) && anyRoom('heat')) return 'pac';
      if (mode && coolStates.includes(mode.s) && anyRoom('cool')) return 'cool';
      return 'off';
    }), 120000);
    const presence = config.presence_entity
      ? mergeShortSpans(combinedSpans(start, end, [plain[config.presence_entity]], ([p]) => (p && isUsable({ state: p.s }) ? p.s : null)), 60000)
      : [];

    // What the automation did, newest first, each switch checked against the thresholds.
    const entries = [];
    for (let i = 1; i < sources.length; i += 1) {
      const now = sources[i];
      const before = sources[i - 1];
      const out = num(pointAt(outdoor, now.from));
      let what = `start_${now.value}`;
      if (now.value === 'boiler' && before.value === 'pac') what = 'to_boiler';
      if (now.value === 'pac' && before.value === 'boiler') what = 'back_pac';
      let status = 'info';
      let why = out === null ? '' : t('why_outdoor', { value: temp(out, 1) });
      if (out !== null && now.value === 'boiler') {
        status = out <= highAt(now.from) ? 'ok' : 'check';
        if (status === 'check') why = t('why_check_boiler', { value: temp(out, 1) });
      }
      if (out !== null && now.value === 'pac') {
        status = out >= lowAt(now.from) ? 'ok' : 'check';
        if (status === 'check') why = t('why_check_pac', { value: temp(out, 1) });
      }
      entries.push({ time: now.from, kind: now.value, what: t(what), why, status });
    }
    for (let i = 1; i < presence.length; i += 1) {
      if (presence[i].value === null) continue;
      entries.push({ time: presence[i].from, kind: 'mode', what: t('mode_change', { mode: presence[i].value }), why: '', status: 'info' });
    }
    entries.sort((a, b) => b.time - a.time);
    const switches = entries.filter((e) => e.kind !== 'mode' && e.status !== 'info');
    const toCheck = entries.filter((e) => e.status === 'check').length;

    // Key figures.
    const hoursOf = (value) => sources.filter((s) => s.value === value).reduce((a, s) => a + s.to - s.from, 0) / 3600000;
    const outdoorMean = timeMean(outdoor, start, end);
    const kpi = (label, value, unitText, note, colour) => `
      <div class="kpi" style="--kpi: ${colour}">
        <span class="kpi-label">${escapeHtml(label)}</span>
        <span class="kpi-value">${escapeHtml(value)}<span class="kpi-unit">${escapeHtml(unitText)}</span></span>
        <span class="kpi-note">${escapeHtml(note)}</span>
      </div>`;
    const kpis = `<div class="kpis">
      ${kpi(t('kpi_outdoor'), outdoorMean === null ? '—' : formatNumber(hass, outdoorMean, 1), ` ${unit}`, t(`period_note_${this._hours}`), 'var(--secondary-text-color)')}
      ${kpi(t('kpi_hp'), formatNumber(hass, hoursOf('pac'), 0), ' h', t('kpi_running'), 'var(--bc-hp)')}
      ${kpi(t('kpi_boiler'), formatNumber(hass, hoursOf('boiler'), 0), ' h', t('kpi_running'), 'var(--bc-boiler)')}
      ${kpi(t('kpi_switches'), String(switches.length), '', toCheck ? t('kpi_some', { n: toCheck }) : t('kpi_all_ok'), 'var(--bc-green)')}
      ${kpi(t('kpi_check'), String(toCheck), '', toCheck ? t('kpi_check_note') : t('kpi_nothing'), 'var(--bc-yellow)')}
    </div>`;

    // Time axis.
    const step = { 24: 3, 48: 6, 168: 24 }[this._hours] || 6;
    const locale = hass.locale?.language || hass.language || 'en';
    const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const ticksX = [];
    const first = new Date(start);
    first.setMinutes(0, 0, 0);
    first.setHours(Math.ceil((first.getHours() + (start > first.getTime() ? 1 : 0)) / step) * step);
    for (let time = first.getTime(); time < end; time += step * 3600000) {
      const date = new Date(time);
      const label = date.getHours() === 0 || step >= 24
        ? `${weekday.format(date).replace('.', '')} ${String(date.getHours()).padStart(2, '0')}h`
        : `${String(date.getHours()).padStart(2, '0')}h`;
      ticksX.push(`<span style="left: ${leftOf(time)}; transform: translateX(-50%)">${escapeHtml(label)}</span>`);
    }
    const axisX = `<div class="axis-x" aria-hidden="true">${ticksX.join('')}</div>`;

    // Outdoor chart with the switch-over thresholds.
    const values = outdoor.map((p) => toNumber(p.s)).concat([lowAt(end), highAt(end)]);
    const yMin = Math.floor((Math.min(...values) - 2) / 5) * 5;
    const yMax = Math.max(yMin + 10, Math.ceil((Math.max(...values) + 2) / 5) * 5);
    const yOf = (value) => Math.min(100, Math.max(0, (1 - (value - yMin) / (yMax - yMin)) * 100));
    const line = (points, valueOf) => {
      let d = '';
      const initial = pointAt(points, start);
      if (initial && valueOf(initial) !== null) d += `M0 ${yOf(valueOf(initial)).toFixed(2)} `;
      for (const p of points) {
        if (p.t <= start || p.t > end) continue;
        const v = valueOf(p);
        if (v === null) continue;
        d += `${d ? 'L' : 'M'}${xOf(p.t).toFixed(1)} ${yOf(v).toFixed(2)} `;
      }
      const last = pointAt(points, end);
      if (d && last && valueOf(last) !== null) d += `L1000 ${yOf(valueOf(last)).toFixed(2)}`;
      return d;
    };
    const stepLine = (points, fallback) => {
      const spans = combinedSpans(start, end, [points], ([p]) => (p ? toNumber(p.s) : null) ?? fallback);
      return spans.map((s, i) => `${i ? 'L' : 'M'}${xOf(s.from).toFixed(1)} ${yOf(s.value).toFixed(2)} L${xOf(s.to).toFixed(1)} ${yOf(s.value).toFixed(2)}`).join(' ');
    };
    const outdoorPath = line(outdoor, (p) => toNumber(p.s));
    let extremes = '';
    if (outdoor.length) {
      const inRange = outdoor.filter((p) => p.t >= start && p.t <= end);
      if (inRange.length > 1) {
        const lowPoint = inRange.reduce((a, p) => (toNumber(p.s) < toNumber(a.s) ? p : a));
        const highPoint = inRange.reduce((a, p) => (toNumber(p.s) > toNumber(a.s) ? p : a));
        const mark = (p, key, dy) => `
          <span class="pt" style="left: ${leftOf(p.t)}; top: ${pct(yOf(toNumber(p.s)))}; background: var(--primary-text-color)"></span>
          <span class="pt-label" style="left: ${leftOf(p.t)}; top: ${pct(yOf(toNumber(p.s)))}; transform: translate(-50%, ${dy})">${escapeHtml(t(key, { value: temp(toNumber(p.s), 1) }))}</span>`;
        extremes = mark(lowPoint, 'min', '8px') + mark(highPoint, 'max', '-28px');
      }
    }
    const low = lowAt(end);
    const high = highAt(end);
    const outdoorChart = `
      <div class="block">
        <div class="block-head">
          <h3 class="block-title">${escapeHtml(t('outdoor_title'))}</h3>
          <div class="legend">
            <span><span class="key-line" style="background: var(--primary-text-color)"></span>${escapeHtml(t('outdoor'))}</span>
            <span><span class="key-line" style="background: var(--bc-hp)"></span>${escapeHtml(t('threshold_hp', { value: temp(high) }))}</span>
            <span><span class="key-line" style="background: var(--bc-boiler)"></span>${escapeHtml(t('threshold_boiler', { value: temp(low) }))}</span>
          </div>
        </div>
        ${timeChart({
          height: 190,
          ticks: niceTicks(yMin, yMax, 5).map((v) => ({ value: v, label: temp(v) })),
          yOf,
          band: `<span class="band" style="top: ${pct(yOf(high))}; height: ${pct(yOf(low) - yOf(high))}"></span>`,
          paths: svgPath(stepLine(highs, high), 'var(--bc-hp)') + svgPath(stepLine(lows, low), 'var(--bc-boiler)') + (outdoorPath ? svgPath(outdoorPath, 'var(--primary-text-color)') : ''),
          overlays: extremes,
          label: t('outdoor_title'),
        })}
        ${this._strip(t('source'), sources, (value) => ({
          pac: ['var(--bc-hp)', t('src_pac')], boiler: ['var(--bc-boiler)', t('src_boiler')],
          cool: ['var(--bc-teal)', t('src_cool')], off: ['var(--bc-surface)', t('src_off')],
        }[value]), leftOf, span)}
        ${presence.length ? this._strip(t('mode'), presence, (value, index) => [
          `color-mix(in srgb, var(--primary-text-color) ${index % 2 ? 14 : 8}%, transparent)`, value || '',
        ], leftOf, span) : ''}
        ${axisX}
      </div>`;

    // One small chart per room: temperature, target, and when it heats.
    const multiples = entityItems(config.rooms).map((item) => {
      const points = rooms[item.entity] || [];
      const name = item.name || this._hass.states[item.entity]?.attributes?.friendly_name || item.entity;
      const currentOf = (p) => toNumber(p.a?.current_temperature);
      const targetOf = (p) => toNumber(p.a?.temperature);
      const temps = points.map(currentOf).concat(points.map(targetOf)).filter((v) => v !== null);
      if (!temps.length) {
        return `<div class="multiple"><div class="multiple-head"><span class="name">${escapeHtml(name)}</span></div>${ui.setup(t('no_data'))}</div>`;
      }
      const rMin = Math.floor(Math.min(...temps)) - 1;
      const rMax = Math.max(rMin + 4, Math.ceil(Math.max(...temps)) + 1);
      const ry = (value) => (1 - (value - rMin) / (rMax - rMin)) * 100;
      const path = (valueOf, stepped) => {
        const spans = combinedSpans(start, end, [points], ([p]) => (p ? valueOf(p) : null));
        if (stepped) {
          return spans.filter((s) => s.value !== null)
            .map((s, i) => `${i ? 'L' : 'M'}${xOf(s.from).toFixed(1)} ${ry(s.value).toFixed(2)} L${xOf(s.to).toFixed(1)} ${ry(s.value).toFixed(2)}`).join(' ');
        }
        return spans.filter((s) => s.value !== null).map((s, i) => `${i ? 'L' : 'M'}${xOf(s.from).toFixed(1)} ${ry(s.value).toFixed(2)}`).join(' ');
      };
      const heatingColour = item.kind === 'boiler' ? 'var(--bc-boiler)' : 'var(--bc-hp)';
      const heating = combinedSpans(start, end, [points], ([p]) => (p?.a?.hvac_action === 'heating' ? 'on' : 'off'))
        .filter((s) => s.value === 'on')
        .map((s) => `<span class="shade" style="left: ${leftOf(s.from)}; width: ${pct(((s.to - s.from) / span) * 100)}; background: color-mix(in srgb, ${heatingColour} 30%, transparent)"></span>`)
        .join('');
      // Verdict: how far the room stays below its target while the thermostat
      // is on. Being warmer than the target (sun, mild days) is not a fault.
      let gapTotal = 0;
      let onTime = 0;
      for (const s of combinedSpans(start, end, [points], ([p]) => (p && p.s !== 'off' && currentOf(p) !== null && targetOf(p) !== null
        ? Math.max(0, targetOf(p) - currentOf(p)) : null))) {
        if (s.value === null) continue;
        gapTotal += s.value * (s.to - s.from);
        onTime += s.to - s.from;
      }
      const gap = onTime ? gapTotal / onTime : null;
      let verdict = t('verdict_off');
      let flagged = false;
      if (gap !== null && gap <= 0.5) verdict = t('verdict_ok');
      if (gap !== null && gap > 0.5) {
        verdict = t('verdict_gap', { value: temp(gap, 1) });
        flagged = true;
      }
      return `
        <div class="multiple${flagged ? ' flag' : ''}">
          <div class="multiple-head">
            <button type="button" class="name" data-entity="${escapeHtml(item.entity)}">${escapeHtml(name)}</button>
            <span class="state" style="color: ${flagged ? 'var(--bc-yellow)' : 'var(--secondary-text-color)'}">${escapeHtml(verdict)}</span>
          </div>
          ${timeChart({
            height: 120,
            ticks: niceTicks(rMin, rMax, 2).map((v) => ({ value: v, label: formatNumber(hass, v, 0) })),
            yOf: ry,
            shades: heating,
            paths: svgPath(path(targetOf, true), 'color-mix(in srgb, var(--primary-text-color) 60%, transparent)', 1.5)
              + svgPath(path(currentOf, false), 'var(--bc-teal)'),
            label: `${name} : ${verdict}`,
          })}
        </div>`;
    }).join('');
    const roomsBlock = entityItems(config.rooms).length ? `
      <div class="block">
        <div class="block-head">
          <h3 class="block-title">${escapeHtml(t('rooms_title'))}</h3>
          <div class="legend">
            <span><span class="key-line" style="background: var(--bc-teal)"></span>${escapeHtml(t('legend_room'))}</span>
            <span><span class="key-line" style="background: color-mix(in srgb, var(--primary-text-color) 60%, transparent)"></span>${escapeHtml(t('legend_target'))}</span>
            <span><span class="key-box" style="background: color-mix(in srgb, var(--bc-hp) 30%, transparent)"></span>${escapeHtml(t('legend_hp'))}</span>
          </div>
        </div>
        <div class="multiples">${multiples}</div>
      </div>` : '';

    // The log.
    const when = new Intl.DateTimeFormat(locale, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    const kindColour = { pac: 'var(--bc-hp)', boiler: 'var(--bc-boiler)', cool: 'var(--bc-teal)', off: 'var(--secondary-text-color)', mode: 'var(--bc-steel)' };
    const icons = { ok: 'mdi:check', check: 'mdi:alert', info: 'mdi:information-outline' };
    const max = toNumber(config.max_events) || 10;
    const rows = entries.slice(0, max).map((e) => `
      <tr>
        <td style="white-space: nowrap; color: var(--secondary-text-color)">${escapeHtml(when.format(new Date(e.time)))}</td>
        <td><span class="kind" style="background: ${kindColour[e.kind]}"></span>${escapeHtml(e.what)}</td>
        <td style="color: var(--secondary-text-color)">${escapeHtml(e.why)}</td>
        <td><span class="verdict ${e.status}"><ha-icon icon="${icons[e.status]}"></ha-icon>${escapeHtml(t(e.status))}</span></td>
      </tr>`).join('');
    const logBlock = `
      <div class="block">
        <div class="block-head"><h3 class="block-title">${escapeHtml(t('log_title'))}</h3></div>
        ${rows ? `<div class="table-wrap"><table class="data">
          <thead><tr><th scope="col">${escapeHtml(t('col_when'))}</th><th scope="col">${escapeHtml(t('col_what'))}</th>
            <th scope="col">${escapeHtml(t('col_why'))}</th><th scope="col">${escapeHtml(t('col_check'))}</th></tr></thead>
          <tbody>${rows}</tbody></table></div>` : ui.setup(t('empty'))}
      </div>`;

    return kpis + outdoorChart + roomsBlock + logBlock;
  }

  // A coloured band of spans along the time axis (heat source, presence mode).
  _strip(label, spans, style, leftOf, span) {
    const segments = spans.map((s, index) => {
      const [background, text] = style(s.value, index) || ['transparent', ''];
      const width = ((s.to - s.from) / span) * 100;
      const dark = background.startsWith('var(--bc-') && background !== 'var(--bc-surface)';
      return `<span class="strip-seg" style="left: ${leftOf(s.from)}; width: ${pct(width)}; background: ${background};
        color: ${dark ? 'var(--bc-on-accent)' : 'var(--primary-text-color)'}" title="${escapeHtml(text)}">${width > 7 ? escapeHtml(text) : ''}</span>`;
    }).join('');
    return `<div class="strip-row"><span class="strip-label">${escapeHtml(label)}</span><div class="strip-bar">${segments}</div></div>`;
  }
}

/* ------------------------------------------------------------------------ */
/* 4g. Insulation card                                                      */
/* ------------------------------------------------------------------------ */

class BastideInsulationCard extends BastideCard {
  static get styles() {
    return CHART_STYLES;
  }

  static getStubConfig() {
    return {};
  }

  getCardSize() {
    return 16;
  }

  edgeAccent() {
    return 'pink';
  }

  watchedEntities() {
    return [];
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

  _rooms() {
    return (Array.isArray(this._config.rooms) ? this._config.rooms : []).filter((room) => room && room.name);
  }

  _maybeFetch() {
    if (!this._hass || !this._config || this._fetching) return;
    if (Date.now() - (this._fetchedAt || 0) < 60 * 60 * 1000) return;
    this._fetch();
  }

  async _fetch() {
    this._fetching = true;
    const config = this._config;
    const hass = this._hass;
    const rooms = this._rooms();
    const now = new Date();
    try {
      const daily = await fetchStatistics(hass, [
        config.outdoor_entity, config.boiler_hours_entity, ...rooms.map((r) => r.heating_energy),
      ], new Date(now.getTime() - 365 * 86400000), now, 'day');
      const nights = await fetchStatistics(hass, [
        config.outdoor_entity, config.boiler_hours_entity,
        ...rooms.map((r) => r.temperature), ...rooms.map((r) => r.heating_energy),
      ], new Date(now.getTime() - 30 * 86400000), now, 'hour');
      // Last summer: this year once June has started, otherwise the year before.
      const year = now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;
      const summerStart = new Date(year, 4, 1);
      const summerEnd = new Date(Math.min(new Date(year, 9, 1).getTime(), now.getTime()));
      const summer = await fetchStatistics(hass, [
        config.summer_outdoor_entity || config.outdoor_entity,
        ...rooms.map((r) => r.summer_temperature || r.temperature), ...rooms.map((r) => r.cooling_energy),
      ], summerStart, summerEnd, 'hour');
      this._data = { daily, nights, summer, summerStart: summerStart.getTime() };
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
    const config = this._config;
    const t = (key, vars) => this.t(`insulation.${key}`, vars);
    const header = ui.header({ icon: 'mdi:home-thermometer', title: config.title || t('title'), accent: 'pink' });
    if (!this._rooms().length || !config.outdoor_entity) return header + ui.setup(t('setup'));
    if (this._error) return header + ui.setup(t('error'));
    if (!this._data) return header + ui.setup(t('loading'));
    return `${header}
      <p class="intro">${escapeHtml(t('intro'))}</p>
      <div class="columns">
        <div class="block accent-hp">
          <h3 class="season-title"><ha-icon icon="mdi:snowflake"></ha-icon>${escapeHtml(t('winter'))}</h3>
          ${this._signature()}
          ${this._timeConstants()}
        </div>
        <div class="block accent-boiler">
          <h3 class="season-title"><ha-icon icon="mdi:white-balance-sunny"></ha-icon>${escapeHtml(t('summer'))}</h3>
          ${this._hotDay()}
          ${this._overheating()}
        </div>
      </div>
      ${this._methods()}`;
  }

  // Energy signature: heat delivered per day against the mean outdoor temperature.
  _signature() {
    const hass = this._hass;
    const config = this._config;
    const t = (key, vars) => this.t(`insulation.${key}`, vars);
    const unit = hass.config?.unit_system?.temperature || '°C';
    const daily = this._data.daily;
    const scop = toNumber(config.heat_pump_scop) || 4.1;
    const boilerKw = toNumber(config.boiler_power_kw);
    const byDay = new Map();
    for (const row of daily[config.outdoor_entity] || []) byDay.set(row.start, { outdoor: row.mean, heat: 0, boilerHours: 0 });
    for (const room of this._rooms()) {
      for (const row of daily[room.heating_energy] || []) {
        if (byDay.has(row.start) && row.change > 0) byDay.get(row.start).heat += row.change * scop;
      }
    }
    for (const row of daily[config.boiler_hours_entity] || []) {
      if (byDay.has(row.start) && row.change > 0) byDay.get(row.start).boilerHours += row.change;
    }
    const points = [];
    let excluded = 0;
    for (const day of byDay.values()) {
      if (day.outdoor === null) continue;
      const boilerDay = day.boilerHours > 0.25;
      if (boilerDay && !boilerKw) {
        excluded += 1;
        continue;
      }
      const heat = day.heat + (boilerDay ? day.boilerHours * boilerKw : 0);
      if (heat < 0.5) continue;
      points.push({ x: day.outdoor, y: heat, boiler: boilerDay });
    }
    const sub = t('signature_sub', { scop: formatNumber(hass, scop, 1) })
      + (boilerKw ? t('signature_boiler', { kw: formatNumber(hass, boilerKw, 0) }) : (excluded ? t('signature_noboiler', { n: excluded }) : ''));
    const head = `
      <div class="block-head">
        <div><h4 class="block-title">${escapeHtml(t('signature'))}</h4><p class="panel-sub">${escapeHtml(sub)}</p></div>
        <div class="legend">
          <span><span class="key-dot" style="background: var(--bc-hp)"></span>${escapeHtml(t('legend_hp_day'))}</span>
          <span><span class="key-dot" style="background: var(--bc-boiler)"></span>${escapeHtml(t('legend_boiler_day'))}</span>
        </div>
      </div>`;
    if (points.length < 10) return `<div class="block">${head}${ui.setup(t('need_days', { n: points.length }))}</div>`;

    const fit = linearFit(points.map((p) => p.x), points.map((p) => p.y));
    const balance = fit.slope < 0 ? -fit.intercept / fit.slope : null;
    const xMin = Math.floor(Math.min(...points.map((p) => p.x)) / 5) * 5 - 2;
    const xMax = Math.max(xMin + 10, Math.ceil(Math.max(...points.map((p) => p.x), balance ?? -99) / 5) * 5 + 2);
    const yMax = Math.max(10, Math.ceil(Math.max(...points.map((p) => p.y)) / 10) * 10);
    const sx = (x) => ((x - xMin) / (xMax - xMin)) * 100;
    const sy = (y) => (1 - y / yMax) * 100;
    const dots = points.map((p) => `<span class="pt" style="left: ${pct(sx(p.x))}; top: ${pct(sy(p.y))};
      background: ${p.boiler ? 'var(--bc-boiler)' : 'var(--bc-hp)'}"></span>`).join('');
    let trend = '';
    let callouts = '';
    if (balance !== null) {
      const yAtMin = fit.intercept + fit.slope * xMin;
      trend = svgPath(`M${(sx(xMin) * 10).toFixed(1)} ${sy(yAtMin).toFixed(2)} L${(sx(balance) * 10).toFixed(1)} ${sy(0).toFixed(2)}`,
        'color-mix(in srgb, var(--primary-text-color) 55%, transparent)');
      const wk = Math.round((-fit.slope * 1000 / 24) / 10) * 10;
      callouts = `
        <span class="callout" style="left: 3%; top: 4%">${escapeHtml(t('slope', { kwh: formatNumber(hass, -fit.slope, 1), wk }))}</span>
        <span class="callout" style="left: ${pct(Math.min(96, sx(balance)))}; bottom: 14px; transform: translateX(-92%)">${escapeHtml(t('balance', { value: formatTemperature(hass, balance, unit, 0) }))}</span>`;
    }
    const xTicks = niceTicks(xMin, xMax, 5).map((x) => `<span style="left: ${pct(sx(x))}; transform: translateX(-50%)">${escapeHtml(formatTemperature(hass, x, unit, 0))}</span>`).join('');
    return `
      <div class="block">
        ${head}
        ${timeChart({
          height: 230,
          ticks: niceTicks(0, yMax, yMax > 40 ? 20 : 10).map((v) => ({ value: v, label: `${v} kWh` })),
          yOf: sy,
          paths: trend,
          overlays: dots + callouts,
          label: t('signature'),
        })}
        <div class="axis-x" aria-hidden="true">${xTicks}</div>
      </div>`;
  }

  // Time constant: how fast each room cools, at night with the heating off.
  _timeConstants() {
    const hass = this._hass;
    const config = this._config;
    const t = (key, vars) => this.t(`insulation.${key}`, vars);
    const nights = this._data.nights;
    const outdoor = new Map((nights[config.outdoor_entity] || []).map((r) => [r.start, r.mean]));
    const boiler = new Map((nights[config.boiler_hours_entity] || []).map((r) => [r.start, r.change]));
    const results = this._rooms().map((room) => {
      const inside = nights[room.temperature] || [];
      const heat = new Map((nights[room.heating_energy] || []).map((r) => [r.start, r.change]));
      const taus = [];
      let run = [];
      const close = () => {
        if (run.length >= 5) {
          const xs = run.map((r, i) => i);
          const ys = run.map((r) => Math.log(r.gap));
          const fit = linearFit(xs, ys);
          if (fit.slope < 0) {
            const tau = -1 / fit.slope;
            if (tau > 2 && tau < 400) taus.push(tau);
          }
        }
        run = [];
      };
      for (const row of inside) {
        const hour = new Date(row.start).getHours();
        const night = hour >= 21 || hour < 7;
        const out = outdoor.get(row.start);
        const quiet = (heat.get(row.start) ?? 0) <= 0.01 && (boiler.get(row.start) ?? 0) <= 0.01;
        const previous = run[run.length - 1];
        const continues = previous && row.start - previous.start === 3600000 && row.mean <= previous.temp + 0.3;
        if (night && quiet && row.mean !== null && out != null && row.mean - out > 3) {
          if (previous && !continues) close();
          run.push({ start: row.start, temp: row.mean, gap: row.mean - out });
        } else {
          close();
        }
      }
      close();
      return { name: room.name, tau: taus.length ? median(taus) : null, nights: taus.length };
    });
    const known = results.filter((r) => r.tau !== null);
    const head = `
      <div><h4 class="block-title">${escapeHtml(t('tau'))}</h4><p class="panel-sub">${escapeHtml(t('tau_sub'))}</p></div>`;
    if (!known.length) return `<div class="block">${head}${ui.setup(t('tau_none'))}</div>`;
    const maxTau = Math.max(...known.map((r) => r.tau));
    const worst = known.reduce((a, r) => (r.tau < a.tau ? r : a));
    const best = known.reduce((a, r) => (r.tau > a.tau ? r : a));
    const bars = results.map((r) => `
      <div class="bar-row">
        <span class="state" style="font-size: 13px; color: var(--primary-text-color)">${escapeHtml(r.name)}</span>
        <div class="bar-line">
          ${r.tau === null ? `<span class="state">${escapeHtml(t('tau_missing'))}</span>` : `
          <span class="bar" style="width: ${pct((r.tau / maxTau) * 80)}; background: ${known.length > 1 && r === worst ? 'var(--bc-pink)' : 'color-mix(in srgb, var(--primary-text-color) 30%, transparent)'}"></span>
          <span class="bar-value">${escapeHtml(formatNumber(hass, r.tau, 0))} h</span>
          <span class="state">${escapeHtml(t(r.nights < 3 ? 'tau_few' : 'tau_nights', { n: r.nights }))}</span>`}
        </div>
      </div>`).join('');
    const insight = known.length > 1 && best !== worst && worst.nights >= 2 && best.nights >= 2
      ? `<p class="note-box">${escapeHtml(t('tau_insight', { room: worst.name, best: best.name, ratio: formatNumber(hass, best.tau / worst.tau, 1) }))}</p>`
      : '';
    return `<div class="block">${head}<div class="bars">${bars}</div>${insight}</div>`;
  }

  _summerRows(id) {
    return this._data.summer[id] || [];
  }

  // The hottest day with the air conditioning off in the living room.
  _hotDay() {
    const hass = this._hass;
    const config = this._config;
    const t = (key, vars) => this.t(`insulation.${key}`, vars);
    const unit = hass.config?.unit_system?.temperature || '°C';
    const room = this._rooms().find((r) => r.kind === 'living') || this._rooms()[0];
    const head = (sub) => `
      <div class="block-head">
        <div><h4 class="block-title">${escapeHtml(t('hot_day'))}</h4>${sub ? `<p class="panel-sub">${escapeHtml(sub)}</p>` : ''}</div>
        <div class="legend">
          <span><span class="key-line" style="background: var(--primary-text-color)"></span>${escapeHtml(t('outdoor'))}</span>
          <span><span class="key-line" style="background: var(--bc-teal)"></span>${escapeHtml(room.name)}</span>
        </div>
      </div>`;
    const inside = new Map(this._summerRows(room.summer_temperature || room.temperature).map((r) => [r.start, r.mean]));
    const cooling = new Map(this._summerRows(room.cooling_energy).map((r) => [r.start, r.change]));
    const days = new Map();
    for (const row of this._summerRows(config.summer_outdoor_entity || config.outdoor_entity)) {
      if (row.mean === null || !inside.has(row.start)) continue;
      const date = new Date(row.start);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!days.has(key)) days.set(key, { date, hours: [], cooling: 0 });
      const day = days.get(key);
      day.hours.push({ hour: date.getHours(), out: row.mean, in: inside.get(row.start) });
      day.cooling += Math.max(0, cooling.get(row.start) ?? 0);
    }
    const candidates = [...days.values()].filter((d) => d.hours.length >= 22 && d.cooling <= 0.05);
    if (!candidates.length) return `<div class="block">${head('')}${ui.setup(t('no_hot_day'))}</div>`;
    const day = candidates.reduce((a, d) => (Math.max(...d.hours.map((h) => h.out)) > Math.max(...a.hours.map((h) => h.out)) ? d : a));
    const outs = day.hours.map((h) => h.out);
    const ins = day.hours.map((h) => h.in);
    const outPeak = day.hours.reduce((a, h) => (h.out > a.out ? h : a));
    const inPeak = day.hours.reduce((a, h) => (h.in > a.in ? h : a));
    const ratio = (Math.max(...ins) - Math.min(...ins)) / Math.max(0.1, Math.max(...outs) - Math.min(...outs));
    const lag = (inPeak.hour - outPeak.hour + 24) % 24;
    const yMin = Math.floor((Math.min(...outs, ...ins) - 2) / 5) * 5;
    const yMax = Math.ceil((Math.max(...outs, ...ins) + 2) / 5) * 5;
    const yOf = (v) => (1 - (v - yMin) / (yMax - yMin)) * 100;
    const xOf = (hour) => (hour / 23) * 1000;
    const path = (key) => day.hours.map((h, i) => `${i ? 'L' : 'M'}${xOf(h.hour).toFixed(1)} ${yOf(h[key]).toFixed(2)}`).join(' ');
    const dateText = new Intl.DateTimeFormat(hass.locale?.language || 'en', { day: 'numeric', month: 'long' }).format(day.date);
    const xTicks = [0, 6, 12, 18, 23].map((h) => `<span style="left: ${pct((h / 23) * 100)}; transform: translateX(${h === 0 ? '0' : (h === 23 ? '-100%' : '-50%')})">${String(h).padStart(2, '0')}h</span>`).join('');
    const stat = (label, value, note) => `
      <div class="kpi" style="--kpi: var(--bc-teal)">
        <span class="kpi-label">${escapeHtml(label)}</span>
        <span class="kpi-value">${escapeHtml(value)}</span>
        <span class="kpi-note">${escapeHtml(note)}</span>
      </div>`;
    return `
      <div class="block">
        ${head(t('hot_sub', { room: room.name, date: dateText }))}
        ${timeChart({
          height: 200,
          ticks: niceTicks(yMin, yMax, 5).map((v) => ({ value: v, label: formatTemperature(hass, v, unit, 0) })),
          yOf,
          paths: svgPath(path('out'), 'var(--primary-text-color)') + svgPath(path('in'), 'var(--bc-teal)'),
          label: t('hot_day'),
        })}
        <div class="axis-x" aria-hidden="true">${xTicks}</div>
        <div class="stats">
          ${stat(t('damping'), `×${formatNumber(hass, ratio, 2)}`, t('damping_note', { n: formatNumber(hass, 1 / Math.max(ratio, 0.01), 0) }))}
          ${stat(t('lag'), `${lag} h`, t('lag_note', { n: lag }))}
        </div>
      </div>`;
  }

  // Hours too hot last summer, air conditioning off.
  _overheating() {
    const hass = this._hass;
    const config = this._config;
    const t = (key, vars) => this.t(`insulation.${key}`, vars);
    const outdoorRows = this._summerRows(config.summer_outdoor_entity || config.outdoor_entity).filter((r) => r.mean !== null);
    const dateFormat = new Intl.DateTimeFormat(hass.locale?.language || 'en', { day: 'numeric', month: 'long', year: 'numeric' });
    // Running mean of the daily outdoor means (EN 16798-1, alpha 0.8).
    const dayMeans = new Map();
    for (const row of outdoorRows) {
      const d = new Date(row.start);
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      if (!dayMeans.has(key)) dayMeans.set(key, []);
      dayMeans.get(key).push(row.mean);
    }
    const running = new Map();
    let rm = null;
    let previousMean = null;
    for (const [key, list] of [...dayMeans.entries()].sort((a, b) => a[0] - b[0])) {
      const mean = list.reduce((a, b) => a + b, 0) / list.length;
      rm = rm === null ? mean : 0.2 * previousMean + 0.8 * rm;
      running.set(key, rm);
      previousMean = mean;
    }
    const rows = this._rooms().map((room) => {
      const inside = this._summerRows(room.summer_temperature || room.temperature);
      const cooling = new Map(this._summerRows(room.cooling_energy).map((r) => [r.start, r.change]));
      const living = room.kind === 'living';
      let hours = 0;
      let first = null;
      for (const row of inside) {
        if (row.mean === null || (cooling.get(row.start) ?? 0) > 0.01) continue;
        const d = new Date(row.start);
        const hour = d.getHours();
        if (living) {
          // The adaptive limit needs the outdoor running mean of that day.
          const rmDay = running.get(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());
          if (rmDay === undefined) continue;
          first = first ?? row.start;
          if (hour >= 9 && hour < 22 && row.mean > 0.33 * rmDay + 21.8) hours += 1;
        } else {
          first = first ?? row.start;
          if ((hour >= 22 || hour < 7) && row.mean > 26) hours += 1;
        }
      }
      if (first === null) {
        return `<tr><th scope="row">${escapeHtml(room.name)}</th><td colspan="4" style="color: var(--secondary-text-color)">${escapeHtml(t('no_summer'))}</td></tr>`;
      }
      const limit = living ? 60 : 32;
      const pass = hours <= limit;
      const since = t('since', { date: dateFormat.format(new Date(first)) });
      return `
        <tr>
          <th scope="row">${escapeHtml(room.name)}</th>
          <td style="color: var(--secondary-text-color)">${escapeHtml(t(living ? 'measure_living' : 'measure_bedroom'))}<br><small>${escapeHtml(since)}</small></td>
          <td class="num">${hours} h</td>
          <td style="color: var(--secondary-text-color)">${escapeHtml(t(living ? 'ref_living' : 'ref_bedroom'))}</td>
          <td><span class="verdict ${pass ? 'ok' : 'fail'}"><ha-icon icon="${pass ? 'mdi:check' : 'mdi:alert'}"></ha-icon>${escapeHtml(t(pass ? 'pass' : 'fail'))}</span></td>
        </tr>`;
    }).join('');
    return `
      <div class="block">
        <div><h4 class="block-title">${escapeHtml(t('overheating'))}</h4><p class="panel-sub">${escapeHtml(t('overheating_sub'))}</p></div>
        <div class="table-wrap"><table class="data">
          <thead><tr><th scope="col">${escapeHtml(t('col_room'))}</th><th scope="col">${escapeHtml(t('col_measure'))}</th>
            <th scope="col" style="text-align: right">${escapeHtml(t('col_value'))}</th><th scope="col">${escapeHtml(t('col_ref'))}</th>
            <th scope="col">${escapeHtml(t('col_verdict'))}</th></tr></thead>
          <tbody>${rows}</tbody></table></div>
      </div>`;
  }

  _methods() {
    const t = (key) => this.t(`insulation.${key}`);
    const rows = ['signature', 'tau', 'damping', 'overheating'].map((key) => `
      <tr>
        <th scope="row">${escapeHtml(t(`m_${key}_name`))}</th>
        <td style="color: var(--secondary-text-color)">${escapeHtml(t(`m_${key}_what`))}</td>
        <td style="color: var(--secondary-text-color)">${escapeHtml(t(`m_${key}_source`))}</td>
        <td style="color: var(--secondary-text-color)">${escapeHtml(t(`m_${key}_limits`))}</td>
      </tr>`).join('');
    return `
      <div class="block accent-pink">
        <h3 class="season-title"><ha-icon icon="mdi:book-open-variant"></ha-icon>${escapeHtml(t('methods'))}</h3>
        <div class="table-wrap"><table class="data" style="min-width: 760px">
          <thead><tr><th scope="col">${escapeHtml(t('col_indicator'))}</th><th scope="col">${escapeHtml(t('col_how'))}</th>
            <th scope="col">${escapeHtml(t('col_source'))}</th><th scope="col">${escapeHtml(t('col_limits'))}</th></tr></thead>
          <tbody>${rows}</tbody></table></div>
        <p class="intro">${escapeHtml(t('methods_note'))}</p>
      </div>`;
  }
}

/* ------------------------------------------------------------------------ */
/* 4h. Camera card                                                          */
/* ------------------------------------------------------------------------ */

const CAMERA_STYLES = `
  .cam {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    border: 2px solid var(--divider-color);
    box-sizing: border-box;
  }
  .cam img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .cam-offline {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: var(--secondary-text-color);
    --mdc-icon-size: 32px;
  }
  .cam-label, .cam-rec {
    position: absolute;
    top: 10px;
    padding: 2px 10px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: color-mix(in srgb, var(--primary-background-color) 85%, transparent);
  }
  .cam-label { left: 10px; color: var(--primary-text-color); }
  .cam-rec {
    right: 10px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--accent);
  }
  .rec-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
  }
  ha-card.hud .cam-label, ha-card.hud .cam-rec { font-family: var(--ha-font-family-heading, inherit); }
`;

function entityRowsHtml(card, items, accent) {
  const hass = card._hass;
  return items.map((item) => {
    const stateObj = hass.states[item.entity];
    const domain = item.entity.split('.')[0];
    const name = item.name || stateObj?.attributes?.friendly_name || item.entity;
    const icon = item.icon || stateObj?.attributes?.icon || DOMAIN_ICONS[domain] || 'mdi:circle-outline';
    if (!stateObj) return ui.toggleRow({ entityId: item.entity, icon, name, state: card.t('entities.missing'), accent });
    const usable = isUsable(stateObj);
    const canToggle = usable && TOGGLE_DOMAINS.includes(domain);
    const on = stateObj.state === 'on';
    return ui.toggleRow({
      entityId: item.entity,
      icon,
      name,
      state: item.secondary || (canToggle ? formatState(hass, stateObj) : ''),
      value: canToggle ? '' : (usable ? formatState(hass, stateObj) : card.t('entities.unavailable')),
      accent,
      active: canToggle ? on : !IDLE_STATES.includes(stateObj.state),
      toggle: canToggle ? { on, label: card.t('entities.toggle', { name }) } : null,
    });
  });
}

class BastideCameraCard extends BastideCard {
  static get styles() {
    return CAMERA_STYLES;
  }

  static getConfigForm() {
    return {
      schema: [
        { name: 'entity', selector: { entity: { filter: { domain: 'camera' } } } },
        { name: 'title', selector: { text: {} } },
        { name: 'name', selector: { text: {} } },
        { name: 'entities', selector: { entity: { multiple: true } } },
      ],
      computeLabel: (schema) => (schema.name ? lookup(null, `editor.camera.${schema.name}`) : undefined),
    };
  }

  static getStubConfig(hass) {
    const camera = Object.keys(hass?.states || {}).find((id) => id.startsWith('camera.'));
    return camera ? { entity: camera } : {};
  }

  getCardSize() {
    return 6;
  }

  edgeAccent() {
    return accentName(this._config?.color, 'pink');
  }

  watchedEntities() {
    return [this._config.entity, ...entityItems(this._config.entities).map((i) => i.entity)].filter(Boolean);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._timer) {
      const seconds = toNumber(this._config?.refresh) || 10;
      this._timer = setInterval(() => {
        const img = this.shadowRoot.querySelector('.cam img');
        if (img && this._src) img.src = `${this._src}&t=${Date.now()}`;
      }, seconds * 1000);
    }
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    this._timer = null;
  }

  renderContent() {
    const config = this._config;
    const hass = this._hass;
    const accent = accentName(config.color, 'pink');
    const header = ui.header({ icon: 'mdi:cctv', title: config.title || '', accent });
    const stateObj = config.entity ? hass.states[config.entity] : undefined;
    this._src = isUsable(stateObj) ? stateObj.attributes?.entity_picture : null;
    const label = config.name || stateObj?.attributes?.friendly_name || '';
    const frame = `
      <button type="button" class="cam accent-${accent}" ${config.entity ? `data-entity="${escapeHtml(config.entity)}"` : ''}>
        ${this._src
          ? `<img src="${escapeHtml(`${this._src}&t=${Date.now()}`)}" alt="${escapeHtml(label)}">`
          : `<span class="cam-offline"><ha-icon icon="mdi:cctv-off"></ha-icon>${escapeHtml(this.t('camera.offline'))}</span>`}
        ${label ? `<span class="cam-label">${escapeHtml(label)}</span>` : ''}
        ${this._src ? `<span class="cam-rec"><span class="rec-dot fx-blink"></span>${escapeHtml(this.t('camera.live'))}</span>` : ''}
      </button>`;
    const items = entityItems(config.entities);
    return header + frame + (items.length ? ui.list(entityRowsHtml(this, items, accent)) : '');
  }
}

/* ------------------------------------------------------------------------ */
/* 4i. Navigation card                                                      */
/* ------------------------------------------------------------------------ */

const NAV_STYLES = `
  ha-card.plain {
    background: none;
    border: 0;
    box-shadow: none;
    clip-path: none;
  }
  ha-card.plain .content { padding: 0; }
  .nav {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    border-bottom: 1px solid var(--divider-color);
  }
  .nav-item {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 16px;
    border-bottom: 3px solid transparent;
    margin-bottom: -1px;
    font-size: 14px;
    font-weight: 600;
    color: var(--secondary-text-color);
    transition: color 0.2s ease, border-color 0.2s ease;
    --mdc-icon-size: 20px;
  }
  .nav-item ha-icon { color: var(--accent); }
  .nav-item.active, .nav-item:hover {
    color: var(--primary-text-color);
    border-bottom-color: var(--accent);
  }
  ha-card.hud .nav-item {
    font-family: var(--ha-font-family-heading, inherit);
    font-size: 18px;
    font-style: italic;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  /* On a phone, the bar can sit at the bottom of the screen. */
  @media (max-width: 600px) {
    ha-card.bottom {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-top: 2px solid var(--divider-color);
      padding-bottom: env(safe-area-inset-bottom);
    }
    ha-card.bottom .nav {
      display: grid;
      grid-template-columns: repeat(var(--items), minmax(0, 1fr));
      gap: 0;
      border-bottom: 0;
    }
    ha-card.bottom .nav-item {
      min-height: 60px;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      padding: 0 4px;
      font-size: 11px;
      border-bottom: 0;
      border-top: 3px solid transparent;
      margin: -2px 0 0;
    }
    ha-card.bottom .nav-item.active { border-top-color: var(--accent); }
    ha-card.hud.bottom .nav-item { font-size: 12px; }
  }
`;

class BastideNavCard extends BastideCard {
  static get styles() {
    return NAV_STYLES;
  }

  getCardSize() {
    return 1;
  }

  watchedEntities() {
    return [];
  }

  cardClasses() {
    return ['plain', this._config?.mobile === 'bottom' ? 'bottom' : ''];
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._onLocation) {
      this._onLocation = () => {
        this._renderKey = '';
        this._render();
      };
      window.addEventListener('location-changed', this._onLocation);
      window.addEventListener('popstate', this._onLocation);
    }
  }

  disconnectedCallback() {
    if (this._onLocation) {
      window.removeEventListener('location-changed', this._onLocation);
      window.removeEventListener('popstate', this._onLocation);
      this._onLocation = null;
    }
  }

  onLocal(action) {
    if (!action.startsWith('nav:')) return;
    const path = action.slice(4);
    if (path === window.location.pathname) return;
    window.history.pushState(null, '', path);
    window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
  }

  renderContent() {
    const items = Array.isArray(this._config.items) ? this._config.items : [];
    const here = window.location.pathname;
    const links = items.map((item) => {
      const active = item.path === here;
      return `<button type="button" class="nav-item accent-${accentName(item.color)}${active ? ' active' : ''}"
        ${active ? 'aria-current="page"' : ''} data-local="nav:${escapeHtml(item.path || '')}">
        <ha-icon icon="${escapeHtml(item.icon || 'mdi:circle-outline')}"></ha-icon><span>${escapeHtml(item.label || '')}</span></button>`;
    }).join('');
    return `<nav class="nav" style="--items: ${Math.max(1, items.length)}" aria-label="${escapeHtml(this.t('nav.aria'))}">${links}</nav>`;
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
  {
    type: 'bastide-heating-card',
    element: BastideHeatingCard,
    name: 'Bastide Heating check',
    description: 'Checks the heating automation: outdoor temperature against the thresholds, heat source, rooms against their targets, and a log.',
  },
  {
    type: 'bastide-insulation-card',
    element: BastideInsulationCard,
    name: 'Bastide Insulation',
    description: 'How the home reacts to cold and heat: energy signature, time constants, overheating, with the methods and sources.',
  },
  {
    type: 'bastide-camera-card',
    element: BastideCameraCard,
    name: 'Bastide Camera',
    description: 'A camera image refreshed every few seconds, with a list of related devices.',
  },
  {
    type: 'bastide-nav-card',
    element: BastideNavCard,
    name: 'Bastide Navigation',
    description: 'Tabs to move between dashboard views, at the bottom of the screen on phones.',
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
