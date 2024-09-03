from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from app.models import BusinessUnit
from app.serializers import BusinessUnitSerializer


class BusinessUnitView(ModelViewSet):
    serializer_class = BusinessUnitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure businesses only see their own business units
        return BusinessUnit.objects.filter(business=self.request.user)
    
    def perform_create(self, serializer):
        # Set the business field to the authenticated business when adding a new business unit
        serializer.save(business=self.request.user)
    
    def perform_update(self, serializer):
        # Ensure businesses can only update their own business units
        if serializer.instance.business != self.request.user:
            raise PermissionDenied("You do not have permission to edit this business unit.")
        serializer.save()

    def perform_destroy(self, instance):
        # Ensure businesses can only delete their own business units
        if instance.business != self.request.user:
            raise PermissionDenied("You do not have permission to delete this business unit.")
        instance.delete()
