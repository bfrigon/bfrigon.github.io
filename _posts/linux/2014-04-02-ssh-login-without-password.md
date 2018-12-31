---
title:       SSH login without password?
description: How to connect via SSH by using a private/public keypair instead of a password
date:        2014-04-02 10:54:43 EDT
lastmod:     2018-12-30 19:39:03 EST
permalink:   /posts/linux/ssh-login-without-password/
thumbnail:   trinity-ssh

sitemap-priority: 0.9

categories:  [linux]
tags:        [linux, server]

---

If you need to manage multiple servers, having to re-enter your password each time you want to establish an SSH connection can become tedious. There is a better way. It is possible to initiate an SSH connection by using a public/private key pair instead. The main advantage is that you can use this key on multiple accounts and only need to remember the pass-phrase of your key.

<!--more-->

If ***ssh-agent*** is running, you will only need to unlock your private key once per session. The unencrypted key will be stored in RAM until you logout of your session.


## Generating the key

Open a terminal and type:

> ssh-keygen -t rsa

Keep the default location where to save the key (~/.ssh/id_rsa) and choose a pass-phrase.

> **user@local** > ***ssh-keygen -t rsa*** \\
> Generating public/private rsa key pair. \\
> Enter file in which to save the key (/home/user/.ssh/id_rsa): \\
> Enter passphrase (empty for no passphrase): \\
> Enter same passphrase again: \\
> Your identification has been saved in /home/user/.ssh/id_rsa. \\
> Your public key has been saved in /home/user/.ssh/id_rsa.pub. \\
> The key fingerprint is: \\
> 29:0f:37:fd:73:4c:85:a7:59:45:8e:75:62:bb:55:21 user@local

This will generate the public/private key pair in ***~/.ssh/***. Now, you need to upload your public key to the remote server by typing:

> ssh-copy-id user@www.example.com

This command will read the public key in ***~/.ssh/id_rsa.pub*** and append it to ***~/.ssh/authorized_keys*** on the remote server.


### Changing the pass-phrase

You can change the pass-phrase of an existing private key at anytime by issuing the following command:

> ssh-keygen -p

This will re-encrypt the private key with the new pass-phrase. The public key remains untouched, so you don't need to replace the key on your server. If you forget to include the ***-p*** argument, then a new public/private key pair will be generated instead and you will have to re-upload the public key to your servers.


### Private key without pass-phrases

It is possible to generate your private key without a pass-phrase, but doing so is not a good idea. True, you won't have to enter your password ever again, but without it, your private key is vulnerable. If someone manages to copy your private key, he can use it to login to your remote system.


## SSH agent with KDE

I had trouble making ssh-agent work with ksshaskpass, after much googling, i found the solution [here][1]

Adding the following line to my ***~/.bashrc*** solved the problem for me:

{%highlight bash%}
ssh() {
    if ! ssh-add -l &>/dev/null; then
        ssh-add </dev/null &>/dev/null
    fi
    command ssh "$@"
}
{%endhighlight%}


[1]: https://askubuntu.com/questions/82976/how-to-get-openssh-to-use-ksshaskpass-under-kde
