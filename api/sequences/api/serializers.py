from ..models import Sequence
from rest_framework import serializers

class SequenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sequence
        fields = '__all__'