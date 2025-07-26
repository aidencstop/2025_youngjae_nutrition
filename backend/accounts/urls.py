from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('my-info/', views.my_info_view, name='my-info'),
    path('chat/', views.chat_api, name='chat'),
    path('evaluate/', views.evaluate_daily_intake, name='evaluate'),
    path('history/', views.daily_history_list, name='history'),
]
