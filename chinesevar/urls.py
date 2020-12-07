from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('feed/', views.search, name='search'),
    path('pair/', views.pairs, name='pair'),
    path('<int:turn_id>/', views.search_more, name='search_more'),
]