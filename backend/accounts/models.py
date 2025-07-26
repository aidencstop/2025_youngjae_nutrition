from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('Username must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        # 필수 인적 사항 기본값
        extra_fields.setdefault('name', '관리자')
        extra_fields.setdefault('gender', 'M')
        extra_fields.setdefault('age', 30)
        extra_fields.setdefault('height', 170)
        extra_fields.setdefault('weight', 70)
        extra_fields.setdefault('diet_goal', 'maintain')

        # 질병 및 기타 항목들 기본값
        for disease in [
            'has_diabetes', 'has_hypertension', 'has_hyperlipidemia',
            'has_obesity', 'has_metabolic_syndrome', 'has_gout',
            'has_fatty_liver', 'has_thyroid', 'has_gastritis', 'has_ibs',
            'has_constipation', 'has_reflux', 'has_pancreatitis',
            'has_heart_disease', 'has_stroke', 'has_anemia',
            'has_osteoporosis', 'has_food_allergy',
            'is_vegetarian',
        ]:
            extra_fields.setdefault(disease, False)

        return self.create_user(username, password, **extra_fields)

# 사용자 정의 모델
class CustomUser(AbstractUser):
    GENDER_CHOICES = [('M', '남성'), ('F', '여성')]
    DIET_GOAL_CHOICES = [('loss', '체중 감량'), ('maintain', '현상 유지'), ('gain', '근육 증량')]

    name = models.CharField(max_length=50)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    age = models.PositiveIntegerField()
    height = models.FloatField()
    weight = models.FloatField()

    # 질병 보유 여부
    has_diabetes = models.BooleanField(default=False)
    has_hypertension = models.BooleanField(default=False)
    has_hyperlipidemia = models.BooleanField(default=False)
    has_obesity = models.BooleanField(default=False)
    has_metabolic_syndrome = models.BooleanField(default=False)
    has_gout = models.BooleanField(default=False)
    has_fatty_liver = models.BooleanField(default=False)
    has_thyroid = models.BooleanField(default=False)
    has_gastritis = models.BooleanField(default=False)
    has_ibs = models.BooleanField(default=False)
    has_constipation = models.BooleanField(default=False)
    has_reflux = models.BooleanField(default=False)
    has_pancreatitis = models.BooleanField(default=False)
    has_heart_disease = models.BooleanField(default=False)
    has_stroke = models.BooleanField(default=False)
    has_anemia = models.BooleanField(default=False)
    has_osteoporosis = models.BooleanField(default=False)
    has_food_allergy = models.BooleanField(default=False)

    is_vegetarian = models.BooleanField(default=False)
    diet_goal = models.CharField(max_length=10, choices=DIET_GOAL_CHOICES)

    objects = CustomUserManager()

    def __str__(self):
        return self.username

# 식단 및 영양제 섭취 기록
class IntakeRecord(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    # 날짜 필드: 새벽 3시 이전은 전날로 간주
    date = models.DateField(editable=False)

    def save(self, *args, **kwargs):
        seoul_now = timezone.localtime()
        if seoul_now.hour < 3:
            self.date = (seoul_now - timezone.timedelta(days=1)).date()
        else:
            self.date = seoul_now.date()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.content[:20]}"

# GPT 피드백 및 요약 저장
class DailyHistory(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    total_intake_text = models.TextField()
    score_macro = models.BooleanField()
    score_disease = models.BooleanField()
    score_goal = models.BooleanField()
    total_grade = models.CharField(max_length=1)  # A~D

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.total_grade}"
