---
title:       Asterisk dialplan syntax highlighting for gedit
description: Asterisk dialplan syntax highlighting for gtksourceview (gedit)
date:        2013-06-09 22:28:41 EDT
lastmod:     2018-12-10 21:58:15 EST
permalink:   /posts/asterisk/asterisk-dialplan-highlight/
thumbnail:   dialplan-highlight

categories:  [asterisk]
tags:        [asterisk, tools, coding, telephony]

sitemap-priority: 0.9


---

I made a language definition file for Asterisk dialplan in gedit (gtksourceview 2.0). I find that it makes the dialplan much easier to read.
<!--more-->

## Language definition file

Paste the following in: **/usr/share/gtksourceview-2.0/language-specs/ast_dialplan.lang**


{% gist bfrigon/9129e3b66405e50ec8c9a8c3049bd47c gedit_syntax_dialplan.lang %}


## Other editors

These are language definitions for other editors (untested)

* [VIM (by Tilghman Lesher)][link-highlight-vim]
* [Nano (by jmcanfield, Johan Adler)][link-highlight-nano]
* [Kate (by Robert Schneider)][link-highlight-kate]




[link-highlight-vim]: https://www.voip-info.org/wiki/view/vim+syntax+highlighting
[link-highlight-nano]: https://www.voip-info.org/wiki/view/Nano+syntax+highlighting
[link-highlight-kate]: https://www.voip-info.org/wiki/view/Kate+Kwrite+Syntax+Highlighting
