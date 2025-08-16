# patients/views.py
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import PatientRecord
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    PatientRecordSerializer
)

# JWT with Role
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
# patients/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import PatientRecord
from .serializers import PatientRecordSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_patient_record(request):
    try:
        record = PatientRecord.objects.get(user=request.user)
        serializer = PatientRecordSerializer(record)
        return Response(serializer.data)
    except PatientRecord.DoesNotExist:
        return Response({'detail': 'No record found'}, status=404)
# Register
@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def register_patient(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'id': user.id,
            'username': user.username,
            'role': user.role
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def register_staff(request):
    data = request.data.copy()
    data['role'] = 'staff'
    serializer = RegisterSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'id': user.id,
            'username': user.username,
            'role': user.role
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Profile
class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return self.request.user

# Permissions
from rest_framework.permissions import BasePermission
class IsOwnerOrStaff(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return obj.user == request.user or request.user.role == 'staff'

# patients/views.py
class PatientRecordViewSet(viewsets.ModelViewSet):
    serializer_class = PatientRecordSerializer
    permission_classes = [IsAuthenticated]  # ✅ Require login

    def get_queryset(self):
        user = self.request.user
        if user.role == 'staff':
            return PatientRecord.objects.all()
        return PatientRecord.objects.filter(user=user)

    def perform_create(self, serializer):
        # ✅ Always require user
        serializer.save(user=self.request.user)