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
            "name": "info",
            "description": "show workout info",
            "type": 1,
        },
        {
            "name": "sync",
            "description": "forces rechecking bookings",
            "type": 1,
        },
        {
            "name": "rest",
            "description": "adjust one-time rest days",
            "type": 1,
            "options": [
                {
                    "name": "Day",
                    "description": "day to toggle rest",
                    "required": True,
                    "type": 3,
                    "choices": [
                        {
                            "name": "Sunday",
                            "value": "sunday"
                        },
                        {
                            "name": "Monday",
                            "value": "monday"
                        },
                        {
                            "name": "Tuesday",
                            "value": "tuesday"
                        },
                        {
                            "name": "Wednesday",
                            "value": "wednesday"
                        },
                        {
                            "name": "Thursday",
                            "value": "thursday"
                        },
                        {
                            "name": "Friday",
                            "value": "friday"
                        },
                        {
                            "name": "Saturday",
                            "value": "saturday"
                        }
                    ],
                }
            ]
        },
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
        {
            "name": "weekend-availability",
            "description": "adjust weekend booking preferences",
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