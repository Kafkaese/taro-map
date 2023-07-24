FROM node:latest AS build
WORKDIR /build

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY public/ public
COPY src/ src
COPY assets/ assets
RUN npm run build

FROM nginx:alpine
COPY --from=build /build/build/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container is launched
CMD ["nginx", "-g", "daemon off;"]