---
name: takeoff-straight-ahead
description: Take off the Boeing 737-800 in the simulator and climb straight ahead to a cleared altitude. Use when rolling, rotating, or climbing on runway heading with HDG SEL and LVL CHG, including yoke, pedal, thrust-lever, and rudder-trim checks before brake release.
---

# Takeoff straight ahead

Climb on the runway heading to the cleared altitude and level there. No turns and no other maneuvers.

Cockpit changes are `perform_action` on the `flightsim-pilot` MCP server. Read instruments with `read_instrument`. Simulation state and raw datarefs are `flightsim-governor` (`get_simulation`, `post_raw_read`). Read each tool schema before calling it.

The autopilot does not steer the nosewheel. Heading select with the autopilot off is guidance only. A roll that leaves the runway heading is already a failed takeoff; more thrust makes it a crash.

Check that the airplane is progressing straight. That check matters more than the flight computer. The FMC, the heading bug, and HDG SEL do not keep the nosewheel on the centerline. The pedals do.

## Before the parking brake is released

Read `pitch_control`, `roll_control`, `rudder`, and both thrust levers while the airplane is stopped. All of them must be zero. Set whatever is not zero back to zero and read it again. A yoke or a pedal left off center, or one lever left up from an earlier attempt, will yaw or roll the airplane as soon as it moves. Pitch trim is not one of these zeros; set that from the FMC takeoff trim below.

The cockpit `rudder` value is the pedals, not the rudder trim. It can read 0 while the trim is holding the nose. Before the brake is released, read `rudder_trim` and `aileron_trim` from `flightsim-governor` `get_simulation` (`configuration.aircraft`), or `post_raw_read` of `sim/cockpit2/controls/rudder_trim`. Both must be 0. On the Sydney 16R takeoff the airplane was lined up on heading 155 with the pedals at 0, both thrust levers at 0, and the engines matched, and `rudder_trim` was -1. That is full left. As soon as the airplane rolled, the nose left the runway heading and ended near 50 degrees with the pedals still reading 0. Pedal input does not cancel that trim. Do not release the brake until `rudder_trim` reads 0.

Prove the pedals work before the roll. Command a small `set_rudder`, read `rudder` back, then return it to 0 and read 0 again. `set_rudder` can time out and leave the previous value in place. On this airplane a write of `sim/cockpit2/controls/yoke_heading_ratio` moved the cockpit `rudder` when `set_rudder` did not: 0.3 on that dataref read back as rudder 0.3, and `set_rudder` to 0 timed out and left it there. A timeout that leaves the pedals at 0 is not proof of steering. A timeout that leaves them off center is a pedal still deflected. Check `rudder` and `yoke_heading_ratio`, return both to 0, and read 0 before the brake is released. Do not roll with the test deflection still in.

Read the manual before the roll. Use `flightsim-pilot` `list_documents` with category `aircraft` and kind `manual`, then `read_document` on `aircraft-boeing_737_800-manual`. Takeoff pitch, the 400-foot roll-mode and flap step, and autopilot engagement are in chapters `section.61d8ed4d315b2284.1` and `section.e086c6cc41412562.1`. Do not invent a procedure from yoke, rudder, and trim alone.

Confirm the airplane is stopped and the heading is steady. That heading is the runway heading. Set the heading bug to it with `set_selected_heading`. A bug a few degrees off will not be flown until the autopilot is engaged, but it must match the runway before the roll.

Set the altitude window to the cleared altitude. There is no direct altitude set. `altitude_up` and `altitude_dn` step 100 feet. Queue only those clicks, then read `selected_altitude`. Do not mix other autoflight actions into that queue.

Set the speed window with `set_airspeed`. The minimum is 100 knots, which is below a safe climb speed. For a light 737-800 (about 4,500 kg of fuel) with flaps 5, use about 160 knots until the flaps are up. Do not command 250 until the flaps are retracted. Flaps 5 is the 37.5 percent lever position; leave the takeoff flap setting that the taxi checklist already accepted.

Read `pitch_trim` and the pitch attitude while the airplane is still stopped. The cockpit trim instrument is pitch trim only. Rudder trim and aileron trim are on the governor simulation, not on that instrument. On the crashed takeoff the pitch trim sat near -0.39 for the whole roll, and at about 136 knots the nose was still about half a degree below the horizon. That is not a takeoff trim. Speed without a nose-up stabilizer is not a stable runway run, and hauling the yoke against it will not fix it.

Open the FMC takeoff reference page and use the trim value it shows. Set that with `set_pitch_trim`, then read `pitch_trim` back before you move. If performance init is blank and the takeoff page has no trim number, do not guess a ratio and do not release the brake. A value left over from the last flight is not a setting.

A verified `pitch_trim` of 0 is not a centered stabilizer. On the Zibo 737, `set_pitch_trim` to 0 made the cockpit ratio and `sim/cockpit2/controls/elevator_trim` read 0, while `laminar/B738/flight_model/stab_trim_units` stayed near 5.0 and stabilizer deflection stayed near -5.5 degrees. That airplane then rotated itself from about +1.5 degrees at 115 knots to about +34 degrees and 1,100 feet radio altitude before the next pitch sample. Resetting the ratio is not the takeoff trim, and it does not prove the surface moved.

Arm the flight director, read it on, then arm the autothrottle and read the annunciator. Only then press `hdg_sel_press` by itself and read the flight-mode annunciator. Roll must show HDG SEL and the heading-select light must be on. A heading-select press sent in the same queue as the flight director, the autothrottle, the lights, and the transponder can be accepted and still leave the light off and the roll mode blank. Press it again, alone, until HDG SEL is showing. Do not press LNAV: it follows a route and can turn. Do not press ALT HLD on the ground: it holds the altitude you have now, which is the field. Do not press VNAV or LVL CHG on the ground. Heading select above 400 feet is the roll mode; it is not the autopilot. On the ground, with the autothrottle armed, LVL CHG can command climb thrust before you are tracking the centerline. The manual selects VNAV only after the flaps and slats are retracted.

`list_documents` and the checklist both still apply to lights, transponder TA/RA, and the 40 percent N1 stabilization. 40 percent N1 is an engine indication, not a thrust-lever percent. A lever near 35 percent can already be about 60 percent N1. Read both N1 values.

## The roll

Release the parking brake only when the yoke, pedals, both thrust levers, and rudder trim read zero, the rudder has read back, and the heading bug, pitch trim, altitude window, HDG SEL, flight director, and autothrottle arm are verified.

Bring both levers up together only while the heading stays on the runway heading and the nose is not drifting down. After each thrust change, read heading first, then the rudder, both N1 values, pitch, and airspeed. From about 100 knots, also read radio altitude on that same pass. The engines must match. A higher left N1 yaws the nose left. If the heading moves off the runway heading, move the pedals immediately to stop the yaw and read `rudder` back. Do not leave the pedals at 0 while the nose walks off, and do not add thrust until the heading is back on the runway heading. As airspeed comes alive, pitch should move toward the rotation attitude. If the nose stays on or below the horizon through flying speed, the stabilizer is still wrong: idle both levers and stop. Do not add thrust and do not fight a mistrimmed stabilizer with pitch control.

On the light 737-800 that leveled at 5,000 feet, the lever-to-N1 map with both levers together was about 18 percent lever for 45 percent N1, 32 percent lever for 61 percent N1, and 70 percent lever for 87 percent N1. Heading stayed on 155 while the pedals and rudder trim were 0. The miss was the pitch scan. At 115 knots the nose was only about +1.5 degrees. The next sample, still during a thrust step, was 130 knots, +34 degrees of pitch, and 1,100 feet radio altitude. That is already past a 15-degree rotation and well above the 400-foot autopilot gate. If pitch is rising through 10 degrees, stop adding thrust, command one pitch attitude aimed at 15 degrees, and read `pitch` back before another pitch command. The manual's check is the pitch indication: reaching a yoke ratio is not reaching 15°. Do not find a 30-degree nose at four-digit radio altitude. The 400-foot item is the roll mode and the flap schedule, not the autopilot.

If the heading changes while `rudder` stays at 0 and both N1 values match, idle and stop while the heading is still near the runway heading, then read `rudder_trim` again. A full-left trim yaws the airplane with the pedals centered. Do not add thrust to steer out of it.

`left_toga_press` is not proof of takeoff thrust. In practice it has cleared `autothrottle_arm`, blanked the autothrottle flight-mode annunciator, left the levers where they were, and lit the autothrottle disconnect warning. After any TO/GA press, read the arm state, the annunciator, and both N1 values. If the arm dropped and the levers did not move, do not press TO/GA again and do not push the levers to the stop to compensate.

Abort the roll if any of these are true:

- Heading differs from the runway heading by more than about 5 degrees before rotation.
- Pitch stays on or below the horizon as airspeed reaches rotation.
- Rudder trim is not 0, a pedal input does not read back, or the rudder stays at 0 while the heading is changing.
- Pitch trim has not been read back against the FMC takeoff trim.
- The engines are split, or either N1 is not what you commanded.
- Airspeed, heading, or attitude readings fail.

Abort means both thrust levers to idle, then stop. Do not rotate, and do not add power to "fly out of" a heading change. A departure that went from runway heading through 20 degrees off at about 70 knots, then 80 degrees off at rotation speed, was already lost; takeoff N1 near 100 percent on that heading left the pavement and crashed.

## After a stable liftoff

Rotate toward 15 degrees of pitch only after the heading has stayed on the runway heading through the roll. The manual states that target in `section.61d8ed4d315b2284.1`: at VR, rotate toward 15° pitch, then verify actual pitch. On this light airplane, rotation is about 130 to 140 knots, not the 100-knot speed-window minimum. Fifteen degrees is the target, not a pull through it. One `set_pitch_control`, then read `pitch`. If it is still well below 15, make one smaller correction and read again. If it is already above about 20, ease that one command back and read again. Do not hold a climb attitude in the 30s.

The flight director and heading select do not fly the airplane. Command A or Command B is the autopilot, and the manual engages it only after the flaps and slats are retracted.

At a positive climb, gear up. Above 400 feet, with the heading still the runway heading and the wings level, select or verify the roll mode and retract flaps as scheduled. The manual says not to treat 400 feet as an acceleration height or a fixed flap-retraction speed. For this straight-ahead climb the roll mode is HDG SEL. Reselect it if TO/GA or another mode replaced it. Flaps 5 reads 37.5 percent on the lever; flaps 1 reads 12.5 percent. Keep the speed window at about 160 until the flaps are up. Do not command 250 until they are retracted.

After the flaps and slats are actually retracted, the manual says to set VNAV, then engage the autopilot as needed:

1. Press `vnav_press` and read the pitch mode. If performance init is blank, cruise altitude is empty, or the scratchpad says the nav data is out of date, VNAV will not level at the altitude window. Then press `lvl_chg_press` instead and confirm MCP SPD. On this airplane LVL CHG annunciates as MCP SPD, not the words LVL CHG.
2. Confirm HDG SEL is still the roll mode.
3. Engage the approved channel with `cmd_a_press` or `cmd_b_press` and confirm that command light and the flight-mode annunciator.

Do those steps one at a time. Do not put `set_pitch_control` in the same batch as `lvl_chg_press` or `cmd_a_press`. After the command light is on, stop moving the yoke and the pedals. A pitch command sent while CMD A is engaging fights the autopilot: on the 5,000-foot departure the nose was at +34 degrees, the yoke was zeroed in the same step as level change and CMD A, and pitch then hunted between about 17 and 20 degrees until altitude hold captured. The autopilot was already in heading select. The yoke was the interference.

Once Command A is on, it flies the modes already selected:

- Heading select holds the heading in the window. It does not steer the nosewheel, so on the ground it is guidance only.
- VNAV is the pitch mode the manual selects after the flaps are up. If that mode will not capture the altitude window, MCP SPD (level change) pitches to hold the speed in the window and climb to the altitude in the window.
- At the selected altitude the pitch mode becomes ALT HOLD and the airplane levels off. That is the capture. Do not press LVL CHG again once MCP SPD or ALT HOLD is showing, and do not press ALT HLD on the ground to try to create it.
- The autothrottle, armed before brake release, shows MCP SPD in the climb and sets thrust to hold the speed window.

The mode that held 5,000 feet on runway heading 155 was CMD A, HDG SEL, ALT HOLD, and autothrottle MCP SPD. Do not turn and do not change the heading bug.

The autothrottle arm can drop while those mode buttons are pressed, and the autothrottle annunciator goes blank. Re-arm it once, then read the annunciator. ARM and then MCP SPD means it is back. Do not press TO/GA to restore it.

If command mode will not engage, stay on the flight director with small pitch and roll inputs and keep the heading. Do not disconnect a mode that is already tracking the runway in order to hand-fly a correction.
