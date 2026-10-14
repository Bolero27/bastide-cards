# Bastide Cards

A collection of custom dashboard cards for [Home Assistant](https://www.home-assistant.io/), installable through [HACS](https://hacs.xyz/).

All cards share one look, so they sit together naturally on a dashboard. Every card follows your dashboard theme (light or dark) and the language of your Home Assistant profile.

| Card | Type | What it shows |
| --- | --- | --- |
| [Climate](#climate-card) | `custom:bastide-climate-card` | Which heat source is running and why in winter, the air conditioning in summer. |

## Installation

### HACS (recommended)

1. In HACS, open the menu (⋮) → **Custom repositories**.
2. Add `https://github.com/Bolero27/bastide-cards` with the type **Dashboard**.
3. Search for **Bastide Cards** in HACS and download it.
4. Reload your browser.

### Manual

1. Download `dist/bastide-cards.js` from the [latest release](https://github.com/Bolero27/bastide-cards/releases/latest).
2. Copy it to `/config/www/bastide-cards.js`.
3. In **Settings → Dashboards → ⋮ → Resources**, add `/local/bastide-cards.js` as a **JavaScript module**.
4. Reload your browser.

## Climate card

For homes with heat pumps, a boiler, or both. The card answers three questions at a glance:

- **What is running?** Heat pump, boiler, both, air conditioning, or nothing.
- **Why?** The outdoor temperature compared with your switch-over point: below it, the boiler takes over from the heat pumps. With two thresholds (for example boiler below 4 °C, heat pumps above 6 °C), the gauge shows the band in between, where the current source stays on.
- **How is each device doing?** Its mode, its target and the room temperature.

In summer, when the heat pumps are cooling, the switch-over gauge is hidden and the card shows the air conditioning instead.

Tap a device, the season or the presence line to open its details.

### Configuration

Everything can be set in the visual editor. In YAML:

```yaml
type: custom:bastide-climate-card
heat_pumps:
  - climate.living_room
  - climate.bedroom
boilers:
  - climate.boiler
outdoor_entity: sensor.outdoor_temperature
boiler_threshold_entity: input_number.boiler_threshold
heat_pump_threshold_entity: input_number.heat_pump_threshold
season_entity: input_select.season
presence_entity: input_select.presence
```

| Option | Default | Description |
| --- | --- | --- |
| `heat_pumps` | | Heat pumps: `climate`, `switch` or `input_boolean` entities. |
| `boilers` | | Boilers: same entity types. At least one heat pump or boiler is needed. |
| `outdoor_entity` | | Outdoor temperature sensor. Shows the gauge and the reason line. |
| `boiler_threshold_entity` | | Helper (`input_number`, `number` or `sensor`) holding the outdoor temperature below which the boiler takes over. |
| `heat_pump_threshold_entity` | | Helper holding the outdoor temperature above which the heat pumps take over again. Leave it out for a single threshold. |
| `switch_over` | `5` | Fixed switch-over temperature, used when no helper is set. |
| `season_entity` | | Shown as a chip next to the title (`input_select`, `select` or `sensor`). |
| `presence_entity` | | Shown at the bottom of the card. |
| `title` | `Heating & cooling` | Card title. The default title is translated. |
| `gauge_min` | `-10` | Lowest temperature on the gauge. |
| `gauge_max` | `25` | Highest temperature on the gauge. |

### How the card decides what is running

- A **climate** entity counts as heating when its mode is `heat`, or `heat_cool` / `auto` while not cooling. It counts as cooling when its mode is `cool` or `dry`, or `heat_cool` / `auto` while cooling. A heat pump that has reached its target still counts as the heat source in use: its line then reads *Standby*.
- A **switch** or **input_boolean** counts as heating when it is on.
- Heating always wins over cooling. When the heat pumps and the boiler both heat, the card says so.

### Colours

The heat pumps take the blue accent and the boilers the orange one. To change only this card, set these variables in your theme:

```yaml
bastide-heat-pump-color: "#0277bd"
bastide-boiler-color: "#ef6c00"
```

## Style

Every card is built from the same pieces: a header with a round icon and an optional chip, a headline with a coloured dot, a list of tappable rows, and a footer line. Text colours, dividers, the card background and the font come from your Home Assistant theme.

Two accent colours are shared by the whole pack. A theme can override them for all cards at once:

```yaml
bastide-blue: "#0277bd"
bastide-orange: "#ef6c00"
```

## Languages

| Language | Status |
| --- | --- |
| English | Supported |
| French | Supported |

Any other language falls back to English. Numbers follow the number format of your Home Assistant profile.

## License

[MIT](LICENSE)
