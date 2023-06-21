import numpy as np
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage

# Define the dataset and bigrams
dataset = [
    "Ahok modus manipulasi ktp",
    "Ahok modus pembuatan sertifikat",
    "jokowi natuna ratas imam bonjol"
]
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
print(dist_matrix)

# Compute the linkage matrix
Z = linkage(dist_matrix, method='average')

# Plot the initial dendrogram
fig, ax = plt.subplots(figsize=(8, 6))
dendrogram(Z, labels=[f"{bigram[0]} {bigram[1]}" for bigram in bigrams], ax=ax)
plt.title("Hierarchical Diagram (Iteration: 0)")
plt.xlabel("Bigrams")
plt.ylabel("Distance")
plt.tight_layout()
plt.savefig("dendrogram_iteration_0.png")  # Save dendrogram
plt.show()

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

    # Plot the dendrogram
    fig, ax = plt.subplots(figsize=(8, 6))
    dendrogram(Z, labels=[f"{bigram[0]} {bigram[1]}" for bigram in bigrams[:i+1]], ax=ax)
    plt.title(f"Hierarchical Diagram (Iteration: {i})")
    plt.xlabel("Bigrams")
    plt.ylabel("Distance")
    plt.tight_layout()
    plt.savefig(f"dendrogram_iteration_{i}.png")  # Save dendrogram
    plt.show()

# Print the clustering results
print("\nClustering Results:")
for i, cluster in enumerate(clusters):
    print(f"Cluster {i+1}: {cluster['bigram']} (Distance: {cluster['distance']}, Size: {cluster['size']})")

# Print the final distance matrix
print("\nFinal Distance Matrix:")
print(dist_matrix)