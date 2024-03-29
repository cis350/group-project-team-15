# call with sh put.sh ID INFO
# id = id of user to update
# info = json for info
# example: sh put.sh 660272f6febb0194a97b388f '{"info":[{"key":"skills","value":["edging","gooning"]}]}'
# example: sh put.sh 660272f6febb0194a97b388f @info.json
#   where info.json:
#   {
#       "info": [
#           {
#               "key": "skills",
#               "value": [
#                   "edging",
#                   "gooning"
#                   ]
#           }
#       ]
#   }

curl \
    -H "Content-Type: application/json" \
    -X PUT \
    -d $2 \
    localhost:8080/student/$1
