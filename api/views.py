from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from io import StringIO
import json, textfsm

# Create your views here.
@api_view(["POST"])
def textfsm_parser(request):
    try:
        data = request.data
        template_text = data["fsmtxt"]
        input_text = data["inputtext"]
        print("tem>>>>>>>>>>>>>>>>",template_text)
        template = textfsm.TextFSM(StringIO(template_text))
        if data["fsmmode"] == "true":
            parsed_content = {
                "headers": template.header,
                "values": template.ParseText(input_text),
            }
        else:
            parsed_content = template.ParseTextToDicts(input_text)
    except Exception as e:
        return Response({"error": str(e)})
    return Response(parsed_content)