from django.urls import re_path
from core import consumers

"""
application = ProtocolTypeRouter({
        'websocket': AuthMiddlewareStack(
            URLRouter(
                core.routing.websocket_urlpatterns
            )
        ),
    })
    
application = ProtocolTypeRouter({
    'websocket': URLRouter(core.routing.websocket_urlpatterns)
})
"""

websocket_urlpatterns = [
    re_path(r'^ws/(?P<room_name>[^/]+)/$', consumers.DemoIndicatorConsumer.as_asgi()),
    re_path(r'ws/global',consumers.GlobalConsumer.as_asgi()),
    re_path(r'ws/indicator',consumers.DemoIndicatorConsumer.as_asgi()),
]



