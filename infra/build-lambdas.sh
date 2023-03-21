#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
LAMBDA_DIR="${SCRIPT_DIR}/../dist"

mkdir -p "${SCRIPT_DIR}/builds"

# Force the modification time on all lamdba files to the same date
# This is necessary to ensure the shasum of the output zip is deterministic
find "${LAMBDA_DIR}/" -exec touch -t 201301250000 {} +

BUILT_LAMBDAS=$(ls "${LAMBDA_DIR}")

for LAMBDA_NAME in $BUILT_LAMBDAS; do
  zip -j -r "${SCRIPT_DIR}/builds/${LAMBDA_NAME}.zip" "${LAMBDA_DIR}/${LAMBDA_NAME}"
done