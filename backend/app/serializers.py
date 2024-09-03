from .models import Business, BusinessUnit, Vendor, Service, Log, ServiceVendor, ZonedStreet, Restriction, ZoneBusynessScore, StreetBusynessScore, Event
from rest_framework import serializers

class BusinessSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Business
        fields = ["business_name", "business_email", "password"]
        extra_kwargs = {
            "password":  {"write_only": True}
        }
    
    def create(self, validated_data):
        return Business.objects.create_user(**validated_data)


class BusinessUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUnit
        fields = ['permit_id', 'unit_name', 'unit_type', 'permit_expiry_date', "business"]
        read_only_fields = ['business']


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['licence_id', 'vendor_name', 'licence_expiry_date', 'vendor_email', 'vendor_phone_number', 'business']
        read_only_fields = ['business']


class ServiceVendorSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.vendor_name', read_only=True)
    vendor_email = serializers.CharField(source='vendor.vendor_email', read_only=True)

    class Meta:
        model = ServiceVendor
        fields = ['service_vendor_id', 'vendor', 'vendor_name', 'vendor_email']


class ServiceSerializer(serializers.ModelSerializer):
    vendors = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=Vendor.objects.all()), write_only=True
    )
    service_vendors = ServiceVendorSerializer(source='servicevendor_set', many=True, read_only=True)

    class Meta:
        model = Service
        fields = ['service_id', 'service_date', 'service_start_time', 'service_end_time', 'location_coords', 'location_address', 'revenue', 'business', 'unit', 'vendors', 'service_vendors']
        read_only_fields = ['service_id', 'business', 'service_vendors']

    def create(self, validated_data):
        vendors_data = validated_data.pop('vendors')
        service = Service.objects.create(**validated_data)
        for vendor in vendors_data:
            ServiceVendor.objects.create(service=service, vendor=vendor)
        return service

    def update(self, instance, validated_data):
        vendors_data = validated_data.pop('vendors', None)
        if vendors_data is not None:
            instance.servicevendor_set.all().delete()
            for vendor in vendors_data:
                ServiceVendor.objects.create(service=instance, vendor=vendor)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = ['business','operation','entity','entity_id','description']
        read_only_fields = ['business']


class RestrictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restriction
        fields = [
            'restriction_street','restriction_fstreet','restriction_tstreet','restriction_street_geometry','restriction_weekday','restriction_ftime','restriction_ttime'
        ]


class ZoneBusynessScoreSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ZoneBusynessScore
        fields = ['score','zone','hour','centroid']


class ZonedStreetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ZonedStreet
        fields = ['street_address','street_geometry','street_centroid','zone_id']


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['event_name','start','end','location']


class StreetBusynessScoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = StreetBusynessScore
        fields = ['zoned_street_centroid', 'hour', 'score', 'zone_id']