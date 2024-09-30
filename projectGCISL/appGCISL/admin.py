from django.contrib import admin
from .models import GCISLUser, Survey, Choice, Question, Response
from django.apps import apps
GCISLUser = apps.get_model('appGCISL', 'GCISLUser')
Survey = apps.get_model('appGCISL', 'Survey')
Question = apps.get_model('appGCISL', 'Question')
Choice = apps.get_model('appGCISL', 'Choice')
Response = apps.get_model('appGCISL', 'Response')
# Register your models here.

@admin.register(GCISLUser)
class GCISLUserAdmin(admin.ModelAdmin):
    pass

@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    pass

@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    pass

@admin.register(Question)
class QuestioneAdmin(admin.ModelAdmin):
    pass

@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    pass


#################################### Fall 2024 Code

# from django.contrib import admin
# from .models import GCISLUser, Survey, Choice, Question, Response

# @admin.register(GCISLUser)
# class GCISLUserAdmin(admin.ModelAdmin):
#     pass
#     list_display = ('username', 'email')  # Adjust fields as necessary

# @admin.register(Survey)
# class SurveyAdmin(admin.ModelAdmin):
#     list_display = ('title', 'created_at')  # Adjust fields as necessary

# @admin.register(Choice)
# class ChoiceAdmin(admin.ModelAdmin):
#     list_display = ('text', 'question')  # Adjust fields as necessary

# @admin.register(Question)
# class QuestionAdmin(admin.ModelAdmin):
#     list_display = ('text', 'survey')  # Adjust fields as necessary

# @admin.register(Response)
# class ResponseAdmin(admin.ModelAdmin):
#     list_display = ('user', 'survey', 'choice')  # Adjust fields as necessary