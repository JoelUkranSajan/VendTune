from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from app.models import Event
from app.serializers import EventSerializer
from rest_framework.filters import OrderingFilter, SearchFilter
from app.pagination import Pagination
from app.filters import EventFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now
from datetime import timedelta,datetime

class EventView(ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = EventFilter
    pagination_class = Pagination
    search_fields = ['event_name']
    ordering_fields = ['start', 'end']
    ordering = ['-start', '-end']

    # http://127.0.0.1:8000/api/event/recent/?days=1
    @action(detail=False, methods=['get'])
    def recent(self, request):
        days = request.query_params.get('days', 7)
        try:
            days = int(days)
        except ValueError:
            return Response({'error': 'Invalid value for days'})
        start_date = now() - timedelta(days=days)
        recent_events = self.queryset.filter(start__gte=start_date, start__lte=now()).order_by('-start')
        serializer = self.get_serializer(recent_events, many=True)
        return Response(serializer.data)


    # http://127.0.0.1:8000/api/event/today
    @action(detail=False, methods=['get'])
    def today(self, request):
        start_date = datetime.combine(now().date(), datetime.min.time())
        end_date = datetime.combine(now().date(), datetime.max.time())
        today_events = self.queryset.filter(start__gte=start_date, start__lte=end_date).order_by('-start')
        serializer = self.get_serializer(today_events, many=True)
        return Response(serializer.data)


    # http://127.0.0.1:8000/api/event/future/?days=1
    @action(detail=False, methods=['get'])
    def future(self, request):
        days = request.query_params.get('days', 7)
        try:
            days = int(days)
        except ValueError:
            return Response({'error': 'Invalid value for days'})
        end_date = now() + timedelta(days=days)
        future_events = self.queryset.filter(start__lte=end_date, start__gte=now()).order_by('start')
        serializer = self.get_serializer(future_events, many=True)
        return Response(serializer.data)
