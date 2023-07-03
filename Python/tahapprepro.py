import string
import re
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory

text = "@Bambangmulyonoo Kok mirip dg yg ikut orasi soal pemakzulan Jokowi? Apakah orang yg sama?"
factory = StemmerFactory()
stemmer = factory.create_stemmer()

stop_factory = StopWordRemoverFactory()
stopword = stop_factory.create_stop_word_remover()

hasil = re.sub("@[A-Za-z0-9_]+", "", text)
hasil = re.sub("#[A-Za-z0-9_]+", "", hasil)
hasil = re.sub(r'http\S+', '', hasil)
hasil = re.sub("RT : ", "", hasil)
hasil = " ".join(hasil.split())
hasil = hasil.translate(str.maketrans('', '', string.punctuation))
print("hasil Cleansing: "+hasil)
hasil_stem = stemmer.stem(hasil)
print("hasil stemming: "+hasil_stem)
# stopword
hasil_stop = stopword.remove(hasil_stem)
print("hasil stopword: "+hasil_stop)