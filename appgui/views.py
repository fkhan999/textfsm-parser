from django.shortcuts import render

from django.contrib.auth.decorators import login_required

# Create your views here.


@login_required(login_url="/admin/login/")
def home(request):
    # obj = TextFsmTemplate.objects.all()
    return render(request, "gui.html", {"obj": None})
