---
title:       ASM delay subroutines for PIC16 mcu
description: Subroutines written in assembly for Microchip PIC16 microcontrollers.
date:        2014-02-14 00:02:50 EST
lastmod:     2018-12-10 21:58:15 EST
permalink:   /posts/programming/pic-delay-asm/

categories:  [programming]
tags:        [pic, assembly, electronic, coding]

thumbnail:   asm-delay

sitemap-priority: 0.9

---

These are the delay subroutines i use in my PIC projects. It was written for the PIC16 family but should be compatible with the 18F instruction set as well.

The simplest way to produce delay is to write a subroutine that waste instructions cycles for the desired amount of time. This method should not be used for application that require a high level of precision since the delay subroutine may be halted by interrupts. The delay is offset by the time it takes to execute the interrupt service routine. For short delays however, this should not be a problem.

<!--more-->


## How many cycles are required

Let’s say that the processor clock runs at 8 MHZ. It takes 4 clock pulses to execute one instruction cycle. At 8 MHZ, the processor is able to execute 2 millions instructions per seconds. It also means that each instructions takes 0.0000005 seconds (0.5 micro seconds) to execute. To produce a 50 milliseconds delay, you then need to execute 100,000 instruction cycles.

Here is the formula to find out the number of instructions required :

    i_time = 1 / (fosc / 4)
    0.0000005 = 1 / (8000000 / 4)

    n = time / i_time
    100000 = 0.05 / 0.0000005


## The delay subroutines

There are 4 delay subroutines :

| &nbsp;         |                                              |
|----------------|----------------------------------------------|
| delay10cty     | WREG x 10 cycles
| delay100cty    | WREG x 100 cycles
| delay1kcty     | WREG x 1000 cycles
| delay10kcty    | WREG x 10000 cycles

Each routines can be looped 'n' times specified by WREG. For instance, if you put D'50 in WREG before calling delay10cty, the routine will waste 500 cycles. The routines takes into account the time it takes to call the routine itself except for delay10kcty. The 3 cycles it takes to call the routine is negligible over 10000 cycles.

The maximum possible delay using these routines is 2,550,000 instruction cycles or 1.275 second @ 8 MHZ


## Usage example

50 milliseconds:
{% highlight nasm %}
    movlw D'100'
    call  delay1kcty
{% endhighlight %}


250 milliseconds:
{% highlight nasm %}
    movlw D'50'
    call  delay10kcty
{% endhighlight %}


## The code

{% gist bfrigon/3a052523fc82d71a9bbc9e7e0426b8ae delay.asm %}
