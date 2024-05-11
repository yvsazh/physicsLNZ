from django.shortcuts import render, reverse
from django.http import HttpResponseRedirect
from django.utils import timezone
from .models import *
from django.core.files.base import ContentFile
import base64

def home(request):
    all_projects = Project.objects.filter(privacy = "public").order_by('-creation_date')
    if request.user.is_authenticated:
        projects = all_projects.exclude(user=request.user)
    else:
        projects = all_projects

    return render(request, 'physics/home.html', {'projects': projects})

def my_projects(request):
    if request.user.is_authenticated:
        projects = Project.objects.filter(user = request.user).order_by("-creation_date")
    else:
        projects = None

    return render(request, 'physics/my_projects.html', {'projects': projects})

def create_project(request):
    project = Project.objects.create(
        user = request.user,
        name = "Новий проект",
        privacy = "public",
        preview = "previews/default-preview.jpg",
        creation_date = timezone.now(),
    )

    return HttpResponseRedirect(reverse('physics:project', args=(project.id, )))

def project(request, project_id):
    project = Project.objects.get(id = project_id)

    return render(request, 'physics/project.html', {'project': project})

def projects_of(request, user_id):

    requested_user = User.objects.get(id = user_id)

    projects = Project.objects.order_by('-creation_date').filter(user = requested_user).filter(privacy = "public")

    return render(request, 'physics/projects_of.html', {'projects': projects, "requested_user": requested_user})

def save_project(request, project_id):
    project = Project.objects.get(id = project_id)

    project.data = request.POST['saveWorld']
    project.world_settings_data = request.POST['saveWorldSettings']
    data_url = request.POST['preview']
    image_data = data_url.split(',')[1]
    decoded_image_data = base64.b64decode(image_data)

    project.preview.save(f'preview.jpg', ContentFile(decoded_image_data), save=True)

    project.save()

    return HttpResponseRedirect(reverse('physics:project', args=(project.id, )))



def edit_project(request, project_id):
    project = Project.objects.get(id = project_id)

    project.name = request.POST['name']
    project.privacy = request.POST['privacy']
    project.save()

    return HttpResponseRedirect(reverse('physics:project', args=(project.id, )))

def delete_project(request, project_id):
    project = Project.objects.get(id = project_id)

    project.delete()

    return HttpResponseRedirect(reverse('physics:my_projects'))