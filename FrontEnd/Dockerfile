# ============================================================================
#  Dockerfile - FrontEnd (Portal de Transparencia Santo Domingo)
#  Build multi-etapa: compila con Node y sirve los estáticos con Nginx.
# ============================================================================

# ---------- Etapa 1: build ----------
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependencias primero (mejor aprovechamiento de la caché de capas)
COPY package.json package-lock.json* ./
RUN npm install

# Copiar el resto del código
COPY . .

# Vite "hornea" las variables VITE_* en tiempo de BUILD. La URL de la API debe
# ser la que el NAVEGADOR del usuario pueda alcanzar (el puerto publicado del
# backend en el host), no el nombre interno del servicio Docker.
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Etapa 2: runtime (Nginx) ----------
FROM nginx:alpine

# Limpiar el contenido por defecto y copiar el build
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración con fallback SPA para React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
