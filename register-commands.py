import requests


url = "https://discord.com/api/v8/applications/782831608964710400/commands"

# /fit availability <weekends|weekdays> <add|remove> <time>
# /fit availability list
# /fit rest <add|remove> <day>
# /fit rest list
# /fit refresh

# for types, see: https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype

json = {
    "name": "say",
    # "id": "812445651069042729",
    "description": "say fun things",
    "options": [
        {
            "name": "weekday-availability",
            "description": "adjust weekday booking preferences",
            "type": 1,
            "options": [
                {
                    "name": "Action",
                    "description": "change to preferences to be made",
                    "type": 3,
                    "required": True,
                    "choices": [
                        {
                            "name": "Add",
                            "value": "add",
                        },
                        {
                            "name": "Remove",
                            "value": "remove",
                        }
                    ]
                },
                {
                    "name": "slot",
                    "description": "timeslot to manage",
                    "type": 3,
                    "required": True,
                },
            ],
        },
    ]
}

# For authorization, you can use either your bot token 
headers = {
    # "Authorization": "Bot #TOKEN#"
}

r = requests.post(url, headers=headers, json=json)
print(r.status_code)
print(r.content)