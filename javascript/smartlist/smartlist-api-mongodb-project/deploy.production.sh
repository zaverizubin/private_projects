#!/bin/sh
FOLDER_PATH=/home/ec2-user/smartlist/backup

rm -rf _serverapp

npm run build

mkdir _serverapp
cp -R dist package.json tsconfig.json tsconfig.build.json _serverapp
tar -zcf serverapp.tar.gz _serverapp

scp serverapp.tar.gz ec2-user@3.109.165.62:$FOLDER_PATH
ssh ec2-user@3.109.165.62 "
cd $FOLDER_PATH
rm -rf _serverapp
tar -xf serverapp.tar.gz
mv serverapp.tar.gz _oldserver.tar.gz
cd ../server
rm -rf dist
cp -R ../backup/_serverapp/* .
"
