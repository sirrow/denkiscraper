#!/bin/bash

usage_exit() {
    echo "Usage: $0 -u userid -p password"
    exit 1
}

while getopts u:p: OPT
do
    case $OPT in
        u)  VALUE_U=$OPTARG
            ;;
        p)  VALUE_P=$OPTARG
            ;;
    esac
done

if [ -v VALUE_U -a -v VALUE_P ]
then
    phantomjs -w > /dev/null &
    ppid=$!
    node denkiscraper.js -u $VALUE_U -p $VALUE_P
    kill $ppid
else
    usage_exit
fi


