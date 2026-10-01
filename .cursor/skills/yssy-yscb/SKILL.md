---
name: yssy-yscb
description: Fly the Zibo 737-800X in the X-Plane 12 simulator from Sydney YSSY to Canberra YSCB with LNAV, VNAV, autothrottle, and autopilot. Use when departing Sydney for Canberra, setting up the FMC, or flying the arrival, ILS, autoland, or a published go-around.
---

# Sydney to Canberra

Act through the Cursor MCP servers `flightsim-pilot` (cockpit) and `flightsim-governor` (simulation). Read each tool schema before calling it. Cockpit commands go through `perform_action`. Charts and the aircraft manual are `list_documents` / `read_document` on `flightsim-pilot`.

Fly the Zibo 737-800X in X-Plane 12 from **Sydney YSSY to Canberra YSCB**, using LNAV, VNAV, autothrottle and autopilot wherever appropriate. This instruction applies only to the simulator.

**Before flight**

Inspect the aircraft, FMC, weather and available controls. Obtain the current Sydney departure and Canberra arrival charts matching the installed navigation database.

Verify that the FMC destination is **YSCB**, and replace the route, arrival and performance data as necessary. Do not reuse its fuel quantity, cruise altitude or takeoff speeds without recalculation.

Prepare and execute a complete route: departure runway, SID and transition, airways, STAR, arrival transition and approach. Airway names such as H65 belong in the airway field, not the waypoint field. Inspect the LEGS page and map for incorrect sequencing and discontinuities. Preserve intentional vector legs until an appropriate intercept is arranged.

Choose a Canberra ILS runway compatible with the weather, available procedures and aircraft autoland capability. Obtain its frequency, identifier, magnetic course, intercept altitude, minima and missed approach procedure. Do not invent these values.

Complete FMC performance initialization using actual weight, fuel and calculated performance. Set takeoff flaps, physical trim, V speeds and acceleration/thrust reduction settings. Verify adequate fuel for the entire flight and reserves.

**Control and monitoring rules**

Use the aircraft’s custom commands. Resolve command IDs by name at runtime; IDs may change after reloading.

After every mode selection, confirm the resulting **PFD flight mode annunciations**, aircraft response and selected targets. Button lights alone do not establish which guidance is active.

Continuously monitor airspeed, altitude, radio altitude, heading, active leg, vertical deviation, autopilot engagement and autothrottle state. Read telemetry; never write altitude, position or engagement-status datarefs to imitate flying.

**Departure and climb**

Set both flight directors ON and autothrottle ARM. Set MCP speed to the calculated V2, heading to the departure runway heading, and altitude to the cleared initial altitude. Without ATC, use an initial altitude consistent with the published departure restrictions and terrain. Do not automatically reuse the previous 5,000-foot setting.

Arm LNAV when the departure geometry permits, and arm VNAV. Confirm their armed indications. Use TO/GA for takeoff and control runway tracking and rotation manually.

At or above **400 feet radio altitude**, once stable, trimmed and following flight director guidance, engage **CMD A**. Verify CMD engagement and the expected lateral and vertical modes. Retract gear after positive climb and retract flaps according to the scheduled speeds. Verify climb thrust.

Manage MCP altitude throughout the climb to permit the cleared climb while retaining required restrictions. If the aircraft levels at the MCP altitude, selecting a higher altitude may require the appropriate VNAV resumption action. Confirm the resulting mode before continuing.

**Cruise and descent**

Maintain LNAV and VNAV. Check the active route, fuel remaining and arrival weather.

Before top of descent, confirm the arrival and approach, then select the permitted lower altitude on the MCP. VNAV descent cannot begin normally while the MCP remains at cruise altitude. Monitor path and speed; manage drag when necessary.

Do not repeatedly press ALT INTV: check the installed aircraft’s behavior and which restrictions it would remove. If VNAV is unavailable, deliberately use an appropriate vertical mode with a verified altitude target and speed, then recover VNAV when suitable.

Set local QNH at the applicable transition level.

**ILS final approach and autoland**

Tune and identify the selected ILS on both NAV radios and set both courses. Arrange an intercept consistent with the chart, approaching the glideslope from below.

Select APP when properly positioned. Verify LOC and G/S armed, then verify their actual capture. Configure gear, landing flaps and calculated approach speed in time for a stabilized final.

For autoland, engage the second autopilot before 1,500 feet radio altitude and verify the installed Zibo version’s dual-channel and flare-readiness indications. After glideslope capture and an established descent, set the published missed approach altitude on the MCP. Monitor the approach through touchdown; do not assume autoland is available merely because APP is selected.

Use reverse thrust and braking as appropriate after touchdown. Monitor directional control and take over when required; do not assume automatic taxiing.

**If using an RNAV approach instead**

Follow the aircraft’s supported procedure: LNAV/VNAV final guidance normally shows **LNAV and VNAV PTH**; supported IAN guidance instead uses APP with **FAC and G/P**. Identify which system this aircraft supports before attempting it. Set minima and manage the missed approach altitude according to that procedure. An RNAV vertical path does not establish autoland capability. Plan a manual landing unless the installed system explicitly supports otherwise.

**Failures and go-around**

If approach guidance fails, the approach becomes unstable, or required visual references are absent at applicable minima, execute the published go-around. Use TO/GA, verify thrust and flight director modes, and control the aircraft immediately if the autopilot disconnects. Follow the published missed approach lateral path, altitude and configuration schedule.

Never continue descending simply because a command was sent successfully. Establish confirmed guidance or take control.

Relevant custom commands:

- `laminar/B738/autopilot/lnav_press`
- `laminar/B738/autopilot/vnav_press`
- `laminar/B738/autopilot/cmd_a_press`
- `laminar/B738/autopilot/cmd_b_press`
- `laminar/B738/autopilot/app_press`
- `laminar/B738/autopilot/hdg_sel_press`
- `laminar/B738/autopilot/lvl_chg_press`
- `laminar/B738/autopilot/left_toga_press`

Issue each mode command once, observe its effect, and decide the next action from the resulting aircraft state.
