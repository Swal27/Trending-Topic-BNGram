#buat naroh history

# dataset = [["Ahok modus manipulasi ktp", "Ahok modus pembuatan sertifikat", "jokowi natuna ratas imam bonjol"],
#            ["jokowi rapat natuna", "tni jamin keamanan jokowi natuna"]]

# result = []

# for i in range(len(dataset)):
#     inner_result = []
#     for j in range(len(dataset[i])):
#         words = dataset[i][j].split()
#         bigrams = [(words[k], words[k+1]) for k in range(len(words)-1)]
#         inner_result.extend([" ".join(bigram) for bigram in bigrams])
#     result.append(inner_result)

# print(result)

# import math

# dataset = [
#     ["Ahok modus manipulasi ktp", "Ahok modus pembuatan sertifikat", "jokowi natuna ratas imam bonjol"],
#     ["jokowi rapat natuna", "tni jamin keamanan jokowi natuna"]
# ]

# result = []
# total_documents = len(dataset)

# # Calculate DF
# df = {}
# for i in range(len(dataset)):
#     for j in range(len(dataset[i])):
#         words = dataset[i][j].split()
#         bigrams = [(words[k], words[k + 1]) for k in range(len(words) - 1)]
#         for bigram in bigrams:
#             if bigram in df:
#                 df[bigram] += 1
#             else:
#                 df[bigram] = 1

# # Calculate IDF and DF-IDF
# for i in range(len(dataset)):
#     inner_result = []
#     for j in range(len(dataset[i])):
#         words = dataset[i][j].split()
#         bigrams = [(words[k], words[k + 1]) for k in range(len(words) - 1)]
#         for bigram in bigrams:
#             df_score = df[bigram]
#             idf_score = math.log10(total_documents / (1 + df_score))
#             dfidf_score = df_score * idf_score
#             inner_result.append({"bigram": " ".join(bigram), "df": df_score, "idf": idf_score, "dfidf": dfidf_score})
#     result.append(inner_result)

# # Print result
# for i, inner_result in enumerate(result):
#     print(f"Dataset {i+1}:")
#     for item in inner_result:
#         print("Bigram:", item["bigram"])
#         print("DF:", item["df"])
#         print("IDF:", item["idf"])
#         print("DF-IDF:", item["dfidf"])
#         print()
#     print()
