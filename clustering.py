import itertools
import numpy as np
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage

# Define the dataset
dataset = [
    "Ahok modus manipulasi ktp",
    "Ahok modus pembuatan sertifikat",
    "jokowi natuna ratas imam bonjol"
]

# Extract unique words (tokens) from the dataset
words = set()
for tweet in dataset:
    words.update(tweet.split())

# Create a list of bigrams
bigrams = list(itertools.combinations(words, 2))

# Initialize the distance matrix
n_bigrams = len(bigrams)
dist_matrix = np.zeros((n_bigrams,))

# Create a list to store the dendrogram plots
dendrograms = []

# Iterate over the pairs of bigrams
for i, (bigram_i, bigram_j) in enumerate(bigrams):
    # Count the number of tweets containing each bigram
    a = sum(1 for tweet in dataset if bigram_i in tweet and bigram_j in tweet)
    b = sum(1 for tweet in dataset if bigram_i in tweet)
    c = sum(1 for tweet in dataset if bigram_j in tweet)

    # Compute the distance using the group average linkage formula
    dist = 1 - a / min(b, c)

    # Assign the distance to the corresponding position in the distance matrix
    dist_matrix[i] = dist

    # Plot the hierarchical diagram for the current iteration
    if i > 0:
        Z = linkage(dist_matrix[:i+1, np.newaxis], method='average')
        fig, ax = plt.subplots(figsize=(8, 6))
        dendrogram(Z, labels=[str(x) for x in bigrams[:i+1]], ax=ax)
        plt.title(f"Hierarchical Diagram (Iteration: {bigram_i}, {bigram_j})")
        plt.xlabel("Bigrams")
        plt.ylabel("Distance")
        plt.tight_layout()

        # Add the dendrogram plot to the list
        dendrograms.append(fig)

        # Display the dendrogram for the current iteration
        plt.show()

# Show all dendrograms sequentially
for dendrogram_plot in dendrograms:
    dendrogram_plot.show()
