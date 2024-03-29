FROM node:14
 
RUN apt-get update -y \
    && apt-get -y install curl python build-essential git ca-certificates

ENV DEBUG="notes:*,messages:*" 
ENV SEQUELIZE_CONNECT="models/sequelize-docker-mysql.yaml" 
ENV NOTES_MODEL="sequelize" 
ENV USER_SERVICE_URL="http://svc-userauth:5858" 
ENV PORT="3000" 
ENV DOTENV_CONFIG_PATH="/run/secrets/notes-dotenv"

# These values should be supplied elsewhere
# ENV TWITTER_CONSUMER_KEY=""
# ENV TWITTER_CONSUMER_SECRET=""
 
RUN mkdir -p /notesapp /notesapp/minty /notesapp/partials /notesapp/public /notesapp/routes /notesapp/theme /notesapp/theme/dist /notesapp/views
COPY minty/ /notesapp/minty/
COPY models/*.mjs models/*.yaml /notesapp/models/
COPY partials/ /notesapp/partials/
COPY public/ /notesapp/public/
COPY routes/ /notesapp/routes/
COPY theme/dist/ /notesapp/theme/dist/
COPY views/ /notesapp/views/
COPY *.mjs package.json /notesapp/

WORKDIR /notesapp

RUN npm install --unsafe-perm

# Uncomment to build the theme directory
# WORKDIR /notesapp/theme
# RUN npm run download && npm run build && npm run clean

WORKDIR /notesapp

VOLUME /sessions 
EXPOSE 3000 
CMD [ "node", "./app.mjs" ]