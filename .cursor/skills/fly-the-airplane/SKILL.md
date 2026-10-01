---
name: fly-the-airplane
description: Fly the simulator aircraft through the flightsim-pilot and flightsim-governor Cursor MCP servers. Use when starting, taxiing, taking off, flying, approaching, or landing.
---

# Fly the airplane

Work a closed loop. Do not skip the read after a control change.

Call the MCP servers in `.cursor/mcp.json`. `flightsim-pilot` is the cockpit. `flightsim-governor` is the simulation. Read each tool schema before calling it.

## 1. Establish the world

1. `flightsim-governor`: `get_status`, `get_simulation`, and `get_truth`.
2. `flightsim-pilot`: `get_aircraft`, then `list_systems` / `read_system`. For the manual, `list_documents` with category `aircraft` and kind `manual`, then `read_document` or `list_document_chapters` / `read_document_chapter`.
3. `list_checklist_categories`, `activate_checklist`, and `read_checklist` for the relevant section.

## 2. Before touching the airplane

1. `list_actions` for the system you are about to use.
2. Read the instruments that will tell you whether the action worked (`list_instruments` / `read_instrument`).
3. If a checklist item is open, `mark_checklist` only after the airplane state matches.

## 3. Fly

1. One action at a time with `perform_action`.
2. Recheck the primary flight instruments and the system you changed.
3. Use `recent_actions` / `recent_history` when the airplane does not match what you expected.
4. Keep scan: attitude, airspeed, altitude, heading, engine, then navigation.

## 4. If you are lost

- Charts and airport procedures are `flightsim-pilot` documents. `list_documents` with kind `chart` or `sop` and the airport ICAO, then `read_document`.
- Simulation state and telemetry are `flightsim-governor` (`get_telemetry_history`, `get_status`, `get_truth`).
- Do not restart the sim to fix a flying mistake unless the user asks or the session is clearly wedged.
