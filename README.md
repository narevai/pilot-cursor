# pilot-cursor

Skills, MCP configuration and prompt for a Cursor agent flying the simulator through one MCP server: **flightsim-pilot** (irl-gym `/mcp`).

irl-gym starts a Cube sandbox for every run, clones this repo into it and runs the harness from the repo root. There is no service in this repo.

## Layout

```
harness.json    command (placeholders {model} {title} {prompt}) and required env
scripts/stream.mjs  runs `agent` with stream-json and prints thinking, tool calls and the answer as readable text
prompt.md       task prompt template
.cursor/mcp.json  MCP configuration (URL from IRL_GYM_MCP_URL)
AGENTS.md       standing instructions for the agent
.cursor/skills/<skill>/SKILL.md
```

One repo per agent. Run the harness with the repo root as the working directory. The dev container is for local use only.

## Routes

irl-gym fills the placeholders from the scenario: `{departure}`, `{destination}`, `{departure_name}`, `{destination_name}` and `{route_skill}`. The route skill is `<departure>-<destination>` in lower case (`yssy-yscb`). A new route is a new skill with that name plus a scenario in irl-gym.

## Skills

| Skill | Use |
| --- | --- |
| `fly-the-airplane` | Closed-loop control through the MCP server |
| `takeoff-straight-ahead` | 737-800 runway roll and straight climb |
| `ils-final-hands-off` | Keep an ILS/autoland stable after LOC and G/S capture |
| `landing` | Dual-autopilot ILS autoland: setup, checks, flare and rollout, go-around |
| `yssy-yscb` | Zibo 737-800X from Sydney YSSY to Canberra YSCB |

## Try it locally

```
IRL_GYM_MCP_URL=http://irl-gym.broadbill-pickerel.ts.net:8000/mcp \
CURSOR_API_KEY=... \
  node scripts/stream.mjs --model <model> "$(cat prompt.md)"
```

`agent --list-models` shows the models your account can use. `agent -p` alone prints only the final answer; `scripts/stream.mjs` uses `--output-format stream-json --stream-partial-output` so the terminal overlay shows progress live. The agent runs with `--force` (commands without confirmation), `--approve-mcps` (the MCP server without a prompt) and `--trust` (the workspace without a prompt), which headless runs need.

The pilot server does not expose the CDU/FMC, the radios or wheel brakes, and there is no simulation control: starting, restarting or pausing the simulation is up to irl-gym.
