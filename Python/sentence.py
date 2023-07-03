import json

# Load the cluster ranking JSON
with open("dendogram fig/cluster_ranking.json", "r") as file:
    cluster_ranking = json.load(file)

# Extract the bigrams and their DF-IDF scores from the JSON
bigrams = cluster_ranking["Bigrams"]

# Create sentences from the bigrams
sentences = [" ".join(bigram["Bigram"].split()) for bigram in bigrams]

# Combine the sentences into a single string
result = " ".join(sentences)

# Print the resulting string
print(result)