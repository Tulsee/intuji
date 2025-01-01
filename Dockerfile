# Build the application
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .

RUN yarn run build


# Create the final image
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.env ./
RUN yarn install --production

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
