import django_filters
from app.models import BusinessUnit, Vendor, Service, Log, ZonedStreet, ZoneBusynessScore, Restriction, Event
from django.contrib.gis.geos import Point, MultiPolygon, MultiLineString
from django.contrib.gis.measure import D
from django.core.exceptions import ValidationError


class BusinessUnitFilter(django_filters.FilterSet):
    '''
    GET http://example.com//api/business_unit/?business=1
    business:Filters by business is equal to 1 

    GET http://example.com//api/business_unit/?unit_name=Central
    unit_name: Filters by name containing "Central".

    GET http://example.com//api/business_unit/?permit_id=ABC123
    permit_id: Filters by license ID exactly matching "ABC123".

    GET http://example.com//api/business_unit/?permit_expiry_date_after=2024-01-01&permit_expiry_date_before=2024-12-31
    permit_expiry_date_after and permit_expiry_date_before: Filters by permit_expiry_date from 2024-01-01 to 2024-12-31.

    GET http://example.com//api/business_unit/?unit_type=Retail
    unit_type: Filters by unit type containing "Retail".
    '''

    business = django_filters.NumberFilter(field_name='business__business_id')
    unit_name = django_filters.CharFilter(lookup_expr='icontains')
    permit_id = django_filters.CharFilter(lookup_expr='iexact')
    permit_expiry_date = django_filters.DateFromToRangeFilter(field_name='permit_expiry_date')
    unit_type = django_filters.CharFilter(lookup_expr='icontains')


    class Meta:
        model = BusinessUnit
        fields = ['unit_name', 'permit_id', 'permit_expiry_date', 'unit_type']



class VendorFilter(django_filters.FilterSet):
    '''
    GET http://example.com//api/vendor/?vendor_name=John
    vendor_name: Filters by name containing "John".

    GET http://example.com//api/vendor/?licence_id=LIC123
    licence_id: Filters by license ID exactly matching "LIC123".

    GET http://example.com//api/vendor/?licence_expiry_date_after=2024-01-01&licence_expiry_date_before=2024-12-31
    licence_expiry_date_after and licence_expiry_date_before: Filters by licence_expiry_date from 2024-01-01 to 2024-12-31.

    GET http://example.com//api/vendor/?vendor_email=example.com
    vendor_email: Filters by email containing "example.com".

    GET http://example.com//api/vendor/?vendor_phone_number=1234
    vendor_phone_number: Filter by phone number containing "1234".
    '''

    business = django_filters.NumberFilter(field_name='business__business_id')
    vendor_name = django_filters.CharFilter(lookup_expr='icontains')
    licence_id = django_filters.CharFilter(lookup_expr='iexact')
    licence_expiry_date = django_filters.DateFromToRangeFilter(field_name='licence_expiry_date')
    vendor_email = django_filters.CharFilter(lookup_expr='icontains')
    vendor_phone_number = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Vendor
        fields = ['vendor_name', 'licence_id', 'licence_expiry_date', 'vendor_email', 'vendor_phone_number']


class ServiceFilter(django_filters.FilterSet):
    '''
    GET http://example.com//api/service/?unit=1
    unit:Filter records where unit equals 1

    GET http://example.com//api/service/?service_date_after=2024-01-01&service_date_before=2024-12-31
    service_date_after and service_date_before: Filters by service_date from 2024-01-01 to 2024-12-31.

    GET http://example.com//api/service/?service_start_time_after=08:00&service_start_time_before=10:00
    service_start_time_after and service_start_time_before: Filters by service_start_time from 8:00 to 10:00.

    GET http://example.com//api/service/?service_end_time_after=16:00&service_end_time_before=18:00
    service_end_time_after and service_end_time_before: Filters by service_end_time from 16:00 to 18:00.

    GET http://example.com//api/service/?location_coords=40.7128,-74.0060,10
    Search for services located at latitude 40.7128, longitude -74.0060 with a radius of 10 km

    GET http://example.com//api/service/?location_address=Main%20Street
    location_address: Filter by location_address containing "Main Street".
    '''
    
    business = django_filters.NumberFilter(field_name='business__business_id')

    unit = django_filters.NumberFilter(field_name='unit__unit_id')
    service_date = django_filters.DateFromToRangeFilter(field_name='service_date')
    service_start_time_after = django_filters.TimeFilter(field_name='service_start_time', lookup_expr='gte')
    service_start_time_before = django_filters.TimeFilter(field_name='service_start_time', lookup_expr='lte')
    service_end_time_after = django_filters.TimeFilter(field_name='service_end_time', lookup_expr='gte')
    service_end_time_before = django_filters.TimeFilter(field_name='service_end_time', lookup_expr='lte')
    location_coords = django_filters.CharFilter(method='filter_location_coords')
    location_address = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Service
        fields = ['unit', 'service_date', 'service_start_time_after', 'service_start_time_before', 'service_end_time_after', 'service_end_time_before', 'location_coords', 'location_address']

    def filter_location_coords(self, queryset, name, value):
        try:
            lat, lng = map(float, value.split(','))
            point = Point(lng, lat)
            return queryset.filter(location_coords__distance_lte=(point, D(m=10)))  # 10 meters radius
        except Exception as e:
            raise ValidationError(f'Invalid location_coords format: {e}')

class LogFilter(django_filters.FilterSet):
    '''
    GET http://example.com//api/log/?operation=selling
    operation: Filter by operation containing "selling".

    GET http://example.com//api/log/?entity=user
    entity: Filter by operation containing "user".

    GET http://example.com//api/log/?entity_id=123
    entity_id: Filter entity_id where entity_id equals 123

    GET http://example.com//api/log/?description=good
    description:Filter by description containing "good".

    GET http://example.com//api/log/?timestamp_after=2024-01-01T00:00:00&timestamp_before=2024-12-31T23:59:59
    timestamp: Filters by service_end_time from from 2024-01-01 00:00:00 to 2024-12-31 23:59:59.

    "T" is a delimiter used to separate the date and time parts
    '''

    business = django_filters.NumberFilter(field_name='business__business_id')

    operation = django_filters.CharFilter(lookup_expr='icontains')
    entity = django_filters.CharFilter(lookup_expr='icontains')
    entity_id = django_filters.NumberFilter()
    description = django_filters.CharFilter(lookup_expr='icontains')
    timestamp = django_filters.DateTimeFromToRangeFilter(field_name='timestamp')

    class Meta:
        model = Log
        fields = ['operation', 'entity', 'entity_id', 'description', 'timestamp']


class ZonedStreetFilter(django_filters.FilterSet):
    '''
    GET http://example.com/api/zoned_street/?street_address=Main

    GET http://example.com/api/zoned_street/?street_geometry=MULTILINESTRING((...))

    GET http://example.com/api/zoned_street/?street_centroid=12.34,56.78

    GET http://example.com/api/zoned_street/?zone_id=1

    GET http://example.com/api/zoned_street/?zone_name=Central

    GET http://example.com/api/zoned_street/?zone_geometry=MULTIPOLYGON((...))

    '''

    street_address = django_filters.CharFilter(lookup_expr='icontains')
    street_geometry = django_filters.CharFilter(method='filter_street_geometry')
    street_centroid = django_filters.CharFilter(method='filter_street_centroid')
    zone_id = django_filters.NumberFilter(field_name='zone_id')
    zone_name = django_filters.CharFilter(lookup_expr='icontains')
    zone_geometry = django_filters.CharFilter(method='filter_zone_geometry')

    class Meta:
        model = ZonedStreet
        fields = ['street_address', 'street_geometry', 'street_centroid', 'zone_id', 'zone_name', 'zone_geometry']

    def filter_street_geometry(self, queryset, name, value):
        try:
            # Assuming value is in WKT format or similar
            geom = MultiLineString(value)
            return queryset.filter(street_geometry=geom)
        except Exception as e:
            raise ValidationError(f'Invalid geometry format: {e}')

    def filter_street_centroid(self, queryset, name, value):
        try:
            lat, lng = map(float, value.split(','))
            point = Point(lng, lat)
            return queryset.filter(street_centroid=point)
        except Exception as e:
            raise ValidationError(f'Invalid centroid format: {e}')

    def filter_zone_geometry(self, queryset, name, value):
        try:
            # Assuming value is in WKT format or similar
            geom = MultiPolygon(value)
            return queryset.filter(zone_geometry=geom)
        except Exception as e:
            raise ValidationError(f'Invalid geometry format: {e}')


class RestrictionFilter(django_filters.FilterSet):
    '''
    GET http://example.com/api/restriction/?restriction_street=Main

    GET http://example.com/api/restriction/?restriction_fstreet=First

    GET http://example.com/api/restriction/?restriction_tstreet=Third

    GET http://example.com/api/restriction/?restriction_weekday=Monday

    GET http://example.com/api/restriction/?restriction_ftime_after=08:00:00&restriction_ftime_before=17:00:00

    GET http://example.com/api/restriction/?restriction_ttime_after=09:00:00&restriction_ttime_before=18:00:00

    GET http://example.com/api/restriction/?restriction_street_geometry=MULTILINESTRING((...))

    '''

    restriction_street = django_filters.CharFilter(lookup_expr='icontains')
    restriction_fstreet = django_filters.CharFilter(lookup_expr='icontains')
    restriction_tstreet = django_filters.CharFilter(lookup_expr='icontains')
    restriction_weekday = django_filters.CharFilter(lookup_expr='icontains')
    restriction_ftime = django_filters.TimeRangeFilter()
    restriction_ttime = django_filters.TimeRangeFilter()
    restriction_street_geometry = django_filters.CharFilter(method='filter_restriction_street_geometry')

    class Meta:
        model = Restriction
        fields = [
            'restriction_street','restriction_fstreet','restriction_tstreet','restriction_weekday','restriction_ftime','restriction_ttime','restriction_street_geometry',
        ]

    def filter_restriction_street_geometry(self, queryset, name, value):
        try:
            # Assuming value is in WKT format or similar
            geom = MultiLineString(value)
            return queryset.filter(restriction_street_geometry=geom)
        except Exception as e:
            raise ValidationError(f'Invalid geometry format: {e}')


class BusynessScoreFilter(django_filters.FilterSet):
    '''
    GET http://example.com/api/busyness_score/?score_gt=20

    GET http://example.com/api/busyness_score/?score_lt=10

    GET http://example.com/api/busyness_score/?zone=1

    GET http://example.com/api/busyness_score/?hour_after=2024-07-01T00:00:00&hour_before=2024-07-07T23:59:59

    GET http://example.com/api/busyness_score/?centroid=40.7128,-74.0060

    '''

    score_gt = django_filters.NumberFilter(field_name='score', lookup_expr='gt')
    score_lt = django_filters.NumberFilter(field_name='score', lookup_expr='lt')
    zone = django_filters.NumberFilter()
    hour = django_filters.DateTimeFromToRangeFilter()
    centroid = django_filters.CharFilter(method='filter_centroid')

    class Meta:
        model = ZoneBusynessScore
        fields = [
            'score_gt','score_lt','zone','hour','centroid',
        ]

    def filter_centroid(self, queryset, name, value):
        try:
            lat, lng = map(float, value.split(','))
            point = Point(lng, lat, srid=4326)
            return queryset.filter(centroid=point)
        except Exception as e:
            raise ValidationError(f'Invalid centroid format: {e}')


class EventFilter(django_filters.FilterSet):
    '''
    GET http://example.com/api/event/?event_name=concert

    GET http://example.com/api/event/?start_after=2024-08-10T00:00:00&start_before=2024-08-20T23:59:59

    GET http://example.com/api/event/?end_after=2024-08-10T00:00:00&start_before=2024-08-20T23:59:59

    GET http://example.com/api/event/?location=40.7128,-74.0060

    '''

    event_name = django_filters.CharFilter(lookup_expr='icontains')
    start = django_filters.DateTimeFromToRangeFilter()
    end = django_filters.DateTimeFromToRangeFilter()
    location = django_filters.CharFilter(method='filter_location')

    class Meta:
        model = Event
        fields = [
            'event_name','start','end','location',
        ]

    def filter_location(self, queryset, name, value):
        try:
            lat, lng = map(float, value.split(','))
            point = Point(lng, lat, srid=4326)
            return queryset.filter(location=point)
        except Exception as e:
            raise ValidationError(f'Invalid location format: {e}')
