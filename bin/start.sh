#!/bin/sh

ROOT_DIR="$(dirname "$0")/.."
PID_FILE=${ROOT_DIR}/.pwc.pid
LOG_FILE=${ROOT_DIR}/pwc.log

if [ -f "${PID_FILE}" ]
then
    echo "PID file exists, attempting to stop..."
    ${ROOT_DIR}/bin/stop.sh
    if [ -f "${PID_FILE}" ]
    then
        echo "PID file still exists after stop. Please manualy clean up node processes and remove PID file ${PID_FILE}"
        exit 20
    fi
fi

echo "Starting pi-weather-collector as background process"
nohup sh -c "echo; echo; echo 'Starting...'; date; DEBUG=pi-weather-collector:* npm start; sleep 1; echo 'Process exit, removing PID file'; rm -f ${PID_FILE}; echo 'Done'" >> ${LOG_FILE} 2>&1 &
PID=`echo $!`
echo ${PID} > ${PID_FILE}
echo "Successfully started pi-weather-collector as pid ${PID}, logging to ${LOG_FILE}."