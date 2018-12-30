---
title:       Linux alarm clock
description: Home made alarm clock running linux
date:        2013-10-07 14:31:30 EDT
lastmod:     2018-12-10 21:58:15 EST
permalink:   /posts/projects/alarm-clock/
thumbnail:   alarm-clock
github-repo: bfrigon/alarm-clock-hardware

categories:  [projects]
tags:        [linux, diy, electronic]

sitemap-priority: 0.9
sitemap-galleries: [alarm-clock-assembly, alarm-clock-model, alarm-clock-case, alarm-clock-keypad-overlay, alarm-clock-speaker-holder, alarm-clock-motherboard, alarm-clock-touch-keypad]


---

I've been working on this project for some time now. This is my alarm clock running Linux.

These are the feature I wanted:

- NTP time synchronization
- Touch keypad
- Transparent [seven-segment display][post-project-alarm-clock-display]
- Web interface to configure the clock, upload alarm sound, etc.
- Battery backup

<!--thumbnail-->

<!--more-->

## Why?

I have an old digital alarm clock which I had for almost 25 years. It does not have a battery to keep the time in case of a power failure so I plug it on the UPS near my computer. I noticed something weird, whenever the UPS in running on battery, the clock actually runs faster. It keeps it's time synchronized to the frequency of the power line (60 Hz). I think that when my UPS is running on battery, the DC/AC inverter is producing a higher frequency and it screw up the clock time base.

Anyway, this clock is ready for retirement, it was time for a new one. So, why not build my own then?

I based my design on a processor capable of running Linux because it is more flexible and already offers reliable tools for many of the features I want and also the one I have not thought of yet. I realize that running Linux on a simple alarm clock is a bit overkill, I'm sure there is a way to do all that with a microcontroller, but I don't have much experience in programming on MCU. Also, this project was an excuse to stick Linux into yet another device.

This is more than a clock, it's a platform for experimenting. There are all sorts of interesting things you could do with it. For example, turn on the lights in the room when the alarm goes off by sending a command to an Insteon hub. I also added an external USB as well as an internal expansion headers for add-ons.

## Design

{% include gallery name='alarm-clock-assembly' %}


### 3D models

{% include gallery name='alarm-clock-model' %}


### Display

It is a four digits [seven-segment display][post-project-alarm-clock-display] encapsulated in a clear casting epoxy block measuring 5" by 2 1/4" by 1". Each digit is one inch wide by 1.5 inches high and has 0.3-inch wide segments.

{% include media name='alarm-clock-display-details' align='left' %}
**More details about the display construction [here][post-project-alarm-clock-display].**


### Drawings

Here are the drawings for the version with the LED matrix display (model A) and the one with four digits seven-segment display (model B).

{% include media name='alarm-clock-drawings' %}
{% include media name='alarm-clock-drawings-model-b' %}

All mechanical drawings and schematics are available on [Github][link-github-drawings]


## Construction

### Case

My design is based around the [1553DBKBAT][link-enclosure] plastic enclosure from Hammond Mfg but it required a few modifications. The opening on the top for the [display][post-project-alarm-clock-display] connector, the holes for the volume control buttons on the end panel and the holes for the speaker on the bottom. For those cuts, I used the tried-and-true method which consists of printing a 1:1 template from the CAD software and gluing it onto the surface to drill or cut.

The sides of this enclosure are made from a softer plastic, almost like rubber. I was not too sure about cutting it myself, so I went to local shop ([umake.ca][link-umake]) who laser cut it for me. I built a supporting jig so that the side to cut on the enclosure would face upward. A sent them a DXF file with the coordinates relative to a fixed reference point on the jig.

{% include gallery name='alarm-clock-case' %}

### Top graphic overlay

I designed the overlay graphics in Inkscape and printed it on [Papilio waterproof inkjet vinyl paper][link-papilio-paper] (matte). Although, this paper is waterproof, I sprayed a thin layer of acrylic to seal it permanently. It is best to apply multiple thin coats while holding the can at 20cm from the surface. On the first attempt, I put too much at once and the colors washed off.
{% include gallery name='alarm-clock-keypad-overlay' %}

### Speaker holder

I made this part using the same epoxy mix I used for the segments diffuser for the [display][post-project-alarm-clock-display].

{% include gallery name='alarm-clock-speaker-holder' %}


## Hardware

### Processor

I was looking for something compact that could easily run Linux, so I opted for an [Aria G25 SOM][link-aria-g25] (System-On-Module). It is based on an ARM [AT91SAM9G25][link-datasheet-at91sam9g25] processor running at 400 MHz and have all the basic hardware (memory, ethernet PHY, power regulator) integrated. It is packaged in a 40mm by 40mm PCB (50mil pads pitch) that can be soldered directly to the motherboard.

This processor provides all the necessary I/O: Ethernet, 2 I2C buses, 2 SPI buses, 3 USB host ports, up to 60 GPIO lines and an SD card interface.

{% include gallery name='alarm-clock-motherboard' %}


### Touch keypad

For the keypad, I choose the [AT42QT1085][link-datasheet-at42qt1085] QTouch sensor IC from Atmel. It provides eight capacitive sensing inputs and 16 general purpose I/O. I use three of the GPIO for LEDs under the snooze, time set, and alarm set buttons. Those LEDs are reverse mount SMT (OSRAM P47F). Since the LEDs are mounted inside the sensing electrode area, using a standard SMT led would split the electrode and remove more area thus, making the electrode less sensitive. I also added, as suggested in the datasheet, a 10nF bypass caps to the cathodes of each LEDs to prevent false detections or stuck keys when the LED is switched off (Hi-Z state).

This chip communicates with the host using the SPI protocol with a maximum clock frequency of 750kHz. To make it works in Linux was not so easy. I enabled hardware SPI support and SPIDEV in the kernel config. The first byte of a transaction was received correctly, but all subsequent bytes failed intermittently. This is because the QT1085 requires at least 100 microseconds between each byte. The actual delay, even when setting the speed at 500 kHz (which is the minimum), was not enough. To the best of my knowledge, there is no way to specify an additional delay between each byte.

I was able to bypass this problem by sending only one byte per IOCTL call and setting the cs_change option to 0. This cause the chip select line to remain active after each transaction. That way, the delay between the calls was more than enough.

The touch keypad PCB is held in place with strips of [3M 467MP adhesive][link-467mp-adhesive] film.

{% include gallery name='alarm-clock-touch-keypad' %}


### Sound card

On the motherboard, there is an integrated USB sound card based on the [PCM2704C][link-datasheet-pcm2704c] codec IC and a [TPA2005D1][link-datasheet-tpa2005D1] amplifier to drive the tiny speaker in all its glorious, ground shaking 1.5 watts! I was not going for the best sound quality here, the speaker I choose is an [AS04008CO-2-R][link-speaker] which is 40mm long by 20mm wide and has a frequency response of 200 HZ to 20 kHz.

I was disappointed when I first tested it though. Outside the case, the sound was horrible but once it was installed inside the enclosure, it sounded much better.

{% include media name='alarm-clock-test-video' %}


### Battery backup

This part of the project is not completed yet. The circuit is going to be on a separate board which fits on the header near the ethernet connector. This header has 2 pins for voltage input, 2 pins for output, i2c bus and a pin for monitoring auxiliary voltage. For the moment, there are two jumpers that tie VIN and VOUT.


## Software

As of writing this article, the hardware portion of this project is almost done and I'm beginning to work on the software.

The clock is running the Linux kernel 3.18 and I used [Buildroot][link-github-buildroot] to make my custom distribution.

For the [bootloader][link-github-bootloader], I used the AT91bootstrap from [Sergio Tanzilli][link-github-tanzilli-bootloader] as a starting point and made my modifications. When the [display][post-project-alarm-clock-display] is powered up, the digits are at full brightness. The bootloader sets the brightness to the default level and puts "- - : - -" on the display while Linux is booting. Other devices are initialized later in the boot process or by the main application.

The clock application is written in Python. For now, it does not do much except showing time.

## Github repositories

These are the repositories on Github for this project :

- [Hardware design][link-github-hardware]
- [AT91bootstrap][link-github-bootloader]
- [Buildroot (Kernel + file system)][link-github-buildroot]
- [Clock application][link-github-clock-app]



[post-project-alarm-clock-display]: /posts/projects/alarm-clock/display/

[link-github-drawings]: https://github.com/bfrigon/alarm-clock-hardware/tree/master/drawings
[link-github-hardware]: https://github.com/bfrigon/alarm-clock-hardware
[link-github-bootloader]: https://github.com/bfrigon/alarm-clock-at91bootstrap
[link-github-buildroot]: https://github.com/bfrigon/alarm-clock-buildroot
[link-github-clock-app]: https://github.com/bfrigon/alarm-clock-app
[link-github-tanzilli-bootloader]: https://github.com/tanzilli/at91bootstrap
[link-papilio-paper]: http://www.papilio.com/inkjet%20waterproof%20adhesive%20film%20media.html
[link-aria-g25]: http://www.acmesystems.it/aria
[link-enclosure]: http://www.digikey.ca/product-search/en?vendor=0&keywords=1553DBKBAT
[link-umake]: http://www.umake.ca
[link-speaker]: http://www.puiaudio.com/pdf/AS04008CO-2-R.pdf
[link-datasheet-pcm2704c]: http://www.ti.com/lit/ds/symlink/pcm2704c.pdf
[link-datasheet-tpa2005D1]: http://www.ti.com/lit/ds/symlink/tpa2005d1.pdf
[link-467mp-adhesive]: http://solutions.3m.com/wps/portal/3M/en_US/Adhesives/Tapes/Products/~/3M-Adhesive-Transfer-Tape-467MP?N=5962555+3294274353&rt=rud
[link-datasheet-at42qt1085]: http://www.atmel.com/Images/Atmel-9625-AT42-QTouch-BSW-AT42QT1085_Datasheet.pdf
[link-datasheet-at91sam9g25]: http://www.atmel.com/images/atmel-11032-32-bit-arm926ej-s-microcontroller-sam9g25_datasheet.pdf


[file-drawings]: {% include media-path name='alarm-clock-drawings' %}
[file-drawings-model-b]: {% include media-path name='alarm-clock-drawings-model-b' %}
