from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import PermissionDenied

from app.models import Vendor
from app.serializers import VendorSerializer

class VendorView(ModelViewSet):
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure businesses only see their own vendors
        return Vendor.objects.filter(business=self.request.user)
    
    def perform_create(self, serializer):
        # Set the business field to the authenticated business when adding a new vendor
        serializer.save(business=self.request.user)
    
    def perform_update(self, serializer):
        # Ensure users can only update their own vendors
        if serializer.instance.business != self.request.user:
            raise PermissionDenied("You do not have permission to edit this vendor's information.")
        serializer.save()

    def perform_destroy(self, instance):
        # Ensure users can only delete their own vendors
        if instance.business != self.request.user:
            raise PermissionDenied("You do not have permission to remove this vendor.")
        instance.delete()


