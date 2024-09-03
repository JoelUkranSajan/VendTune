from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from app.models import Restriction
from app.serializers import RestrictionSerializer

class RestrictionView(ListAPIView):
    queryset = Restriction.objects.all()
    serializer_class = RestrictionSerializer
    permission_classes = [IsAuthenticated]