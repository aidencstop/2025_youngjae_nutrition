from django.test import TestCase
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

class AccountsTests(TestCase):
    def test_create_user(self):
        user = CustomUser.objects.create_user(
            username='testuser',
            password='testpass123',
            name='테스트',
            gender='M',
            age=30,
            height=175.0,
            weight=70.0,
            diet_goal='maintain'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('testpass123'))
