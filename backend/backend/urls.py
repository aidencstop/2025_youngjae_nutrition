# storybook_backend/urls.py
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# ★ API가 아닌 모든 경로는 React index.html로 (맨 마지막!)
urlpatterns += [
    re_path(r'^(?!api/).*$', TemplateView.as_view(template_name='index.html')),
]
