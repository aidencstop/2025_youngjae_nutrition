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

from datetime import timedelta
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
# openai, json, DailyHistory, IntakeRecord, UserInfoSerializer 등은 기존 import 유지

def _business_date():
    """
    새벽 3시 이전은 전날로 간주하는 '사업일자' 계산
    """
    now = timezone.localtime()
    base_date = now.date()
    if now.hour < 3:
        return base_date - timedelta(days=1)
    return base_date

@api_view(['POST'])
def evaluate_daily_intake(request):
    user = request.user

    # 1) '사업일자' 규칙(새벽 3시 이전 전날) 적용
    target_date = _business_date()

    # 2) 오늘(사업일자) 기록 조회
    records = IntakeRecord.objects.filter(user=user, date=target_date).order_by('timestamp')
    if not records.exists():
        return Response(
            {'error': f'No intake records found for {target_date}.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    all_text = "\n".join([r.content for r in records])
    profile = UserInfoSerializer(user).data

    # 3) 질병 요약
    disease_fields = [
        k.replace('has_', '').replace('_', ' ').title()
        for k, v in profile.items() if k.startswith('has_') and v
    ]
    disease_summary = ', '.join(disease_fields) if disease_fields else 'None'

    # 4) GPT 프롬프트 (탄/단/지 g 수치 추가 요청)
    prompt = f"""
You are a professional health consultant. Below is a user's profile and today's food/supplement intake.

[User Profile]
Gender: {profile['gender']}
Age: {profile['age']}
Height: {profile['height']} cm
Weight: {profile['weight']} kg
Health Conditions: {disease_summary}
Vegetarian: {"Yes" if profile.get('is_vegetarian') else "No"}
Diet Goal: {profile['diet_goal']}

[Intake Today]
{all_text}

Please evaluate the user's daily diet in the following three categories.

Ignore any lines that are not related to food or supplement intake.

For each category, return:
- A score between 0 and 10 (integer)
- A brief reason for the score (1–2 sentences, English only)
- One suggestion for improvement (1 sentence, English only)

Additionally for the "macro" category ONLY, estimate the user's daily intake of macronutrients in grams:
- carbs_g, protein_g, fat_g
These should be non-negative integers (grams) rounded to the nearest whole number. If you are unsure, provide your best estimate.

Respond strictly in this JSON format:

{{
  "macro": {{
    "score": <integer 0–10>,
    "reason": "<why this macro score>",
    "advice": "<tip to improve macro score>",
    "carbs_g": <integer>,
    "protein_g": <integer>,
    "fat_g": <integer>
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

    def _to_int_safe(x, default=None):
        try:
            # float로 한번 받아서 반올림 후 int 처리
            return int(round(float(x)))
        except Exception:
            return default

    # 5) GPT 호출 & 파싱
    raw_answer = None
    try:
        gpt_response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[{"role": "user", "content": prompt}]
        )
        raw_answer = gpt_response['choices'][0]['message']['content']
        result = json.loads(raw_answer)

        # --- macro ---
        score_macro = int(result.get('macro', {}).get('score', 0))
        reason_macro_raw = result.get('macro', {}).get('reason', '') or ''
        advice_macro = result.get('macro', {}).get('advice', '') or ''

        carbs_g = _to_int_safe(result.get('macro', {}).get('carbs_g'), default=None)
        protein_g = _to_int_safe(result.get('macro', {}).get('protein_g'), default=None)
        fat_g = _to_int_safe(result.get('macro', {}).get('fat_g'), default=None)

        # 1줄 요약(line 1) 구성: Carbs ~~g, Protein ~~g, Fat ~~g
        if carbs_g is not None and protein_g is not None and fat_g is not None:
            macro_line1 = f"Carbs {carbs_g}g, Protein {protein_g}g, Fat {fat_g}g"
        else:
            # 백업 형식(혹시 모델이 누락한 경우)
            c = f"{carbs_g}g" if carbs_g is not None else "N/A"
            p = f"{protein_g}g" if protein_g is not None else "N/A"
            f = f"{fat_g}g" if fat_g is not None else "N/A"
            macro_line1 = f"Carbs {c}, Protein {p}, Fat {f}"

        # 최종 reason_macro: 1줄 요약 + 개행 + 기존 이유(2줄째)
        reason_macro = f"{macro_line1}\n{reason_macro_raw.strip()}"

        # --- disease ---
        score_disease = int(result.get('disease', {}).get('score', 0))
        reason_disease = result.get('disease', {}).get('reason', '') or ''
        advice_disease = result.get('disease', {}).get('advice', '') or ''

        # --- goal ---
        score_goal = int(result.get('goal', {}).get('score', 0))
        reason_goal = result.get('goal', {}).get('reason', '') or ''
        advice_goal = result.get('goal', {}).get('advice', '') or ''

    except Exception as e:
        return Response(
            {'error': 'Failed to parse GPT response', 'raw': raw_answer, 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # 6) 총점 → 등급
    score_total = score_macro + score_disease + score_goal
    if score_total <= 4:
        grade = 'D'
    elif score_total <= 14:
        grade = 'C'
    elif score_total <= 24:
        grade = 'B'
    else:
        grade = 'A'

    # 7) DailyHistory 저장 (해당 사업일자 기준으로 교체 저장)
    DailyHistory.objects.filter(user=user, date=target_date).delete()
    DailyHistory.objects.create(
        user=user,
        date=target_date,
        total_intake_text=all_text,
        score_macro=score_macro,
        score_disease=score_disease,
        score_goal=score_goal,
        total_grade=grade,
        reason_macro=reason_macro,          # ← 2줄 형식으로 저장
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

    # 8) 응답 (reason_macro를 2줄 형식으로 반환)
    return Response({
        'grade': grade,
        'score_macro': score_macro,
        'score_disease': score_disease,
        'score_goal': score_goal,
        'score_total': score_total,
        'reason_macro': reason_macro,        # ← 2줄
        'reason_disease': reason_disease,
        'reason_goal': reason_goal,
        'advice_macro': advice_macro,
        'advice_disease': advice_disease,
        'advice_goal': advice_goal,
        'intake_summary': all_text,
        'feedback_saved': True,
        'raw_gpt_response': raw_answer,
        'evaluated_date': str(target_date),
    }, status=status.HTTP_200_OK)




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

from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from .models import IntakeRecord, IntakeImage
from .serializers import IntakeRecordSerializer, IntakeImageSerializer

def _logical_today():
    now = timezone.localtime()
    return (now.date() if now.hour >= 3 else (now - timezone.timedelta(days=1)).date())

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from django.utils import timezone
from django.conf import settings

from .models import IntakeRecord, IntakeImage, CustomUser  # 모델 경로는 프로젝트 구조에 맞게
from .serializers import UserInfoSerializer  # 이미 사용 중인 걸로 보임

def _today_by_3am_rule():
    now = timezone.localtime()
    date = now.date()
    if now.hour < 3:
        # 새벽 3시 이전은 전날로 귀속
        date = date - timezone.timedelta(days=1)
    return date

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def image_analyze(request):
    """
    이미지 업로드 전용(텍스트는 선택적 note)
    - 프런트: images (여러개), note(옵션)
    - 응답: ingested_count, images[], record
    """
    user = request.user
    files = request.FILES.getlist('images')
    note = request.data.get('note', '').strip()

    if not files:
        return Response({'error': 'No images uploaded.'}, status=400)

    diet_date = _today_by_3am_rule()

    saved_images = []
    for f in files:
        obj = IntakeImage.objects.create(
            user=user,
            image=f,
            note=note,
            date=diet_date,
        )
        saved_images.append({
            'id': obj.id,
            'image': obj.image.url if hasattr(obj.image, 'url') else str(obj.image),
            'note': obj.note,
            'date': obj.date.isoformat(),
            'created_at': obj.created_at.isoformat(),
        })

    # 이미지 업로드 내역을 IntakeRecord에도 기록
    record_text = f"[Image] {len(saved_images)} image(s) uploaded." + (f" Note: {note}" if note else "")
    record = IntakeRecord.objects.create(
        user=user,
        content=record_text,
        date=diet_date,
    )

    return Response({
        'ingested_count': len(saved_images),
        'images': saved_images,
        'record': {
            'id': record.id,
            'content': record.content,
            'date': record.date.isoformat(),
        }
    }, status=200)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def hybrid_analyze(request):
    """
    하이브리드(텍스트 + 이미지)
    - 프런트: images (0개 이상), text(옵션)
    - 응답: images[], record
    """
    user = request.user
    files = request.FILES.getlist('images')
    text = request.data.get('text', '').strip()
    diet_date = _today_by_3am_rule()

    saved_images = []
    for f in files:
        obj = IntakeImage.objects.create(
            user=user,
            image=f,
            note=text,  # 하이브리드에서는 업로드 시 텍스트를 note로도 남김
            date=diet_date,
        )
        saved_images.append({
            'id': obj.id,
            'image': obj.image.url if hasattr(obj.image, 'url') else str(obj.image),
            'note': obj.note,
            'date': obj.date.isoformat(),
            'created_at': obj.created_at.isoformat(),
        })

    # 텍스트/이미지 내용을 IntakeRecord에 합쳐 기록
    parts = []
    if text:
        parts.append(f"Text: {text}")
    if saved_images:
        parts.append(f"Images: {len(saved_images)} uploaded")
    record_text = "[Hybrid] " + " | ".join(parts) if parts else "[Hybrid] (no content)"

    record = IntakeRecord.objects.create(
        user=user,
        content=record_text,
        date=diet_date,
    )

    return Response({
        'images': saved_images,
        'record': {
            'id': record.id,
            'content': record.content,
            'date': record.date.isoformat(),
        }
    }, status=200)