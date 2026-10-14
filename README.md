# Bastide Cards

A collection of custom dashboard cards for [Home Assistant](https://www.home-assistant.io/), installable through [HACS](https://hacs.xyz/).

All cards share one look, so they sit together naturally on a dashboard. Every card follows your dashboard theme (light or dark) and the language of your Home Assistant profile.

| Card | Type | What it shows |
| --- | --- | --- |
| [Climate](#climate-card) | `custom:bastide-climate-card` | Which heat source is running and why in winter, the air conditioning in summer. |
| [Presence](#presence-card) | `custom:bastide-presence-card` | The current presence mode in large type, one-tap mode buttons, outdoor temperature and season. |
| [Entities](#entities-card) | `custom:bastide-entities-card` | A titled list of devices with on/off switches. |
| [Agenda](#agenda-card) | `custom:bastide-agenda-card` | The next events of one or more calendars. |
| [Camera](#camera-card) | `custom:bastide-camera-card` | A camera image refreshed every few seconds, with related devices below it. |
| [Navigation](#navigation-card) | `custom:bastide-nav-card` | Tabs between dashboard views, at the bottom of the screen on phones. |
| [Heating check](#heating-check-card) | `custom:bastide-heating-card` | Is the heating automation doing its job? Outdoor temperature against the thresholds, heat source, rooms against their targets, and a checked log. |
| [Insulation](#insulation-card) | `custom:bastide-insulation-card` | How the home reacts to cold and heat, with the methods and their sources. |

For a dark, game-HUD look across the whole dashboard, pair the cards with [Bastide Theme](https://github.com/Bolero27/bastide-theme).

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

Tap a device, the season, a threshold or the presence line to open its details, and change it there. Thresholds read from helpers show as chips under the gauge.

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
| `layout` | `rows` | `rows`: one line per device. `tiles`: one tile per heat pump with its room temperature and − / + buttons for the target, and a strip per boiler. |
| `central_mode_entity` | | A `select` holding the common mode of your thermostats, shown as a row of buttons. |
| `central_modes` | | Limit the buttons to these options of `central_mode_entity`. |

Heat pumps and boilers can also be given as `{ entity, name }` to choose the name shown on the card.

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

## Presence card

Shows the current presence mode of an `input_select` (or `select`) in large type, with one button per mode. Tap a button to switch mode. The outdoor temperature and the season sit on the right.

```yaml
type: custom:bastide-presence-card
entity: input_select.presence
outdoor_entity: sensor.outdoor_temperature
season_entity: input_select.season
modes:
  Home:
    icon: mdi:home-heart
    color: orange
```

| Option | Default | Description |
| --- | --- | --- |
| `entity` | | The `input_select` or `select` holding the presence modes. |
| `title` | `Home` | Small label above the current mode. The default is translated. |
| `outdoor_entity` | | Outdoor temperature sensor. |
| `season_entity` | | Shown as a chip (`input_select`, `select` or `sensor`). |
| `modes` | | Per mode: `icon` and `color` (one of the accent names below). Common mode names get an icon automatically. |

## Entities card

A titled list of devices. Lights, switches, input booleans, fans and automations get an on/off switch; other entities show their state. Tap a row to open its details.

```yaml
type: custom:bastide-entities-card
title: Office
icon: mdi:desk
color: yellow
entities:
  - switch.computer
  - light.desk_lamp
  - entity: media_player.tv
    name: TV
```

| Option | Default | Description |
| --- | --- | --- |
| `title` | | Card title. |
| `icon` | `mdi:view-list` | Icon next to the title. |
| `color` | `orange` | Accent colour, one of the accent names below. |
| `entities` | | Entity IDs, or objects with `entity`, and optionally `name`, `icon` and `secondary`. |

## Agenda card

The next events of one or more calendars, with their day, time and place.

```yaml
type: custom:bastide-agenda-card
entities:
  - calendar.family
days: 7
max_events: 5
color: violet
```

| Option | Default | Description |
| --- | --- | --- |
| `entities` | | Calendar entities. |
| `title` | `Calendar` | Card title. The default is translated. |
| `days` | `7` | How many days ahead to look. |
| `max_events` | `5` | How many events to show. |
| `color` | `violet` | Accent colour. |

## Camera card

A camera image, refreshed every 10 seconds (`refresh`), with an optional list of devices below it. Tap the image for the live stream.

```yaml
type: custom:bastide-camera-card
entity: camera.front_door
title: Security
name: Front door
color: pink
entities:
  - entity: input_boolean.security_mode
    name: Security mode
```

## Navigation card

Tabs to move between the views of a dashboard. With `mobile: bottom`, the tabs sit at the bottom of the screen on phones.

```yaml
type: custom:bastide-nav-card
mobile: bottom
items:
  - label: Home
    icon: mdi:home
    path: /my-dashboard/home
    color: orange
  - label: Heating
    icon: mdi:thermometer
    path: /my-dashboard/heating
    color: orange
```

## Heating check card

Checks that the heating automation behaves as intended, over 24 hours, 48 hours or 7 days:

- key figures: mean outdoor temperature, hours on the heat pump and on the boiler, switch-overs and how many need a look;
- the outdoor temperature against the switch-over thresholds, with the heat source and the presence mode underneath;
- one small chart per room: temperature, target and heating periods, with a verdict;
- a log of what happened, where each switch-over is checked against the outdoor temperature and the thresholds at that moment.

```yaml
type: custom:bastide-heating-card
outdoor_entity: sensor.outdoor_temperature
boiler_threshold_entity: input_number.boiler_threshold
heat_pump_threshold_entity: input_number.heat_pump_threshold
heat_pump_mode_entity: select.thermostats_mode
boiler_entity: climate.boiler
presence_entity: input_select.presence
rooms:
  - entity: climate.living_room
    name: Living room
```

The heat pumps count as running when `heat_pump_mode_entity` is in `heat_pump_heat_states` (default `Heat only`) and a room thermostat is heating. The card reads the Home Assistant history every 5 minutes.

## Insulation card

How the home reacts to cold and heat, from the long-term statistics Home Assistant already keeps:

- **winter**: energy signature (heat delivered per day against the mean outdoor temperature, with the losses in W/K and the balance temperature) and the time constant of each room (how fast it cools at night with the heating off);
- **summer**: damping and time lag on the hottest day with the air conditioning off, and overheating hours per room;
- the method, sources and limits of each indicator.

```yaml
type: custom:bastide-insulation-card
outdoor_entity: sensor.outdoor_temperature
heat_pump_scop: 4.1
boiler_hours_entity: sensor.boiler_burner_hours
boiler_power_kw: 12
rooms:
  - name: Living room
    kind: living
    temperature: sensor.living_room_temperature
    heating_energy: sensor.living_room_heat_pump_heating_energy
    cooling_energy: sensor.living_room_heat_pump_cooling_energy
```

| Option | Description |
| --- | --- |
| `rooms[].kind` | `living` (adaptive comfort limit, 9 am–10 pm) or `bedroom` (26 °C at night). |
| `rooms[].summer_temperature` | Another temperature sensor for the summer, if it has a longer history. |
| `heat_pump_scop` | Turns the heat pumps' electricity into heat. |
| `boiler_hours_entity`, `boiler_power_kw` | Burner hours per day and boiler power, to count boiler days. Without the power, boiler days are left out. |
| `summer_outdoor_entity` | Another outdoor sensor for the summer. Avoid a heat pump's outdoor unit sensor: it warms up while running. |

These indicators compare rooms and years and show where to look first; they are not a diagnosis. Each one shows how many days or nights it rests on.

## Style

Every card is built from the same pieces: a header with a round icon, a headline with a coloured dot, a list of tappable rows, a footer line, chips for values you can tap to change (a season, a threshold) and on/off switches. Text colours, dividers, the card background and the font come from your Home Assistant theme.

Eight accent colours are shared by the whole pack: `orange`, `blue`, `pink`, `violet`, `teal`, `yellow`, `green` and `steel`. A theme can override any of them for all cards at once:

```yaml
bastide-blue: "#0277bd"
bastide-orange: "#ef6c00"
```

### HUD look

When the theme sets `bastide-style: hud` (as [Bastide Theme](https://github.com/Bolero27/bastide-theme) does), every card switches to a game-HUD look: bevelled corners, titles as slanted coloured tabs, slanted buttons and chips, a segmented temperature gauge. The cards then load the theme's fonts (Barlow and Barlow Condensed) from Google Fonts; set `bastide-fonts: none` in the theme to skip that request.

The HUD look is animated: cards slide in, the active presence mode pulses, its name glitches when it changes, fans turn and flames flicker while heating, the current gauge cell blinks, a light sweeps across the cards, and buttons lift on hover. Set `bastide-fx: none` in the theme to turn the animations off. They also stop when the device asks for reduced motion.

## Languages

| Language | Status |
| --- | --- |
| English | Supported |
| French | Supported |

Any other language falls back to English. Numbers follow the number format of your Home Assistant profile.

## License

[MIT](LICENSE)
