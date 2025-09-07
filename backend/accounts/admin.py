from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, IntakeRecord, DailyHistory, IntakeImage

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'name', 'gender', 'age', 'height', 'weight', 'diet_goal', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Health Info', {
            'fields': (
                'gender', 'age', 'height', 'weight',
                'has_diabetes', 'has_hypertension', 'has_hyperlipidemia', 'has_obesity',
                'has_metabolic_syndrome', 'has_gout', 'has_fatty_liver', 'has_thyroid',
                'has_gastritis', 'has_ibs', 'has_constipation', 'has_reflux',
                'has_pancreatitis', 'has_heart_disease', 'has_stroke', 'has_anemia',
                'has_osteoporosis', 'has_food_allergy',
                'is_vegetarian', 'diet_goal'
            )
        }),
    )


from django.contrib import admin
from .models import DailyHistory

@admin.register(DailyHistory)
class DailyHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'total_grade', 'score_macro', 'score_disease', 'score_goal')
    list_filter = ('date', 'total_grade')
    search_fields = ('user__username',)

    readonly_fields = (
        'user', 'date', 'total_intake_text',
        'score_macro', 'reason_macro', 'advice_macro',
        'score_disease', 'reason_disease', 'advice_disease',
        'score_goal', 'reason_goal', 'advice_goal',
        'total_grade',
        'gender', 'age', 'height', 'weight', 'diet_goal',
        'has_diabetes', 'has_hypertension', 'has_hyperlipidemia',
        'has_anemia', 'has_obesity', 'has_metabolic_syndrome',
        'has_gout', 'has_hyperhomocysteinemia', 'has_ibs',
        'has_gastritis_or_ulcer', 'has_constipation', 'has_fatty_liver'
    )

    fieldsets = (
        ('기본 정보', {
            'fields': ('user', 'date', 'total_grade')
        }),
        ('총 섭취 내용', {
            'fields': ('total_intake_text',)
        }),
        ('Macro 평가', {
            'fields': ('score_macro', 'reason_macro', 'advice_macro')
        }),
        ('Disease 평가', {
            'fields': ('score_disease', 'reason_disease', 'advice_disease')
        }),
        ('Goal 평가', {
            'fields': ('score_goal', 'reason_goal', 'advice_goal')
        }),
        ('사용자 프로필 스냅샷', {
            'fields': ('gender', 'age', 'height', 'weight', 'diet_goal')
        }),
        ('질병 상태 스냅샷', {
            'fields': (
                'has_diabetes', 'has_hypertension', 'has_hyperlipidemia',
                'has_anemia', 'has_obesity', 'has_metabolic_syndrome',
                'has_gout', 'has_hyperhomocysteinemia', 'has_ibs',
                'has_gastritis_or_ulcer', 'has_constipation', 'has_fatty_liver'
            )
        }),
    )



admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(IntakeRecord)

@admin.register(IntakeImage)
class IntakeImageAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'created_at', 'image', 'note')
    list_filter = ('date',)
    search_fields = ('user__username', 'note')