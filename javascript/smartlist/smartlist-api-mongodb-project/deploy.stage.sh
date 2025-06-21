#!/bin/sh
FOLDER_PATH=/var/www/html/clients/abhijeet/smartlist/backup

rm -rf _serverapp

npm run build

mkdir _serverapp
cp -R dist package.json tsconfig.json tsconfig.build.json _serverapp
tar -zcf serverapp.tar.gz _serverapp

scp serverapp.tar.gz amitav@52.76.118.46:$FOLDER_PATH
ssh amitav@52.76.118.46 "
cd $FOLDER_PATH
rm -rf _serverapp
tar -xf serverapp.tar.gz
mv serverapp.tar.gz _oldserver.tar.gz
cd ../server
rm -rf dist
cp -R ../backup/_serverapp/* .
"
