from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import IntakeRecord, DailyHistory

CustomUser = get_user_model()

# 회원가입용 시리얼라이저
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'username', 'password', 'password2', 'name', 'gender', 'age', 'height', 'weight',
            'has_diabetes', 'has_hypertension', 'has_hyperlipidemia', 'has_obesity',
            'has_metabolic_syndrome', 'has_gout', 'has_fatty_liver', 'has_thyroid',
            'has_gastritis', 'has_ibs', 'has_constipation', 'has_reflux', 'has_pancreatitis',
            'has_heart_disease', 'has_stroke', 'has_anemia', 'has_osteoporosis', 'has_food_allergy',
            'is_vegetarian', 'diet_goal'
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("비밀번호가 일치하지 않습니다.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

# 사용자 정보 조회/수정용 시리얼라이저
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ['password', 'last_login', 'is_superuser', 'is_staff', 'is_active', 'groups', 'user_permissions']

# 로그인 성공 시 응답용
class LoginSuccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'name']

# 식단 입력 기록
class IntakeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntakeRecord
        fields = '__all__'

# 일별 GPT 평가 기록
class DailyHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyHistory
        fields = '__all__'

from rest_framework import serializers
from .models import IntakeRecord, IntakeImage

class IntakeImageSerializer(serializers.ModelSerializer):
    # user를 사람이 읽기 좋은 형태로 노출 (원하면 제거 가능)
    user = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = IntakeImage
        fields = ['user', 'image', 'note', 'date', 'created_at']  # id 제외