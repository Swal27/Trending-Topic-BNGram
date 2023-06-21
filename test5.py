import numpy as np
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster

# Define the dataset
dataset = [
    "Ahok modus manipulasi ktp",
    "Ahok modus pembuatan sertifikat",
    "jokowi natuna ratas imam bonjol"
]

# Define the bigrams
bigrams = [
    ('Ahok', 'modus'),
    ('modus', 'manipulasi'),
    ('manipulasi', 'ktp'),
    ('modus', 'pembuatan'),
    ('pembuatan', 'sertifikat'),
    ('jokowi', 'natuna'),
    ('natuna', 'ratas'),
    ('ratas', 'imam'),
    ('imam', 'bonjol')
]

# Create the tweet-bigram matrix
n_tweets = len(dataset)
n_bigrams = len(bigrams)
tweet_bigram_matrix = np.zeros((n_tweets, n_bigrams), dtype=int)

# Populate the tweet-bigram matrix
for i, tweet in enumerate(dataset):
    for j, bigram in enumerate(bigrams):
        if all(word in tweet for word in bigram):
            tweet_bigram_matrix[i, j] = 1

# Compute the distance matrix
dist_matrix = np.zeros((n_bigrams, n_bigrams))
for i in range(n_bigrams):
    for j in range(i + 1, n_bigrams):
        a = ((tweet_bigram_matrix[:, i] > 0) & (tweet_bigram_matrix[:, j] > 0)).sum()
        b = (tweet_bigram_matrix[:, i] > 0).sum()
        c = (tweet_bigram_matrix[:, j] > 0).sum()
        dist = 1 - a / min(b, c)
        dist_matrix[i, j] = dist
        dist_matrix[j, i] = dist

# Compute the linkage matrix
Z = linkage(dist_matrix, method='average')

# Determine the clustering labels
threshold = 0.5  # Adjust this threshold to control the cluster size
labels = fcluster(Z, threshold, criterion='distance')

# Print the clustering results
clusters = {}
for i, bigram in enumerate(bigrams):
    cluster_label = labels[i]
    if cluster_label not in clusters:
        clusters[cluster_label] = []
    clusters[cluster_label].append(bigram)

print("Bigrams in Each Cluster:")
for cluster_label, bigrams in clusters.items():
    print(f"Cluster {cluster_label}:")
    for bigram in bigrams:
        print(bigram)
    print()
