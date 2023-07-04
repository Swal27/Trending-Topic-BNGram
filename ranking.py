import json
import mariadb
import os

# Connect to MySQL
mydb = mariadb.connect(
    host="localhost",
    user="root",
    passwd="",
    database="trending_topic"
)

#main folder
main_folder = 'F:/Perkuliahan/Kelas/KKP/ServerSide/Python/dendogram fig'


# Fetch the clusters from JSON file
cluster_file = os.path.join(main_folder, f"clusters.json")
with open(cluster_file, "r") as file:
    clusters = json.load(file)

# Initialize variables to store the highest DF-IDF score and its corresponding cluster
max_dfidf_score = 0.0
max_dfidf_cluster = None

# Retrieve the DF-IDF scores for each bigram in each cluster and find the cluster with the highest score
for cluster_label, bigrams in clusters.items():
    for bigram in bigrams:
        # Retrieve the DF-IDF score from the database
        cursor = mydb.cursor()
        cursor.execute("SELECT dfidf FROM result_tables WHERE bigram = %s", (bigram,))
        dfidf_score = cursor.fetchone()

        if dfidf_score and float(dfidf_score[0]) > max_dfidf_score:
            max_dfidf_score = float(dfidf_score[0])
            max_dfidf_cluster = cluster_label

# Retrieve the unique bigrams in the highest scoring cluster along with their DF-IDF scores
unique_bigrams = set(clusters[max_dfidf_cluster])
cluster_bigrams = []
for bigram in unique_bigrams:
    cursor = mydb.cursor()
    cursor.execute("SELECT dfidf FROM result_tables WHERE bigram = %s", (bigram,))
    dfidf_score = cursor.fetchone()
    dfidf = float(dfidf_score[0]) if dfidf_score else 0.0
    cluster_bigrams.append({"Bigram": bigram, "DF-IDF Score": dfidf})

# Close the database connection
mydb.close()

# Create a dictionary to store the highest DF-IDF cluster, its score, and the joined sentence
cluster_data = {
    "Cluster": max_dfidf_cluster,
    "DF-IDF Score": max_dfidf_score,
    "Bigrams": cluster_bigrams
}

# Combine the cluster data and the joined sentence into a single JSON
result = {
    "Cluster Ranking": cluster_data,
    "Joined Sentence": " ".join(bigram["Bigram"] for bigram in cluster_bigrams)
}

# Save the result as JSON
result_file = os.path.join(main_folder, f"result.json")
with open(result_file, "w") as file:
    json.dump(result, file, indent=4)

print("Result saved as 'dendogram fig/result.json'.")
