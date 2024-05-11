from django.urls import path

from . import views

app_name = 'physics'
urlpatterns = [
	path("", views.home, name="home"),
    path("my_projects/", views.my_projects, name="my_projects"),
    path("project/<int:project_id>", views.project, name="project"),
    path("projects_of/<int:user_id>", views.projects_of, name="projects_of"),
    path("save_project/<int:project_id>", views.save_project, name="save_project"),
    path('create_project/', views.create_project, name="create_project"),
    path('delete_project/<int:project_id>', views.delete_project, name="delete_project"),
    path('edit_project/<int:project_id>', views.edit_project, name="edit_project"),
]