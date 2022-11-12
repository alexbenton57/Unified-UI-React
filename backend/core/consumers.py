import asyncio
import random
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json


def dbprint(txt):
    print("----------")
    print(txt)
    print("----------")


class DemoIndicatorConsumer(AsyncJsonWebsocketConsumer):

    room_group_name = "demo_indicator_websocket"

    async def connect(self):
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "random_info",
                "message": "Begin transmission for example indicator",
            },
        )

    async def random_info(self, event):
        while True:
            content = json.dumps(
                {
                    "message": {
                        "mess": event["message"],
                        "value": random.randint(0, 100),
                        "tag": "indicator"
                    }
                }
            )

            await self.send(text_data=content)
            print(content)
            await asyncio.sleep(10)

    async def disconnect(self, code):
        pass


wrapper_group_name = "wrapper_in"


class ManagerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("manager_websocket", self.channel_name)
        await self.accept()

    async def message(self, event):
        # message = json.loads(event['message'])
        print("message sent in managerconsumer")
        await self.send_json(
            {
                "tag": event["tag"],
                "content": event["content"],
            },
        )

    async def receive_json(self, content):
        dbprint(f"Manager Websocket got:{content}")
        tag = content.get("tag", None)
        content = content.get("content", None)

        if tag == "call_manager_button":
            await self.change_help_var(content, True)
            await self.channel_layer.group_send(
                "manager_websocket", {"type": "message", "content": content, "tag": tag}
            )

        elif tag == "cancel_call_manager":
            await self.change_help_var(content, False)
        else:
            pass
