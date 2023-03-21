#!/usr/bin/env bash
set -e

tf_command=$1
environment=$2

declare -A tf_commands=()
tf_commands["init"]="init -backend-config=environments/$environment.backend"
tf_commands["plan"]="plan -var-file=environments/$environment.tfvars"
tf_commands["apply"]="apply -var-file=environments/$environment.tfvars"

declare -A environment_account_ids=()
environment_account_ids["preview"]="369662608964"
environment_account_ids["production"]="451603144994"
environment_account_ids["sandbox"]="401770798620"

function usage {
  local IFS="|"
  echo "Use $0 ${!tf_commands[*]} ${!environment_account_ids[*]}"
  exit 1
}

if [ $# -lt 2 ]; then
  echo "Invalid number of arguments supplied"
  usage
fi

if [ ! "${tf_commands[$tf_command]}" ]; then
  echo "Invalid argument supplied ($tf_command)"
  usage
fi

if [ ! "${environment_account_ids[$environment]}" ]; then
  echo "Invalid argument supplied ($environment)"
  usage
fi

account_id=$(aws sts get-caller-identity --query "Account" --output text)
if [ "$account_id" != "${environment_account_ids[$environment]}" ]; then
  echo "Your credentials are for the AWS account $account_id, yet the environment '$environment' is on the AWS account ${environment_account_ids[$environment]}"
  exit 1
fi

shift; shift; # shift to the third arg position so that we can pass extra arguments to the command at the end
terraform ${tf_commands[$tf_command]} $*
