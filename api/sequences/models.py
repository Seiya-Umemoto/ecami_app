from django.db import models
from django.contrib.postgres.fields import ArrayField
import pandas as pd
import numpy as np
import keras
import tensorflow as tf
from keras.preprocessing.image import img_to_array
from django.conf import settings
from keras.preprocessing import image
from tensorflow.keras.models import load_model
import os
# from tensorflow.python import ops
import tensorflow.compat.v1 as tfv1 
# from tensorflow.keras.applications.inception_resnet_v2 import InceptionResNetV2, decode_predictions, preprocess_input
from keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.utils import to_categorical

# Create your models here.
class Sequence(models.Model):
    sequence = models.CharField(max_length=1000, blank=True)
    gamma = models.FloatField(null=False, blank=False, default=1.0)
    classified = models.CharField(max_length=200, blank=True)
    # rank5_classified = ArrayField(base_field=models.CharField(default='unknown', max_length=10), size=None)
    # rank5_probability = ArrayField(base_field=models.FloatField(default=0.0), size=None)
    rank5_classified = ArrayField(models.CharField(max_length=10, null=True, default="unknown", blank=True))
    rank5_probability = ArrayField(models.FloatField(default=0.0, null=True, blank=True))
    uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "Sequence classified at {}".format(self.uploaded.strftime('%Y-%m-%d %H:%M'))

    def save(self, *args, **kwargs):

        codes = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L',
         'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y']

        def create_dict(codes):
            char_dict = {}
            for index, val in enumerate(codes):
                char_dict[val] = index+1

            return char_dict

        char_dict = create_dict(codes)

        print(char_dict)
        print("Dict Length:", len(char_dict))

        def integer_encoding(data):
            """
            - Encodes code sequence to integer values.
            - 20 common amino acids are taken into consideration
                and rest 4 are categorized as 0.
            """
            
            encode_list = []
            row_encode = []
            for code in data:
                row_encode.append(char_dict.get(code, 0))
            encode_list.append(np.array(row_encode))
            
            return encode_list
 
        LABELS = {0: 'AA0', 1: 'AA1', 2: 'AA10', 3: 'AA11', 4: 'AA12', 5: 'AA13', 6: 'AA14', 7: 'AA15', 8: 'AA1_1', 9: 'AA1_2', 10: 'AA1_3', 11: 'AA2', 12: 'AA3', 13: 'AA3_1', 14: 'AA3_2', 15: 'AA3_3', 16: 'AA3_4', 17: 'AA4', 18: 'AA5', 19: 'AA5_1', 20: 'AA5_2', 21: 'AA6', 22: 'AA7', 23: 'AA8', 24: 'AA9', 25: 'CBM0', 26: 'CBM1', 27: 'CBM10', 28: 'CBM11', 29: 'CBM12', 30: 'CBM13', 31: 'CBM14', 32: 'CBM16', 33: 'CBM17', 34: 'CBM18', 35: 'CBM19', 36: 'CBM2', 37: 'CBM20', 38: 'CBM21', 39: 'CBM22', 40: 'CBM23', 41: 'CBM24', 42: 'CBM25', 43: 'CBM26', 44: 'CBM27', 45: 'CBM28', 46: 'CBM3', 47: 'CBM30', 48: 'CBM32', 49: 'CBM34', 50: 'CBM35', 51: 'CBM36', 52: 'CBM37', 53: 'CBM38', 54: 'CBM39', 55: 'CBM4', 56: 'CBM40', 57: 'CBM41', 58: 'CBM42', 59: 'CBM43', 60: 'CBM44', 61: 'CBM45', 62: 'CBM46', 63: 'CBM47', 64: 'CBM48', 65: 'CBM49', 66: 'CBM5', 67: 'CBM50', 68: 'CBM51', 69: 'CBM52', 70: 'CBM53', 71: 'CBM54', 72: 'CBM55', 73: 'CBM56', 74: 'CBM57', 75: 'CBM58', 76: 'CBM59', 77: 'CBM6', 78: 'CBM60', 79: 'CBM61', 80: 'CBM62', 81: 'CBM63', 82: 'CBM64', 83: 'CBM65', 84: 'CBM66', 85: 'CBM67', 86: 'CBM69', 87: 'CBM70', 88: 'CBM71', 89: 'CBM72', 90: 'CBM73', 91: 'CBM77', 92: 'CBM79', 93: 'CBM8', 94: 'CBM9', 95: 'CE0', 96: 'CE1', 97: 'CE11', 98: 'CE12', 99: 'CE13', 100: 'CE14', 101: 'CE15', 102: 'CE16', 103: 'CE2', 104: 'CE3', 105: 'CE4', 106: 'CE5', 107: 'CE6', 108: 'CE7', 109: 'CE8', 110: 'CE9', 111: 'GH0', 112: 'GH1', 113: 'GH10', 114: 'GH100', 115: 'GH101', 116: 'GH102', 117: 'GH103', 118: 'GH104', 119: 'GH105', 120: 'GH106', 121: 'GH107', 122: 'GH108', 123: 'GH109', 124: 'GH11', 125: 'GH110', 126: 'GH111', 127: 'GH112', 128: 'GH113', 129: 'GH114', 130: 'GH115', 131: 'GH116', 132: 'GH117', 133: 'GH118', 134: 'GH12', 135: 'GH120', 136: 'GH121', 137: 'GH122', 138: 'GH123', 139: 'GH125', 140: 'GH126', 141: 'GH127', 142: 'GH128', 143: 'GH129', 144: 'GH13', 145: 'GH130', 146: 'GH131', 147: 'GH132', 148: 'GH133', 149: 'GH134', 150: 'GH135', 151: 'GH136', 152: 'GH137', 153: 'GH138', 154: 'GH139', 155: 'GH13_1', 156: 'GH13_10', 157: 'GH13_11', 158: 'GH13_12', 159: 'GH13_13', 160: 'GH13_14', 161: 'GH13_15', 162: 'GH13_16', 163: 'GH13_17', 164: 'GH13_18', 165: 'GH13_19', 166: 'GH13_2', 167: 'GH13_20', 168: 'GH13_21', 169: 'GH13_22', 170: 'GH13_23', 171: 'GH13_24', 172: 'GH13_25', 173: 'GH13_26', 174: 'GH13_27', 175: 'GH13_28', 176: 'GH13_29', 177: 'GH13_3', 178: 'GH13_30', 179: 'GH13_31', 180: 'GH13_32', 181: 'GH13_33', 182: 'GH13_34', 183: 'GH13_35', 184: 'GH13_36', 185: 'GH13_37', 186: 'GH13_38', 187: 'GH13_39', 188: 'GH13_4', 189: 'GH13_40', 190: 'GH13_5', 191: 'GH13_6', 192: 'GH13_7', 193: 'GH13_8', 194: 'GH13_9', 195: 'GH14', 196: 'GH140', 197: 'GH141', 198: 'GH142', 199: 'GH143', 200: 'GH144', 201: 'GH145', 202: 'GH146', 203: 'GH147', 204: 'GH148', 205: 'GH149', 206: 'GH15', 207: 'GH150', 208: 'GH151', 209: 'GH152', 210: 'GH16', 211: 'GH17', 212: 'GH18', 213: 'GH19', 214: 'GH2', 215: 'GH20', 216: 'GH22', 217: 'GH23', 218: 'GH24', 219: 'GH25', 220: 'GH26', 221: 'GH27', 222: 'GH28', 223: 'GH29', 224: 'GH3', 225: 'GH30', 226: 'GH30_1', 227: 'GH30_2', 228: 'GH30_3', 229: 'GH30_4', 230: 'GH30_5', 231: 'GH30_7', 232: 'GH30_8', 233: 'GH30_9', 234: 'GH31', 235: 'GH32', 236: 'GH33', 237: 'GH34', 238: 'GH35', 239: 'GH36', 240: 'GH37', 241: 'GH38', 242: 'GH39', 243: 'GH4', 244: 'GH42', 245: 'GH43', 246: 'GH43_1', 247: 'GH43_10', 248: 'GH43_11', 249: 'GH43_12', 250: 'GH43_13', 251: 'GH43_14', 252: 'GH43_16', 253: 'GH43_17', 254: 'GH43_18', 255: 'GH43_19', 256: 'GH43_2', 257: 'GH43_21', 258: 'GH43_22', 259: 'GH43_23', 260: 'GH43_24', 261: 'GH43_26', 262: 'GH43_27', 263: 'GH43_28', 264: 'GH43_29', 265: 'GH43_3', 266: 'GH43_30', 267: 'GH43_31', 268: 'GH43_32', 269: 'GH43_33', 270: 'GH43_34', 271: 'GH43_35', 272: 'GH43_36', 273: 'GH43_37', 274: 'GH43_4', 275: 'GH43_5', 276: 'GH43_6', 277: 'GH43_8', 278: 'GH43_9', 279: 'GH44', 280: 'GH45', 281: 'GH46', 282: 'GH47', 283: 'GH48', 284: 'GH49', 285: 'GH5', 286: 'GH50', 287: 'GH51', 288: 'GH52', 289: 'GH53', 290: 'GH54', 291: 'GH55', 292: 'GH56', 293: 'GH57', 294: 'GH58', 295: 'GH59', 296: 'GH5_1', 297: 'GH5_10', 298: 'GH5_11', 299: 'GH5_12', 300: 'GH5_13', 301: 'GH5_14', 302: 'GH5_15', 303: 'GH5_16', 304: 'GH5_17', 305: 'GH5_18', 306: 'GH5_19', 307: 'GH5_2', 308: 'GH5_20', 309: 'GH5_21', 310: 'GH5_22', 311: 'GH5_23', 312: 'GH5_24', 313: 'GH5_25', 314: 'GH5_26', 315: 'GH5_27', 316: 'GH5_28', 317: 'GH5_29', 318: 'GH5_31', 319: 'GH5_33', 320: 'GH5_36', 321: 'GH5_37', 322: 'GH5_38', 323: 'GH5_39', 324: 'GH5_4', 325: 'GH5_40', 326: 'GH5_41', 327: 'GH5_42', 328: 'GH5_43', 329: 'GH5_44', 330: 'GH5_45', 331: 'GH5_46', 332: 'GH5_48', 333: 'GH5_49', 334: 'GH5_5', 335: 'GH5_50', 336: 'GH5_51', 337: 'GH5_52', 338: 'GH5_7', 339: 'GH5_8', 340: 'GH5_9', 341: 'GH6', 342: 'GH62', 343: 'GH63', 344: 'GH64', 345: 'GH65', 346: 'GH66', 347: 'GH67', 348: 'GH68', 349: 'GH7', 350: 'GH70', 351: 'GH71', 352: 'GH72', 353: 'GH73', 354: 'GH74', 355: 'GH75', 356: 'GH76', 357: 'GH77', 358: 'GH78', 359: 'GH79', 360: 'GH8', 361: 'GH80', 362: 'GH81', 363: 'GH82', 364: 'GH83', 365: 'GH84', 366: 'GH85', 367: 'GH86', 368: 'GH87', 369: 'GH88', 370: 'GH89', 371: 'GH9', 372: 'GH90', 373: 'GH91', 374: 'GH92', 375: 'GH93', 376: 'GH94', 377: 'GH95', 378: 'GH97', 379: 'GH99', 380: 'GT0', 381: 'GT1', 382: 'GT10', 383: 'GT100', 384: 'GT101', 385: 'GT102', 386: 'GT104', 387: 'GT105', 388: 'GT11', 389: 'GT12', 390: 'GT13', 391: 'GT14', 392: 'GT15', 393: 'GT16', 394: 'GT17', 395: 'GT18', 396: 'GT19', 397: 'GT2', 398: 'GT20', 399: 'GT21', 400: 'GT22', 401: 'GT23', 402: 'GT24', 403: 'GT25', 404: 'GT26', 405: 'GT27', 406: 'GT28', 407: 'GT29', 408: 'GT3', 409: 'GT30', 410: 'GT31', 411: 'GT32', 412: 'GT33', 413: 'GT34', 414: 'GT35', 415: 'GT37', 416: 'GT38', 417: 'GT39', 418: 'GT4', 419: 'GT40', 420: 'GT41', 421: 'GT42', 422: 'GT43', 423: 'GT44', 424: 'GT45', 425: 'GT47', 426: 'GT48', 427: 'GT49', 428: 'GT5', 429: 'GT50', 430: 'GT51', 431: 'GT52', 432: 'GT53', 433: 'GT54', 434: 'GT55', 435: 'GT56', 436: 'GT57', 437: 'GT58', 438: 'GT59', 439: 'GT6', 440: 'GT60', 441: 'GT61', 442: 'GT62', 443: 'GT63', 444: 'GT64', 445: 'GT65', 446: 'GT66', 447: 'GT67', 448: 'GT68', 449: 'GT69', 450: 'GT7', 451: 'GT70', 452: 'GT71', 453: 'GT72', 454: 'GT73', 455: 'GT74', 456: 'GT75', 457: 'GT76', 458: 'GT77', 459: 'GT79', 460: 'GT8', 461: 'GT80', 462: 'GT81', 463: 'GT82', 464: 'GT83', 465: 'GT84', 466: 'GT85', 467: 'GT87', 468: 'GT88', 469: 'GT89', 470: 'GT9', 471: 'GT90', 472: 'GT91', 473: 'GT92', 474: 'GT94', 475: 'GT95', 476: 'GT96', 477: 'GT98', 478: 'GT99', 479: 'PL0', 480: 'PL1', 481: 'PL10', 482: 'PL10_1', 483: 'PL10_2', 484: 'PL10_3', 485: 'PL11', 486: 'PL11_1', 487: 'PL11_2', 488: 'PL12', 489: 'PL12_1', 490: 'PL12_2', 491: 'PL12_3', 492: 'PL13', 493: 'PL14', 494: 'PL14_1', 495: 'PL14_2', 496: 'PL14_3', 497: 'PL15', 498: 'PL15_1', 499: 'PL15_2', 500: 'PL16', 501: 'PL17', 502: 'PL17_1', 503: 'PL17_2', 504: 'PL1_1', 505: 'PL1_10', 506: 'PL1_11', 507: 'PL1_12', 508: 'PL1_13', 509: 'PL1_2', 510: 'PL1_3', 511: 'PL1_4', 512: 'PL1_5', 513: 'PL1_6', 514: 'PL1_7', 515: 'PL1_8', 516: 'PL2', 517: 'PL20', 518: 'PL21', 519: 'PL22', 520: 'PL22_1', 521: 'PL22_2', 522: 'PL23', 523: 'PL24', 524: 'PL25', 525: 'PL26', 526: 'PL27', 527: 'PL28', 528: 'PL2_1', 529: 'PL2_2', 530: 'PL3', 531: 'PL3_1', 532: 'PL3_2', 533: 'PL3_3', 534: 'PL3_4', 535: 'PL3_5', 536: 'PL4', 537: 'PL4_1', 538: 'PL4_2', 539: 'PL4_3', 540: 'PL4_4', 541: 'PL5', 542: 'PL5_1', 543: 'PL6', 544: 'PL6_1', 545: 'PL6_2', 546: 'PL6_3', 547: 'PL7', 548: 'PL7_1', 549: 'PL7_2', 550: 'PL7_3', 551: 'PL7_4', 552: 'PL7_5', 553: 'PL8', 554: 'PL8_1', 555: 'PL8_2', 556: 'PL8_3', 557: 'PL9', 558: 'PL9_1', 559: 'PL9_2', 560: 'PL9_3', 561: 'PL9_4'}
        MAX_LENGTH = 70
        to_pred = []
        self.classified = str(settings.BASE_DIR)
        try:
            file_model = os.path.join(settings.BASE_DIR, 'model/protcnn_model2.h5')
            graph = tfv1.get_default_graph()
            
            with graph.as_default():
                model = load_model(file_model)
                to_pred.extend(self.sequence)
                encode = integer_encoding(to_pred)
                pad = pad_sequences(encode, maxlen=MAX_LENGTH, padding='post', truncating='post')
                ohe = to_categorical(pad)
                # print(dict(zip(LABELS, np.squeeze(model.predict(to_pred)).tolist())))
                # pred = LABELS[np.argmax(model.predict(to_pred))]
                # pred = LABELS[np.argmax(model.predict(ohe))]
                rank5_index = model.predict(ohe).argsort()[0][-5:][::-1]
                rank5_probability = [round(model.predict(ohe)[0][i]*100, 1) for i in rank5_index]
                rank5_classified = [LABELS[i] for i in rank5_index]
                self.classified = str(rank5_classified[0])
                self.rank5_classified = rank5_classified
                self.rank5_probability = rank5_probability
                print(f'classified as {rank5_classified[0]}')
        except Exception as e:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(e).__name__, e.args)
            print(message)
            print('failed to classify')
            self.classified = 'failed to classify'
        else:
            print("The file does not exist")
        super().save(*args, **kwargs)