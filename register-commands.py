import requests


url = "https://discord.com/api/v8/applications/782831608964710400/commands"

# /fit availability <weekends|weekdays> <add|remove> <time>
# /fit availability list
# /fit rest <add|remove> <day>
# /fit rest list
# /fit refresh

# for types, see: https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype

json = {
    "name": "fit",
    "id": "812445651069042729",
    "description": "Manage fit-4-less workouts",
    "options": [
        {
            "name": "rest",
            "description": "adjust one-time rest days",
            "type": 1,
            "required": False,
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
                    "name": "day",
                    "description": "day to manage",
                    "type": 3,
                    "required": True,
                },
            ],
        },
        {
            "name": "weekday-availability",
            "description": "adjust weekday booking preferences",
            "type": 1,
            "required": False,
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
                    "choices": [
                        {
                            "name": "8-30AM",
                            "value": "8:30 AM"
                        },
                        {
                            "name": "10-00AM",
                            "value": "10:00 AM",
                        },
                        {
                            "name": "11-30AM",
                            "value": "11:30 AM",
                        },
                        {
                            "name": "1-00PM",
                            "value": "1:00 PM",
                        },
                        {
                            "name": "2-30PM",
                            "value": "2:30 PM",
                        },
                        {
                            "name": "4-00PM",
                            "value": "4:00 PM",
                        },
                        {
                            "name": "5-30PM",
                            "value": "5:30 PM",
                        },
                        {
                            "name": "7-00PM",
                            "value": "7:00 PM",
                        },
                        {
                            "name": "8-30PM",
                            "value": "8:30 PM",
                        },
                    ]
                },
            ],
        },
        {
            "name": "weekend-availability",
            "description": "adjust weekend booking preferences",
            "type": 1,
            "required": False,
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
                    "choices": [
                        {
                            "name": "2-00PM",
                            "value": "2:00 PM",
                        },
                        {
                            "name": "3-30PM",
                            "value": "3:30 PM",
                        },
                        {
                            "name": "5-00PM",
                            "value": "5:00 PM",
                        },
                    ]
                },
            ],
        },
    ]
}

# For authorization, you can use either your bot token 
headers = {
    "Authorization": "Bot #TOKEN#"
}

r = requests.post(url, headers=headers, json=json)
print(r.status_code)
print(r.content)