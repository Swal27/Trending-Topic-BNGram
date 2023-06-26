import numpy as np
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster
from scipy.spatial.distance import squareform
import os
import json
import mariadb

mydb = mariadb.connect(
    host="localhost",
    user="root",
    passwd="",
    database="trending_topic"
)

cursor = mydb.cursor()

# Fetch the dataset from the table raw_tweet and attribute text_process
cursor.execute("SELECT text_process FROM rawtweet")
dataset = [row[0] for row in cursor.fetchall()]

# Fetch the bigrams from the table result_table and attribute bigram
cursor.execute("SELECT bigram FROM result_table")
bigrams = [tuple(row[0].split()) for row in cursor.fetchall()]

# Close the database connection
mydb.close()

# Create the tweet-bigram matrix
n_tweets = len(dataset)
n_bigrams = len(bigrams)
tweet_bigram_matrix = np.zeros((n_tweets, n_bigrams), dtype=int)

# Populate the tweet-bigram matrix
for i, tweet in enumerate(dataset):
    for j, bigram in enumerate(bigrams):
        if all(word in tweet for word in bigram):
            tweet_bigram_matrix[i, j] = 1

# Compute the group average linkage distances
dist_matrix = np.zeros((n_bigrams, n_bigrams))
for i in range(n_bigrams):
    for j in range(i + 1, n_bigrams):
        a = ((tweet_bigram_matrix[:, i] > 0) & (tweet_bigram_matrix[:, j] > 0)).sum()
        b = (tweet_bigram_matrix[:, i] > 0).sum()
        c = (tweet_bigram_matrix[:, j] > 0).sum()
        dist = 1 - a / min(b, c)
        dist_matrix[i, j] = dist
        dist_matrix[j, i] = dist

# Specify the folder path to save the dendrogram figures
output_folder = "C:/Users/ACER/Documents/Kuliah/Semester 6/KKP/Trending Topic/dendogram fig"

# Convert the distance matrix to a condensed form
condensed_dist_matrix = squareform(dist_matrix)

# Compute the linkage matrix
Z = linkage(condensed_dist_matrix, method='average')

# Plot and save the last iteration dendrogram
last_iteration = n_bigrams - 1
fig, ax = plt.subplots(figsize=(8, 6))
dendrogram(Z, labels=[f"{bigram[0]} {bigram[1]}" for bigram in bigrams], ax=ax)
plt.title(f"Hierarchical Diagram (Iteration: {last_iteration})")
plt.xlabel("Bigrams")
plt.ylabel("Distance")
plt.tight_layout()
output_file = os.path.join(output_folder, f"dendrogram_{last_iteration}.png")
plt.savefig(output_file)
plt.close()

# Determine the clustering labels at the 2136th iteration
num_clusters = 2
labels = fcluster(Z, num_clusters, criterion='maxclust', depth=2136)

# Create a dictionary to store the clusters at the 2136th iteration
clusters = {}
for i, bigram in enumerate(bigrams):
    cluster_label = labels[i]
    if cluster_label not in clusters:
        clusters[cluster_label] = []
    clusters[cluster_label].append(bigram)

# Go back one iteration
previous_iteration = last_iteration - 1

# Plot and save the previous iteration dendrogram with a larger image size
fig, ax = plt.subplots(figsize=(16, 12))
dendrogram(Z, labels=[f"{bigram[0]} {bigram[1]}" for bigram in bigrams], ax=ax, truncate_mode='lastp', p=previous_iteration)
plt.title(f"Hierarchical Diagram (Iteration: {previous_iteration})")
plt.xlabel("Bigrams")
plt.ylabel("Distance")
plt.tight_layout()
output_file = os.path.join(output_folder, f"dendrogram_{previous_iteration}.png")
plt.savefig(output_file, dpi=300)  # Increase the DPI for higher resolution
plt.close()

print(f"Previous iteration dendrogram saved as dendrogram_{previous_iteration}.png with a larger image size.")

# Retrieve the clustering labels at the previous iteration
previous_labels = fcluster(Z, previous_iteration, criterion='maxclust')

# Create a dictionary to store the clusters at the previous iteration
previous_clusters = {}
for i, bigram in enumerate(bigrams):
    cluster_label = previous_labels[i]
    if cluster_label not in previous_clusters:
        previous_clusters[cluster_label] = []
    previous_clusters[cluster_label].append(bigram)

# Create a dictionary to store the previous clusters data
previous_clusters_data = {}
for i, cluster in previous_clusters.items():
    cluster_label = f"Cluster {i}"
    previous_clusters_data[cluster_label] = [f"{bigram[0]} {bigram[1]}" for bigram in cluster]

# Save the previous clusters data as JSON
previous_json_output_file = os.path.join(output_folder, "previous_clusters_data.json")
with open(previous_json_output_file, "w") as file:
    json.dump(previous_clusters_data, file, indent=4)

print("Previous clusters data exported as JSON successfully.")
