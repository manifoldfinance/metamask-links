#!/bin/sh
yarn install --pure-lockfile --ignore-scripts
cd node_modules/sharp/
yarn
yarn run install
cd -
yarn run build
