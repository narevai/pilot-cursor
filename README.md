# pilot-cursor

Cursor skills for flying the simulator through two MCP servers: **flightsim-governor** (sim/world) and **flightsim-pilot** (cockpit).

## Skills

| Skill | Use |
| --- | --- |
| `fly-the-airplane` | Closed-loop control through the MCP servers |
| `takeoff-straight-ahead` | 737-800 runway roll and straight climb |
| `yssy-yscb` | Zibo 737-800X from Sydney YSSY to Canberra YSCB |

## Dev Container

This repo is meant to be opened in a Dev Container (Cursor / VS Code: **Reopen in Container**). The image is Node.js 24 with pnpm, oxlint, and oxfmt.

The sim MCP hosts live on Tailscale (`governor.broadbill-pickerel.ts.net`). The container maps that hostname to the current Tailscale IP. If MCP calls start failing, update `extraHosts` in `.devcontainer/devcontainer.json`.

## MCP servers

Configured in `.cursor/mcp.json`.

| Server | Role | Default URL |
| --- | --- | --- |
| `flightsim-governor` | Simulation lifecycle, scenarios, telemetry, truth | `http://governor.broadbill-pickerel.ts.net:8000/mcp/governor` |
| `flightsim-pilot` | Aircraft, instruments, checklists, cockpit actions | `http://governor.broadbill-pickerel.ts.net:8000/mcp/pilot` |
