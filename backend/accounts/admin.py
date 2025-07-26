from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, IntakeRecord, DailyHistory

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

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(IntakeRecord)
admin.site.register(DailyHistory)
