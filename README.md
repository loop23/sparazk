SparaZK
=======

This is a reissue of the old SparaConcetti, made for some friends at ZK squat.

The old one used to run on window, this one runs in a modern browser; It is a server side node.js app (running Express) that talks to a mongo backend to save sessions.

Usage is displayed on page load, a live instance is at http://sparazk.herokuapp.com; The code is configured to read a .env with a MONGOSOUP_URL (and a PORT for local running). It runs happily on heroku once you have your own MONGOSOUP_URL.

When you load the homepage, it redirects to a random unguessable room; When you load files into it, it uploads them to the server. You can then share the url and the next person who loads it will see what you see. This is useful for love letters and such.

The software is licenced under the terms of the "GPL-2.0+"

Author
------
loop, loop23@gmail.com / https://github.com/loop23
