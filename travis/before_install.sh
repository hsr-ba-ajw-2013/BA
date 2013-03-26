#!/bin/sh

echo '######################################'
echo '#           BEFORE INSTALL           #'
echo '#             - START -              #'
echo '######################################'

echo '---- Installing NaturalDocs ----'
sudo apt-get update
sudo apt-get install naturaldocs
ln -s naturaldocs NaturalDocs

echo '######################################'
echo '#           BEFORE INSTALL           #'
echo '#            - FINISH -              #'
echo '######################################'