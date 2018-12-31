---
title:       Asterisk manager - Y.A.A.M
description: Y.A.A.M, A web interface for managing Asterisk
date:        2013-06-09 22:28:41 EDT
lastmod:     2018-12-30 19:39:03 EST
permalink:   /posts/asterisk/asterisk-manager/
github-repo: bfrigon/yaam

thumbnail:   yaam
categories:  [asterisk, programming]
tags:        [asterisk, telephony, coding]

sitemap-priority: 0.9
sitemap-galleries: [projects-pbx-asterisk-manager-screenshots]

---

Y.A.A.M is a web interface for managing an Asterisk server. The goal of this project is NOT to be an alternative to other GUI such as FreePBX. It is more like an assistant, for those who prefer to edit configuration files manually, but needs a web interface for quick access to server logs, call logs, etc.

<!--thumbnail-->

<!--more-->

By default, users are only allowed to view call logs, listen to voice message or edit phone book records for their extension only. It is possible to give permissions for certain users to access the data for all users as well. Each plugins has a list of permissions which can be turned on or off for specific users.

Available plugins:
 - Call log viewer
 - Call treatment
 - Voicemail (ODBC)
 - Phone book
 - Sys Admin (Log viewer, channel status, run CLI commands)
 - Originate call

> **Y.A.A.M Is not production environment ready yet**. It is still in an alpha stage. If you would like to contribute to the project, you can clone the [git repository][source-code] and submit a patch.

## Screenshoots

{% include gallery name='projects-pbx-asterisk-manager-screenshots' %}

## Source code

Get the source code [here on Github][source-code]

## Requirements
 - Web server (Apache, lighttpd)
 - PHP 5.0+
 - ODBC (mysql)
 - Asterisk 1.8+ (with AMI enabled)

## Installation

1. Download or clone the repository on [Github][source-code]

        git clone https://github.com/bfrigon/yaam.git

2. Copy the content of the folder 'root' to your server base directory. (e.g. '/var/www')

3. Create a folder named 'cache' in your server base directory and give write access to it.

4. Setup the database. Here is the mysql dump file used to create the necessary tables.

5. Copy the sample configuration file in ./setup/yaam.conf to /etc/yaam.conf and change the settings.

6. The default password for admin is 'yaam'.

[source-code]: https://github.com/bfrigon/yaam
[mysql-dump-file]: https://raw.githubusercontent.com/bfrigon/yaam/master/setup/db_init.sql
