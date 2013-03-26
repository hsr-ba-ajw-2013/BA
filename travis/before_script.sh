#!/bin/sh

echo '######################################'
echo '#            BEFORE SCRIPT           #'
echo '#             - START -              #'
echo '######################################'

echo '---- Installing NaturalDocs ----'
sudo apt-get update
sudo apt-get install naturaldocs
ln -s naturaldocs NaturalDocs

echo '######################################'
echo '#            BEFORE SCRIPT           #'
echo '#            - FINISH -              #'
echo '######################################'