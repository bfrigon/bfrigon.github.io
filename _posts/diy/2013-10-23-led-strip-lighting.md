---
title:       LED strip lighting for my a/v rack cabinet
description:
date:        2013-10-23 15:41:29 EDT
lastmod:     2018-12-10 21:58:15 EST
permalink:   /posts/diy/led-strip-lighting/
thumbnail:   led-strip-lighting

categories:  [diy]
tags:        [rackmount, diy]

sitemap-priority: 0.9
sitemap-galleries: [rack-led-lighting]

---

I installed a LED strip in my [a/v rack][post-rack-cabinet] to make it easier to see when I’m working on it. My plan was to buy white LEDs but it turned out to be cheaper to get RGB strips of the length I needed where I bought them. The kit comes with a controller and a remote control which allows you to set the intensity and change colors.

<!--more-->


## LED strips

I must say the white is not 100% pure, it has a blueish hue (much less than it appears in the pictures thought) but it doesn’t bother me much. Anyway, it’s still better than my previous lighting "solution":

{% include media name='led-lighting-before' align='left' %}
{% include media name='led-lighting-after' align='left' %}


## Installation

{% include media name='led-strip-closeup' align='left' %}
These strip can be cut to the length you need. Every third LEDs, there is a quarter-inch of exposed traces where you can cut the strip without damaging it. Once it is cut, you are left with 4 tabs (12v, red, blue and green) on each ends which you can use to solder wires directly to the other strip or a connector to the controller. Usually, the spool already have a connector soldered to one end. It is important to make sure the wires goes to the controller and other parts of the strip in the correct order, otherwise it won’t work or the wrong colors are going to be produced.

{% include media name='led-strip-installed' align='right' %}
These strips have a 3M self-adhesive backing so they are easy to install. However, i found out that the adhesive is not very strong. I did not have any problems for vertical runs but when i tried to install them upside down, they came off after a while. The weight of the wire was too much for the adhesive. To correct this problem, i fixed the strip in place with 2 inch wide clear tape and used wire clips to hold the wires.

{% include media name='led-strip-controller' align='left' %}
The controller I bought have an IR receiver and comes with a remote control. You can set the intensity and choose preset colors and effects (strobe, fade). When you turn the controller off, it will remember its previous setting, so you could use a PSU with an on-off switch and use the remote control only to switch colors.


## Results

I bought these mainly to light up the back of my [a/v rack][post-rack-cabinet] while i work on it but the way the light shines through the vents on the front is quite nice too.

{% include gallery name='rack-led-lighting' %}


[post-rack-cabinet]: /posts/diy/rack-cabinet/
