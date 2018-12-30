---
title:       Call treatment for Asterisk
description: How to setup call treatment for Asterisk using a database.
date:        2017-03-15 01:26:47 EDT
lastmod:     2018-12-10 21:58:15 EST
permalink:   /posts/asterisk/call-treatment/
thumbnail:   call-treatment

categories:  [asterisk]
tags:        [asterisk, telephony]

sitemap-priority: 0.9

---

The thing i like the most about Asterisk is how flexible the dialplan is, and specifically how much creative you can get for dealing with undesired callers.

I use a database to store the call treatment rules and run a lookup query for each incoming call. If a number or caller name matches a rule, it takes the appropriate action for that call.

<!--more-->



## The database table

{% highlight mysql %}
CREATE TABLE `call_treatment` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `description` varchar(80) NOT NULL,
    `extension` varchar(10) NOT NULL,
    `caller_name` varchar(80) NOT NULL,
    `caller_num` varchar(80) NOT NULL,
    `action` varchar(45) NOT NULL DEFAULT 'quiet',
    PRIMARY KEY (`id`),
    KEY `idx_call_treatment_extension` (`extension`),
    KEY `idx_call_treatment_caller_name` (`caller_name`),
    KEY `idx_call_treatment_caller_num` (`caller_num`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

{% endhighlight %}

The **caller_name** and **caller_num** columns are used as regex expression to match the caller phone number and name. You can define either of them or both.

Here are examples of rule syntax :
- **401[0-9]{7}** will match all numbers beginning with the area code 401.
- **4015551125** will match a single number.
- **401** will match any numbers containing 401. e.g. (555) 555-0401
- .* will match all numbers


The **action** column contains the action to take if the incoming call matche this rule. 

**Extension** is optional. It defines to which user extension this rules applies to.


## Query

Paste the following lines in func_odbc.conf :

{% highlight text %}
dsn=asterisk
readsql=SELECT action FROM call_treatment WHERE (extension='${SQL_ESC(${ARG1})}' or extension='') AND ('${SQL_ESC(${ARG2})}' RLIKE caller_name OR caller_name='') AND ('${SQL_ESC(${ARG3})}' RLIKE caller_num AND NOT caller_num='') ORDER BY extension DESC, caller_num DESC LIMIT 1
{% endhighlight %}

You can run the query from the dialplan by using :

{% highlight text %}
ODBC_CALL_TREATMENT(${extension}, ${CALLERID(name)}, ${CALLERID(num))
{% endhighlight %}


## Dialplan

This is an excerpt from my dialplan as an example. On an incoming call, the dialplan execute the lookup query. If the number doesn't match any rules, the call is processed as normal. Otherwise, it jumps to the label **treatment-** followed by the acion. e.g. treatment-busy. If the label does not exists, the call is then proccessed as usual.

{% highlight text %}
[context-incoming]

    exten => s, 1, NoOp()
        ;**** Check if a call treatment exists for the caller ****
        same => n, Set(action=${TOLOWER(${ODBC_CALL_TREATMENT(${EXTEN}, ${CALLERID(name)},${CALLERID(num)})})})

        ;**** Jump to label normal if none is found ****
        same => n, GotoIf(${ISNULL(${action})}?normal)

        ;**** Jump to the propriate call treatment action, or treatment-invalid if not found ****
        same => n, GotoIf(${DIALPLAN_EXISTS(context-incoming,treatment-${action})}?treatment-${action},1:treatment-invalid,1)

        ;**** Normal call processing ****
        same => n(normal), NoOp()
        same => n, Dial(....)
        same => n, Hangup()

    ;--------------------------------------------
    ; call treatment : busy
    ;--------------------------------------------
    exten => treatment-busy, 1, Verbose(0, Call treatment (busy) : ${CALLERID(num)})
        same => n, Answer()
        same => n, PlayTones(busy)
        same => n, Wait(3600)
        same => n, Hangup()
        same => n, Return()

    ;---------------------------------------------
    ; Call treatment : Quiet
    ;---------------------------------------------
    exten => treatment-quiet, 1, Verbose(0,Call treatment (quiet) : ${CALLERID(num)})
        same => n, Answer()
        same => n, PlayTones(ring)
        same => n, Wait(3600)
        same => n, Hangup()
        same => n, Return()

    ;---------------------------------------------
    ; Call treatment : Torture menu (english)
    ;---------------------------------------------
    exten => treatment-torture-en, 1, Verbose(0,Call treatment (torture-en) : ${CALLERID(num)})
        same => n, Answer(500)
        same => n, Wait(1)
        same => n, Set(CHANNEL(language)=en)
        same => n(torture-en-loop), NoOp()
            same => n, Playback(custom/torture-menu-part1)
            same => n, PlayTones(ring)
            same => n, Wait(2)
            same => n, Playback(custom/torture-menu-part2)
            same => n, Goto(torture-en-loop)

    ;---------------------------------------------
    ; Invalid call treatment
    ;---------------------------------------------
    exten => treatment-invalid, 1, Log(WARNING, Invalid call treatment for ${CALLERID(num)} : ${action})
        same => n, goto(s,normal)

{% endhighlight %}
