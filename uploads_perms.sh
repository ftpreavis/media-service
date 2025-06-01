#!/bin/sh

chown -R app:app /app/uploads

exec runuser -u app -- "$@"
