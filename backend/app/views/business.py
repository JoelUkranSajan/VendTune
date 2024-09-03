from rest_framework import generics
from rest_framework.permissions import AllowAny

from app.models import Business
from app.serializers import BusinessSerializer


class RegisterBusinessView(generics.CreateAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [AllowAny]