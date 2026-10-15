FROM node:22-bookworm-slim AS frontend
WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ backend/
COPY assets/ assets/
COPY run_web.py ./
COPY --from=frontend /build/dist frontend/dist/
ENV HOST=0.0.0.0 PORT=8000 OPEN_BROWSER=0 PYTHONDONTWRITEBYTECODE=1
EXPOSE 8000
CMD ["python", "run_web.py"]
