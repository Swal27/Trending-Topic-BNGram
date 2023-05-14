import tweepy
import sys
import string
import re
from cleantext import clean
import mariadb
from datetime import datetime, timedelta, timezone
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory

mydb = mariadb.connect(
  host="localhost",
  user="root",
  passwd="",
  database="trending_topic"
)

factory = StemmerFactory()
stemmer = factory.create_stemmer()

stop_factory = StopWordRemoverFactory()
stopword = stop_factory.create_stop_word_remover()

temp = []
mycursor = mydb.cursor()
mycursor.execute("SELECT * FROM rawtweet")
myresult = mycursor.fetchall()

for x in myresult:
    hasil = re.sub("@[A-Za-z0-9_]+","", x[2])
    hasil = re.sub("#[A-Za-z0-9_]+","", hasil)
    hasil = re.sub(r'http\S+', '', hasil)
    hasil = re.sub("RT : ", "", hasil)
    hasil = " ".join(hasil.split())
    hasil = clean(hasil, no_emoji=True)
    hasil = hasil.translate(str.maketrans('', '', string.punctuation))
    #stemming
    hasil_stem = stemmer.stem(hasil)

    #stopword
    hasil_stop = stopword.remove(hasil_stem)

    mycursor.execute("UPDATE rawtweet SET text_process = %s WHERE id = %d", (hasil_stop,x[0]))
    mydb.commit()
