# Build Stage
FROM node:22.3-alpine3.19 AS build

WORKDIR /app

COPY package*.json /app
RUN npm install

COPY . .

ARG VITE_BACKEND_URL=http://localhost:5000
RUN sh -c "echo \"VITE_BACKEND_URL=${VITE_BACKEND_URL}\" > .env.production"
RUN npm run build

# Production Stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
