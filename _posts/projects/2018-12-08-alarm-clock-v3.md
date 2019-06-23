---
title:       Another alarm clock project
description: RGB seven segment display alarm clock with MP3 playback and WIFI
date:        2018-12-08 01:00:00 EST
lastmod:     2019-06-23 16:08:22 EDT
thumbnail:   alarm-clock-v3
permalink:   /posts/projects/alarm-clock-v3/
github-repo: bfrigon/alarm-clock-v3

categories:  [projects]
tags:        [diy, electronic]

sitemap-priority: 0.9
sitemap-galleries: [clkv3-enclosure, clkv3-decals, clkv3-display, clkv3-keypad, clkv3-motherboard, clkv3-psu, clkv3-final-assembly]

---

This is my third alarm clock design. It has an RGB 7-segments display made from WS2812 LEDs, a VS1053 chip to playback MP3's as alarm sound, WiFi connectivity. It is easily programmable as the main board design is based on an Arduino mega. It has an onboard USB->serial adapter and is compatible with the Arduino IDE and all the libraries.

The enclosure parts can be printed with your own 3D printer or by using an online 3D printing services. I included all the necessary STL files on the [GitHub repository][link-github-stl-files] for this project.

<!--more-->

### Features summary

- Arduino based design using the ATMEGA2560 MCU.
- WI-FI connectivity
- Plays MP3/WAV files from a SD card.
- Large RGB seven segment display
- 16x2 character LCD display
- RGB night lamp
- Touch keypad
- 24h battery backup

{% include media name='clkv3-final-assembly-front' %}

## Enclosure

The enclosure is made from two parts, the upper section which contains the display and speaker and the lower section which consist of the LCD display module and motherboard. I used Shapeways to print the enclosure parts using their black dyed versatile plastic. The unfinished parts have a porous texture and if you scratch it lightly, it becomes shiny and really visible. To smooth it out, i spray paint the part and sand it with 1000 grit sandpaper between each coat and repeat until I get a smooth finish.

More details about this process [here][post-smooth-shapeways-plastic].

{% include gallery name='clkv3-enclosure' %}


### Decals

There are many online sources where you can get your custom sheets relatively cheaply. Before applying the decals, it is best to spray at least two coats of varnish as it makes it easier to remove the decals without ruining the paint layer in case you make a mistake. 

To make sure the transfer shift don’t shift while transferring the decal, I put masking tape on one side of the transfer sheet. Ideally, you should use a burnishing tool to transfer the sheet, but using the tip of a pen works fine. The key to apply enough pressure to successfully transfer the decal but not too much.

The decals are still quite fragile at this point. A few coats of varnish is required to seal the decals.

{% include gallery name='clkv3-decals' %}


## Display

The seven segment display was made using [WS2812B][datasheet-WS1812B] which i latter changed for the [IN-PI554FCH][datasheet-IN-PI554FCH] (same pin out than the [WS2812B][datasheet-WS1812B], but has lower power consumption). There are 4 PCB, one for each digit, mounted in a 3D printed frame. At the front, there is a 3mm laser engraved mirror acrylic sheet with the segment pattern. I added a texture to help diffuse the light a bit. On the back of the display assembly, between the two speakers, there is also a 3-led RGB lamp that serves as a night lamp which can be toggled on or off by swiping left-to-right on the keypad.

{% include gallery name='clkv3-display' %}


## Touch keypad

The touch keypad is monitored by the [AT42QT1070][datasheet-AT42QT1070] IC. On the PCB, there are three key electrodes placed closely together. I don't use the adjacent key suppression feature but instead monitor which channel among the detected keys has the strongest signal value to determine which key was pressed. This allows me in software to detect swipe left and swipe right motions.

The keypad overlay is a 1.5mm thick Plexiglas sheet with laser engraved key legend which i filled with acrylic paint. I also sprayed the sheet with a few coats of clear varnish so that the finish matches with the rest of the enclosure.

{% include gallery name='clkv3-keypad' %}


## Audio sub system

MP3/WAV files a read from an SD card and decoded by the [VS1053B][datasheet-VS1053B] codec IC. The codec output is amplified with a TPA2016D2 stereo amplifier which can deliver 2.8 Watts per channel. 

{% include media name='clkv3-speakers' align='right' %}
As for the speakers, I choose the [AS04008PS-4W-R][datasheet-AS04008PS-4W-R] from PUI audio. It has a decent sound quality for it's size (40x28 mm). As expected with speakers in this category, the bass isn't very loud, but once installed in the enclosure, it improves a bit. It performs better with song that contains higher frequencies, like the ring tones you find on a cell phone. 

When the alarm goes off and if SD card was removed or for some reason, it cannot decode the file, the software will instead play a fallback sound file embedded in program memory.


## Motherboard

The motherboard design is based around the [Arduino Mega 2560][link-arduino2560]. It's 256k program memory was perfect for this application because of all the features I wanted to implement. The motherboard assembly consists of three parts: The motherboard itself which contains the [ATMEGA2560][datasheet-ATmega2560], [DS3231 RTC][datasheet-DS3231], [WINC1500 WI-FI module][datasheet-WINC1500] and onboard USB-serial adapter. The daughter board which has the [VS1053B][datasheet-VS1053B] codec and amplifier and finally, the front panel PCB with the LCD module board and the light sensor next to it.

There are no screw to hold the front panel PCB in place, instead the board is joined to the motherboard and daughter board using solder tabs.

The power supply is located on a separate board and connect to the motherboard with plug-in headers. I opted to have the PSU on a separate PCB because, at the time of designing the motherboard, I wasn't sure of the power requirements or whether to use a NiMh or lithium battery.

{% include gallery name='clkv3-motherboard' %}


## PSU/Battery backup

There is a [350mAh LIPO battery][link-adafruit-lipo-350] which is the largest capacity I was able find that fits into the enclosure. The biggest power hog in the system is the display. There are 34 segments in total : 4 x 7 segments, 2 dots, 2 alarm status, am/pm and a time set led. The [IN-PI554FCH][datasheet-IN-PI554FCH] RGB led consumes about 12mA per channel, so 3 x 34 x 12mA = 1224 mA. Under normal conditions, the maximum possible number of active segment is 29 (When the time is 20:08 in 24h mode). Still, this amounts to 1044mA, which is way more than the battery can handle. 

So, to limit power consumption when running on battery, i implemented three power state in software. The normal mode, in which the clock is powered from DC and the display is allowed to take as much current as it needs. When running on battery power, the clock will go to low power mode. The display is limited to one color (red) and at a maximum of 40% brightness ( max. 140 mA ), WI-FI is disabled and the user interface remain active. The clock will remain in this state for 15 seconds after there is no input from the user, after which, it will go to standby mode.

In this mode, all peripherals, including the display is shutdown and only the LCD remain active displaying the time. It will remain in this mode until the alarm goes off or the user presses a key. The [IN-PI554FCH][datasheet-IN-PI554FCH] led (same for [WS2812B][datasheet-WS1812B]) consume about 1 mA even when they are OFF so all 34 of them consume battery power needlessly. To mitigate this problem, a MOSFET was added to switch off the power going to the display.

In standby mode, the maximum power consumption is around 12 mA. Which is enough to provide a maximum runtime of 24 hours on a fully charged battery, given that it remains in standby mode the entire time. My goal was not to design something ultra low-power that could run for days on battery, just enough to last until the morning and wake you up in case the power goes out during the night.

The [BQ24075][datasheet-BQ24075] IC is responsible for charging/monitoring the LIPO battery. It can automatically switch from external DC power to battery power if the voltage falls below 4.35v or goes over 6.4v. It's output voltage varies between 3v and 5.5v in function of the battery charge and if external DC is present. For that reason, a step-up/step-down converter is needed after the [BQ24075][datasheet-BQ24075]. I chose the [TPS630701][datasheet-TPS630701]. It is capable of outputting 5V at up to 2A from a wide input range (2v to 16v), perfect for the job. 

{% include gallery name='clkv3-psu' %}


### PGOOD/SYSOFF signal

The [BQ24075][datasheet-BQ24075] has a PGOOD output pin which goes low when a DC input voltage within range is detected. The system monitors this pin and enters/exit low power mode accordingly. 

It also has a SYSOFF pin which is used to disconnect the battery when the pin is set HIGH. Since the default state of this pin is HIGH, the software has to pull SYSOFF low to remain ON if DC power is lost. When it's running on battery power, if the RESET button is pressed, the SYSOFF pin will return to its default state (HIGH) and disconnect the battery. This is the only way to power off the clock without manually disconnecting the battery. When DC power is present, the SYSOFF state is ignored, so pressing RESET will not power off the clock.


### USB serial sleep mode

The embedded USB serial adapter is handy because I can update the software without having to open the enclosure. However, it becomes an unwanted source of power drain when running on battery. I modified the USB-serial firmware so that it will monitor the USB voltage. When VUSB is not detected, the processor will enter power-down mode and wake up when VUSB is present again. This significantly reduces the power consumption when the serial adapter is not needed.


## Final assembly ##

{% include gallery name='clkv3-final-assembly' %}

## CAD, schematics and fab files.

### Mechanical drawings 

{% include media name='alarm-clock-v3-drawings' %}


### Schematics

Dwg ID.                           | Title
----------------------------------|----------------------------------
[CLKV3-SCH-01][doc-clkv3-sch-01]  | Display - RGB seven segment digit
[CLKV3-SCH-02][doc-clkv3-sch-02]  | Display - RGB dots
[CLKV3-SCH-03][doc-clkv3-sch-03]  | Touch keypad
[CLKV3-SCH-04][doc-clkv3-sch-04]  | Front panel
[CLKV3-SCH-05][doc-clkv3-sch-05]  | Motherboard
[CLKV3-SCH-06][doc-clkv3-sch-06]  | Daughterboard
[CLKV3-SCH-07][doc-clkv3-sch-07]  | PSU PCB
[CLKV3-SCH-08][doc-clkv3-sch-08]  | RGB Lamp
[CLKV3-SCH-09][doc-clkv3-sch-09]  | Alarm Swtich PCB


### Fab files

 - [STL files for the enclosure][link-github-stl-files]
 - [Laser cut templates][link-github-laser]
 - [Decals][link-github-decals]




[datasheet-WS1812B]: https://www.seeedstudio.com/document/pdf/WS2812B%20Datasheet.pdf
[datasheet-IN-PI554FCH]: http://www.inolux-corp.com/datasheet/SMDLED/Addressable%20LED/IN-PI554FCH.pdf
[datasheet-AS04008PS-4W-R]: http://www.puiaudio.com/pdf/AS04008PS-4W-R.pdf
[datasheet-BQ24075]: https://www.ti.com/lit/ds/slus810l/slus810l.pdf
[datasheet-TPS630701]: https://www.ti.com/lit/ds/symlink/tps63070.pdf
[datasheet-ATmega2560]: https://ww1.microchip.com/downloads/en/devicedoc/atmel-2549-8-bit-avr-microcontroller-atmega640-1280-1281-2560-2561_datasheet.pdf
[datasheet-WINC1500]: https://ww1.microchip.com/downloads/en/DeviceDoc/ATWINC15x0-MR210xB-IEEE-802.11-b-g-n-SmartConnect-IoT-Module-Data-Sheet-DS70005304C.pdf
[datasheet-DS3231]: https://datasheets.maximintegrated.com/en/ds/DS3231.pdf
[datasheet-VS1053B]: https://www.sparkfun.com/datasheets/Components/SMD/vs1053.pdf
[datasheet-TPA2016D2]: https://www.ti.com/lit/ds/symlink/tpa2016d2.pdf
[datasheet-AT42QT1070]: https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-9596-AT42-QTouch-BSW-AT42QT1070_Datasheet.pdf
[link-arduino2560]: https://store.arduino.cc/usa/arduino-mega-2560-rev3
[link-github-stl-files]: https://github.com/bfrigon/alarm-clock-v3/tree/master/fab-files/stl-files
[link-github-laser]: https://github.com/bfrigon/alarm-clock-v3/tree/master/fab-files/laser-cut
[link-github-decals]: https://github.com/bfrigon/alarm-clock-v3/tree/master/fab-files/decals
[link-adafruit-lipo-350]: https://www.adafruit.com/product/2750
[post-smooth-shapeways-plastic]: /posts/diy/shapeways-plastic-smoothing/

[doc-clkv3-sch-01]: https://github.com/bfrigon/alarm-clock-v3/raw/master/drawings/schematics/clkv3-sch-01_rgb-digits.pdf
[doc-clkv3-sch-02]: https://github.com/bfrigon/alarm-clock-v3/raw/master/drawings/schematics/clkv3-sch-02_rgb-dots.pdf
[doc-clkv3-sch-03]: https://github.com/bfrigon/alarm-clock-v3/raw/master/drawings/schematics/clkv3-sch-03_touch-keypad.pdf
[doc-clkv3-sch-04]: https://github.com/bfrigon/alarm-clock-v3/raw/master/drawings/schematics/clkv3-sch-04_front-panel.pdf
[doc-clkv3-sch-05]: https://github.com/bfrigon/alarm-clock-v3/raw/master/drawings/schematics/clkv3-sch-05_motherboard.pdf
[doc-clkv3-sch-06]: https://github.com/bfrigon/alarm-clock-v3/raw/master/drawings/schematics/clkv3-sch-06_daughterboard.pdf
[doc-clkv3-sch-07]: https://github.com/bfrigon/alarm-clock-v3/raw/master/drawings/schematics/clkv3-sch-07_psu.pdf
[doc-clkv3-sch-08]: https://github.com/bfrigon/alarm-clock-v3/raw/master/drawings/schematics/clkv3-sch-08_rgb-lamp.pdf
[doc-clkv3-sch-09]: https://github.com/bfrigon/alarm-clock-v3/raw/master/drawings/schematics/clkv3-sch-09_alarm-switch.pdf
