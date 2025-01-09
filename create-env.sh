#!/bin/bash

# Check if stage parameter is provided
if [ -z "$1" ]; then
    echo "Error: Please provide a stage parameter (dev or prod)"
    exit 1
fi

# Validate stage parameter
stage=$1
if [ "$stage" != "dev" ] && [ "$stage" != "prod" ]; then
    echo "Error: Stage must be either 'dev' or 'prod'"
    exit 1
fi

# Check if outputs file exists
outputs_file="./shared/outputs-${stage}.json"
if [ ! -f "$outputs_file" ]; then
    echo "Error: File ${outputs_file} not found"
    exit 1
fi

# Extract values using jq
auth_stack="speak2see-auth-${stage}"
api_stack="speak2see-api-${stage}"

user_pool_client_id=$(jq -r ".[\"${auth_stack}\"].UserPoolClientId" "$outputs_file")
user_pool_id=$(jq -r ".[\"${auth_stack}\"].UserPoolId" "$outputs_file")
api_endpoint=$(jq -r ".[\"${api_stack}\"].ApiEndpoint" "$outputs_file")

# Validate extracted values
if [ "$user_pool_client_id" == "null" ] || [ "$user_pool_id" == "null" ] || [ "$api_endpoint" == "null" ]; then
    echo "Error: Failed to extract required values from ${outputs_file}"
    exit 1
fi
# Set mock API flag based on stage
use_mock_api="false"
if [ "$stage" == "dev" ]; then
    use_mock_api="true"
fi
# Create .env file
cat >.env <<EOF
VITE_REACT_APP_USER_POOL_CLIENT_ID=${user_pool_client_id}
VITE_REACT_APP_USER_POOL_ID=${user_pool_id}
VITE_REACT_APP_API_ENDPOINT=${api_endpoint}
VITE_REACT_APP_USE_MOCK_API=${use_mock_api}
EOF

echo "Successfully created .env file for ${stage} environment"
