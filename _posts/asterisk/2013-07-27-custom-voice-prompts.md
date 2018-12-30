---
title:       Recording voice prompts with Audacity and SOX
description: How to record your own custom voice prompts with Audacity to use with Asterisk.
date:        2013-07-27 19:28:23 EDT
lastmod:     2018-12-10 21:58:15 EST
permalink:   /posts/asterisk/custom-voice-prompts/
thumbnail:   asterisk-voice-prompts

categories:  [asterisk]
tags:        [asterisk, tools, linux, telephony]

sitemap-priority: 0.9

---


Asterisk comes with an extensive set of voice prompts in many languages but there are situations where you may need to record your own voice prompts. It can be tricky to get it right. This article describes the method I use to achieve that. I use Audacity and SOX to record and convert the voice prompt files.

<!--more-->

I use Linux, so **I did not test this method with Audacity for Windows**. I don’t know if SOX if available on Windows. Also, i know that you can export in ULAW,ALAW and GSM format directly with Audacity, but I did not test that either. The reason I use SOX is so that I can use a script to convert the prompts to multiple formats at once instead of manually doing it for each one..

## Recording your own custom voice prompts

If you have, or know someone with a good voice, you can record your voice prompts yourself with a microphone of decent quality. Try to find a place where you can control background noise.

You may also purchase your voice prompts online. They usually charge you by the word and send you back the recording in WAV format.


* [June Wallack][link-june-wallack] (french, english)
* [Allison Smith][link-allison-smith] (english)

personally, I use an online text to speech (tts) synthesizer to produce the prompts i need. I just record the output from the sound card for each prompts and put them together in a master file. By the way, yes, i am aware that you can use a TTS with Asterisk. I tried a few but did not find one of sufficient quality in french. I prefer to use pre-recorded prompts instead.

You can use these online TTS :

* [ispeech.org][link-ispeech]
* [IBM watson - tts demo][link-watson]


### Recording with audacity

{% include media name='record-prompts-capture' %}

Make sure the audio track rate is 16000 Hz and also set the project rate to 16000 Hz. The track must also be 1 channel (mono) only.


## Batch exporting with Audacity

It is possible to export multiple parts of a file at once with Audacity. You can do that by creating labels. First, you need to select the part that you want to export and press **CTRL+B** or go to **"Tracks > Add label at selection"**. Then give a name to the label, Audacity will use this name to create the individual files. You can adjust the start and end position of the label later by using the "handles" on the label track.

{% include media name='audacity-labels' %}

I usually leave 60 milliseconds of silence before and after the prompts. It depends of where the prompts will be used. If it is at the end of a sentence, you can leave 100 ms after. For digits, you may need a shorter silence before and after to make it sound good when they are played back to back. For example, let’s say that i need three prompts : "The current temperature is", "minus" and "15". I will leave less silence after "minus" than the others. To test the silence delay, I copy and paste the three prompts together in another file and play it back. I adjust the delay until it sounds natural.

Click on **File => Export multiple...**

{% include media name='audacity-export' %}

Select **"Other uncompressed format"** in export format. Next, click on **Options**

{% include media name='audacity-export-settings' %}

Select **"Raw (header-less)"** and **"Signed 16-bit PCM"**. Click **OK** and then, **Export**

Audacity will export each segment defined by labels to a .raw file at the location you specified.



## Convert to formats used by Asterisk

I use sox to convert the files in other formats Asterisk uses (ulaw, alaw, gsm, etc…)

### SLN16

The raw file audacity produced is already a signed 16 bit format, just rename the file to .sln16

### U-LAW

{% highlight bash %}
sox -t raw -r 16k -e signed-integer -b 16 -c 1 input.raw -t raw -r 8k -e a-law -c 1 output.alaw
{% endhighlight %}

### A-LAW

{% highlight bash %}
sox -t raw -r 16k -e signed-integer -b 16 -c 1 input.raw -t raw -r 8k -e u-law -c 1 output.ulaw
{% endhighlight %}

### GSM

{% highlight bash %}
sox -t raw -r 16k -e signed-integer -b 16 -c 1 input.raw -t gsm -r 8k -c 1 output.gsm
{% endhighlight %}

### WAV (8k)

{% highlight bash %}
sox -t raw -r 16k -e signed-integer -b 16 -c 1 input.raw -t wav -r 8k -c 1 output.wav
{% endhighlight %}

### G-722

SOX does not support g722. So for this format, you will need a converter. I used a tool made by Kevin P. Fleming and Russell Bryant from Digium.

Here is the source code :

[g722_encoder.tar.gz][file-g722-encoder]

And this is the script i use to convert the files all at once :

{% highlight bash %}
#!/bin/sh

mkdir -p alaw
mkdir -p ulaw
mkdir -p gsm
mkdir -p wav
mkdir -p sln16
mkdir -p g722


for file in *.raw; do
    file_out=`basename "${file%.*}"`

    echo "converting $file_out..."

    cp $file sln16/$file_out.sln16
    sox -t raw -r 16k -e signed-integer -b 16 -c 1 $file -t raw -r 8k -e a-law -c 1 alaw/$file_out.alaw
    sox -t raw -r 16k -e signed-integer -b 16 -c 1 $file -t raw -r 8k -e u-law -c 1 ulaw/$file_out.ulaw
    sox -t raw -r 16k -e signed-integer -b 16 -c 1 $file -t gsm -r 8k -c 1 gsm/$file_out.gsm
    sox -t raw -r 16k -e signed-integer -b 16 -c 1 $file -t wav -r 8k -c 1 wav/$file_out.wav
    g722_encode $file g722/$file_out.g722
done

echo '---------------------------------------------------'
echo 'Done!'
{% endhighlight %}


[file-g722-encoder]: /files/g722_encoder.tar.gz
[link-june-wallack]: http://junewallack.com/store/new
[link-allison-smith]: https://www.digium.com/en/products/ivr/allison-smith
[link-ispeech]: https://www.ispeech.org/text.to.speech
[link-watson]: https://text-to-speech-demo.ng.bluemix.net/
