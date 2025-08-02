import openai
from django.conf import settings
from django.contrib.auth import authenticate
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import CustomUser, IntakeRecord, DailyHistory
from .serializers import (
    RegisterSerializer,
    LoginSuccessSerializer,
    UserInfoSerializer,
    IntakeRecordSerializer,
    DailyHistorySerializer,
)

openai.api_key = settings.OPENAI_API_KEY

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': '회원가입 성공'})
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': LoginSuccessSerializer(user).data
        })
    return Response({'error': '아이디 또는 비밀번호가 틀렸습니다.'}, status=400)

@api_view(['GET', 'PUT'])
def my_info_view(request):
    user = request.user
    if request.method == 'GET':
        serializer = UserInfoSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserInfoSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': '정보 수정 완료'})
        return Response(serializer.errors, status=400)

@api_view(['POST'])
def chat_api(request):
    content = request.data.get('content')
    if not content:
        return Response({'error': '내용이 없습니다.'}, status=400)

    record = IntakeRecord.objects.create(user=request.user, content=content)
    return Response({
        'message': '기록 완료',
        'record': IntakeRecordSerializer(record).data
    })

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
import openai
import json
from .models import IntakeRecord, DailyHistory
from .serializers import UserInfoSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
import openai
import json
from .models import IntakeRecord, DailyHistory
from .serializers import UserInfoSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
import json
import openai

from .models import IntakeRecord, DailyHistory
from .serializers import UserInfoSerializer

@api_view(['POST'])
def evaluate_daily_intake(request):
    user = request.user
    today = timezone.localtime().date()

    records = IntakeRecord.objects.filter(user=user, date=today)
    if not records.exists():
        return Response({'error': 'No intake records found for today.'}, status=400)

    all_text = "\n".join([r.content for r in records])
    profile = UserInfoSerializer(user).data

    # Format health condition string for GPT
    disease_fields = [k.replace('has_', '').replace('_', ' ').title()
                      for k, v in profile.items() if k.startswith('has_') and v]
    disease_summary = ', '.join(disease_fields) if disease_fields else 'None'

    # GPT prompt
    prompt = f"""
You are a professional health consultant. Below is a user's profile and today's food/supplement intake.

[User Profile]
Gender: {profile['gender']}
Age: {profile['age']}
Height: {profile['height']} cm
Weight: {profile['weight']} kg
Health Conditions: {disease_summary}
Vegetarian: {"Yes" if profile['is_vegetarian'] else "No"}
Diet Goal: {profile['diet_goal']}

[Intake Today]
{all_text}

Please evaluate the user's daily diet in the following three categories.

For each category, return:
- A score between 0 and 10 (integer)
- A brief reason for the score (1–2 sentences, English only)
- One suggestion for improvement (1 sentence, English only)

Respond strictly in this JSON format:

{{
  "macro": {{
    "score": <integer 0–10>,
    "reason": "<why this macro score>",
    "advice": "<tip to improve macro score>"
  }},
  "disease": {{
    "score": <integer 0–10>,
    "reason": "<why this disease score>",
    "advice": "<tip to improve disease score>"
  }},
  "goal": {{
    "score": <integer 0–10>,
    "reason": "<why this goal score>",
    "advice": "<tip to improve goal score>"
  }}
}}
"""

    try:
        gpt_response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[{"role": "user", "content": prompt}]
        )
        raw_answer = gpt_response['choices'][0]['message']['content']
        result = json.loads(raw_answer)

        score_macro = int(result.get('macro', {}).get('score', 0))
        reason_macro = result.get('macro', {}).get('reason', '')
        advice_macro = result.get('macro', {}).get('advice', '')

        score_disease = int(result.get('disease', {}).get('score', 0))
        reason_disease = result.get('disease', {}).get('reason', '')
        advice_disease = result.get('disease', {}).get('advice', '')

        score_goal = int(result.get('goal', {}).get('score', 0))
        reason_goal = result.get('goal', {}).get('reason', '')
        advice_goal = result.get('goal', {}).get('advice', '')

    except Exception as e:
        return Response({'error': 'Failed to parse GPT response', 'raw': raw_answer}, status=500)

    score_total = score_macro + score_disease + score_goal
    if score_total <= 4:
        grade = 'D'
    elif score_total <= 14:
        grade = 'C'
    elif score_total <= 24:
        grade = 'B'
    else:
        grade = 'A'

    DailyHistory.objects.filter(user=user, date=today).delete()
    DailyHistory.objects.create(
        user=user,
        date=today,
        total_intake_text=all_text,
        score_macro=score_macro,
        score_disease=score_disease,
        score_goal=score_goal,
        total_grade=grade,
        reason_macro=reason_macro,
        reason_disease=reason_disease,
        reason_goal=reason_goal,
        advice_macro=advice_macro,
        advice_disease=advice_disease,
        advice_goal=advice_goal,

        gender=profile['gender'],
        age=profile['age'],
        height=profile['height'],
        weight=profile['weight'],
        diet_goal=profile['diet_goal'],

        has_diabetes=profile.get('has_diabetes', False),
        has_hypertension=profile.get('has_hypertension', False),
        has_hyperlipidemia=profile.get('has_hyperlipidemia', False),
        has_anemia=profile.get('has_anemia', False),
        has_obesity=profile.get('has_obesity', False),
        has_metabolic_syndrome=profile.get('has_metabolic_syndrome', False),
        has_gout=profile.get('has_gout', False),
        has_hyperhomocysteinemia=profile.get('has_hyperhomocysteinemia', False),
        has_ibs=profile.get('has_ibs', False),
        has_gastritis_or_ulcer=profile.get('has_gastritis_or_ulcer', False),
        has_constipation=profile.get('has_constipation', False),
        has_fatty_liver=profile.get('has_fatty_liver', False),
    )

    return Response({
        'grade': grade,
        'score_macro': score_macro,
        'score_disease': score_disease,
        'score_goal': score_goal,
        'score_total': score_total,
        'reason_macro': reason_macro,
        'reason_disease': reason_disease,
        'reason_goal': reason_goal,
        'advice_macro': advice_macro,
        'advice_disease': advice_disease,
        'advice_goal': advice_goal,
        'intake_summary': all_text,
        'feedback_saved': True,
        'raw_gpt_response': raw_answer,
    })



@api_view(['GET'])
def daily_history_list(request):
    user = request.user
    page = int(request.GET.get('page', 1))
    page_size = 10
    histories = DailyHistory.objects.filter(user=user).order_by('-date')
    start = (page - 1) * page_size
    end = start + page_size
    serializer = DailyHistorySerializer(histories[start:end], many=True)
    return Response(serializer.data)
