from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),

    # 프론트엔드 SPA를 위한 기본 라우팅 (필요 시 수정 가능)
    path('', TemplateView.as_view(template_name='base.html')),
]
