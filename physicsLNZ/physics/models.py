from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.signals import post_delete
from django.dispatch import receiver

class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1, related_name='+')
    name = models.CharField("Name of project", max_length = 30)
    data = models.TextField("Data of project", default = "")
    privacy = models.CharField("Privacy", max_length = 40, default="public")
    world_settings_data = models.TextField("World settings data", default = "")
    preview = models.ImageField("Preview of project", upload_to="previews/", default="default-preview.jpg")
    creation_date = models.DateField("Creation date", default = timezone.now())

    def __str__(self):
        return str(self.name)

    def delete(self, *args, **kwargs):
        self.preview.delete()
        super(Project, self).delete(*args, **kwargs)


@receiver(post_delete, sender=Project)
def delete_project_images(sender, instance, **kwargs):
    instance.preview.delete(save=False)