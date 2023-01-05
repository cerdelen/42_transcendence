#!/bin/sh
mkdir ~/.npm-global || true
npm config set prefix '~/.npm-global' || true
echo "export PATH=~/.npm-global/bin:$PATH" > ~/.profile || true
source ~/.profile || true