# patients/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import my_patient_record
from .views import (
    register_patient,
    register_staff,
    ProfileView,
    CustomTokenObtainPairView,
    PatientRecordViewSet,
    my_patient_record
)

router = DefaultRouter()
router.register(r'patient-records', PatientRecordViewSet, basename='patient-records')

urlpatterns = [
    path('register/patient/', register_patient, name='register_patient'),
    path('register/staff/', register_staff, name='register_staff'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('patient/my-record/', my_patient_record, name='my_patient_record'),
    path('me/', ProfileView.as_view(), name='me'),
    path('', include(router.urls)),
]

