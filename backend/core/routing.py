from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/(?P<room_name>[^/]+)/$', consumers.DemoIndicatorConsumer.as_asgi()),
    re_path(r'ws/manager',consumers.ManagerConsumer.as_asgi()),
    re_path(r'ws/indicator',consumers.DemoIndicatorConsumer.as_asgi()),
]


