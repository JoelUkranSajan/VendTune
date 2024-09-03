from django.views.decorators.http import require_GET
from datetime import datetime
from app.utils.location_recommendation import generate_recommendations
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework import status
from app.utils.miscellaneous import to_nearest_hour

@require_GET
def get_recommendations(request):
    try:
        user_date = request.GET.get('date')
        user_start_time = request.GET.get('service_start_time')
        user_end_time = request.GET.get('service_end_time')
        zone = request.GET.get('zone_id')
        count = request.GET.get('count')

        if not user_date and not user_start_time and not user_end_time and not zone:
            return HttpResponseBadRequest('Service date, start time, end time and general area must be provided.')

        try:
            user_date = datetime.strptime(user_date, "%Y-%m-%d").date()
            user_start_time = datetime.strptime(user_start_time, "%H:%M:%S").time()
            user_end_time = datetime.strptime(user_end_time, "%H:%M:%S").time()
        except ValueError:
            return HttpResponseBadRequest('Invalid datetime format.')
        
        try:
            zone = int(zone)
        except ValueError:
            return HttpResponseBadRequest('Invalid zone.')
        
        if count:
            count = int(count)
            if isinstance(count, int):
                if count < 3: # no less than 3 recommendations
                    count = 3
                elif count > 20: # no more than 20
                    count = 20 
            else:
                count = None
            
        start_datetime = to_nearest_hour(datetime.combine(user_date, user_start_time))
        end_datetime = to_nearest_hour(datetime.combine(user_date, user_end_time))
        mid_datetime = to_nearest_hour(start_datetime + (end_datetime - start_datetime) / 2)

        # Generate recommendations
        try:
            recommendations = generate_recommendations(start_datetime, mid_datetime, end_datetime, zone, count)
        except Exception as e:
            return JsonResponse({'Recommendations Generation Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return JsonResponse(recommendations.to_json(), safe=False, status=status.HTTP_200_OK)

    except Exception as e:
        return JsonResponse({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)