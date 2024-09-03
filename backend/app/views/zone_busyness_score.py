from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from app.models import ZoneBusynessScore
from app.serializers import ZoneBusynessScoreSerializer
from app.utils.miscellaneous import to_nearest_hour

from django.http import JsonResponse, HttpResponseBadRequest
from datetime import datetime


class ZoneBusynessScoreView(ListAPIView):
    serializer_class = ZoneBusynessScoreSerializer
    permission_classes = [IsAuthenticated]

    # get busyness scores for specified datetime only
    def get_queryset(self):
        try:
            user_date = self.request.query_params.get('date')
            user_start_time = self.request.query_params.get('service_start_time')
            user_end_time = self.request.query_params.get('service_end_time')

            if not user_date and not user_start_time and not user_end_time:
                return HttpResponseBadRequest('Service date, start time and end time must be provided.')

            try:
                user_date = datetime.strptime(user_date, "%Y-%m-%d").date()
                user_start_time = datetime.strptime(user_start_time, "%H:%M:%S").time()
                user_end_time = datetime.strptime(user_end_time, "%H:%M:%S").time()
            except ValueError:
                return HttpResponseBadRequest('Invalid datetime format.')
            
            start_datetime = to_nearest_hour(datetime.combine(user_date, user_start_time))
            end_datetime = to_nearest_hour(datetime.combine(user_date, user_end_time))
            mid_datetime = start_datetime + (end_datetime - start_datetime) / 2
        except Exception as e:
            return JsonResponse({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return ZoneBusynessScore.objects.filter(hour=mid_datetime)