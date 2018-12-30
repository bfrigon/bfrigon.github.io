---
title:          Dual function RESET button on an Arduino
description:
date:        2018-12-15 02:08:51 EST
lastmod:     2018-12-19 13:20:35 EST
permalink:   /posts/electronic/arduino-dual-function-reset
thumbnail:

categories:  [electronic]
tags:        [electronic,arduino]

sitemap-priority: 0.9

published: false

---


Most often on consumer products, the RESET button is also used to reset the device to it's factory defaults when you hold the button for a certain amount of time. To replicate this feature, you would need to detect if the RESET button is still pressed after rebooting and execute the appropriate code. But you can't do that because the microcontroller is going to stay in a reset state for as long as you hold the reset button.

There is an external RESET pin on Arduino's board that will reset the microcontroller when you pull it LOW. By inserting a capacitor between this pin and the external reset switch, it will send a short LOW pulse to the processor reset line when the button is pressed. Then, after that pulse, the microcontroller will start running again even though you are still holding the external reset switch. Now, what's left to do it to read the state of that switch with another pin.

As a bonus, this pin can also be used to generate a hardware reset from software. By configuring this pin as an output and setting it LOW, it will trigger the reset pulse as it would be the same as if you pressed the reset switch. 










