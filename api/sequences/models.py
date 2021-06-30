from django.db import models
from django.contrib.postgres.fields import ArrayField
import pandas as pd
import numpy as np
import tensorflow as tf
from django.conf import settings
from tensorflow.keras.models import load_model
import os
import tensorflow.compat.v1 as tfv1 
from keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.utils import to_categorical
from .select_models.encoding import *

# Create your models here
class Sequence(models.Model):
    sequence = models.CharField(max_length=1000, blank=True)
    gamma = models.FloatField(null=False, blank=False, default=1.0)
    classified = ArrayField(models.CharField(max_length=200, blank=True))
    # rank5_classified = ArrayField(ArrayField(models.CharField(max_length=10, null=True, default="unknown", blank=True)))
    # rank5_probability = ArrayField(ArrayField(models.FloatField(default=0.0, null=True, blank=True)))
    # rank5_classified = ArrayField(models.CharField(max_length=10, null=True, default="unknown", blank=True))
    # rank5_probability = ArrayField(models.FloatField(default=0.0, null=True, blank=True))
    modelSelection = ArrayField(models.BooleanField(default=False, null=False, blank=False))
    uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Sequence classified at {}".format(self.uploaded.strftime('%Y-%m-%d %H:%M'))

    def save(self, *args, **kwargs):

        char_dict = create_dict(codes)
        print(char_dict)
        print("Dict Length:", len(char_dict))


        # self.classified = str(settings.BASE_DIR)
        try:
            file_model_list = []
            if self.modelSelection[0]:
                file_model_cnn = os.path.join(settings.BASE_DIR, 'model/bdlstm_model3.h5')
                file_model_list.append(file_model_cnn)
            if self.modelSelection[1]:
                file_model_lstm = os.path.join(settings.BASE_DIR, 'model/protcnn_model2.h5')
                file_model_list.append(file_model_lstm)           
            graph = tfv1.get_default_graph()
            
            with graph.as_default():
                for file_model in file_model_list:
                    if file_model.split('/')[-1] == "bdlstm_model3.h5":
                        MAX_LENGTH = 470
                    elif file_model.split('/')[-1] == "protcnn_model2.h5":
                        MAX_LENGTH = 70
                    model = load_model(file_model)
                    to_pred.extend(self.sequence)
                    encode = integer_encoding(char_dict, to_pred)
                    pad = pad_sequences(encode, maxlen=MAX_LENGTH, padding='post', truncating='post')
                    if file_model.split('/')[-1] == "bdlstm_model3.h5":
                        rank5_index = model.predict(pad).argsort()[0][-5:][::-1]
                    elif file_model.split('/')[-1] == "protcnn_model2.h5":
                        ohe = to_categorical(pad)
                        rank5_index = model.predict(ohe).argsort()[0][-5:][::-1]
                    # rank5_probability = [round(model.predict(ohe)[0][i]*100, 1) for i in rank5_index]
                    rank5_classified = [LABELS[i] for i in rank5_index]
                    # self.classified = str(rank5_classified[0])
                    if file_model.split('/')[-1] == "bdlstm_model3.h5":
                        # self.rank5_classified[0] = rank5_classified
                        # self.rank5_probability[0] = rank5_probability
                        self.classified[0] = str(rank5_classified[0])
                    elif file_model.split('/')[-1] == "protcnn_model2.h5":
                        # self.rank5_classified[1] = rank5_classified
                        # self.rank5_probability[1] = rank5_probability
                        self.classified[1] = str(rank5_classified[0])
                    print(f'classified as {rank5_classified[0]}')
        except Exception as e:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(e).__name__, e.args)
            print(message)
            print('failed to classify')
            self.classified[0] = message
            print("The file does not exist")
        super().save(*args, **kwargs)