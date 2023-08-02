import json
import mariadb
import os
from collections import defaultdict
from newspaper import Config, Article, fulltext
from pygooglenews import GoogleNews


# Connect to MySQL
mydb = mariadb.connect(
    host="localhost",
    user="root",
    passwd="",
    database="trending_topic"
)

input_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dendogram fig")
# Fetch the clusters from JSON file
clusters_file = os.path.join(input_folder, "clusters.json")
with open(clusters_file, "r") as file:
    clusters = json.load(file)

# Fetch headline news based on the bigram using newspaper3k
config = Config()
config.memoize_articles = False  # Disable article caching for fresh results

# Initialize variables to store the highest DF-IDF scores and their corresponding clusters
dfidf_clusters = defaultdict(float)

# Retrieve the DF-IDF scores for each bigram in each cluster and store them
for cluster_label, bigrams in clusters.items():
    max_dfidf_score = 0.0
    for bigram in bigrams:
        # Retrieve the DF-IDF score from the database
        cursor = mydb.cursor()
        cursor.execute("SELECT dfidf FROM result_tables WHERE bigram = %s", (bigram,))
        dfidf_score = cursor.fetchone()

        if dfidf_score and float(dfidf_score[0]) > max_dfidf_score:
            max_dfidf_score = float(dfidf_score[0])

    dfidf_clusters[cluster_label] = max_dfidf_score

# Get the top 3 clusters with highest DF-IDF scores
top_clusters = sorted(dfidf_clusters.items(), key=lambda x: x[1], reverse=True)[:3]

cluster_rankings = []

# Retrieve the unique bigrams in the highest scoring clusters along with their DF-IDF scores
for cluster, dfidf_score in top_clusters:
    unique_bigrams = set(clusters[cluster])
    cluster_bigrams = []
    for bigram in unique_bigrams:
        cursor = mydb.cursor()
        cursor.execute("SELECT dfidf FROM result_tables WHERE bigram = %s", (bigram,))
        dfidf_score = cursor.fetchone()
        dfidf = float(dfidf_score[0]) if dfidf_score else 0.0

        search_query = bigram

        # Search for news articles related to the bigram
        gn = GoogleNews(lang='id')  # Using Indonesian language
        search_results = gn.search(search_query)

        # Get the search results
        entries = search_results['entries']

        # Get the first headline
        if entries:
            headline = entries[0]['title']
        else:
            headline = ""

        cluster_bigrams.append({"Bigram": bigram, "DF-IDF Score": dfidf, "Headline": headline})

    cluster_data = {
        "Cluster": cluster,
        "Max DF-IDF Score": dfidf_clusters[cluster],
        "Bigrams": cluster_bigrams
    }

    cluster_rankings.append(cluster_data)

# Close the database connection
mydb.close()

result = {
    "Cluster Rankings": cluster_rankings,
}

# Save the result as JSON
result_file = os.path.join(input_folder, "result.json")
with open(result_file, "w") as file:
    json.dump(result, file, indent=4)

print("Result saved as 'Python/dendogram fig/result.json'.")
