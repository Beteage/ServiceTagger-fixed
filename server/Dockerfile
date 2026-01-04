FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start command
CMD ["npm", "start" sh -c "npx prisma migrate deploy && npm start"
CMD sh -c "npx prisma migrate deploy && npm start"
