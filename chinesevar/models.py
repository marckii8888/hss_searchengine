from django.db import models

# Create your models here.
class Turn(models.Model):
    speaker = models.CharField(max_length=30)
    sentence = models.CharField(max_length=200)

    def __str__(self):
        return "Speaker: " + self.speaker + " Sentence: " + self.sentence