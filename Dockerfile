FROM node:14-slim

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends \
    && apt-get install -y xvfb \
    && rm -rf /var/lib/apt/lists/*

# Cd into /app
WORKDIR /app

# Copy package.json into app folder
COPY package.json /app

# Install dependencies
RUN npm install
COPY . /app

# Start server on port 3000∂
EXPOSE 3001
ENV PORT=3001

# Creating Display
ENV DISPLAY :99

# Start script on Xvfb
CMD Xvfb :99 -screen 0 1920x1080x24 & npm start