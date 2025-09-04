# motivoapp/permissions.py
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow read-only access for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow write access only for admins
        return request.user and request.user.is_staff
