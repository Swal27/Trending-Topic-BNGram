import numpy as np
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster
from scipy.spatial.distance import squareform
import os
import json
import mariadb
import subprocess

def fetch_dataset_from_database():
    # Connect to the database and fetch the dataset
    mydb = mariadb.connect(
        host="localhost",
        user="root",
        passwd="",
        database="trending_topic"
    )
    cursor = mydb.cursor()
    cursor.execute("SELECT text_process FROM rawtweets")
    dataset = [row[0] for row in cursor.fetchall()]
    mydb.close()
    return dataset

def fetch_bigrams_from_database():
    # Connect to the database and fetch the bigrams
    mydb = mariadb.connect(
        host="localhost",
        user="root",
        passwd="",
        database="trending_topic"
    )
    cursor = mydb.cursor()
    cursor.execute("SELECT bigram FROM result_tables")
    bigrams = [tuple(row[0].split()) for row in cursor.fetchall()]
    mydb.close()
    return bigrams

def create_tweet_bigram_matrix(dataset, bigrams):
    # Create the tweet-bigram matrix
    n_tweets = len(dataset)
    n_bigrams = len(bigrams)
    tweet_bigram_matrix = np.zeros((n_tweets, n_bigrams), dtype=int)

    # Populate the tweet-bigram matrix
    for i, tweet in enumerate(dataset):
        for j, bigram in enumerate(bigrams):
            if all(word in tweet for word in bigram):
                tweet_bigram_matrix[i, j] = 1

    return tweet_bigram_matrix

def generate_dendrogram(tweet_bigram_matrix, bigrams, output_folder):
    # Compute the group average linkage distances
    dist_matrix = np.zeros((len(bigrams), len(bigrams)))
    for i in range(len(bigrams)):
        for j in range(i + 1, len(bigrams)):
            a = ((tweet_bigram_matrix[:, i] > 0) & (tweet_bigram_matrix[:, j] > 0)).sum()
            b = (tweet_bigram_matrix[:, i] > 0).sum()
            c = (tweet_bigram_matrix[:, j] > 0).sum()
            dist = 1 - a / min(b, c)
            dist_matrix[i, j] = dist
            dist_matrix[j, i] = dist

    # Convert the distance matrix to a condensed form
    condensed_dist_matrix = squareform(dist_matrix)

    # Compute the linkage matrix
    Z = linkage(condensed_dist_matrix, method='average')

    # Plot and save the dendrogram
    last_iteration = len(bigrams) - 1
    fig, ax = plt.subplots(figsize=(8, 6))
    dendrogram(Z, labels=[f"{bigram[0]} {bigram[1]}" for bigram in bigrams], ax=ax)
    plt.title(f"Hierarchical Diagram (Iteration: {last_iteration})")
    plt.xlabel("Bigrams")
    plt.ylabel("Distance")
    plt.tight_layout()
    output_file = os.path.join(output_folder, f"dendrogram.png")
    plt.savefig(output_file)
    plt.close()

    return Z

def extract_clusters_at_iteration(Z, bigrams, iteration):
    # Determine the clustering labels at the specified iteration
    labels = fcluster(Z, iteration, criterion='maxclust')

    # Create a dictionary to store the clusters at the specified iteration
    clusters = {}
    for i, bigram in enumerate(bigrams):
        cluster_label = labels[i]
        if cluster_label not in clusters:
            clusters[cluster_label] = []
        clusters[cluster_label].append(bigram)

    return clusters

def save_clusters_as_json(clusters, output_folder, filename):
    # Create a dictionary to store the cluster data
    cluster_data = {}
    for cluster_label, bigrams in clusters.items():
        cluster_key = f"Cluster {cluster_label}"
        cluster_data[cluster_key] = [f"{bigram[0]} {bigram[1]}" for bigram in bigrams]

    # Save the cluster data as JSON
    json_output_file = os.path.join(output_folder, filename)
    with open(json_output_file, "w") as file:
        json.dump(cluster_data, file, indent=4)

    print(f"Cluster data exported as JSON successfully.")

# Fetch the dataset from the database
dataset = fetch_dataset_from_database()

# Fetch the bigrams from the database
bigrams = fetch_bigrams_from_database()

# Create the tweet-bigram matrix
tweet_bigram_matrix = create_tweet_bigram_matrix(dataset, bigrams)

# Specify the folder path to save the dendrogram figures
output_folder = "C:/Users/ACER/Documents/Kuliah/Semester 6/KKP/Trending Topic/dendogram fig"

# Generate the dendrogram
Z = generate_dendrogram(tweet_bigram_matrix, bigrams, output_folder)

# Determine the total number of iterations
total_iterations = Z.shape[0]

# Calculate the desired iteration (total_iterations - 1)
desired_iteration = total_iterations - 1

clusters = extract_clusters_at_iteration(Z, bigrams, desired_iteration)

# Save the clusters as JSON
filename = f"clusters.json"
save_clusters_as_json(clusters, output_folder, filename)

def run_ranking():
    subprocess.call(['python', 'ranking.py'])

run_ranking()