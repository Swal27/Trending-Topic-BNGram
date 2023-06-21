import numpy as np
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage
import os

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

# Print the tweet-bigram matrix
print("+----------------------+-----------+-----------+-----------+")
print("| Bi-gram              |   Tweet 1 |   Tweet 2 |   Tweet 3 |")
print("+======================+===========+===========+===========+")
for j, bigram in enumerate(bigrams):
    print(f"| {' '.join(bigram):20s} |", end=" ")
    for i in range(n_tweets):
        print(f"    {tweet_bigram_matrix[i, j]:2d}    |", end=" ")
    print()
print("+----------------------+-----------+-----------+-----------+")

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

# Print the distance matrix
print("\nDistance Matrix:")
for i in range(n_bigrams):
    print("+----------------------+ ", end="")
print()
for i in range(n_bigrams):
    print(f"| {bigrams[i][0]:<10s} {bigrams[i][1]:<10s} | ", end="")
print()
for i in range(n_bigrams):
    print("+----------------------+ ", end="")
print()
for i in range(n_bigrams):
    for j in range(n_bigrams):
        print(f"| {dist_matrix[i, j]:8.3f} ", end="")
    print("|")
for i in range(n_bigrams):
    print("+----------------------+ ", end="")
print()

# Specify the folder path to save the dendrogram figures
output_folder = "C:/Users/ACER/Documents/Kuliah/Semester 6/KKP/Trending Topic/dendogram fig"

# Compute the linkage matrix
Z = linkage(dist_matrix, method='average')

# Plot the initial dendrogram
fig, ax = plt.subplots(figsize=(8, 6))
dendrogram(Z, labels=[f"{bigram[0]} {bigram[1]}" for bigram in bigrams], ax=ax)
plt.title("Hierarchical Diagram (Iteration: 0)")
plt.xlabel("Bigrams")
plt.ylabel("Distance")
plt.tight_layout()

# Save the initial dendrogram figure
output_file = os.path.join(output_folder, "dendrogram_0.png")
plt.savefig(output_file)
plt.close()

# Perform hierarchical clustering
clusters = []
for i in range(1, n_bigrams):
    cluster = {"bigram": bigrams[i], "distance": dist_matrix[i, 0], "size": 1}
    clusters.append(cluster)

    # Update the distance matrix with group average linkage formula
    for j in range(1, i):
        a = ((tweet_bigram_matrix[:, i] > 0) & (tweet_bigram_matrix[:, j] > 0)).sum()
        b = (tweet_bigram_matrix[:, i] > 0).sum()
        c = (tweet_bigram_matrix[:, j] > 0).sum()
        dist = 1 - a / min(b, c)
        dist_matrix[i, j] = dist
        dist_matrix[j, i] = dist

    # Compute the linkage matrix for the current iteration
    Z = linkage(dist_matrix[:i+1, :i+1], method='average')

    # Plot the dendrogram for the current iteration
    fig, ax = plt.subplots(figsize=(8, 6))
    dendrogram(Z, labels=[f"{bigram[0]} {bigram[1]}" for bigram in bigrams[:i+1]], ax=ax)
    plt.title(f"Hierarchical Diagram (Iteration: {i})")
    plt.xlabel("Bigrams")
    plt.ylabel("Distance")
    plt.tight_layout()

    # Save the dendrogram figure for the current iteration
    output_file = os.path.join(output_folder, f"dendrogram_{i}.png")
    plt.savefig(output_file)
    plt.close()

# Print the clustering results
print("\nClustering Results:")
for i, cluster in enumerate(clusters):
    print(f"Cluster {i+1}: {cluster['bigram']} (Distance: {cluster['distance']}, Size: {cluster['size']})")

