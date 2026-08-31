


`npm i docsify-cli -g`
https://docsify.js.org/#/quickstart?id=initialize

`docsify serve ./docs`

 a

## Python way (no npm)

Docsify is 100% client-side (fetches markdown via AJAX, hash-based routing by
default), so any static file server works -- no Docsify-specific tooling
needed.

`python3 -m http.server 3000 --directory docs`

Then open http://localhost:3000

Notes:
- `--directory` requires Python 3.7+; on older Python, `cd docs && python3 -m http.server 3000` instead.
- No live-reload (unlike `docsify serve`) -- refresh the browser after edits.

https://okmi-mizu.github.io/mental-drawer/

## Git commands

I want to get files from the remote repository and merge them into my local repository.
`git-main-pull`


`git-main-push`



