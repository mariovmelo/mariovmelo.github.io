#!/bin/bash
fileid="1O7hygz-OLZ2t5MgBPszWYM4kpIUg4C4H"
filename="dump.tar.gz"
curl -c ./cookie -s -L "https://drive.google.com/uc?export=download&id=${fileid}" > /dev/null
curl -Lb ./cookie "https://drive.google.com/uc?export=download&confirm=`awk '/download/ {print $NF}' ./cookie`&id=${fileid}" -o ${filename}