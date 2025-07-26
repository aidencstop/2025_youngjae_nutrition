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

@api_view(['POST'])
def evaluate_daily_intake(request):
    user = request.user
    today = timezone.localtime().date()

    records = IntakeRecord.objects.filter(user=user, date=today)
    if not records.exists():
        return Response({'error': '오늘 식단 기록이 없습니다.'}, status=400)

    all_text = "\n".join([r.content for r in records])

    # 사용자 정보 요약
    profile = UserInfoSerializer(user).data
    prompt = f"""
당신은 건강 전문가입니다. 다음은 사용자의 정보와 오늘의 섭취 내역입니다.

[사용자 정보]
성별: {profile['gender']}, 나이: {profile['age']}, 키: {profile['height']}, 몸무게: {profile['weight']}
질병 보유: {', '.join([k for k,v in profile.items() if k.startswith('has_') and v])}
채식주의자 여부: {profile['is_vegetarian']}
목표: {profile['diet_goal']}

[오늘의 섭취 내용]
{all_text}

다음 세 가지 항목에 대해 평가해주세요. 각 항목은 '예' 또는 '아니오'로만 대답하세요.
1. Macro 구성(탄단지) 균형이 적절한가요?
2. 질병 상황에 맞는 식단인가요?
3. 식단 목표에 부합하나요?
"""

    gpt_response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    answer = gpt_response['choices'][0]['message']['content']

    def extract_score(keyword):
        if keyword in answer and '예' in answer.split(keyword)[1][:10]:
            return True
        return False

    score_macro = extract_score('1.')
    score_disease = extract_score('2.')
    score_goal = extract_score('3.')
    score_total = sum([score_macro, score_disease, score_goal])
    grade_map = {0: 'D', 1: 'C', 2: 'B', 3: 'A'}
    grade = grade_map[score_total]

    # 기존 기록 삭제 후 저장
    DailyHistory.objects.filter(user=user, date=today).delete()
    history = DailyHistory.objects.create(
        user=user,
        date=today,
        total_intake_text=all_text,
        score_macro=score_macro,
        score_disease=score_disease,
        score_goal=score_goal,
        total_grade=grade,
    )

    return Response({
        'grade': grade,
        'score_macro': score_macro,
        'score_disease': score_disease,
        'score_goal': score_goal,
        'intake_summary': all_text,
        'feedback_saved': True,
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
