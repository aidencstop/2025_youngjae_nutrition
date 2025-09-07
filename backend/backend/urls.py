from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),

    # 프론트엔드 SPA를 위한 기본 라우팅 (필요 시 수정 가능)
    path('', TemplateView.as_view(template_name='base.html')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# ★ 핵심: API가 아닌 모든 경로는 React index.html로
urlpatterns += [
    re_path(r"^(?!api/).*$", TemplateView.as_view(template_name="index.html")),
]