from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.core.serializers import serialize
from django.http import JsonResponse

from app.models import Service
from app.serializers import ServiceSerializer, ServiceVendorSerializer, ServiceVendor

from datetime import timedelta
from django.utils.timezone import now

import json


class ServiceView(ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure businesses only see their own services
        return Service.objects.filter(business=self.request.user)
    
    def perform_create(self, serializer):
        # Set the business field to the authenticated business when adding a new service
        serializer.save(business=self.request.user)

    def perform_update(self, serializer):
        # Ensure businesses can only update their own services
        if serializer.instance.business != self.request.user:
            raise PermissionDenied("You do not have permission to edit this service.")
        serializer.save(business=self.request.user)

    def perform_destroy(self, instance):
        # Ensure businesses can only delete their servoces
        if instance.business != self.request.user:
            raise PermissionDenied("You do not have permission to delete this service.")
        instance.servicevendor_set.all().delete()
        instance.delete()

    # by default, get services and associated authorised vendors in JSON format
    def list(self, request):
        services = self.get_queryset()

        days = request.query_params.get('days', None)
        if days:
            try:
                days = int(days)
            except ValueError:
                return Response({'error': 'Invalid value for days'})
                
            if days != 0:    
                limit_date = now() + timedelta(days=days)

                if days < 0:
                    services = services.filter(service_date__gte=limit_date, service_date__lte=now()).order_by('-service_date')
                elif days > 0:
                    services = services.filter(service_date__lte=limit_date, service_date__gte=now()).order_by('service_date')

        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)

    # get services and associated authorised vendores in GeoJSON format
    @action(detail=False, methods=['get'])
    def geojson(self, request):
        services = self.get_queryset()
        
        days = request.query_params.get('days', None)
        if days:
            try:
                days = int(days)
            except ValueError:
                return Response({'error': 'Invalid value for days'})
            
            if days != 0:
                limit_date = now() + timedelta(days=days)
                if days < 0:
                    services = services.filter(service_date__gte=limit_date, service_date__lte=now()).order_by('-service_date')
                elif days > 0:
                    services = services.filter(service_date__lte=limit_date, service_date__gte=now()).order_by('service_date')
            

        geojson_data = serialize('geojson', services, geometry_field='location_coords', fields=(
            'service_date', 'service_start_time', 'service_end_time', 'location_address', 'revenue', 'created_at', 'business', 'unit'))
        
        geojson_dict = json.loads(geojson_data)
        for feature in geojson_dict['features']:
            service_id = feature['id']
            service_vendors = ServiceVendor.objects.filter(service_id=service_id)
            feature['properties']['vendors'] = ServiceVendorSerializer(service_vendors, many=True).data
        
        return JsonResponse(geojson_dict, status=status.HTTP_200_OK)