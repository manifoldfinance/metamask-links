#!/bin/sh
yarn install --pure-lockfile
cd node_modules/sharp/
yarn
yarn run install
cd -
yarn run build
 
