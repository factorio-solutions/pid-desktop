#!/bin/sh
for i in $(find -type f); do # Not recommended, will break on whitespace
    cat $i | grep -obUaP "\x67\x01\x19";
    if [[ $? -eq 0 ]]; then
    	echo $i
    fi
done