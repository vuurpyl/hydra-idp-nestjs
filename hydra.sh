# create oauth2 client
docker-compose -f docker-compose-hydra.yml exec hydra hydra clients create --endpoint http://localhost:4445 --id auth-code-client --secret secret --grant-types client_credentials,authorization_code,refresh_token --response-types code,id_token --scope openid,offline --callbacks http://localhost:5555/callback

# start authorization_code flow
docker-compose -f docker-compose-hydra.yml exec hydra hydra token user --skip-tls-verify --port 5555 --client-id auth-code-client --client-secret secret --endpoint http://localhost:4444/ --scope openid,offline --redirect http://localhost:5555/callback --token-url http://localhost:4444/oauth2/token

# start client_credentials flow
docker-compose -f docker-compose-hydra.yml exec hydra hydra token client --skip-tls-verify --endpoint http://127.0.0.1:4444 --client-id auth-client --client-secret secretkey
