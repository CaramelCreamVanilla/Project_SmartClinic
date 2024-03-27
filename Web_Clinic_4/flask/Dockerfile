
FROM python:3.11

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    build-essential \
    libmariadb-dev \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./

RUN pip install --upgrade pip && \
    pip install --no-cache-dir --default-timeout=100 -r requirements.txt

COPY . .

EXPOSE 5558


CMD ["python", "app.py"]