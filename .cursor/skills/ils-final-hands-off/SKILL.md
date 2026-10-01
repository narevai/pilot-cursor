---
name: ils-final-hands-off
description: Keep a Zibo 737 ILS/autoland stable after LOC and G/S capture. Use when flying an ILS, APP mode, dual autopilot autoland, short final, or recovering from an unexpected climb on approach.
---

# ILS final — hands off the modes

After **VOR/LOC** and **G/S** are captured, the autopilot is flying the approach. Most button presses on final make it worse.

Learned the hard way on YSCB ILSY 35: the airplane was descending on the glideslope with dual AP armed for autoland; unnecessary `cmd_a` / `cmd_b` presses dropped a channel, broke G/S, and the aircraft climbed toward the missed-approach MCP altitude.

## What went wrong

1. **On G/S, MCP was raised to missed approach (5100).** That step is correct *only while G/S remains captured*.
2. **CMD B dropped; CMD A/B were pressed again to “fix” dual channel.** Those presses are toggles. They dropped the other AP, upset pitch modes (split FMA codes), and extinguished APP guidance.
3. **With G/S gone and MCP above the airplane, autopilot climbed** toward the missed-approach window. That looked like a mystery climb; it was mode reversion to the MCP altitude.
4. Salvage attempts (more CMD presses, late VS) produced a high/slow unstable approach near the threshold.

## Hard rules on final

Once **VOR/LOC** is active and **G/S** is armed or active:

| Do | Do not |
|---|---|
| Configure gear / flaps / speedbrake / CONT per checklist | Press `cmd_a_press` or `cmd_b_press` again |
| Set landing speed once; leave it | Toggle APP, VORLOC, LVL CHG, VNAV, or HDG SEL |
| Engage **CMD B once** early (before 1500 ft RA), confirm both CMD lights, then stop | “Re-engage” dual AP mid-final |
| After **stable G/S capture and established descent**, set MCP missed approach | Set missed MCP if G/S is not confirmed captured |
| Monitor only: IAS, VS, RA, ALT, DME, FMA, both CMD lights | Fix a broken G/S with VS scrapes close-in |

## Dual AP (autoland)

1. Capture LOC/G/S on **CMD A** alone first.
2. When established and still above ~1500 ft RA, press **CMD B once**.
3. Read `cmd_a_light` and `cmd_b_light`. Both must be on.
4. **Never press either CMD button again** unless the published go-around requires it.
5. If one CMD light goes out on final: **go around**. Do not toggle to restore dual channel below the glideslope.

## Unexpected climb on approach

If VS goes positive after you were descending on G/S:

1. Read `selected_altitude` and `flight_modes` / pitch FMA immediately.
2. If MCP is **above** you and G/S is no longer active, the AP is climbing to MCP — that is expected after G/S loss, not a trim mystery.
3. **Do not** try to force a late descent onto the path inside ~3–4 NM when high.
4. Fly the **published missed approach** (TO/GA, flaps/gear schedule, MCP missed altitude), then set up a clean second ILS.

## Allowed final actions only

- Checklist config: `gear_down`, flaps to schedule, `eng*_start_cont`, `set_speedbrake` ARM (`ratio: -0.5`)
- One speed set to target approach speed
- One MCP missed-approach set **after** G/S is clearly captured and VS is a steady descent
- One `cmd_b_press` for dual channel, then hands off
- Go-around: `left_toga_press` when unstable or G/S lost

## Verify after every allowed action

Read back before touching anything else:

- `flight_modes` (or raw FMA codes if text is ambiguous)
- `cmd_a_light` / `cmd_b_light`
- `vertical_speed` (must stay negative on G/S)
- `airspeed`
- `radio_altitude` / `cpt_nav_txt2` (DME)

If pitch FMA sides disagree, or APP/G/S indications disappear while still supposed to be on the slope — **go around**, do not experiment.
