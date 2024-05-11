from django.shortcuts import render, reverse
from .forms import UserRegistrationForm
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login

def register(request):
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)
        if user_form.is_valid():
            new_user = user_form.save(commit=False)
            new_user.set_password(user_form.cleaned_data['password'])
            new_user.save()

            login(request, new_user)

            return HttpResponseRedirect(reverse('physics:home'))
    else:
        user_form = UserRegistrationForm()
    return render(request, 'account/register.html', {'user_form': user_form})