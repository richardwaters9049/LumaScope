# Dockerfile.frontend

FROM oven/bun:1.2.2

COPY . .
WORKDIR /app/frontend

RUN bun install

EXPOSE 3000
CMD ["bun", "run", "dev"]
