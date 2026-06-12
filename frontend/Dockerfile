# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

ARG REACT_APP_TASK_SERVICE_URL=http://localhost:8000
ARG REACT_APP_USER_SERVICE_URL=http://localhost:8001

ENV REACT_APP_TASK_SERVICE_URL=$REACT_APP_TASK_SERVICE_URL
ENV REACT_APP_USER_SERVICE_URL=$REACT_APP_USER_SERVICE_URL

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

# SPA fallback: redirect all routes to index.html
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
