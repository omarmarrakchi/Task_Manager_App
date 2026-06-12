#!/bin/sh

# Injecter les URLs runtime dans un fichier JS charge par index.html
cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  TASK_SERVICE_URL: "${TASK_SERVICE_URL:-/task-api}",
  USER_SERVICE_URL: "${USER_SERVICE_URL:-/user-api}"
};
EOF

# Lancer Nginx
exec nginx -g "daemon off;"
