---
title:       Home media server
description: Home media server in a 1U rackmount chassis. It has a tv tuner to stream tv to the clients. It runs Ubuntu Server 12.04.
date:        2013-06-17 01:46:27 EDT
lastmod:     2018-12-30 19:39:03 EST
permalink:   /posts/projects/media-server/
thumbnail:   media-server

categories:  [projects]
tags:        [linux, server, rackmount, "media-center"]

sitemap-priority: 0.9
sitemap-galleries: [projects-media-server-assembly, projects-media-server-psu, projects-media-server-pcie-riser]

---

<!--thumbnail-->

This is my media server which stores my media library plus other services (pxe boot server, a private apt repository). It has a TV tuner and i use TVHeadend to stream the live tv to my [HTPC][post-htpc]. It also manage the recordings. I did not build a custom case for this project, i bought it off the shelf ([iStarUSA D-118V2-ITX][link-rackmount-case] 1U rackmount case) but i made some modifications to it.

<!--more-->

## Hardware

It has a [Intel mini-itx DN2800MT][link-dn2800mt] motherboard with an embedded Atom N2800 (1.86 Ghz) and 4GB of ram. The TV tuner is a [WinTV HVR-2250][link-hvr2250] dual ATSC tuner.

{% include gallery name='projects-media-server-assembly' %}


### Power supply

The [DN2800MT][link-dn2800mt] does not have a conventional ATX power supply connector. There are two ways that you can power this board, one is the external power jack (laptop type) or the internal 2-pin molex header. It accept a wide 8v to 19v voltage range and use about 15 watts.

I used a 12V 35 watts ([TDK LS35-12][datasheet-psu]) switching power supply. Since the chassis i bought accept a standard mini atx power supply form factor, I made an aluminum bracket to mount the PSU.

{% include gallery name='projects-media-server-psu' %}

Here is the template for the PSU bracket :

{% include media name='media-server-psu-bracket' %}


### PCIe riser

The only thing that this case is missing IMHO is better support for the PCI card. It is only held in place by its I/O bracket. So, i made an ‘L’ shape bracket to mount the PCI riser card to. Because it is now fixed, the PCI card needs to move sideway when it is inserted or removed. The opening on the right side of the card slot was not large enough, so i had to cut it wider.

{% include gallery name='projects-media-server-pcie-riser' %}


## Media server software

It runs [Ubuntu Server 12.04][link-ubuntu-server] and [TVHeadend 3.5][link-tvheadend]




[post-htpc]: /posts/projects/htpc/

[datasheet-psu]: https://www.digikey.ca/product-search/en?vendor=0&keywords=tdk+ls35-12

[link-rackmount-case]: https://www.istarusa.com/istarusa/products.php?series=Rackmount%20Chassis&sub=D%20VALUE&model=D-118V2-ITX&factor=1,%201.3#.UmiSD9-faXk
[link-dn2800mt]: https://www.intel.com/content/www/us/en/motherboards/desktop-motherboards/desktop-board-dn2800mt.html
[link-hvr2250]: http://www.hauppauge.com/site/products/data_hvr2250.html
[link-tvheadend]: https://tvheadend.org/
[link-ubuntu-server]: https://www.ubuntu.com/server
