import math
import spacy
import mariadb

# Load spaCy NER model
nlp = spacy.load("en_core_web_trf")

# Connect to MySQL
mydb = mariadb.connect(
  host="localhost",
  user="root",
  passwd="",
  database="trending_topic"
)

# Fetch dataset from MySQL
mycursor = mydb.cursor()
mycursor.execute("SELECT text_process, time_slot FROM rawtweet ORDER BY time_slot")
rows = mycursor.fetchall()

dataset = []
current_timeslot = rows[0][1]
current_doc = []

for row in rows:
    text_process, time_slot = row
    if time_slot != current_timeslot:
        dataset.append(current_doc)
        current_doc = []
        current_timeslot = time_slot
    current_doc.append(text_process)

# Add the last timeslot
dataset.append(current_doc)

result = []
total_documents = len(dataset)

# Calculate DF
df = {}
for i in range(len(dataset)):
    for j in range(len(dataset[i])):
        words = dataset[i][j].split()
        bigrams = [(words[k], words[k + 1]) for k in range(len(words) - 1)]
        for bigram in bigrams:
            if bigram in df:
                if df[bigram][0] == i:
                    df[bigram][1] += 1
                else:
                    df[bigram] = [i, 1]
            else:
                df[bigram] = [i, 1]

for bigram, frequency in df.items():
    print("Bigram:", bigram)
    print("Frequency:", frequency)
    print()

print(len(dataset))
# Calculate IDF and DF-IDF
for i in range(len(dataset)):
    inner_result = []
    for j in range(len(dataset[i])):
        words = dataset[i][j].split()
        bigrams = [(words[k], words[k + 1]) for k in range(len(words) - 1)]
        previous_bigram = 0
        for bigram in bigrams:
            df_score = df[bigram]

            # Apply NER on the bigram
            doc = nlp(" ".join(bigram))
            entity_type = doc.ents[0].label_ if doc.ents else None

            # Apply boost based on entity type
            boost = 1.0
            if entity_type in ["LOC", "PERSON", "ORG"]:
                boost = 1.5

            # Checking how much bigram in previous timeslot
            for x in range(i):
                for y in range(len(dataset[x])):
                    pre_words = dataset[x][y].split()
                    pre_bigrams = [(pre_words[k], pre_words[k + 1]) for k in range(len(pre_words) - 1)]
                    if bigram in pre_bigrams:
                        previous_bigram += 1

            idf_score = math.log10((previous_bigram / len(dataset)) + 1) + 1
            dfidf_score = (((df_score[1] + 1) * boost) / idf_score)
            inner_result.append(
                {"bigram": " ".join(bigram), "df": df_score, "idf": idf_score, "dfidf": dfidf_score, "boost": boost,"previous_bigram": previous_bigram, "ttimeslot": len(dataset)})
    result.append(inner_result)

# Print and insert result into SQL
for i, inner_result in enumerate(result):
    print(f"Timeslot {i + 1}:")
    for item in inner_result:
        print("Bigram:", item["bigram"])
        print("DF:", item["df"])
        print("IDF:", item["idf"])
        print("DF-IDF:", item["dfidf"])
        print("Boost:", item["boost"])
        print("Previous Bigram:", item["previous_bigram"])
        print("Total Timeslot:", item["ttimeslot"])
        print()

        # Insert the result into the database
        insert_query = "INSERT INTO result_table (bigram, df, idf, dfidf, boost, previous_bigram, ttimeslot) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        values = (
            item["bigram"],
            item["df"][1],  # Assuming df is a list [index, frequency]
            item["idf"],
            item["dfidf"],
            item["boost"],
            item["previous_bigram"],
            item["ttimeslot"]
        )
        mycursor.execute(insert_query, values)

    print()

# Commit the changes to the database
mydb.commit()

# Close the database connection
mydb.close()
