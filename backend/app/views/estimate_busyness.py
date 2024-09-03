from django.views.decorators.http import require_GET
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework import status

from app.utils.busyness_estimation import estimate_busyness
from app.utils.miscellaneous import to_nearest_hour

from datetime import datetime


@require_GET
def get_busyness_scores(request):
    try:
        user_date = request.GET.get('date')
        user_start_time = request.GET.get('service_start_time')
        user_end_time = request.GET.get('service_end_time')

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
        mid_datetime = to_nearest_hour(start_datetime + (end_datetime - start_datetime) / 2) 

        # Estimate busyness
        try:
            busyness_scores = estimate_busyness(mid_datetime)
        except Exception as e:
            return JsonResponse({'Busyness Estimation Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return JsonResponse(busyness_scores.to_json(), safe=False, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
