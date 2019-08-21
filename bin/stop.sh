#!/bin/sh

ROOT_DIR="$(dirname "$0")/.."
PID_FILE=${ROOT_DIR}/.pwc.pid

if [ -f "${PID_FILE}" ]
then
    PID=`cat "${PID_FILE}"`
    echo "Attempting to stop process ${PID}..."
    kill ${PID}
    EC="$?"
    if [ ${EC} -ne 0 ]
        then 
        echo "Failed to stop process ${PID} (kill exit code of ${EC}). Please manually clean up node processes and remove pid file ${PID_FILE}".
        exit 20
    fi
    rm -f ${PID_FILE}
    echo "The pi-weather-collector process was successfully stopped."

else
    echo "The pi-weather-collector process does not appear to be running (no PID file)."
fi
