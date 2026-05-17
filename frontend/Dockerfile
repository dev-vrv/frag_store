FROM node:lts-alpine

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
COPY scripts/run-next-debug.sh /app/scripts/run-next-debug.sh

EXPOSE 3000
